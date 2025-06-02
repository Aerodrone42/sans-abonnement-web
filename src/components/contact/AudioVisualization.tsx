
import { useState, useRef, useEffect } from 'react';

interface AudioVisualizationProps {
  isListening: boolean;
  isProcessing: boolean;
}

const AudioVisualization = ({ isListening, isProcessing }: AudioVisualizationProps) => {
  const [audioData, setAudioData] = useState<number[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const generateAudioData = () => {
      if (!isListening && !isProcessing) return;
      
      const data = Array.from({ length: 32 }, () => Math.random() * 100);
      setAudioData(data);
      animationRef.current = requestAnimationFrame(generateAudioData);
    };

    if (isListening || isProcessing) {
      generateAudioData();
    } else {
      setAudioData([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isProcessing]);

  if (!isListening && !isProcessing) return null;

  return (
    <div className="flex items-center justify-center gap-1 mb-6 h-20">
      {audioData.map((height, index) => (
        <div
          key={index}
          className={`rounded-full transition-all duration-100 ${
            isProcessing ? 'bg-gradient-to-t from-purple-400 to-pink-400' : 'bg-gradient-to-t from-cyan-400 to-blue-400'
          }`}
          style={{
            width: '4px',
            height: `${Math.max(4, height / 2)}px`,
            opacity: 0.7 + (height / 200)
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualization;
