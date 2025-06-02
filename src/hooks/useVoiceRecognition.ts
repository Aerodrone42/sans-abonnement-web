
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
  const isStoppedRef = useRef(true);
  const microphoneMutedRef = useRef(false);
  const recognitionActiveRef = useRef(false);
  const conversationActiveRef = useRef(false);

  const cleanup = () => {
    console.log('🧹 Nettoyage complet microphone');
    shouldContinueRef.current = false;
    speakingRef.current = false;
    isStoppedRef.current = true;
    microphoneMutedRef.current = false;
    recognitionActiveRef.current = false;
    conversationActiveRef.current = false;
    setIsListening(false);
    setIsConversationActive(false);
    
    // CORRECTION: Nettoyer tous les timeouts pour éviter les redémarrages
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
    cleanup();
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    processingRef.current = false;
  };

  const muteMicrophoneForSpeech = () => {
    console.log('🎤❌ MICRO FORCÉ ARRÊT - IA va parler');
    microphoneMutedRef.current = true;
    recognitionActiveRef.current = false;
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('🔇 Reconnaissance vocale FORCÉE ARRÊT pendant synthèse');
      } catch (error) {
        console.log('Erreur arrêt recognition pour synthèse');
      }
    }
  };

  const unmuteMicrophoneAfterSpeech = () => {
    console.log('🎤✅ MICRO RÉACTIVÉ - IA a fini de parler');
    microphoneMutedRef.current = false;
    
    setTimeout(() => {
      // CORRECTION: Vérifications plus strictes pour éviter les redémarrages intempestifs
      if (conversationActiveRef.current && 
          !isStoppedRef.current && 
          !speakingRef.current && 
          !processingRef.current && 
          !recognitionActiveRef.current &&
          !microphoneMutedRef.current) {
        console.log('🔄 Redémarrage micro après synthèse');
        startRecognitionSafely();
      } else {
        console.log('🚫 Redémarrage micro annulé - conditions non remplies');
      }
    }, 1000);
  };

  const startRecognitionSafely = () => {
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return false;
    }

    if (recognitionActiveRef.current) {
      console.log('⚠️ Recognition déjà active, ignorer le démarrage');
      return false;
    }

    // CORRECTION: Vérifier que la conversation est active
    if (!conversationActiveRef.current) {
      console.log('❌ Conversation non active, arrêt du démarrage');
      return false;
    }

    try {
      shouldContinueRef.current = true;
      recognitionActiveRef.current = true;
      recognitionRef.current.start();
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
    console.log('🤖 DÉBUT TRAITEMENT IA:', finalTranscript);
    
    // CORRECTION: Vérifications plus strictes
    if (isStoppedRef.current || !conversationActiveRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée');
      return;
    }
    
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court, ignoré:', finalTranscript);
      return;
    }

    console.log('🔥 ACTIVATION PROCESSING');
    setIsProcessing(true);
    processingRef.current = true;
    
    muteMicrophoneForSpeech();

    if (!chatGPT) {
      console.log('❌ ChatGPT non initialisé, mode dictée seulement');
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        unmuteMicrophoneAfterSpeech();
        onTranscript(finalTranscript, "message");
      }, 500);
      return;
    }
    
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
      
      setIsSpeaking(true);
      speakingRef.current = true;
      
      console.log('🔊 Début synthèse vocale');
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        speakingRef.current = false;
        setIsProcessing(false);
        processingRef.current = false;
        unmuteMicrophoneAfterSpeech();
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      setIsProcessing(false);
      processingRef.current = false;
      setTimeout(() => {
        unmuteMicrophoneAfterSpeech();
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
      conversationActiveRef.current = true;
      setIsConversationActive(true);

      console.log('🚀 Démarrage reconnaissance vocale');
      const started = startRecognitionSafely();
      
      if (started) {
        console.log('✅ Conversation ACTIVE');
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
    conversationActiveRef.current = false;
    setIsConversationActive(false);
    stopSpeaking();
  };

  useEffect(() => {
    console.log('🔄 Initialisation reconnaissance vocale');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass() as ExtendedSpeechRecognition;
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 Recognition démarrée - ÉCOUTE ACTIVE');
        recognitionActiveRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        console.log('🎯 RÉSULTAT VOCAL REÇU');
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
          const displayText = lastTranscriptRef.current + interimTranscript;
          setTranscript(displayText);
          console.log('📝 AFFICHAGE INTERIM:', displayText);
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL:', finalTranscript);
          lastTranscriptRef.current += finalTranscript;
          setTranscript(lastTranscriptRef.current);
          
          if (silenceTimeoutRef.current) {
            console.log('⏰ Annulation timeout précédent');
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          
          console.log('⏰ NOUVEAU TIMEOUT de 3s pour traitement IA');
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('⏰ TIMEOUT DÉCLENCHÉ - Vérification conditions');
            
            // CORRECTION: Conditions plus strictes et claires
            const canProcess = conversationActiveRef.current && 
                              !isStoppedRef.current && 
                              !microphoneMutedRef.current && 
                              !processingRef.current &&
                              lastTranscriptRef.current.trim();
            
            console.log('🔍 CONDITIONS:', {
              conversationActive: conversationActiveRef.current,
              notStopped: !isStoppedRef.current,
              micNotMuted: !microphoneMutedRef.current,
              notProcessing: !processingRef.current,
              hasTranscript: !!lastTranscriptRef.current.trim()
            });
            
            if (canProcess) {
              console.log('🚀 LANCEMENT TRAITEMENT IA');
              processAIResponse(lastTranscriptRef.current.trim());
              lastTranscriptRef.current = "";
              interimResultRef.current = "";
              setTranscript("");
            } else {
              console.log('❌ CONDITIONS NON REMPLIES pour traitement IA');
            }
          }, 3000);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        recognitionActiveRef.current = false;
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          console.error('❌ Permission microphone refusée');
          conversationActiveRef.current = false;
          setIsConversationActive(false);
          return;
        }
        
        // CORRECTION: Ne redémarrer que si vraiment nécessaire
        if (conversationActiveRef.current && 
            !processingRef.current && 
            !speakingRef.current && 
            !isStoppedRef.current && 
            !microphoneMutedRef.current) {
          console.log('🔄 Redémarrage après erreur dans 1s');
          restartTimeoutRef.current = setTimeout(() => {
            if (conversationActiveRef.current && 
                !speakingRef.current && 
                !processingRef.current && 
                !isStoppedRef.current && 
                !microphoneMutedRef.current) {
              startRecognitionSafely();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        recognitionActiveRef.current = false;
        setIsListening(false);
        
        // CORRECTION: Ne redémarrer que si toutes les conditions sont remplies
        if (conversationActiveRef.current && 
            !processingRef.current && 
            !speakingRef.current && 
            !isStoppedRef.current && 
            !microphoneMutedRef.current) {
          console.log('🔄 Auto-restart recognition dans 500ms');
          restartTimeoutRef.current = setTimeout(() => {
            if (conversationActiveRef.current && 
                !speakingRef.current && 
                !processingRef.current && 
                !isStoppedRef.current && 
                !microphoneMutedRef.current && 
                !recognitionActiveRef.current) {
              startRecognitionSafely();
            }
          }, 500);
        } else {
          console.log('🚫 Auto-restart ignoré - conditions non remplies');
        }
      };
      
      console.log('🎙️ Speech Recognition configurée et PRÊTE');
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
