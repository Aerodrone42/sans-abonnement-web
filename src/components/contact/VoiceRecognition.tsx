
import { useState, forwardRef, useImperativeHandle } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useAIInitialization } from "@/hooks/useAIInitialization";
import AudioVisualization from "./AudioVisualization";
import NeuralBackground from "./NeuralBackground";
import VoiceControl from "./VoiceControl";
import ConversationDisplay from "./ConversationDisplay";
import AIStatusDisplay from "./AIStatusDisplay";
import AIGreeting from "./AIGreeting";
import AutoSubmitIndicator from "./AutoSubmitIndicator";
import DebugInfo from "./DebugInfo";

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

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField, fillFormFromAI, submitFromAI, formData }, ref) => {
    const [conversationMode] = useState(true);
    
    // Initialize AI service
    const {
      chatGPT,
      isInitialized,
      initError,
      isRetrying,
      initialGreeting,
      reinitialize
    } = useAIInitialization({ fillFormFromAI, submitFromAI });

    console.log('🔍 AVANT useVoiceRecognition - chatGPT:', !!chatGPT, 'isInitialized:', isInitialized);
    
    // Voice recognition hook
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
      chatGPT
    });

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone,
      reinitialize
    }));

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

          <AIStatusDisplay
            isInitialized={isInitialized}
            initError={initError}
            isRetrying={isRetrying}
            chatGPT={chatGPT}
            onReinitialize={reinitialize}
          />

          <AIGreeting
            initialGreeting={initialGreeting}
            initError={initError}
          />

          <AutoSubmitIndicator
            formData={formData}
            submitFromAI={submitFromAI}
          />

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

          <DebugInfo
            isInitialized={isInitialized}
            chatGPT={chatGPT}
            initError={initError}
          />
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
