
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
  // États principaux
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  // Refs techniques
  const recognitionRef = useRef<ExtendedSpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechSynthesis = useRef(new SpeechSynthesisService()).current;
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Flags de contrôle
  const shouldContinueRef = useRef(false);
  const processingRef = useRef(false);

  // Nettoyage
  const cleanup = () => {
    console.log('🧹 Nettoyage microphone');
    shouldContinueRef.current = false;
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

  // Arrêt complet
  const stopSpeaking = () => {
    console.log('🛑 ARRÊT COMPLET');
    shouldContinueRef.current = false;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    processingRef.current = false;
    cleanup();
  };

  // Traitement IA - CORRIGÉ
  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 Début traitement IA:', finalTranscript);
    console.log('🔍 Conditions - conversationMode:', conversationMode, 'chatGPT:', !!chatGPT, 'shouldContinue:', shouldContinueRef.current);
    
    // TOUJOURS activer l'état de traitement IMMÉDIATEMENT
    setIsProcessing(true);
    processingRef.current = true;
    console.log('✅ État isProcessing activé - Brain icon devrait apparaître');
    
    // Vérifier les conditions APRÈS avoir activé l'état
    if (!conversationMode || !chatGPT || !shouldContinueRef.current) {
      console.log('❌ Conditions non remplies - fallback vers onTranscript');
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        onTranscript(finalTranscript, "message");
      }, 500); // Petit délai pour voir l'icône Brain
      return;
    }

    // Arrêter l'écoute pendant le traitement
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
      
      console.log('🔊 Début synthèse vocale');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        
        // Auto-restart si conversation active
        if (shouldContinueRef.current && isConversationActive) {
          console.log('🔄 Redémarrage auto dans 500ms');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
                console.log('🎙️ Redémarrage réussi');
              } catch (error) {
                console.error('❌ Erreur redémarrage:', error);
              }
            }
          }, 500);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      
      // Redémarrer même en cas d'erreur
      if (shouldContinueRef.current && isConversationActive) {
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldContinueRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
              console.log('🔄 Redémarrage après erreur');
            } catch (error) {
              console.error('❌ Erreur redémarrage post-erreur:', error);
            }
          }
        }, 1000);
      }
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
      console.log('🏁 Fin traitement IA');
    }
  };

  // Démarrage conversation
  const startListening = async () => {
    console.log('🎯 DÉMARRAGE conversation');
    
    if (!recognitionRef.current) {
      console.log('❌ Recognition indisponible');
      return;
    }

    // Arrêter synthèse en cours
    if (isSpeaking) {
      speechSynthesis.stop();
      setIsSpeaking(false);
    }

    try {
      // Permission micro
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        console.log('🎤 Permission micro obtenue');
      }

      // Activation conversation
      shouldContinueRef.current = true;
      setIsConversationActive(true);

      // Démarrage recognition
      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('✅ Conversation ACTIVE');
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      cleanup();
    }
  };

  // Arrêt conversation
  const stopListening = () => {
    console.log('🛑 ARRÊT conversation demandé');
    setIsConversationActive(false);
    stopSpeaking();
  };

  // Configuration recognition - UNIQUE
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
        
        if (shouldContinueRef.current && isConversationActive && !processingRef.current) {
          console.log('🔄 Redémarrage après erreur');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur redémarrage:', error);
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        setIsListening(false);
        
        // Auto-restart SEULEMENT si pas en cours de traitement
        if (shouldContinueRef.current && isConversationActive && !processingRef.current && !isSpeaking) {
          console.log('🔄 Auto-restart recognition');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current && !processingRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur auto-restart:', error);
              }
            }
          }, 300);
        }
      };
      
      console.log('🎙️ Speech Recognition configurée');
    }

    return cleanup;
  }, []); // Pas de dépendances - configuration unique

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
