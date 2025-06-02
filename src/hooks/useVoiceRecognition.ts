
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
  const isStoppedRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupMicrophone = () => {
    console.log('🧹 Nettoyage complet du microphone...');
    setIsListening(false);
    setIsConversationActive(false);
    
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        console.log('🛑 Arrêt track:', track.kind);
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }
  };

  const stopSpeaking = () => {
    console.log('🛑 ARRÊT TOTAL - stopSpeaking appelé');
    
    isStoppedRef.current = true;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    console.log('✅ IA complètement arrêtée');
  };

  const restartListening = async () => {
    if (isStoppedRef.current || !isConversationActive) {
      console.log('❌ Conversation arrêtée, pas de redémarrage');
      return;
    }

    try {
      console.log('🔄 Redémarrage de l\'écoute...');
      
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('🎤 Écoute redémarrée avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur redémarrage écoute:', error);
      // Retry après délai si erreur
      if (isConversationActive && !isStoppedRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isConversationActive && !isStoppedRef.current) {
            restartListening();
          }
        }, 1000);
      }
    }
  };

  const processAIResponse = async (finalTranscript: string) => {
    if (!conversationMode || !chatGPT) {
      onTranscript(finalTranscript, "message");
      return;
    }

    console.log('🤖 Traitement réponse IA - isStoppedRef:', isStoppedRef.current);
    
    if (isStoppedRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée');
      return;
    }

    setIsProcessing(true);
    
    // Arrêter l'écoute pendant le traitement
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    try {
      console.log('📤 Envoi message à l\'IA:', finalTranscript);
      const response = await chatGPT.sendMessage(finalTranscript);
      
      console.log('📥 Réponse IA reçue:', response.substring(0, 50) + '...');
      
      if (isStoppedRef.current) {
        console.log('❌ Conversation arrêtée pendant traitement');
        setIsProcessing(false);
        return;
      }
      
      setLastResponse(response);
      setIsSpeaking(true);
      setIsProcessing(false);
      
      // Parler et programmer le redémarrage automatique
      speechSynthesis.speak(response, () => {
        console.log('🎯 Fin de la synthèse vocale - redémarrage programmé');
        setIsSpeaking(false);
        
        // Redémarrage automatique après un délai
        if (conversationMode && !isStoppedRef.current && isConversationActive) {
          console.log('⏰ Programmation redémarrage dans 2 secondes...');
          restartTimeoutRef.current = setTimeout(() => {
            if (!isStoppedRef.current && isConversationActive && !isListening) {
              console.log('🔄 Exécution du redémarrage automatique');
              restartListening();
            }
          }, 2000);
        }
      });
    } catch (error) {
      console.error('❌ Erreur traitement IA:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      
      // Redémarrer même en cas d'erreur
      if (conversationMode && !isStoppedRef.current && isConversationActive) {
        restartTimeoutRef.current = setTimeout(() => {
          if (!isStoppedRef.current && isConversationActive) {
            restartListening();
          }
        }, 2000);
      }
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return;
    }

    try {
      if (isListening && isConversationActive) {
        console.log('🛑 Arrêt de la conversation en cours...');
        stopSpeaking();
        cleanupMicrophone();
        return;
      }

      console.log('🚀 Démarrage nouvelle conversation');
      isStoppedRef.current = false;
      setIsConversationActive(true);

      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Conversation continue démarrée');
    } catch (error) {
      console.error('❌ Erreur démarrage conversation:', error);
      cleanupMicrophone();
    }
  };

  const stopListening = () => {
    console.log('🛑 Arrêt complet de la conversation');
    setIsConversationActive(false);
    stopSpeaking();
    cleanupMicrophone();
  };

  // Configuration de la reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 Transcript final détecté:', finalTranscript);
          setTranscript(finalTranscript);
          
          // Nettoyer le timeout précédent
          if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current);
          }
          
          // Délai pour éviter les coupures prématurées
          responseTimeoutRef.current = setTimeout(() => {
            if (!isStoppedRef.current && isConversationActive) {
              console.log('⚡ Traitement du transcript après délai');
              processAIResponse(finalTranscript);
            }
          }, 1500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('❌ Erreur reconnaissance:', event.error);
        
        // Gestion intelligente des erreurs
        if (event.error === 'no-speech' && isConversationActive && !isStoppedRef.current) {
          console.log('🔄 Redémarrage après silence...');
          setTimeout(() => {
            if (isConversationActive && !isStoppedRef.current && !isListening) {
              restartListening();
            }
          }, 1000);
        } else if (event.error !== 'aborted' && isConversationActive && !isStoppedRef.current) {
          console.log('🔄 Redémarrage après erreur...');
          setTimeout(() => {
            if (isConversationActive && !isStoppedRef.current && !isListening) {
              restartListening();
            }
          }, 2000);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🏁 Reconnaissance terminée - Active:', isConversationActive, 'Stopped:', isStoppedRef.current);
        setIsListening(false);
        
        // Redémarrage automatique si conversation active
        if (isConversationActive && !isStoppedRef.current && !isSpeaking && !isProcessing) {
          console.log('🔄 Auto-redémarrage après fin normale');
          setTimeout(() => {
            if (isConversationActive && !isStoppedRef.current && !isListening) {
              restartListening();
            }
          }, 500);
        }
      };
    } else {
      console.error('❌ Reconnaissance vocale non supportée');
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
    isConversationActive,
    startListening,
    stopListening,
    stopSpeaking,
    cleanupMicrophone
  };
};
