import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Brain, Zap, MessageCircle, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedChatGPTService } from "@/services/enhancedChatGptService";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import AudioVisualization from "./AudioVisualization";
import NeuralBackground from "./NeuralBackground";
import VoiceControl from "./VoiceControl";
import ConversationDisplay from "./ConversationDisplay";

interface VoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  currentField: string;
  fillFormFromAI?: (aiData: Partial<any>) => void;
  submitFromAI?: () => Promise<void>;
  formData?: {
    name: string;
    email: string;
    phone: string;
    business: string;
    message: string;
  };
}

export interface VoiceRecognitionRef {
  cleanup: () => void;
  reinitialize: () => void;
}

// Configuration API - IMPORTANTE: Utilisez des variables d'environnement en production !
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "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";

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField, fillFormFromAI, submitFromAI, formData }, ref) => {
    const [chatGPT, setChatGPT] = useState<EnhancedChatGPTService | null>(null);
    const [conversationMode, setConversationMode] = useState(true);
    const [isFormFilled, setIsFormFilled] = useState(false);
    const [initialGreeting, setInitialGreeting] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    
    // Fonction d'initialisation de ChatGPT
    const initializeChatGPT = async (isRetry = false) => {
      if (isRetry) {
        setIsRetrying(true);
      }
      
      console.log('🔵 DÉBUT INITIALISATION ChatGPT', isRetry ? '(RETRY)' : '(PREMIÈRE FOIS)');
      
      try {
        // Vérifier la clé API
        if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 10) {
          throw new Error('Clé API OpenAI manquante ou invalide');
        }
        
        // Créer l'instance ChatGPT
        const chatGPTInstance = new EnhancedChatGPTService(OPENAI_API_KEY);
        console.log('✅ Instance ChatGPT créée');
        
        // Configurer les callbacks AVANT tout
        if (fillFormFromAI && submitFromAI) {
          chatGPTInstance.setFormCallbacks(fillFormFromAI, submitFromAI);
          console.log('✅ Callbacks configurés');
        } else {
          console.warn('⚠️ Callbacks manquants - fillFormFromAI:', !!fillFormFromAI, 'submitFromAI:', !!submitFromAI);
        }
        
        // Test de connectivité avec OpenAI
        console.log('🔍 Test de connectivité OpenAI...');
        
        // CORRECTION CRITIQUE: Définir l'instance ChatGPT AVANT de générer le message d'accueil
        setChatGPT(chatGPTInstance);
        console.log('🎯 Instance ChatGPT définie dans le state');
        
        setIsInitialized(true);
        setInitError(null);
        
        // Message d'accueil automatique APRÈS avoir défini l'instance
        try {
          console.log('🎯 Génération du message d\'accueil...');
          const greeting = await chatGPTInstance.startConversation();
          setInitialGreeting(greeting);
          console.log('✅ Message d\'accueil reçu:', greeting);
        } catch (greetingError) {
          console.error('❌ Erreur message d\'accueil:', greetingError);
          // Message de secours
          setInitialGreeting("Bonjour ! Je suis Nova, votre conseiller IA. Quel est votre secteur d'activité ?");
        }
        
        console.log('🎉 ChatGPT TOTALEMENT INITIALISÉ ET OPÉRATIONNEL');
        
      } catch (error) {
        console.error('❌ ERREUR CRITIQUE initialisation ChatGPT:', error);
        setInitError(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsInitialized(false);
        setChatGPT(null);
        
        // Message de secours en cas d'erreur
        setInitialGreeting("Service temporairement indisponible. Veuillez remplir le formulaire manuellement.");
      } finally {
        setIsRetrying(false);
      }
    };
    
    // Initialiser ChatGPT au montage du composant
    useEffect(() => {
      if (!isInitialized && !initError) {
        initializeChatGPT();
      }
    }, [fillFormFromAI, submitFromAI]);
    
    // CORRECTION CRITIQUE: S'assurer que chatGPT est bien transmis
    console.log('🔍 AVANT useVoiceRecognition - chatGPT:', !!chatGPT, 'isInitialized:', isInitialized);
    
    const {
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
    } = useVoiceRecognition({ 
      onTranscript, 
      conversationMode, 
      chatGPT // Instance ChatGPT correctement initialisée
    });

    // Fonction de réinitialisation
    const reinitialize = () => {
      console.log('🔄 RÉINITIALISATION FORCÉE');
      setIsInitialized(false);
      setInitError(null);
      setChatGPT(null);
      setInitialGreeting("");
      initializeChatGPT(true);
    };

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone,
      reinitialize
    }));

    // Détecter si le formulaire a été rempli par l'IA
    useEffect(() => {
      if (formData) {
        const wasEmpty = !formData.name && !formData.email && !formData.phone && !formData.business;
        const hasContent = formData.name || formData.email || formData.phone || formData.business;
        
        if (wasEmpty && hasContent) {
          setIsFormFilled(true);
          console.log('📝 Formulaire rempli par l\'IA détecté');
        }
      }
    }, [formData]);

    // Fonction pour envoyer automatiquement l'email
    const handleAutoSubmit = async () => {
      if (isFormFilled && submitFromAI) {
        console.log('🤖 IA déclenche l\'envoi automatique de l\'email');
        try {
          await submitFromAI();
          setIsFormFilled(false);
          console.log('✅ Email envoyé automatiquement');
        } catch (error) {
          console.error('❌ Erreur envoi automatique:', error);
        }
      }
    };

    // État de santé de l'IA
    const getAIStatus = () => {
      if (initError) return { status: 'error', color: 'red', icon: '🔴' };
      if (isRetrying) return { status: 'retrying', color: 'yellow', icon: '🟡' };
      if (isInitialized && chatGPT) return { status: 'ready', color: 'green', icon: '🟢' };
      return { status: 'loading', color: 'blue', icon: '🔵' };
    };

    const aiStatus = getAIStatus();

    console.log('🔍 ÉTAT ACTUEL:', {
      isInitialized,
      hasChatGPT: !!chatGPT,
      hasError: !!initError,
      isRetrying,
      hasGreeting: !!initialGreeting
    });

    return (
      <div className="relative">
        <div className="bg-gradient-to-br from-gray-900/90 via-blue-900/60 to-purple-900/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 relative overflow-hidden">
          
          <NeuralBackground />

          {/* Header IA avec statut */}
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Conseiller IA - Trouvez votre formule idéale
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className={`text-${aiStatus.color}-400`}>
                {aiStatus.icon} {aiStatus.status === 'ready' ? 'IA Opérationnelle' : 
                                 aiStatus.status === 'error' ? 'IA Indisponible' :
                                 aiStatus.status === 'retrying' ? 'Reconnexion...' : 'IA en cours...'}
              </span>
            </div>
          </div>

          {/* Message d'erreur avec bouton de retry */}
          {initError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-200 text-sm font-medium mb-1">Problème de connexion IA</p>
                  <p className="text-red-100 text-xs mb-3">{initError}</p>
                  <Button
                    onClick={reinitialize}
                    size="sm"
                    disabled={isRetrying}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isRetrying ? 'Reconnexion...' : 'Réessayer'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Message d'accueil automatique de Nova */}
          {initialGreeting && !initError && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium mb-1">Nova - Conseiller IA {aiStatus.icon}</p>
                  <p className="text-green-100 text-sm">{initialGreeting}</p>
                </div>
              </div>
            </div>
          )}

          {/* Indicateur de formulaire rempli par l'IA */}
          {isFormFilled && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">
                  🎯 Formulaire automatiquement rempli ! Prêt à envoyer votre demande ?
                </span>
                <Button
                  onClick={handleAutoSubmit}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer la demande
                </Button>
              </div>
            </div>
          )}

          <AudioVisualization isListening={isListening} isProcessing={isProcessing} />

          <VoiceControl
            isListening={isListening}
            isProcessing={isProcessing}
            conversationMode={conversationMode}
            chatGPT={chatGPT}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={stopSpeaking}
          />

          <ConversationDisplay transcript={transcript} lastResponse={lastResponse} />

          {/* Debug info en développement */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
              <div>🔍 Debug: Init={isInitialized ? '✅' : '❌'} | ChatGPT={chatGPT ? '✅' : '❌'} | Error={initError ? '❌' : '✅'}</div>
              <div>API Key: {OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 20)}...` : 'MANQUANTE'}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
