
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, MicOff, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecognitionProps {
  onTranscript: (text: string, field: string) => void;
  currentField: string;
}

export interface VoiceRecognitionRef {
  cleanup: () => void;
}

const VoiceRecognition = forwardRef<VoiceRecognitionRef, VoiceRecognitionProps>(
  ({ onTranscript, currentField }, ref) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [audioData, setAudioData] = useState<number[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const animationRef = useRef<number>();
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const cleanupMicrophone = () => {
      console.log('Cleaning up microphone and voice recognition...');
      setIsListening(false);
      
      // Stop media stream if it exists
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Recognition already stopped');
        }
      }

      // Reset audio data
      setAudioData([]);
    };

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone
    }));

    useEffect(() => {
      // Vérifier si la reconnaissance vocale est supportée
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionClass();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            onTranscript(finalTranscript, "message");
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          cleanupMicrophone();
        };

        // Utiliser addEventListener pour l'événement onend qui peut ne pas être directement disponible
        if (recognitionRef.current.addEventListener) {
          recognitionRef.current.addEventListener('end', () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            cleanupMicrophone();
          });
        }
      }

      // Cleanup when component unmounts
      return () => {
        cleanupMicrophone();
      };
    }, [onTranscript]);

    const startListening = async () => {
      if (!recognitionRef.current) return;

      try {
        // First check if we're already listening
        if (isListening) {
          console.log('Already listening, stopping first...');
          cleanupMicrophone();
          return;
        }

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Start recognition
        recognitionRef.current.start();
        setIsListening(true);
        startAudioVisualization();
        
        console.log('Voice recognition started');
      } catch (error) {
        console.error('Erreur d\'accès au microphone:', error);
        cleanupMicrophone();
      }
    };

    const stopListening = () => {
      console.log('Stopping voice recognition...');
      cleanupMicrophone();
    };

    const startAudioVisualization = () => {
      const generateAudioData = () => {
        if (!isListening) return;
        
        const data = Array.from({ length: 32 }, () => Math.random() * 100);
        setAudioData(data);
        animationRef.current = requestAnimationFrame(generateAudioData);
      };
      generateAudioData();
    };

    return (
      <div className="relative">
        {/* Interface de reconnaissance vocale */}
        <div className="bg-gradient-to-br from-gray-900/90 via-blue-900/60 to-purple-900/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 relative overflow-hidden">
          
          {/* Effet de réseau neuronal de fond */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {[...Array(20)].map((_, i) => (
                <g key={i}>
                  <circle
                    cx={20 + (i % 5) * 80}
                    cy={40 + Math.floor(i / 5) * 40}
                    r="3"
                    fill="currentColor"
                    className="text-cyan-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                  {i < 19 && (
                    <line
                      x1={20 + (i % 5) * 80}
                      y1={40 + Math.floor(i / 5) * 40}
                      x2={20 + ((i + 1) % 5) * 80}
                      y2={40 + Math.floor((i + 1) / 5) * 40}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-blue-400/50 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Header IA */}
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Assistant IA Vocal
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Dictée de votre message</span>
            </div>
          </div>

          {/* Visualisation audio - LA PARTIE QUI ÉTAIT MANQUANTE */}
          {isListening && (
            <div className="flex items-center justify-center gap-1 mb-6 h-20">
              {audioData.map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-cyan-400 to-blue-400 rounded-full transition-all duration-100"
                  style={{
                    width: '4px',
                    height: `${Math.max(4, height / 2)}px`,
                    opacity: 0.7 + (height / 200)
                  }}
                />
              ))}
            </div>
          )}

          {/* Bouton microphone */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110 shadow-lg shadow-red-500/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 shadow-lg shadow-blue-500/30'
              }`}
            >
              {/* Onde sonore animée */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
              
              {isListening ? (
                <MicOff className="w-8 h-8 text-white relative z-10" />
              ) : (
                <Mic className="w-8 h-8 text-white relative z-10" />
              )}
            </Button>

            <p className="text-center text-gray-300 text-sm max-w-xs">
              {isListening
                ? `Parlez maintenant pour remplir le champ "Message"...`
                : `Cliquez pour activer la reconnaissance vocale`
              }
            </p>

            {/* Transcript en temps réel */}
            {transcript && (
              <div className="bg-gray-800/50 border border-cyan-400/30 rounded-lg p-4 max-w-md">
                <p className="text-cyan-100 text-sm">
                  <span className="text-cyan-400 font-semibold">Transcription:</span> {transcript}
                </p>
              </div>
            )}
          </div>

          {/* Particules flottantes d'IA */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-float"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);

VoiceRecognition.displayName = "VoiceRecognition";

export default VoiceRecognition;
