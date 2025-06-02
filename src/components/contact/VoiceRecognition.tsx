
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Mic, MicOff, Brain, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatGPTService } from "@/services/chatGptService";
import { SpeechSynthesisService } from "@/services/speechSynthesisService";
import ApiKeyInput from "./ApiKeyInput";

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResponse, setLastResponse] = useState("");
    const [chatGPT, setChatGPT] = useState<ChatGPTService | null>(null);
    const [speechSynthesis] = useState(() => new SpeechSynthesisService());
    const [conversationMode, setConversationMode] = useState(false);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const animationRef = useRef<number>();
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const cleanupMicrophone = () => {
      console.log('Cleaning up microphone and voice recognition...');
      setIsListening(false);
      setIsProcessing(false);
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Recognition already stopped');
        }
      }

      speechSynthesis.stop();
      setAudioData([]);
    };

    useImperativeHandle(ref, () => ({
      cleanup: cleanupMicrophone
    }));

    const handleApiKeySet = (apiKey: string) => {
      console.log('handleApiKeySet called with key length:', apiKey.length);
      console.log('API key starts with sk-:', apiKey.startsWith('sk-'));
      
      try {
        const service = new ChatGPTService(apiKey);
        setChatGPT(service);
        localStorage.setItem('openai_api_key', apiKey);
        console.log('ChatGPT service created and API key stored');
      } catch (error) {
        console.error('Error creating ChatGPT service:', error);
      }
    };

    useEffect(() => {
      // Récupérer la clé API stockée
      const storedKey = localStorage.getItem('openai_api_key');
      if (storedKey) {
        console.log('Found stored API key, creating ChatGPT service');
        setChatGPT(new ChatGPTService(storedKey));
      }

      // ... keep existing code (speech recognition setup)
      // Vérifier si la reconnaissance vocale est supportée
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionClass();
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = async (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            
            if (conversationMode && chatGPT) {
              // Mode conversation avec ChatGPT
              setIsProcessing(true);
              try {
                const response = await chatGPT.sendMessage(finalTranscript);
                setLastResponse(response);
                speechSynthesis.speak(response, () => {
                  setIsProcessing(false);
                });
              } catch (error) {
                console.error('Erreur conversation:', error);
                setIsProcessing(false);
              }
            } else {
              // Mode dictée classique
              onTranscript(finalTranscript, "message");
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          cleanupMicrophone();
        };

        if (recognitionRef.current.addEventListener) {
          recognitionRef.current.addEventListener('end', () => {
            console.log('Speech recognition ended');
            setIsListening(false);
            cleanupMicrophone();
          });
        }
      }

      return () => {
        cleanupMicrophone();
      };
    }, [onTranscript, conversationMode, chatGPT]);

    const startListening = async () => {
      if (!recognitionRef.current) return;

      try {
        if (isListening) {
          console.log('Already listening, stopping first...');
          cleanupMicrophone();
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

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

    console.log('VoiceRecognition render - chatGPT connected:', !!chatGPT);

    return (
      <div className="relative">
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
                  <Mic className="w-3 h-3 mr-1" />
                  Dictée
                </Button>
              </div>
            </div>
          )}

          {/* Visualisation audio */}
          {(isListening || isProcessing) && (
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
          )}

          {/* Bouton microphone */}
          <div className="flex flex-col items-center gap-4 relative z-10">
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
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

            {/* Transcription et réponse */}
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
