
import { Mic, MicOff, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlProps {
  isListening: boolean;
  isProcessing: boolean;
  conversationMode: boolean;
  chatGPT: any;
  onStartListening: () => void;
  onStopListening: () => void;
}

const VoiceControl = ({ 
  isListening, 
  isProcessing, 
  conversationMode, 
  chatGPT, 
  onStartListening, 
  onStopListening 
}: VoiceControlProps) => {
  return (
    <div className="flex flex-col items-center gap-4 relative z-10">
      <Button
        type="button"
        onClick={isListening ? onStopListening : onStartListening}
        disabled={isProcessing || (!chatGPT && conversationMode)}
        className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
          isProcessing
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg shadow-purple-500/50'
            : isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110 shadow-lg shadow-red-500/50'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 shadow-lg shadow-blue-500/30'
        }`}
      >
        {(isListening || isProcessing) && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {isProcessing ? (
          <Brain className="w-8 h-8 text-white relative z-10 animate-pulse" />
        ) : isListening ? (
          <MicOff className="w-8 h-8 text-white relative z-10" />
        ) : (
          <Mic className="w-8 h-8 text-white relative z-10" />
        )}
      </Button>

      <p className="text-center text-gray-300 text-sm max-w-xs">
        {isProcessing
          ? 'ChatGPT réfléchit...'
          : isListening
          ? conversationMode 
            ? 'Parlez avec ChatGPT...'
            : 'Dictez votre message...'
          : conversationMode
          ? 'Cliquez pour parler avec ChatGPT'
          : 'Cliquez pour dicter votre message'
        }
      </p>
    </div>
  );
};

export default VoiceControl;
