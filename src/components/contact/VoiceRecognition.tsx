
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Brain, Zap, MessageCircle, Send } from "lucide-react";
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
}

// Votre clé API OpenAI - configurée pour votre entreprise
const OPENAI_API_KEY = "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";

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField, fillFormFromAI, submitFromAI, formData }, ref) => {
    const [chatGPT, setChatGPT] = useState<EnhancedChatGPTService | null>(null);
    const [conversationMode, setConversationMode] = useState(true);
    const [canSendEmail, setCanSendEmail] = useState(false);
    
    const {
      isListening,
      transcript,
      isProcessing,
      lastResponse,
      isSpeaking,
      startListening,
      stopListening,
      stopSpeaking,
      cleanupMicrophone
    } = useVoiceRecognition({ onTranscript, conversationMode, chatGPT });

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone
    }));

    useEffect(() => {
      // Initialiser ChatGPT automatiquement avec votre clé API
      console.log('🔵 Initializing Enhanced ChatGPT with company API key');
      try {
        const chatGPTInstance = new EnhancedChatGPTService(OPENAI_API_KEY);
        
        // Configurer les callbacks pour le remplissage automatique du formulaire
        if (fillFormFromAI && submitFromAI) {
          chatGPTInstance.setFormCallbacks(fillFormFromAI, submitFromAI);
          console.log('✅ Callbacks de formulaire configurés dans ChatGPT');
        }
        
        setChatGPT(chatGPTInstance);
        
        console.log('✅ Enhanced ChatGPT service with learning capabilities and form integration initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Enhanced ChatGPT service:', error);
      }
    }, [fillFormFromAI, submitFromAI]);

    // Vérifier si le formulaire est prêt pour l'envoi
    useEffect(() => {
      if (formData) {
        const isComplete = Boolean(formData.name && formData.email && formData.message);
        setCanSendEmail(isComplete);
      }
    }, [formData]);

    // Fonction pour envoyer automatiquement l'email quand l'IA le demande
    const handleAutoSubmit = async () => {
      if (canSendEmail && submitFromAI) {
        console.log('🤖 IA déclenche l\'envoi automatique de l\'email');
        await submitFromAI();
      }
    };

    console.log('🔵 VoiceRecognition render - Enhanced chatGPT connected:', !!chatGPT);

    return (
      <div className="relative">
        <div className="bg-gradient-to-br from-gray-900/90 via-blue-900/60 to-purple-900/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 relative overflow-hidden">
          
          <NeuralBackground />

          {/* Header IA */}
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Conseiller IA - Trouvez votre formule idéale
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Assistant Commercial IA</span>
            </div>
          </div>

          {/* Message d'accueil amélioré */}
          <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
            <p className="text-green-200 text-sm">
              ✅ Bonjour ! Je suis votre conseiller IA spécialisé en développement web. 
              Parlez-moi de votre projet (nom, email, téléphone, métier) et je remplirai automatiquement votre demande de devis !
            </p>
          </div>

          {/* Indicateur d'état du formulaire */}
          {formData && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">
                  📝 Formulaire: {canSendEmail ? '✅ Prêt à envoyer' : '⏳ En cours de remplissage automatique...'}
                </span>
                {canSendEmail && (
                  <Button
                    onClick={handleAutoSubmit}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer l'email
                  </Button>
                )}
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
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
