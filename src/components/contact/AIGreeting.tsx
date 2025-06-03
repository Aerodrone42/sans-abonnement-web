
import { Brain } from "lucide-react";

interface AIGreetingProps {
  initialGreeting: string;
  initError: string | null;
}

const AIGreeting = ({ initialGreeting, initError }: AIGreetingProps) => {
  if (!initialGreeting || initError) return null;

  const getAIStatusIcon = () => {
    if (initError) return '🔴';
    return '🟢';
  };

  return (
    <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-green-200 text-sm font-medium mb-1">Nova - Conseiller IA {getAIStatusIcon()}</p>
          <p className="text-green-100 text-sm">{initialGreeting}</p>
        </div>
      </div>
    </div>
  );
};

export default AIGreeting;
