
import { Brain, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIStatusDisplayProps {
  isInitialized: boolean;
  initError: string | null;
  isRetrying: boolean;
  chatGPT: any;
  onReinitialize: () => void;
}

const AIStatusDisplay = ({ isInitialized, initError, isRetrying, chatGPT, onReinitialize }: AIStatusDisplayProps) => {
  const getAIStatus = () => {
    if (initError) return { status: 'error', color: 'red', icon: '🔴' };
    if (isRetrying) return { status: 'retrying', color: 'yellow', icon: '🟡' };
    if (isInitialized && chatGPT) return { status: 'ready', color: 'green', icon: '🟢' };
    return { status: 'loading', color: 'blue', icon: '🔵' };
  };

  const aiStatus = getAIStatus();

  return (
    <>
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
                onClick={onReinitialize}
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
    </>
  );
};

export default AIStatusDisplay;
