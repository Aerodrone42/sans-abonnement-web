
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
  
  // CORRECTION: Variables de contrôle simplifiées
  const shouldStayActiveRef = useRef(false);
  const currentTranscriptRef = useRef("");

  const stopEverything = () => {
    console.log('🛑 ARRÊT TOTAL du microphone');
    
    // Désactiver TOUT
    shouldStayActiveRef.current = false;
    setIsListening(false);
    setIsConversationActive(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    // Nettoyer les timeouts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
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
        console.log('🔇 Recognition STOP forcé');
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    // Arrêter la synthèse vocale
    speechSynthesis.stop();
    console.log('✅ ARRÊT TOTAL terminé');
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 Traitement IA:', finalTranscript);
    
    if (!shouldStayActiveRef.current) {
      console.log('❌ Session arrêtée, abandon traitement');
      return;
    }
    
    if (!finalTranscript || finalTranscript.trim().length < 2) {
      console.log('❌ Transcript trop court');
      return;
    }

    setIsProcessing(true);

    if (!chatGPT) {
      console.log('❌ ChatGPT indisponible');
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript(finalTranscript, "message");
      }, 500);
      return;
    }
    
    if (!conversationMode) {
      console.log('Mode dictée');
      setTimeout(() => {
        setIsProcessing(false);
        onTranscript(finalTranscript, "message");
      }, 1500);
      return;
    }

    try {
      console.log('🚀 Envoi à ChatGPT:', finalTranscript);
      const response = await chatGPT.sendMessage(finalTranscript);
      console.log('✅ Réponse ChatGPT:', response);
      setLastResponse(response);
      
      setIsSpeaking(true);
      
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse terminée');
        setIsSpeaking(false);
        setIsProcessing(false);
        
        // Redémarrer seulement si encore actif
        if (shouldStayActiveRef.current && chatGPT) {
          setTimeout(() => {
            if (shouldStayActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                console.log('🔄 Redémarrage après IA');
              } catch (error) {
                console.log('Erreur redémarrage après IA');
              }
            }
          }, 1000);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      setIsProcessing(false);
    }
  };

  const startListening = async () => {
    console.log('🎯 DÉMARRAGE conversation');
    
    if (!recognitionRef.current || !chatGPT) {
      console.log('❌ Conditions non remplies');
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
        
        // CORRECTION: Quand on a un transcript final, on ARRÊTE la reconnaissance et on traite
        if (finalTranscript.trim()) {
          console.log('🎯 TRANSCRIPT FINAL:', finalTranscript);
          currentTranscriptRef.current += finalTranscript;
          setTranscript(currentTranscriptRef.current);
          
          // ARRÊTER la reconnaissance pour traiter l'IA
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
              console.log('🔇 Arrêt pour traitement IA');
            } catch (error) {
              console.log('Erreur arrêt pour IA');
            }
          }
          
          // Traiter avec l'IA si en mode conversation
          if (shouldStayActiveRef.current && 
              currentTranscriptRef.current.trim() &&
              chatGPT &&
              conversationMode) {
            
            console.log('🚀 Traitement IA');
            processAIResponse(currentTranscriptRef.current.trim());
            currentTranscriptRef.current = "";
            setTranscript("");
          } else if (!conversationMode) {
            // Mode dictée
            setTimeout(() => {
              onTranscript(currentTranscriptRef.current.trim(), "message");
              currentTranscriptRef.current = "";
              setTranscript("");
            }, 1000);
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
        
        // Ne redémarre QUE si vraiment nécessaire
        if (shouldStayActiveRef.current && 
            chatGPT &&
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
        
        // CORRECTION: Ne redémarre PAS automatiquement ici
        // Le redémarrage se fait uniquement après traitement IA ou en cas d'erreur
        console.log('🚫 Pas de redémarrage automatique');
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
