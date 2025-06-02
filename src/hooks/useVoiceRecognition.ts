import { useState, useRef, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: EnhancedChatGPTService | null;
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
    
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    
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
    
    isStoppedRef.current = true;
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    
    if (speechCheckIntervalRef.current) {
      clearInterval(speechCheckIntervalRef.current);
      speechCheckIntervalRef.current = null;
    }
    
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    
    console.log('✅ IA arrêtée - tous les états réinitialisés');
  };

  const startSpeechMonitoring = () => {
    speechCheckIntervalRef.current = setInterval(() => {
      const synthState = speechSynthesis.getSynthesisState();
      const isCurrentlySpeaking = speechSynthesis.isSpeaking();
      
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
      console.log('🤖 Début traitement réponse IA avec apprentissage automatique - isStoppedRef:', isStoppedRef.current);
      
      if (isStoppedRef.current) {
        console.log('❌ Arrêt détecté, pas de traitement IA');
        return;
      }

      setIsProcessing(true);
      try {
        console.log('Sending message to Enhanced AI with learning:', finalTranscript);
        const response = await chatGPT.sendMessage(finalTranscript);
        
        console.log('🎯 Réponse IA reçue avec données d\'apprentissage:', response.substring(0, 50) + '...');
        
        if (isStoppedRef.current) {
          console.log('❌ Arrêt détecté après réponse IA, pas de synthèse vocale');
          setIsProcessing(false);
          return;
        }
        
        setLastResponse(response);
        setIsSpeaking(true);
        setIsProcessing(false);
        
        startSpeechMonitoring();
        
        speechSynthesis.speak(response, () => {
          console.log('Speech completed successfully');
          setIsSpeaking(false);
          setIsProcessing(false);
          
          if (speechCheckIntervalRef.current) {
            clearInterval(speechCheckIntervalRef.current);
            speechCheckIntervalRef.current = null;
          }
        });
      } catch (error) {
        console.error('Erreur conversation avec apprentissage:', error);
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

      isStoppedRef.current = false;

      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('Voice recognition started with learning capabilities');
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
          
          if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current);
          }
          
          responseTimeoutRef.current = setTimeout(() => {
            console.log('Processing final transcript with learning after delay:', finalTranscript);
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
