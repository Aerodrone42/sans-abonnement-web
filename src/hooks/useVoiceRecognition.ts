
import { useState, useRef, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: EnhancedChatGPTService | null;
}

// Extension des types pour SpeechRecognition
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
  const isStoppedRef = useRef(false);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupMicrophone = () => {
    console.log('🧹 Nettoyage complet du microphone...');
    setIsListening(false);
    
    // Nettoyer tous les timeouts
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
      autoRestartTimeoutRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        console.log('🛑 Arrêt track:', track.kind);
        track.stop();
      });
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
    console.log('🛑 ARRÊT TOTAL - stopSpeaking appelé');
    
    isStoppedRef.current = true;
    setIsConversationActive(false);
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
    
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
      autoRestartTimeoutRef.current = null;
    }
    
    console.log('✅ IA complètement arrêtée');
  };

  // Fonction simplifiée de redémarrage automatique
  const scheduleRestart = (delay: number = 1000) => {
    console.log(`⏰ Programmation redémarrage dans ${delay}ms`);
    console.log('📊 État avant programmation:', {
      isStoppedRef: isStoppedRef.current,
      isConversationActive,
      isListening,
      isSpeaking,
      isProcessing
    });
    
    // Nettoyer ancien timeout
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
    }
    
    autoRestartTimeoutRef.current = setTimeout(async () => {
      console.log('🔄 TENTATIVE DE REDÉMARRAGE');
      console.log('📊 État au moment du redémarrage:', {
        isStoppedRef: isStoppedRef.current,
        isConversationActive,
        isListening,
        isSpeaking,
        isProcessing
      });
      
      if (isStoppedRef.current || !isConversationActive) {
        console.log('❌ Redémarrage annulé - conversation arrêtée');
        return;
      }

      if (isListening || isSpeaking || isProcessing) {
        console.log('❌ Redémarrage annulé - autre activité en cours');
        return;
      }

      try {
        console.log('🚀 REDÉMARRAGE EFFECTIF DE L\'ÉCOUTE');
        
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
          console.log('✅ Écoute redémarrée avec succès');
        }
      } catch (error) {
        console.error('❌ Erreur redémarrage:', error);
        // Retry après délai plus long
        if (isConversationActive && !isStoppedRef.current) {
          console.log('🔄 Retry redémarrage dans 2 secondes');
          scheduleRestart(2000);
        }
      }
    }, delay);
  };

  const processAIResponse = async (finalTranscript: string) => {
    console.log('🤖 === DÉBUT processAIResponse ===');
    console.log('🤖 Input:', finalTranscript);
    console.log('🤖 conversationMode:', conversationMode);
    console.log('🤖 chatGPT disponible:', !!chatGPT);
    console.log('📊 État conversation:', {
      isConversationActive,
      isStoppedRef: isStoppedRef.current
    });
    
    if (!conversationMode || !chatGPT) {
      console.log('❌ Mode conversation désactivé ou ChatGPT non disponible');
      onTranscript(finalTranscript, "message");
      return;
    }

    if (isStoppedRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée via isStoppedRef');
      return;
    }

    if (!isConversationActive) {
      console.log('❌ Traitement annulé - conversation non active');
      return;
    }

    console.log('🤖 Début traitement IA...');
    setIsProcessing(true);
    
    // Arrêter l'écoute pendant le traitement
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('🛑 Écoute arrêtée pour traitement IA');
      } catch (error) {
        console.log('Recognition déjà arrêtée');
      }
    }

    try {
      console.log('📤 Envoi à ChatGPT...');
      const response = await chatGPT.sendMessage(finalTranscript);
      console.log('📥 Réponse ChatGPT reçue:', response.substring(0, 100) + '...');
      
      if (isStoppedRef.current || !isConversationActive) {
        console.log('❌ Conversation arrêtée pendant traitement ChatGPT');
        setIsProcessing(false);
        return;
      }
      
      setLastResponse(response);
      setIsProcessing(false);
      setIsSpeaking(true);
      
      console.log('🔊 Début synthèse vocale...');
      
      // Parler avec callback pour redémarrage
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse vocale terminée');
        setIsSpeaking(false);
        
        // Vérifier encore les conditions avant redémarrage
        console.log('🎯 Vérification conditions pour redémarrage après synthèse');
        console.log('📊 État après synthèse:', {
          isStoppedRef: isStoppedRef.current,
          isConversationActive,
          isListening,
          isSpeaking: false
        });
        
        if (!isStoppedRef.current && isConversationActive) {
          console.log('🎯 Programmation redémarrage après synthèse');
          scheduleRestart(500);
        } else {
          console.log('❌ Redémarrage non programmé après synthèse');
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      
      // Redémarrer même en cas d'erreur
      if (!isStoppedRef.current && isConversationActive) {
        console.log('🔄 Redémarrage après erreur ChatGPT');
        scheduleRestart(2000);
      }
    }
    
    console.log('🤖 === FIN processAIResponse ===');
  };

  const startListening = async () => {
    console.log('🎯 startListening appelé');
    console.log('📊 État actuel:', {
      isListening,
      isConversationActive,
      recognitionAvailable: !!recognitionRef.current
    });
    
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return;
    }

    try {
      // Si conversation déjà active, ne pas l'arrêter
      if (isConversationActive && isListening) {
        console.log('✅ Conversation déjà active, continue...');
        return;
      }

      // Si on était en train de parler, arrêter
      if (isSpeaking) {
        console.log('🛑 Arrêt de la synthèse en cours...');
        stopSpeaking();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('🚀 Démarrage nouvelle conversation');
      isStoppedRef.current = false;
      setIsConversationActive(true);

      // Obtenir le stream micro
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      // Démarrer la reconnaissance
      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Conversation continue démarrée avec succès');
    } catch (error) {
      console.error('❌ Erreur démarrage conversation:', error);
      cleanupMicrophone();
      setIsConversationActive(false);
    }
  };

  const stopListening = () => {
    console.log('🛑 Arrêt complet de la conversation');
    setIsConversationActive(false);
    stopSpeaking();
    cleanupMicrophone();
  };

  // Configuration de la reconnaissance vocale
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
          console.log('🎯 Transcript final détecté:', finalTranscript);
          setTranscript(finalTranscript);
          
          // Traitement immédiat du transcript
          console.log('⚡ Traitement immédiat du transcript');
          processAIResponse(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Erreur reconnaissance:', event.error);
        setIsListening(false);
        
        // Redémarrage automatique après erreur
        if (isConversationActive && !isStoppedRef.current) {
          console.log('🔄 Redémarrage après erreur de reconnaissance');
          scheduleRestart(1500);
        }
      };

      recognition.onend = () => {
        console.log('🏁 Reconnaissance terminée');
        setIsListening(false);
        
        console.log('📊 État à la fin de reconnaissance:', {
          isConversationActive,
          isStoppedRef: isStoppedRef.current,
          isSpeaking,
          isProcessing
        });
        
        // Redémarrage automatique si conversation active
        if (isConversationActive && !isStoppedRef.current && !isSpeaking && !isProcessing) {
          console.log('🔄 Auto-redémarrage après fin normale');
          scheduleRestart(500);
        } else {
          console.log('❌ Pas de redémarrage - conditions non remplies');
        }
      };
    } else {
      console.error('❌ Reconnaissance vocale non supportée');
    }

    return () => {
      cleanupMicrophone();
      stopSpeaking();
    };
  }, [onTranscript, conversationMode, chatGPT, isConversationActive, isSpeaking, isProcessing]);

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
    cleanupMicrophone
  };
};
