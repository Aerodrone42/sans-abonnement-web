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
  
  // États de contrôle simplifiés
  const shouldContinueRef = useRef(false);
  const isActiveSessionRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const interimResultRef = useRef("");

  const cleanup = () => {
    console.log('🧹 Nettoyage COMPLET microphone');
    
    // Arrêter TOUT
    shouldContinueRef.current = false;
    isActiveSessionRef.current = false;
    
    setIsListening(false);
    setIsConversationActive(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    // Nettoyer les timeouts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Arrêter le stream audio
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🎤 Track audio fermé');
      });
      mediaStreamRef.current = null;
    }

    // Arrêter la reconnaissance vocale
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('🔇 Recognition ARRÊTÉE');
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    // Arrêter la synthèse vocale
    speechSynthesis.stop();
    console.log('✅ Nettoyage TERMINÉ');
  };

  const stopSpeaking = () => {
    console.log('🛑 ARRÊT TOTAL demandé par utilisateur');
    cleanup();
  };

  const startRecognitionSafely = () => {
    // Vérifications de sécurité STRICTES
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return false;
    }

    if (!shouldContinueRef.current || !isActiveSessionRef.current) {
      console.log('❌ Session non active, arrêt du démarrage');
      return false;
    }

    if (!chatGPT) {
      console.log('❌ ChatGPT non disponible');
      return false;
    }

    if (isListening) {
      console.log('⚠️ Déjà en écoute, ignorer');
      return false;
    }

    try {
      recognitionRef.current.start();
      console.log('✅ Recognition démarrée');
      return true;
    } catch (error) {
      console.error('❌ Erreur démarrage recognition:', error);
      setIsListening(false);
      return false;
    }
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 DÉBUT TRAITEMENT IA:', finalTranscript);
    
    if (!shouldContinueRef.current || !isActiveSessionRef.current) {
      console.log('❌ Session arrêtée, abandon traitement IA');
      return;
    }
    
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court');
      return;
    }

    setIsProcessing(true);
    
    // Arrêter temporairement le micro pendant traitement IA
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Erreur arrêt micro pour IA');
      }
    }

    if (!chatGPT) {
      console.log('❌ ChatGPT indisponible, mode dictée');
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript(finalTranscript, "message");
        
        // Redémarrer le micro si session active
        if (shouldContinueRef.current && isActiveSessionRef.current) {
          setTimeout(() => startRecognitionSafely(), 1000);
        }
      }, 500);
      return;
    }
    
    if (!conversationMode) {
      console.log('Mode dictée');
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript(finalTranscript, "message");
        
        // Redémarrer le micro si session active
        if (shouldContinueRef.current && isActiveSessionRef.current) {
          setTimeout(() => startRecognitionSafely(), 1000);
        }
      }, 1500);
      return;
    }

    try {
      console.log('🚀 ENVOI À ChatGPT:', finalTranscript);
      const response = await chatGPT.sendMessage(finalTranscript);
      console.log('✅ Réponse ChatGPT:', response);
      setLastResponse(response);
      
      setIsSpeaking(true);
      
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        setIsProcessing(false);
        
        // Redémarrer le micro SEULEMENT si session toujours active
        if (shouldContinueRef.current && isActiveSessionRef.current && chatGPT) {
          setTimeout(() => {
            startRecognitionSafely();
          }, 1000);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      setIsProcessing(false);
      
      // Redémarrer le micro même en cas d'erreur si session active
      if (shouldContinueRef.current && isActiveSessionRef.current) {
        setTimeout(() => startRecognitionSafely(), 2000);
      }
    }
  };

  const startListening = async () => {
    console.log('🎯 DÉMARRAGE conversation');
    
    if (!recognitionRef.current || !chatGPT) {
      console.log('❌ Conditions non remplies pour démarrer');
      return;
    }

    // Arrêter toute synthèse en cours
    if (isSpeaking) {
      speechSynthesis.stop();
      setIsSpeaking(false);
    }

    try {
      // Demander permission micro
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

      // ACTIVER la session
      shouldContinueRef.current = true;
      isActiveSessionRef.current = true;
      setIsConversationActive(true);

      console.log('🚀 Démarrage reconnaissance vocale');
      startRecognitionSafely();
      
    } catch (error) {
      console.error('❌ Erreur démarrage:', error);
      cleanup();
    }
  };

  const stopListening = () => {
    console.log('🛑 ARRÊT conversation demandé');
    
    // DÉSACTIVER la session
    shouldContinueRef.current = false;
    isActiveSessionRef.current = false;
    setIsConversationActive(false);
    
    cleanup();
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
          interimResultRef.current = interimTranscript;
          const displayText = lastTranscriptRef.current + interimTranscript;
          setTranscript(displayText);
        }
        
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL:', finalTranscript);
          lastTranscriptRef.current += finalTranscript;
          setTranscript(lastTranscriptRef.current);
          
          // Annuler timeout précédent
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          
          // CORRECTION: Déclencher immédiatement le traitement IA
          if (shouldContinueRef.current && 
              isActiveSessionRef.current && 
              lastTranscriptRef.current.trim() &&
              chatGPT &&
              conversationMode) {
            
            console.log('🚀 TRAITEMENT IA IMMÉDIAT');
            processAIResponse(lastTranscriptRef.current.trim());
            lastTranscriptRef.current = "";
            interimResultRef.current = "";
            setTranscript("");
          } else if (!conversationMode) {
            // En mode dictée, juste remplir le formulaire
            setTimeout(() => {
              onTranscript(lastTranscriptRef.current.trim(), "message");
              lastTranscriptRef.current = "";
              setTranscript("");
            }, 1000);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur recognition:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          console.error('❌ Permission microphone refusée');
          stopListening();
          return;
        }
        
        // Redémarrer UNIQUEMENT si session active et conditions remplies
        if (shouldContinueRef.current && 
            isActiveSessionRef.current && 
            chatGPT &&
            !isProcessing &&
            !isSpeaking) {
          
          console.log('🔄 Redémarrage après erreur');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && isActiveSessionRef.current) {
              startRecognitionSafely();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Recognition terminée');
        setIsListening(false);
        
        // Redémarrer UNIQUEMENT si session active
        if (shouldContinueRef.current && 
            isActiveSessionRef.current && 
            chatGPT &&
            !isProcessing &&
            !isSpeaking) {
          
          console.log('🔄 Auto-restart recognition');
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueRef.current && isActiveSessionRef.current) {
              startRecognitionSafely();
            }
          }, 500);
        } else {
          console.log('🚫 Auto-restart ignoré - session inactive');
        }
      };
      
      console.log('🎙️ Speech Recognition PRÊTE');
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
