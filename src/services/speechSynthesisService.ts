
export class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoice();
  }

  private initVoice() {
    const setVoice = () => {
      const voices = this.synth.getVoices();
      // Chercher une voix française de qualité
      this.voice = voices.find(voice => 
        voice.lang.startsWith('fr') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      ) || voices.find(voice => voice.lang.startsWith('fr')) || voices[0];
      
      console.log('Voice selected:', this.voice?.name);
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  speak(text: string, onEnd?: () => void): void {
    console.log('Starting speech synthesis for:', text.substring(0, 50) + '...');
    
    // Arrêter toute synthèse en cours proprement
    this.stop();

    // Attendre un peu pour s'assurer que la synthèse précédente est bien arrêtée
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      if (this.voice) {
        utterance.voice = this.voice;
        console.log('Using voice:', this.voice.name);
      }
      
      // Paramètres optimisés pour éviter les coupures
      utterance.rate = 0.85; // Légèrement plus lent pour plus de stabilité
      utterance.pitch = 1;
      utterance.volume = 0.9; // Volume plus élevé
      
      // Gestion des événements pour debugging
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        console.log('Speech ended normally');
        this.currentUtterance = null;
        if (onEnd) {
          onEnd();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        this.currentUtterance = null;
        if (onEnd) {
          onEnd();
        }
      };
      
      utterance.onboundary = (event) => {
        console.log('Speech boundary:', event.name, 'at', event.charIndex);
      };

      // Démarrer la synthèse
      try {
        this.synth.speak(utterance);
        console.log('Speech synthesis initiated');
      } catch (error) {
        console.error('Error starting speech synthesis:', error);
        this.currentUtterance = null;
        if (onEnd) {
          onEnd();
        }
      }
    }, 100);
  }

  stop(): void {
    console.log('Stopping speech synthesis');
    
    if (this.currentUtterance) {
      this.currentUtterance.onend = null; // Éviter les callbacks multiples
      this.currentUtterance = null;
    }
    
    // Arrêter la synthèse de manière plus douce
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    
    // Double vérification après un court délai
    setTimeout(() => {
      if (this.synth.speaking) {
        console.log('Force stopping remaining speech');
        this.synth.cancel();
      }
    }, 50);
  }

  isSpeaking(): boolean {
    return this.synth.speaking && this.currentUtterance !== null;
  }

  // Nouvelle méthode pour vérifier l'état de la synthèse
  getSynthesisState(): string {
    if (this.synth.speaking) return 'speaking';
    if (this.synth.pending) return 'pending';
    return 'idle';
  }
}
