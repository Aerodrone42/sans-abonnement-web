
interface DebugInfoProps {
  isInitialized: boolean;
  chatGPT: any;
  initError: string | null;
}

const DebugInfo = ({ isInitialized, chatGPT, initError }: DebugInfoProps) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "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";

  if (!import.meta.env.DEV) return null;

  return (
    <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
      <div>🔍 Debug: Init={isInitialized ? '✅' : '❌'} | ChatGPT={chatGPT ? '✅' : '❌'} | Error={initError ? '❌' : '✅'}</div>
      <div>API Key: {OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 20)}...` : 'MANQUANTE'}</div>
    </div>
  );
};

export default DebugInfo;
