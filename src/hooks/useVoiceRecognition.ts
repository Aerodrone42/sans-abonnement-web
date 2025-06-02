
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
  const isStoppedRef = useRef(false);
  const microphoneMutedRef = useRef(false); // NOUVEAU: Flag pour couper le micro pendant la synthèse

  const cleanup = () => {
    console.log('🧹 Nettoyage complet microphone');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    isStoppedRef.current = true;
    microphoneMutedRef.current = false;
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
    console.log('🛑 ARRÊT COMPLET DEMANDÉ');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    isStoppedRef.current = true;
    microphoneMutedRef.current = false;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    processingRef.current = false;
    cleanup();
  };

  // NOUVEAU: Couper le microphone pendant que l'IA parle
  const muteMicrophoneForSpeech = () => {
    console.log('🎤❌ MICRO COUPÉ - IA va parler');
    microphoneMutedRef.current = true;
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🔇 Reconnaissance vocale arrêtée pendant synthèse');
      } catch (error) {
        console.log('Erreur arrêt recognition pour synthèse');
      }
    }
  };

  // NOUVEAU: Réactiver le microphone après que l'IA a parlé
  const unmuteMicrophoneAfterSpeech = () => {
    console.log('🎤✅ MICRO RÉACTIVÉ - IA a fini de parler');
    microphoneMutedRef.current = false;
    
    // Attendre un peu avant de redémarrer pour éviter que l'IA s'entende
    setTimeout(() => {
      if (isConversationActive && !isStoppedRef.current && !speakingRef.current && !processingRef.current) {
        console.log('🔄 Redémarrage micro après synthèse');
        try {
          if (recognitionRef.current) {
            shouldContinueRef.current = true;
            recognitionRef.current.start();
            setIsListening(true);
            console.log('✅ Micro redémarré avec succès');
          }
        } catch (error) {
          console.error('❌ Erreur redémarrage micro:', error);
        }
      }
    }, 1000); // Délai de sécurité de 1 seconde
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 Début traitement IA:', finalTranscript);
    
    if (isStoppedRef.current || microphoneMutedRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée ou micro coupé');
      return;
    }
    
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court, ignoré:', finalTranscript);
      return;
    }
    
    setIsProcessing(true);
    processingRef.current = true;
    
    // COUPER LE MICRO pendant le traitement
    muteMicrophoneForSpeech();
    
    if (!conversationMode || !chatGPT) {
      console.log('❌ Conditions non remplies - conversationMode:', conversationMode, 'chatGPT:', !!chatGPT);
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        unmuteMicrophoneAfterSpeech();
        onTranscript(finalTranscript, "message");
      }, 1500);
      return;
    }

    try {
      console.log('📤 Envoi à ChatGPT...');
      const response = await chatGPT.sendMessage(finalTranscript);
      
      console.log('✅ Réponse ChatGPT reçue:', response);
      
      setLastResponse(response);
      setIsSpeaking(true);
      speakingRef.current = true;
      
      console.log('🔊 Début synthèse vocale - micro restera coupé');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée - réactivation du micro');
        setIsSpeaking(false);
        speakingRef.current = false;
        
        // RÉACTIVER LE MICRO après la synthèse
        unmuteMicrophoneAfterSpeech();
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      
      // Même en cas d'erreur, réactiver le micro
      setTimeout(() => {
        unmuteMicrophoneAfterSpeech();
      }, 2000);
    } finally {
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
      isStoppedRef.current = false;
      microphoneMutedRef.current = false;
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
        // VÉRIFICATION CRITIQUE: Ne pas traiter si arrêté ou micro coupé
        if (isStoppedRef.current || microphoneMutedRef.current) {
          console.log('❌ onresult ignoré - conversation arrêtée ou micro coupé');
          return;
        }

        // VÉRIFICATION SUPPLÉMENTAIRE: Ignorer si l'IA parle
        if (speakingRef.current || processingRef.current) {
          console.log('❌ onresult ignoré - IA parle ou traite');
          return;
        }

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
        
        if (interimTranscript) {
          interimResultRef.current = interimTranscript;
          setTranscript(lastTranscriptRef.current + interimTranscript);
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL UTILISATEUR:', finalTranscript);
          lastTranscriptRef.current += finalTranscript;
          setTranscript(lastTranscriptRef.current);
          
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Délai de silence réduit pour une réactivité améliorée
          silenceTimeoutRef.current = setTimeout(() => {
            if (lastTranscriptRef.current.trim() && !isStoppedRef.current && !microphoneMutedRef.current) {
              console.log('⏰ Traitement après silence de 3s:', lastTranscriptRef.current);
              processAIResponse(lastTranscriptRef.current.trim());
              lastTranscriptRef.current = "";
              interimResultRef.current = "";
              setTranscript("");
            }
          }, 3000); // Réduit à 3 secondes
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        setIsListening(false);
        
        // Ne redémarrer que si pas d'erreur critique et micro non coupé
        if (isConversationActive && !processingRef.current && !speakingRef.current && !isStoppedRef.current && !microphoneMutedRef.current) {
          console.log('🔄 Redémarrage après erreur dans 3s');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && !isStoppedRef.current && !microphoneMutedRef.current && recognitionRef.current) {
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
        
        // Ne redémarrer automatiquement que si conditions OK et micro pas coupé
        if (isConversationActive && !processingRef.current && !speakingRef.current && !isStoppedRef.current && !microphoneMutedRef.current) {
          console.log('🔄 Auto-restart recognition dans 1.5s');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && !isStoppedRef.current && !microphoneMutedRef.current && recognitionRef.current) {
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
          console.log('🚫 Auto-restart ignoré - conditions non remplies');
        }
      };
      
      console.log('🎙️ Speech Recognition configurée avec protection contre auto-écoute');
    }

    return cleanup;
  }, [isConversationActive]);

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
