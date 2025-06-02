
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isConnected: boolean;
}

const ApiKeyInput = ({ onApiKeySet, isConnected }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, API key length:', apiKey.length);
    console.log('API key starts with sk-:', apiKey.startsWith('sk-'));
    
    if (apiKey.trim()) {
      console.log('Calling onApiKeySet with API key');
      onApiKeySet(apiKey.trim());
    } else {
      console.log('API key is empty or invalid');
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400">
        <Key className="w-4 h-4" />
        <span>ChatGPT connecté</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm text-gray-300">
        <p className="mb-2">🔑 <strong>Clé API OpenAI requise</strong></p>
        <p className="text-xs text-gray-400">
          Obtenez votre clé sur{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            platform.openai.com
          </a>
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => {
              console.log('API key input changed, length:', e.target.value.length);
              setApiKey(e.target.value);
            }}
            placeholder="sk-..."
            className="pr-10 bg-gray-800/50 border-cyan-400/30 text-white"
          />
          <button
            type="button"
            onClick={() => {
              console.log('Toggle visibility clicked');
              setShowKey(!showKey);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button 
          type="submit" 
          disabled={!apiKey.trim()}
          onClick={(e) => {
            console.log('Connect button clicked');
            // Le handleSubmit sera appelé automatiquement par le formulaire
          }}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          Connecter
        </Button>
      </div>
    </form>
  );
};

export default ApiKeyInput;
