
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
    const [isFormFilled, setIsFormFilled] = useState(false);
    const [initialGreeting, setInitialGreeting] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Initialiser ChatGPT une seule fois au début
    useEffect(() => {
      if (!isInitialized) {
        console.log('🔵 INITIALISATION UNIQUE de ChatGPT');
        try {
          const chatGPTInstance = new EnhancedChatGPTService(OPENAI_API_KEY);
          
          // Configurer les callbacks AVANT de définir l'instance
          if (fillFormFromAI && submitFromAI) {
            chatGPTInstance.setFormCallbacks(fillFormFromAI, submitFromAI);
            console.log('✅ Callbacks configurés AVANT l\'instance');
          }
          
          // Définir l'instance ChatGPT
          setChatGPT(chatGPTInstance);
          setIsInitialized(true);
          
          // Message d'accueil automatique
          const startGreeting = async () => {
            try {
              const greeting = await chatGPTInstance.startConversation();
              setInitialGreeting(greeting);
              console.log('🎯 Message d\'accueil envoyé:', greeting);
            } catch (error) {
              console.error('❌ Erreur message d\'accueil:', error);
              setInitialGreeting("Bonjour ! Je suis Nova, je vais vous poser quelques questions rapides pour vous conseiller au mieux. Quel est votre secteur d'activité ?");
            }
          };
          
          startGreeting();
          console.log('✅ ChatGPT CORRECTEMENT INITIALISÉ');
          
        } catch (error) {
          console.error('❌ Erreur initialisation ChatGPT:', error);
        }
      }
    }, [fillFormFromAI, submitFromAI, isInitialized]);
    
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
      chatGPT // IMPORTANT: passer l'instance correctement initialisée
    });

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone
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

    // Fonction pour envoyer automatiquement l'email quand l'IA le demande
    const handleAutoSubmit = async () => {
      if (isFormFilled && submitFromAI) {
        console.log('🤖 IA déclenche l\'envoi automatique de l\'email');
        await submitFromAI();
        setIsFormFilled(false); // Reset après envoi
      }
    };

    console.log('🔵 VoiceRecognition render - ChatGPT présent:', !!chatGPT, 'Initialisé:', isInitialized);

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
              <span>Assistant Commercial IA {isInitialized && chatGPT ? '🟢' : '🔴'}</span>
            </div>
          </div>

          {/* Message d'accueil automatique de Nova */}
          {initialGreeting && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-200 text-sm font-medium mb-1">Nova - Conseiller IA</p>
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
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
