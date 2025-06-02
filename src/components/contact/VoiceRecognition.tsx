
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Brain, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatGPTService } from "@/services/chatGptService";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import ApiKeyInput from "./ApiKeyInput";
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

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField }, ref) => {
    const [chatGPT, setChatGPT] = useState<ChatGPTService | null>(null);
    const [conversationMode, setConversationMode] = useState(false);
    
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

    const handleApiKeySet = (apiKey: string) => {
      console.log('🔵 handleApiKeySet called with key length:', apiKey.length);
      console.log('🔵 Raw API key:', apiKey);
      
      const cleanedKey = apiKey.trim().replace(/\s+/g, '');
      console.log('🔵 Cleaned API key length:', cleanedKey.length);
      console.log('🔵 Cleaned API key starts with sk-:', cleanedKey.startsWith('sk-'));
      
      if (!cleanedKey.startsWith('sk-')) {
        console.error('❌ Invalid API key format - must start with sk-');
        alert('Clé API invalide - elle doit commencer par "sk-"');
        return;
      }
      
      try {
        console.log('🔵 Creating ChatGPT service...');
        const service = new ChatGPTService(cleanedKey);
        setChatGPT(service);
        localStorage.setItem('openai_api_key', cleanedKey);
        console.log('✅ ChatGPT service created and API key stored successfully');
        alert('✅ ChatGPT connecté avec succès !');
      } catch (error) {
        console.error('❌ Error creating ChatGPT service:', error);
        alert('❌ Erreur lors de la connexion à ChatGPT: ' + error.message);
      }
    };

    useEffect(() => {
      const storedKey = localStorage.getItem('openai_api_key');
      if (storedKey) {
        console.log('🔵 Found stored API key, creating ChatGPT service');
        try {
          setChatGPT(new ChatGPTService(storedKey));
          console.log('✅ ChatGPT service restored from localStorage');
        } catch (error) {
          console.error('❌ Error restoring ChatGPT service:', error);
          localStorage.removeItem('openai_api_key');
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
                Assistant IA Vocal ChatGPT
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>{conversationMode ? 'Mode Conversation' : 'Mode Dictée'}</span>
            </div>
          </div>

          {/* Configuration API */}
          {!chatGPT && (
            <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-cyan-400/20">
              <ApiKeyInput onApiKeySet={handleApiKeySet} isConnected={false} />
            </div>
          )}

          {chatGPT && (
            <div className="mb-6 flex items-center justify-between">
              <ApiKeyInput onApiKeySet={handleApiKeySet} isConnected={true} />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={conversationMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConversationMode(true)}
                  className="text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Conversation
                </Button>
                <Button
                  type="button"
                  variant={!conversationMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConversationMode(false)}
                  className="text-xs"
                >
                  <Brain className="w-3 h-3 mr-1" />
                  Dictée
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
