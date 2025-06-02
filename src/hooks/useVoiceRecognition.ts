
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
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const shouldContinueRef = useRef(false);
  const processingRef = useRef(false);
  const speakingRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const interimResultRef = useRef("");

  const cleanup = () => {
    console.log('🧹 Nettoyage microphone');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    setIsListening(false);
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
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
    console.log('🔍 Vérification conditions - conversationMode:', conversationMode, 'chatGPT:', !!chatGPT, 'shouldContinue:', shouldContinueRef.current, 'isConversationActive:', isConversationActive);
    
    // Vérifier si c'est un transcript valide et non vide
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court, ignoré:', finalTranscript);
      return;
    }
    
    setIsProcessing(true);
    processingRef.current = true;
    console.log('✅ État isProcessing activé');
    
    // Conditions assouplies pour permettre le traitement même si shouldContinue est false
    if (!conversationMode || !chatGPT) {
      console.log('❌ Conditions non remplies - conversationMode:', conversationMode, 'chatGPT:', !!chatGPT);
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        onTranscript(finalTranscript, "message");
      }, 1500); // Garder le processing visible plus longtemps
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
      
      console.log('✅ Réponse ChatGPT reçue:', response);
      
      setLastResponse(response);
      setIsSpeaking(true);
      speakingRef.current = true;
      
      console.log('🔊 Début synthèse vocale');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        speakingRef.current = false;
        
        // Toujours redémarrer si la conversation est active, même si shouldContinue est false
        if (isConversationActive) {
          console.log('🔄 Redémarrage auto dans 3000ms');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                shouldContinueRef.current = true; // Réactiver
                recognitionRef.current.start();
                setIsListening(true);
                console.log('🎙️ Redémarrage réussi');
              } catch (error) {
                console.error('❌ Erreur redémarrage:', error);
              }
            }
          }, 3000);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      
      if (isConversationActive) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isConversationActive && !speakingRef.current && recognitionRef.current) {
            try {
              shouldContinueRef.current = true;
              recognitionRef.current.start();
              setIsListening(true);
              console.log('🔄 Redémarrage après erreur');
            } catch (error) {
              console.error('❌ Erreur redémarrage post-erreur:', error);
            }
          }
        }, 4000);
      }
    } finally {
      // Garder le processing visible plus longtemps
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        console.log('🏁 Fin traitement IA');
      }, 2000);
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
      
      console.log('✅ Conversation ACTIVE - shouldContinue:', shouldContinueRef.current);
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
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Mettre à jour l'affichage en temps réel
        if (interimTranscript) {
          interimResultRef.current = interimTranscript;
          setTranscript(lastTranscriptRef.current + interimTranscript);
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL:', finalTranscript);
          lastTranscriptRef.current += finalTranscript;
          setTranscript(lastTranscriptRef.current);
          
          // Réinitialiser le timer de silence
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Attendre 5 secondes de silence avant de traiter (augmenté)
          silenceTimeoutRef.current = setTimeout(() => {
            if (lastTranscriptRef.current.trim()) {
              console.log('⏰ Traitement après silence de 5s:', lastTranscriptRef.current);
              processAIResponse(lastTranscriptRef.current.trim());
              lastTranscriptRef.current = "";
              interimResultRef.current = "";
              setTranscript("");
            }
          }, 5000); // Augmenté à 5 secondes
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        setIsListening(false);
        
        if (isConversationActive && !processingRef.current && !speakingRef.current) {
          console.log('🔄 Redémarrage après erreur');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                shouldContinueRef.current = true;
                recognitionRef.current.start();
                setIsListening(true);
              } catch (error) {
                console.error('Erreur redémarrage:', error);
              }
            }
          }, 3000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        setIsListening(false);
        
        if (isConversationActive && !processingRef.current && !speakingRef.current) {
          console.log('🔄 Auto-restart recognition');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && recognitionRef.current) {
              try {
                shouldContinueRef.current = true;
                recognitionRef.current.start();
                setIsListening(true);
                console.log('✅ Auto-restart réussi');
              } catch (error) {
                console.error('Erreur auto-restart:', error);
              }
            }
          }, 1500);
        } else {
          console.log('🚫 Auto-restart ignoré - traitement ou synthèse en cours');
        }
      };
      
      console.log('🎙️ Speech Recognition configurée');
    }

    return cleanup;
  }, [isConversationActive]); // Ajouter isConversationActive comme dépendance

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
