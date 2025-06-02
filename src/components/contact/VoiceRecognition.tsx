
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Brain, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatGPTService } from "@/services/chatGptService";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import AudioVisualization from "./AudioVisualization";
import NeuralBackground from "./NeuralBackground";
import VoiceControl from "./VoiceControl";
import ConversationDisplay from "./ConversationDisplay";

interface VoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  currentField: string;
}

export interface VoiceRecognitionRef {
  cleanup: () => void;
}

// Votre clé API OpenAI - remplacez par votre vraie clé
const OPENAI_API_KEY = "sk-votre-cle-api-ici";

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField }, ref) => {
    const [chatGPT, setChatGPT] = useState<ChatGPTService | null>(null);
    const [conversationMode, setConversationMode] = useState(true); // Mode conversation par défaut
    
    const {
      isListening,
      transcript,
      isProcessing,
      lastResponse,
      startListening,
      stopListening,
      cleanupMicrophone
    } = useVoiceRecognition({ onTranscript, conversationMode, chatGPT });

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone
    }));

    useEffect(() => {
      // Initialiser ChatGPT avec votre clé API au chargement
      if (OPENAI_API_KEY && OPENAI_API_KEY !== "sk-votre-cle-api-ici") {
        console.log('🔵 Initializing ChatGPT with company API key');
        try {
          setChatGPT(new ChatGPTService(OPENAI_API_KEY));
          console.log('✅ ChatGPT service initialized successfully');
        } catch (error) {
          console.error('❌ Error initializing ChatGPT service:', error);
        }
      }
    }, []);

    console.log('🔵 VoiceRecognition render - chatGPT connected:', !!chatGPT);

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

          {/* Message d'accueil */}
          {!chatGPT ? (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-200 text-sm">
                ⚠️ Configuration requise : Veuillez ajouter votre clé API OpenAI dans le code pour activer l'assistant IA.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
              <p className="text-green-200 text-sm">
                ✅ Assistant IA prêt ! Parlez-moi de votre projet pour que je vous propose la formule la plus adaptée.
              </p>
            </div>
          )}

          <AudioVisualization isListening={isListening} isProcessing={isProcessing} />

          <VoiceControl
            isListening={isListening}
            isProcessing={isProcessing}
            conversationMode={conversationMode}
            chatGPT={chatGPT}
            onStartListening={startListening}
            onStopListening={stopListening}
          />

          <ConversationDisplay transcript={transcript} lastResponse={lastResponse} />
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
