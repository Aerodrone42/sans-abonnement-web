
import { useState, useRef, useEffect } from 'react';
import { ChatGPTService } from '@/services/chatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: ChatGPTService | null;
}

export const useVoiceRecognition = ({ onTranscript, conversationMode, chatGPT }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechSynthesis = useRef(new SpeechSynthesisService()).current;
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStoppedRef = useRef(false);

  const cleanupMicrophone = () => {
    console.log('Cleaning up microphone and voice recognition...');
    setIsListening(false);
    
    // Nettoyer le timeout de réponse
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    
    // Nettoyer l'interval de vérification du speech
    if (speechCheckIntervalRef.current) {
      clearInterval(speechCheckIntervalRef.current);
      speechCheckIntervalRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Recognition already stopped');
      }
    }
  };

  const stopSpeaking = () => {
    console.log('🛑 ARRÊT FORCÉ DE L\'IA - stopSpeaking appelé');
    
    // Marquer comme arrêté
    isStoppedRef.current = true;
    
    // Arrêt immédiat et agressif de la synthèse vocale
    speechSynthesis.stop();
    
    // Mise à jour immédiate de tous les états
    setIsSpeaking(false);
    setIsProcessing(false);
    
    // Nettoyer l'interval de vérification
    if (speechCheckIntervalRef.current) {
      clearInterval(speechCheckIntervalRef.current);
      speechCheckIntervalRef.current = null;
    }
    
    // Nettoyer également le timeout de réponse pour éviter qu'une nouvelle réponse démarre
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    
    console.log('✅ IA arrêtée - tous les états réinitialisés');
  };

  const startSpeechMonitoring = () => {
    // Surveiller l'état de la synthèse vocale pour détecter les interruptions
    speechCheckIntervalRef.current = setInterval(() => {
      const synthState = speechSynthesis.getSynthesisState();
      const isCurrentlySpeaking = speechSynthesis.isSpeaking();
      
      console.log('Speech monitoring - State:', synthState, 'Speaking:', isCurrentlySpeaking, 'Component isSpeaking:', isSpeaking);
      
      if (isSpeaking && (!isCurrentlySpeaking || synthState === 'idle' || synthState === 'force-stopped')) {
        console.log('Speech ended or force stopped, cleaning up...');
        setIsSpeaking(false);
        setIsProcessing(false);
        if (speechCheckIntervalRef.current) {
          clearInterval(speechCheckIntervalRef.current);
          speechCheckIntervalRef.current = null;
        }
      }
    }, 200);
  };

  const processAIResponse = async (finalTranscript: string) => {
    if (conversationMode && chatGPT) {
      console.log('🤖 Début traitement réponse IA - isStoppedRef:', isStoppedRef.current);
      
      // Vérifier si l'utilisateur a demandé l'arrêt
      if (isStoppedRef.current) {
        console.log('❌ Arrêt détecté, pas de traitement IA');
        return;
      }

      setIsProcessing(true);
      try {
        console.log('Sending message to AI:', finalTranscript);
        const response = await chatGPT.sendMessage(finalTranscript);
        
        console.log('🎯 Réponse IA reçue:', response.substring(0, 50) + '...');
        
        // Vérifier encore une fois si l'utilisateur n'a pas demandé l'arrêt entre temps
        if (isStoppedRef.current) {
          console.log('❌ Arrêt détecté après réponse IA, pas de synthèse vocale');
          setIsProcessing(false);
          return;
        }
        
        setLastResponse(response);
        setIsSpeaking(true);
        setIsProcessing(false);
        
        // Démarrer la surveillance de la synthèse
        startSpeechMonitoring();
        
        speechSynthesis.speak(response, () => {
          console.log('Speech completed successfully');
          setIsSpeaking(false);
          setIsProcessing(false);
          
          // Nettoyer l'interval de vérification
          if (speechCheckIntervalRef.current) {
            clearInterval(speechCheckIntervalRef.current);
            speechCheckIntervalRef.current = null;
          }
        });
      } catch (error) {
        console.error('Erreur conversation:', error);
        setIsProcessing(false);
        setIsSpeaking(false);
      }
    } else {
      onTranscript(finalTranscript, "message");
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        console.log('Already listening, stopping first...');
        cleanupMicrophone();
        return;
      }

      // Réinitialiser le flag d'arrêt
      isStoppedRef.current = false;

      // Arrêter l'IA si elle parle
      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      cleanupMicrophone();
    }
  };

  const stopListening = () => {
    console.log('Stopping voice recognition...');
    cleanupMicrophone();
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = async (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          
          // Nettoyer le timeout précédent s'il existe
          if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current);
          }
          
          // Augmenter le délai à 3 secondes pour éviter les coupures prématurées
          responseTimeoutRef.current = setTimeout(() => {
            console.log('Processing final transcript after delay:', finalTranscript);
            processAIResponse(finalTranscript);
          }, 3000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        cleanupMicrophone();
      };

      if (recognitionRef.current.addEventListener) {
        recognitionRef.current.addEventListener('end', () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          cleanupMicrophone();
        });
      }
    }

    return () => {
      cleanupMicrophone();
      stopSpeaking();
    };
  }, [onTranscript, conversationMode, chatGPT]);

  return {
    isListening,
    transcript,
    isProcessing,
    lastResponse,
    isSpeaking,
    startListening,
    stopListening,
    stopSpeaking,
    cleanupMicrophone
  };
};
