
import { useState, useRef, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: EnhancedChatGPTService | null;
}

// Extension des types pour SpeechRecognition
interface ExtendedSpeechRecognition extends SpeechRecognition {
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

export const useVoiceRecognition = ({ onTranscript, conversationMode, chatGPT }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  const recognitionRef = useRef<ExtendedSpeechRecognition | null>(null);
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
    console.log('🤖 DÉBUT processAIResponse - conversationMode:', conversationMode, 'chatGPT:', !!chatGPT);
    console.log('🤖 finalTranscript:', finalTranscript);
    console.log('🤖 isStoppedRef.current:', isStoppedRef.current);
    
    if (!conversationMode || !chatGPT) {
      console.log('❌ Mode conversation désactivé ou ChatGPT non disponible');
      onTranscript(finalTranscript, "message");
      return;
    }

    if (isStoppedRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée');
      return;
    }

    console.log('🤖 Démarrage du traitement IA...');
    setIsProcessing(true);
    
    // Arrêter l'écoute pendant le traitement
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🛑 Écoute arrêtée pour traitement IA');
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    try {
      console.log('📤 Envoi message à ChatGPT:', finalTranscript);
      const response = await chatGPT.sendMessage(finalTranscript);
      
      console.log('📥 Réponse ChatGPT reçue:', response.substring(0, 100) + '...');
      
      if (isStoppedRef.current) {
        console.log('❌ Conversation arrêtée pendant traitement ChatGPT');
        setIsProcessing(false);
        return;
      }
      
      setLastResponse(response);
      setIsSpeaking(true);
      setIsProcessing(false);
      
      console.log('🔊 Démarrage synthèse vocale...');
      
      // Parler et programmer le redémarrage automatique
      speechSynthesis.speak(response, () => {
        console.log('🎯 FIN synthèse vocale - programmation redémarrage');
        setIsSpeaking(false);
        
        // Redémarrage automatique après un délai plus court
        if (conversationMode && !isStoppedRef.current && isConversationActive) {
          console.log('⏰ Programmation redémarrage dans 1.5 secondes...');
          restartTimeoutRef.current = setTimeout(() => {
            if (!isStoppedRef.current && isConversationActive && !isListening) {
              console.log('🔄 EXÉCUTION redémarrage automatique');
              restartListening();
            } else {
              console.log('❌ Redémarrage annulé - conditions non remplies');
              console.log('- isStoppedRef:', isStoppedRef.current);
              console.log('- isConversationActive:', isConversationActive);
              console.log('- isListening:', isListening);
            }
          }, 1500);
        } else {
          console.log('❌ Redémarrage non programmé - conditions non remplies');
          console.log('- conversationMode:', conversationMode);
          console.log('- isStoppedRef:', isStoppedRef.current);
          console.log('- isConversationActive:', isConversationActive);
        }
      });
    } catch (error) {
      console.error('❌ Erreur traitement ChatGPT:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      
      // Redémarrer même en cas d'erreur
      if (conversationMode && !isStoppedRef.current && isConversationActive) {
        console.log('🔄 Redémarrage après erreur dans 2 secondes...');
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
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass() as ExtendedSpeechRecognition;
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event) => {
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
            responseTimeoutRef.current = null;
            console.log('🗑️ Timeout précédent nettoyé');
          }
          
          // Délai plus court pour traitement immédiat
          console.log('⏰ Programmation traitement dans 1 seconde...');
          responseTimeoutRef.current = setTimeout(() => {
            if (!isStoppedRef.current && isConversationActive) {
              console.log('⚡ EXÉCUTION traitement transcript');
              processAIResponse(finalTranscript);
            } else {
              console.log('❌ Traitement annulé - conversation arrêtée');
            }
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
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

      recognition.onend = () => {
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
