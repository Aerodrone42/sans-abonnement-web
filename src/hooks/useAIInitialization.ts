
import { useState, useEffect } from 'react';
import { EnhancedChatGPTService } from '@/services/enhancedChatGptService';

interface UseAIInitializationProps {
  fillFormFromAI?: (aiData: Partial<any>) => void;
  submitFromAI?: () => Promise<void>;
}

export const useAIInitialization = ({ fillFormFromAI, submitFromAI }: UseAIInitializationProps) => {
  const [chatGPT, setChatGPT] = useState<EnhancedChatGPTService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [initialGreeting, setInitialGreeting] = useState("");

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "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";

  const initializeChatGPT = async (isRetry = false) => {
    if (isRetry) {
      setIsRetrying(true);
    }
    
    console.log('🔵 DÉBUT INITIALISATION ChatGPT', isRetry ? '(RETRY)' : '(PREMIÈRE FOIS)');
    
    try {
      if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 10) {
        throw new Error('Clé API OpenAI manquante ou invalide');
      }
      
      const chatGPTInstance = new EnhancedChatGPTService(OPENAI_API_KEY);
      console.log('✅ Instance ChatGPT créée');
      
      if (fillFormFromAI && submitFromAI) {
        chatGPTInstance.setFormCallbacks(fillFormFromAI, submitFromAI);
        console.log('✅ Callbacks configurés');
      } else {
        console.warn('⚠️ Callbacks manquants - fillFormFromAI:', !!fillFormFromAI, 'submitFromAI:', !!submitFromAI);
      }
      
      console.log('🔍 Test de connectivité OpenAI...');
      
      setChatGPT(chatGPTInstance);
      console.log('🎯 Instance ChatGPT définie dans le state');
      
      setIsInitialized(true);
      setInitError(null);
      
      try {
        console.log('🎯 Génération du message d\'accueil...');
        const greeting = await chatGPTInstance.startConversation();
        setInitialGreeting(greeting);
        console.log('✅ Message d\'accueil reçu:', greeting);
      } catch (greetingError) {
        console.error('❌ Erreur message d\'accueil:', greetingError);
        setInitialGreeting("Bonjour ! Je suis Nova, votre conseiller IA. Quel est votre secteur d'activité ?");
      }
      
      console.log('🎉 ChatGPT TOTALEMENT INITIALISÉ ET OPÉRATIONNEL');
      
    } catch (error) {
      console.error('❌ ERREUR CRITIQUE initialisation ChatGPT:', error);
      setInitError(error instanceof Error ? error.message : 'Erreur inconnue');
      setIsInitialized(false);
      setChatGPT(null);
      setInitialGreeting("Service temporairement indisponible. Veuillez remplir le formulaire manuellement.");
    } finally {
      setIsRetrying(false);
    }
  };

  const reinitialize = () => {
    console.log('🔄 RÉINITIALISATION FORCÉE');
    setIsInitialized(false);
    setInitError(null);
    setChatGPT(null);
    setInitialGreeting("");
    initializeChatGPT(true);
  };

  useEffect(() => {
    if (!isInitialized && !initError) {
      initializeChatGPT();
    }
  }, [fillFormFromAI, submitFromAI]);

  return {
    chatGPT,
    isInitialized,
    initError,
    isRetrying,
    initialGreeting,
    reinitialize
  };
};
