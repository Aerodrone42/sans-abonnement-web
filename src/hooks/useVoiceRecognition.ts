import { useState, useRef, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: EnhancedChatGPTService | null;
}

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
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const shouldContinueRef = useRef(false);
  const processingRef = useRef(false);
  const speakingRef = useRef(false);

  const cleanup = () => {
    console.log('🧹 Nettoyage microphone');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    setIsListening(false);
    setIsConversationActive(false);
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
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
    console.log('🛑 ARRÊT COMPLET');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    processingRef.current = false;
    cleanup();
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 Début traitement IA:', finalTranscript);
    
    setIsProcessing(true);
    processingRef.current = true;
    console.log('✅ État isProcessing activé');
    
    if (!conversationMode || !chatGPT || !shouldContinueRef.current) {
      console.log('❌ Conditions non remplies - fallback vers onTranscript');
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        onTranscript(finalTranscript, "message");
      }, 500);
      return;
    }

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🔇 Écoute arrêtée pour traitement');
      } catch (error) {
        console.log('Erreur arrêt recognition');
      }
    }

    try {
      console.log('📤 Envoi à ChatGPT...');
      const response = await chatGPT.sendMessage(finalTranscript);
      
      if (!shouldContinueRef.current) {
        console.log('❌ Conversation interrompue');
        return;
      }
      
      setLastResponse(response);
      setIsSpeaking(true);
      speakingRef.current = true;
      
      console.log('🔊 Début synthèse vocale');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        speakingRef.current = false;
        
        if (shouldContinueRef.current && isConversationActive) {
          console.log('🔄 Redémarrage auto dans 1500ms (délai augmenté)');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
                console.log('🎙️ Redémarrage réussi après délai prolongé');
              } catch (error) {
                console.error('❌ Erreur redémarrage:', error);
              }
            } else {
              console.log('🚫 Redémarrage annulé - conditions non remplies');
            }
          }, 1500);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      
      if (shouldContinueRef.current && isConversationActive) {
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldContinueRef.current && !speakingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
              console.log('🔄 Redémarrage après erreur');
            } catch (error) {
              console.error('❌ Erreur redémarrage post-erreur:', error);
            }
          }
        }, 2000);
      }
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
      console.log('🏁 Fin traitement IA');
    }
  };

  const startListening = async () => {
    console.log('🎯 DÉMARRAGE conversation');
    
    if (!recognitionRef.current) {
      console.log('❌ Recognition indisponible');
      return;
    }

    if (isSpeaking) {
      speechSynthesis.stop();
      setIsSpeaking(false);
      speakingRef.current = false;
    }

    try {
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        console.log('🎤 Permission micro obtenue');
      }

      shouldContinueRef.current = true;
      setIsConversationActive(true);

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('✅ Conversation ACTIVE');
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      cleanup();
    }
  };

  const stopListening = () => {
    console.log('🛑 ARRÊT conversation demandé');
    setIsConversationActive(false);
    stopSpeaking();
  };

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
          console.log('🎯 TRANSCRIPT:', finalTranscript);
          setTranscript(finalTranscript);
          processAIResponse(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        setIsListening(false);
        
        if (shouldContinueRef.current && isConversationActive && !processingRef.current && !speakingRef.current) {
          console.log('🔄 Redémarrage après erreur (avec vérifications)');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur redémarrage:', error);
              }
            }
          }, 1500);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        setIsListening(false);
        
        if (shouldContinueRef.current && isConversationActive && !processingRef.current && !speakingRef.current) {
          console.log('🔄 Auto-restart recognition (conditions vérifiées)');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
                console.log('✅ Auto-restart réussi avec vérifications renforcées');
              } catch (error) {
                console.error('Erreur auto-restart:', error);
              }
            } else {
              console.log('🚫 Auto-restart annulé - une condition a échoué');
            }
          }, 800);
        } else {
          console.log('🚫 Auto-restart ignoré - traitement ou synthèse en cours');
        }
      };
      
      console.log('🎙️ Speech Recognition configurée avec logique renforcée');
    }

    return cleanup;
  }, []);

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
    cleanupMicrophone: cleanup
  };
};
