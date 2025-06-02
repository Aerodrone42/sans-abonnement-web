
export class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isForceStoppedRef: { current: boolean } = { current: false };

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
    
    // Réinitialiser le flag d'arrêt forcé
    this.isForceStoppedRef.current = false;
    
    // Arrêter toute synthèse en cours proprement
    this.stop();

    // Attendre un peu pour s'assurer que la synthèse précédente est bien arrêtée
    setTimeout(() => {
      // Vérifier si un arrêt forcé a été demandé pendant l'attente
      if (this.isForceStoppedRef.current) {
        console.log('Speech cancelled before starting');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      if (this.voice) {
        utterance.voice = this.voice;
        console.log('Using voice:', this.voice.name);
      }
      
      // Paramètres optimisés pour éviter les coupures
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 0.9;
      
      // Gestion des événements pour debugging
      utterance.onstart = () => {
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        console.log('Speech ended normally');
        this.currentUtterance = null;
        // Ne pas appeler onEnd si l'arrêt a été forcé
        if (onEnd && !this.isForceStoppedRef.current) {
          onEnd();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        this.currentUtterance = null;
        if (onEnd && !this.isForceStoppedRef.current) {
          onEnd();
        }
      };

      // Démarrer la synthèse seulement si pas d'arrêt forcé
      try {
        if (!this.isForceStoppedRef.current) {
          this.synth.speak(utterance);
          console.log('Speech synthesis initiated');
        }
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
    console.log('Stopping speech synthesis - FORCE STOP');
    
    // Marquer l'arrêt comme forcé
    this.isForceStoppedRef.current = true;
    
    if (this.currentUtterance) {
      this.currentUtterance.onend = null; // Éviter les callbacks multiples
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }
    
    // Arrêter immédiatement et agressivement
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    
    // Triple vérification avec délais échelonnés
    setTimeout(() => {
      if (this.synth.speaking) {
        console.log('Force stopping remaining speech (2nd attempt)');
        this.synth.cancel();
      }
    }, 10);
    
    setTimeout(() => {
      if (this.synth.speaking) {
        console.log('Force stopping remaining speech (3rd attempt)');
        this.synth.cancel();
      }
    }, 50);
  }

  isSpeaking(): boolean {
    return this.synth.speaking && this.currentUtterance !== null && !this.isForceStoppedRef.current;
  }

  getSynthesisState(): string {
    if (this.isForceStoppedRef.current) return 'force-stopped';
    if (this.synth.speaking) return 'speaking';
    if (this.synth.pending) return 'pending';
    return 'idle';
  }
}
