
interface ConversationDisplayProps {
  transcript: string;
  lastResponse: string;
}

const ConversationDisplay = ({ transcript, lastResponse }: ConversationDisplayProps) => {
  return (
    <>
      {transcript && (
        <div className="bg-gray-800/50 border border-cyan-400/30 rounded-lg p-4 max-w-md">
          <p className="text-cyan-100 text-sm">
            <span className="text-cyan-400 font-semibold">Vous:</span> {transcript}
          </p>
        </div>
      )}

      {lastResponse && (
        <div className="bg-gray-800/50 border border-green-400/30 rounded-lg p-4 max-w-md">
          <p className="text-green-100 text-sm">
            <span className="text-green-400 font-semibold">ChatGPT:</span> {lastResponse}
          </p>
        </div>
      )}
    </>
  );
};

export default ConversationDisplay;
