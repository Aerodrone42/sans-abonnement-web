
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
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechSynthesis = useRef(new SpeechSynthesisService()).current;
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStoppedRef = useRef(false);
  const restartListeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
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
    setIsConversationActive(false);
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

    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
    }
    
    console.log('✅ IA arrêtée - tous les états réinitialisés');
  };

  const startListeningInternal = async () => {
    if (!recognitionRef.current) return;

    try {
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Voice recognition started (internal)');
    } catch (error) {
      console.error('Erreur démarrage reconnaissance interne:', error);
    }
  };

  const restartListeningAfterSpeech = () => {
    if (isStoppedRef.current || !isConversationActive) {
      console.log('❌ Conversation arrêtée, pas de redémarrage');
      return;
    }

    console.log('🔄 Redémarrage de l\'écoute après réponse IA...');
    
    restartListeningTimeoutRef.current = setTimeout(async () => {
      if (!isStoppedRef.current && isConversationActive) {
        await startListeningInternal();
      }
    }, 1000); // Délai de 1 seconde après la fin de la synthèse vocale
  };

  const startSpeechMonitoring = () => {
    speechCheckIntervalRef.current = setInterval(() => {
      const synthState = speechSynthesis.getSynthesisState();
      const isCurrentlySpeaking = speechSynthesis.isSpeaking();
      
      if (isSpeaking && (!isCurrentlySpeaking || synthState === 'idle' || synthState === 'force-stopped')) {
        console.log('🎯 Speech ended, preparing to restart listening...');
        setIsSpeaking(false);
        setIsProcessing(false);
        
        if (speechCheckIntervalRef.current) {
          clearInterval(speechCheckIntervalRef.current);
          speechCheckIntervalRef.current = null;
        }

        // Redémarrer l'écoute automatiquement en mode conversation
        if (conversationMode && !isStoppedRef.current) {
          restartListeningAfterSpeech();
        }
      }
    }, 200);
  };

  const processAIResponse = async (finalTranscript: string) => {
    if (conversationMode && chatGPT) {
      console.log('🤖 Début traitement réponse IA avec conversation continue - isStoppedRef:', isStoppedRef.current);
      
      if (isStoppedRef.current) {
        console.log('❌ Arrêt détecté, pas de traitement IA');
        return;
      }

      setIsProcessing(true);
      
      // Arrêter l'écoute pendant le traitement
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (error) {
          console.log('Recognition already stopped during processing');
        }
      }

      try {
        console.log('Sending message to Enhanced AI with learning:', finalTranscript);
        const response = await chatGPT.sendMessage(finalTranscript);
        
        console.log('🎯 Réponse IA reçue pour conversation continue:', response.substring(0, 50) + '...');
        
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
          console.log('🎯 Speech completed, conversation can continue');
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
        
        // Redémarrer l'écoute même en cas d'erreur
        if (conversationMode && !isStoppedRef.current && isConversationActive) {
          restartListeningAfterSpeech();
        }
      }
    } else {
      onTranscript(finalTranscript, "message");
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        console.log('Already listening, stopping conversation...');
        stopSpeaking();
        cleanupMicrophone();
        setIsConversationActive(false);
        return;
      }

      isStoppedRef.current = false;
      setIsConversationActive(true);

      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Voice recognition started with continuous conversation');
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      cleanupMicrophone();
      setIsConversationActive(false);
    }
  };

  const stopListening = () => {
    console.log('🛑 Stopping voice recognition and conversation...');
    setIsConversationActive(false);
    stopSpeaking();
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
          
          // Délai optimisé pour éviter les coupures prématurées
          responseTimeoutRef.current = setTimeout(() => {
            console.log('🎯 Processing final transcript for continuous conversation:', finalTranscript);
            processAIResponse(finalTranscript);
          }, 1500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        
        // Ne pas arrêter la conversation pour les erreurs mineures
        if (event.error === 'no-speech' && isConversationActive && !isStoppedRef.current) {
          console.log('🔄 Redémarrage automatique après silence...');
          setTimeout(() => {
            if (isConversationActive && !isStoppedRef.current) {
              startListeningInternal();
            }
          }, 1000);
        } else {
          cleanupMicrophone();
        }
      };

      if (recognitionRef.current.addEventListener) {
        recognitionRef.current.addEventListener('end', () => {
          console.log('🎤 Speech recognition ended');
          setIsListening(false);
          
          // Redémarrer automatiquement si la conversation est active
          if (isConversationActive && !isStoppedRef.current && !isSpeaking && !isProcessing) {
            console.log('🔄 Auto-restart listening for continuous conversation');
            setTimeout(() => {
              if (isConversationActive && !isStoppedRef.current) {
                startListeningInternal();
              }
            }, 500);
          }
        });
      }
    }

    return () => {
      cleanupMicrophone();
      stopSpeaking();
      setIsConversationActive(false);
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
