
import { useState, useRef, useEffect } from 'react';
import { ChatGPTService } from '@/services/chatGptService';
import { SpeechSynthesisService } from '@/services/speechSynthesisService';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  conversationMode: boolean;
  chatGPT: ChatGPTService | null;
}

export const useVoiceRecognition = ({ onTranscript, conversationMode, chatGPT }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechSynthesis = useRef(new SpeechSynthesisService()).current;
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupMicrophone = () => {
    console.log('Cleaning up microphone and voice recognition...');
    setIsListening(false);
    setIsProcessing(false);
    
    // Nettoyer le timeout de réponse
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Recognition already stopped');
      }
    }
  };

  const stopSpeaking = () => {
    console.log('Stopping AI speech...');
    speechSynthesis.stop();
    setIsSpeaking(false);
    setIsProcessing(false);
  };

  const processAIResponse = async (finalTranscript: string) => {
    if (conversationMode && chatGPT) {
      setIsProcessing(true);
      try {
        console.log('Sending message to AI:', finalTranscript);
        const response = await chatGPT.sendMessage(finalTranscript);
        setLastResponse(response);
        setIsSpeaking(true);
        speechSynthesis.speak(response, () => {
          setIsProcessing(false);
          setIsSpeaking(false);
        });
      } catch (error) {
        console.error('Erreur conversation:', error);
        setIsProcessing(false);
        setIsSpeaking(false);
      }
    } else {
      onTranscript(finalTranscript, "message");
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        console.log('Already listening, stopping first...');
        cleanupMicrophone();
        return;
      }

      // Arrêter l'IA si elle parle
      if (isSpeaking) {
        stopSpeaking();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recognitionRef.current.start();
      setIsListening(true);
      
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      cleanupMicrophone();
    }
  };

  const stopListening = () => {
    console.log('Stopping voice recognition...');
    cleanupMicrophone();
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = async (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          
          // Nettoyer le timeout précédent s'il existe
          if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current);
          }
          
          // Attendre 2.5 secondes avant de traiter la réponse pour laisser le temps au client de continuer
          responseTimeoutRef.current = setTimeout(() => {
            console.log('Processing final transcript after delay:', finalTranscript);
            processAIResponse(finalTranscript);
          }, 2500);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        cleanupMicrophone();
      };

      if (recognitionRef.current.addEventListener) {
        recognitionRef.current.addEventListener('end', () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          cleanupMicrophone();
        });
      }
    }

    return () => {
      cleanupMicrophone();
      stopSpeaking();
    };
  }, [onTranscript, conversationMode, chatGPT]);

  return {
    isListening,
    transcript,
    isProcessing,
    lastResponse,
    isSpeaking,
    startListening,
    stopListening,
    stopSpeaking,
    cleanupMicrophone
  };
};
