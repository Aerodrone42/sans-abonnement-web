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
  
  const shouldStayActiveRef = useRef(false);
  const currentTranscriptRef = useRef("");

  const stopEverything = () => {
    console.log('🛑 ARRÊT TOTAL du microphone');
    
    shouldStayActiveRef.current = false;
    setIsListening(false);
    setIsConversationActive(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🎤 Track audio fermé');
      });
      mediaStreamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('🔇 Recognition STOP forcé');
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    speechSynthesis.stop();
    console.log('✅ ARRÊT TOTAL terminé');
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 DÉBUT Traitement IA:', finalTranscript);
    
    if (!shouldStayActiveRef.current) {
      console.log('❌ Session arrêtée, abandon traitement');
      return;
    }
    
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court');
      return;
    }

    setIsProcessing(true);
    console.log('🔄 IS PROCESSING = TRUE');

    // CORRECTION CRITIQUE : Vérifier le mode conversation ET la disponibilité de chatGPT
    if (conversationMode && chatGPT) {
      console.log('🤖 MODE CONVERSATION IA ACTIVÉ');
      try {
        console.log('🚀 ENVOI À CHATGPT:', finalTranscript);
        const response = await chatGPT.sendMessage(finalTranscript);
        console.log('✅ RÉPONSE CHATGPT REÇUE:', response);
        setLastResponse(response);
        
        setIsSpeaking(true);
        console.log('🔊 DÉBUT synthèse vocale');
        
        speechSynthesis.speak(response, () => {
          console.log('✅ Synthèse vocale terminée');
          setIsSpeaking(false);
          setIsProcessing(false);
          
          // Redémarrer seulement si encore actif
          if (shouldStayActiveRef.current && chatGPT) {
            setTimeout(() => {
              if (shouldStayActiveRef.current && recognitionRef.current) {
                try {
                  console.log('🔄 REDÉMARRAGE après IA');
                  recognitionRef.current.start();
                } catch (error) {
                  console.log('❌ Erreur redémarrage après IA:', error);
                }
              }
            }, 1000);
          }
        });
        
      } catch (error) {
        console.error('❌ ERREUR ChatGPT:', error);
        setIsProcessing(false);
      }
    } else {
      // Mode dictée uniquement si pas de mode conversation OU pas de chatGPT
      console.log('📝 Mode dictée activé - conversationMode:', conversationMode, 'chatGPT disponible:', !!chatGPT);
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript(finalTranscript, "message");
        console.log('✅ Dictée terminée');
      }, 1000);
    }
  };

  const startListening = async () => {
    console.log('🎯 DÉMARRAGE conversation');
    
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return;
    }

    if (isSpeaking) {
      speechSynthesis.stop();
      setIsSpeaking(false);
    }

    try {
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

      shouldStayActiveRef.current = true;
      setIsConversationActive(true);
      currentTranscriptRef.current = "";
      setTranscript("");

      console.log('🚀 Démarrage reconnaissance');
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      stopEverything();
    }
  };

  const stopListening = () => {
    console.log('🛑 ARRÊT demandé par utilisateur');
    stopEverything();
  };

  const stopSpeaking = () => {
    console.log('🛑 ARRÊT COMPLET demandé');
    stopEverything();
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
        console.log('🎤 Recognition DÉMARRÉE');
        setIsListening(true);
      };

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
        
        if (interimTranscript) {
          const displayText = currentTranscriptRef.current + interimTranscript;
          setTranscript(displayText);
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL REÇU:', finalTranscript);
          currentTranscriptRef.current += finalTranscript;
          setTranscript(currentTranscriptRef.current);
          
          // ARRÊTER la reconnaissance immédiatement
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
              console.log('🔇 Arrêt recognition pour traitement');
            } catch (error) {
              console.log('Erreur arrêt recognition');
            }
          }
          
          // TRAITEMENT IMMÉDIAT
          const textToProcess = currentTranscriptRef.current.trim();
          console.log('🚀 DÉCLENCHEMENT IMMÉDIAT du traitement pour:', textToProcess);
          
          // Reset du transcript
          currentTranscriptRef.current = "";
          setTranscript("");
          
          // TRAITEMENT IMMÉDIAT
          if (shouldStayActiveRef.current && textToProcess) {
            processAIResponse(textToProcess);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          console.error('❌ Permission refusée');
          stopEverything();
          return;
        }
        
        if (shouldStayActiveRef.current && 
            !isProcessing &&
            !isSpeaking &&
            event.error !== 'aborted') {
          
          console.log('🔄 Redémarrage après erreur');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldStayActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('Erreur redémarrage');
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        setIsListening(false);
      };
      
      console.log('🎙️ Speech Recognition PRÊTE');
    }

    return stopEverything;
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
    cleanupMicrophone: stopEverything
  };
};
