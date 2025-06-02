import { useState, useRef, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: EnhancedChatGPTService | null;
}

interface ExtendedSpeechRecognition extends SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
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
  const microphoneMutedRef = useRef(false);
  // Nouvelle ref pour tracker l'état réel de la reconnaissance
  const recognitionActiveRef = useRef(false);

  const cleanup = () => {
    console.log('🧹 Nettoyage complet microphone');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    isStoppedRef.current = true;
    microphoneMutedRef.current = false;
    recognitionActiveRef.current = false;
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
    recognitionActiveRef.current = false;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    processingRef.current = false;
    cleanup();
  };

  const muteMicrophoneForSpeech = () => {
    console.log('🎤❌ MICRO COUPÉ - IA va parler');
    microphoneMutedRef.current = true;
    recognitionActiveRef.current = false;
    
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

  const unmuteMicrophoneAfterSpeech = () => {
    console.log('🎤✅ MICRO RÉACTIVÉ - IA a fini de parler');
    microphoneMutedRef.current = false;
    
    setTimeout(() => {
      if (isConversationActive && !isStoppedRef.current && !speakingRef.current && !processingRef.current && !recognitionActiveRef.current) {
        console.log('🔄 Redémarrage micro après synthèse');
        startRecognitionSafely();
      }
    }, 1000);
  };

  // Fonction sécurisée pour démarrer la reconnaissance
  const startRecognitionSafely = () => {
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return false;
    }

    if (recognitionActiveRef.current) {
      console.log('⚠️ Recognition déjà active, ignorer le démarrage');
      return false;
    }

    try {
      shouldContinueRef.current = true;
      recognitionActiveRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
      console.log('✅ Recognition démarrée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur démarrage recognition:', error);
      recognitionActiveRef.current = false;
      setIsListening(false);
      return false;
    }
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

    if (!chatGPT) {
      console.log('❌ ChatGPT non initialisé, mode dictée seulement');
      setTimeout(() => {
        onTranscript(finalTranscript, "message");
      }, 500);
      return;
    }
    
    setIsProcessing(true);
    processingRef.current = true;
    
    muteMicrophoneForSpeech();
    
    if (!conversationMode) {
      console.log('Mode dictée activé');
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
        unmuteMicrophoneAfterSpeech();
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
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
      console.log('🎤 Demande permission micro...');
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;
        console.log('✅ Permission micro obtenue');
      }

      isStoppedRef.current = false;
      microphoneMutedRef.current = false;
      setIsConversationActive(true);

      console.log('🚀 Démarrage reconnaissance vocale');
      const started = startRecognitionSafely();
      
      if (started) {
        console.log('✅ Conversation ACTIVE - prêt à écouter');
      } else {
        console.log('❌ Échec démarrage conversation');
      }
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
    console.log('🔄 Initialisation reconnaissance vocale - ChatGPT:', !!chatGPT);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass() as ExtendedSpeechRecognition;
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 Reconnaissance vocale démarrée - PRÊT À ÉCOUTER');
        recognitionActiveRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        if (isStoppedRef.current || microphoneMutedRef.current) {
          console.log('❌ onresult ignoré - conversation arrêtée ou micro coupé');
          return;
        }

        if (speakingRef.current || processingRef.current) {
          console.log('❌ onresult ignoré - IA parle ou traite');
          return;
        }

        console.log('🎯 RÉSULTAT VOCAL ACCEPTÉ');
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
          
          silenceTimeoutRef.current = setTimeout(() => {
            if (lastTranscriptRef.current.trim() && !isStoppedRef.current && !microphoneMutedRef.current) {
              console.log('⏰ Traitement après silence:', lastTranscriptRef.current);
              processAIResponse(lastTranscriptRef.current.trim());
              lastTranscriptRef.current = "";
              interimResultRef.current = "";
              setTranscript("");
            }
          }, 2500);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        recognitionActiveRef.current = false;
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          console.error('❌ Permission microphone refusée');
          setIsConversationActive(false);
          return;
        }
        
        // Redémarrage automatique seulement si nécessaire et autorisé
        if (isConversationActive && !processingRef.current && !speakingRef.current && !isStoppedRef.current && !microphoneMutedRef.current) {
          console.log('🔄 Redémarrage après erreur dans 2s');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && !isStoppedRef.current && !microphoneMutedRef.current) {
              startRecognitionSafely();
            }
          }, 2000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        recognitionActiveRef.current = false;
        setIsListening(false);
        
        // Auto-restart seulement si vraiment nécessaire
        if (isConversationActive && !processingRef.current && !speakingRef.current && !isStoppedRef.current && !microphoneMutedRef.current && !recognitionActiveRef.current) {
          console.log('🔄 Auto-restart recognition dans 1s');
          restartTimeoutRef.current = setTimeout(() => {
            if (isConversationActive && !speakingRef.current && !processingRef.current && !isStoppedRef.current && !microphoneMutedRef.current && !recognitionActiveRef.current) {
              startRecognitionSafely();
            }
          }, 1000);
        } else {
          console.log('🚫 Auto-restart ignoré - conditions non remplies');
        }
      };
      
      console.log('🎙️ Speech Recognition configurée et PRÊTE');
    }

    return cleanup;
  }, [isConversationActive, chatGPT]);

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
