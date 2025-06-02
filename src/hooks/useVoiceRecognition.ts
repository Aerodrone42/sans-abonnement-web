
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
  // États simplifiés
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  
  // Refs pour la gestion technique
  const recognitionRef = useRef<ExtendedSpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechSynthesis = useRef(new SpeechSynthesisService()).current;
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Flags simples
  const shouldContinueRef = useRef(false);
  const isCurrentlyProcessingRef = useRef(false);

  // Fonction de nettoyage simple
  const cleanup = () => {
    console.log('🧹 Nettoyage du microphone');
    shouldContinueRef.current = false;
    setIsListening(false);
    
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
    console.log('🛑 ARRÊT COMPLET demandé');
    shouldContinueRef.current = false;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    cleanup();
  };

  // Traitement IA simplifié
  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 Traitement IA:', finalTranscript);
    
    if (!conversationMode || !chatGPT || !shouldContinueRef.current) {
      console.log('❌ Conditions non remplies pour IA');
      onTranscript(finalTranscript, "message");
      return;
    }

    if (isCurrentlyProcessingRef.current) {
      console.log('❌ Traitement déjà en cours');
      return;
    }

    isCurrentlyProcessingRef.current = true;
    setIsProcessing(true);
    
    // Arrêter temporairement l'écoute
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.log('Erreur arrêt recognition');
      }
    }

    try {
      console.log('📤 Envoi à ChatGPT...');
      const response = await chatGPT.sendMessage(finalTranscript);
      
      if (!shouldContinueRef.current) {
        console.log('❌ Conversation arrêtée pendant traitement');
        return;
      }
      
      setLastResponse(response);
      setIsSpeaking(true);
      
      console.log('🔊 Synthèse vocale...');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        
        // Redémarrer automatiquement si conversation active
        if (shouldContinueRef.current && isConversationActive) {
          console.log('🔄 Redémarrage automatique');
          setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur redémarrage:', error);
              }
            }
          }, 500);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      // Redémarrer même en cas d'erreur
      if (shouldContinueRef.current && isConversationActive) {
        setTimeout(() => {
          if (shouldContinueRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (error) {
              console.error('Erreur redémarrage après erreur:', error);
            }
          }
        }, 1000);
      }
    } finally {
      setIsProcessing(false);
      isCurrentlyProcessingRef.current = false;
    }
  };

  // Démarrage simplifié
  const startListening = async () => {
    console.log('🎯 Démarrage conversation');
    
    if (!recognitionRef.current) {
      console.log('❌ Reconnaissance non disponible');
      return;
    }

    // Arrêter synthèse si en cours
    if (isSpeaking) {
      speechSynthesis.stop();
      setIsSpeaking(false);
    }

    try {
      // Obtenir permission micro
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      // Activer les flags
      shouldContinueRef.current = true;
      setIsConversationActive(true);

      // Démarrer reconnaissance
      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('✅ Conversation démarrée');
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      cleanup();
    }
  };

  // Arrêt simplifié
  const stopListening = () => {
    console.log('🛑 Arrêt conversation');
    setIsConversationActive(false);
    stopSpeaking();
  };

  // Configuration reconnaissance - une seule fois
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
          console.log('🎯 Transcript reçu:', finalTranscript);
          setTranscript(finalTranscript);
          processAIResponse(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur reconnaissance:', event.error);
        setIsListening(false);
        
        // Redémarrage après erreur
        if (shouldContinueRef.current && isConversationActive) {
          setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur redémarrage après erreur:', error);
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Reconnaissance terminée');
        setIsListening(false);
        
        // Redémarrage automatique si conversation active
        if (shouldContinueRef.current && isConversationActive && !isSpeaking && !isCurrentlyProcessingRef.current) {
          console.log('🔄 Auto-redémarrage');
          setTimeout(() => {
            if (shouldContinueRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur auto-redémarrage:', error);
              }
            }
          }, 300);
        }
      };
    }

    return cleanup;
  }, []); // Dependency array vide - configuration une seule fois

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
