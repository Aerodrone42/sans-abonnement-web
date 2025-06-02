
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
    setIsConversationActive(false);
    
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

  // Fonction simplifiée de redémarrage
  const scheduleRestart = (delay: number = 1000) => {
    console.log(`⏰ Programmation redémarrage dans ${delay}ms`);
    
    // Nettoyer ancien timeout
    if (autoRestartTimeoutRef.current) {
      clearTimeout(autoRestartTimeoutRef.current);
    }
    
    autoRestartTimeoutRef.current = setTimeout(async () => {
      console.log('🔄 TENTATIVE DE REDÉMARRAGE');
      console.log('- isStoppedRef:', isStoppedRef.current);
      console.log('- isConversationActive:', isConversationActive);
      console.log('- isListening:', isListening);
      console.log('- isSpeaking:', isSpeaking);
      console.log('- isProcessing:', isProcessing);
      
      if (isStoppedRef.current || !isConversationActive) {
        console.log('❌ Redémarrage annulé - conversation arrêtée');
        return;
      }

      if (isListening || isSpeaking || isProcessing) {
        console.log('❌ Redémarrage annulé - autre activité en cours');
        return;
      }

      try {
        console.log('🚀 REDÉMARRAGE EFFECTIF');
        
        // S'assurer qu'on a le stream micro
        if (!mediaStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
        }

        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
          console.log('✅ Écoute redémarrée avec succès');
        }
      } catch (error) {
        console.error('❌ Erreur redémarrage:', error);
        // Retry après délai plus long
        if (isConversationActive && !isStoppedRef.current) {
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
    
    if (!conversationMode || !chatGPT) {
      console.log('❌ Mode conversation désactivé ou ChatGPT non disponible');
      onTranscript(finalTranscript, "message");
      scheduleRestart(1000); // Redémarrer même en mode normal
      return;
    }

    if (isStoppedRef.current) {
      console.log('❌ Traitement annulé - conversation arrêtée');
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
      
      if (isStoppedRef.current) {
        console.log('❌ Conversation arrêtée pendant traitement ChatGPT');
        setIsProcessing(false);
        return;
      }
      
      setLastResponse(response);
      setIsProcessing(false);
      setIsSpeaking(true);
      
      console.log('🔊 Début synthèse vocale...');
      
      // Parler avec callback simplifié
      speechSynthesis.speak(response, () => {
        console.log('✅ Synthèse vocale terminée');
        setIsSpeaking(false);
        
        // Redémarrage immédiat après la synthèse
        if (!isStoppedRef.current && isConversationActive) {
          console.log('🎯 Programmation redémarrage après synthèse');
          scheduleRestart(500); // Délai court
        } else {
          console.log('❌ Redémarrage non programmé');
          console.log('- isStoppedRef:', isStoppedRef.current);
          console.log('- isConversationActive:', isConversationActive);
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur ChatGPT:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      
      // Redémarrer même en cas d'erreur
      if (!isStoppedRef.current && isConversationActive) {
        console.log('🔄 Redémarrage après erreur');
        scheduleRestart(2000);
      }
    }
    
    console.log('🤖 === FIN processAIResponse ===');
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      console.log('❌ Recognition non disponible');
      return;
    }

    try {
      if (isListening && isConversationActive) {
        console.log('🛑 Arrêt de la conversation en cours...');
        stopSpeaking();
        cleanupMicrophone();
        return;
      }

      console.log('🚀 Démarrage nouvelle conversation');
      isStoppedRef.current = false;
      setIsConversationActive(true);

      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('🎤 Conversation continue démarrée');
    } catch (error) {
      console.error('❌ Erreur démarrage conversation:', error);
      cleanupMicrophone();
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
        
        // Redémarrage automatique si conversation active et pas en traitement
        if (isConversationActive && !isStoppedRef.current && !isSpeaking && !isProcessing) {
          console.log('🔄 Auto-redémarrage après fin normale');
          scheduleRestart(500);
        } else {
          console.log('❌ Pas de redémarrage - conditions:');
          console.log('- isConversationActive:', isConversationActive);
          console.log('- isStoppedRef:', isStoppedRef.current);
          console.log('- isSpeaking:', isSpeaking);
          console.log('- isProcessing:', isProcessing);
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
