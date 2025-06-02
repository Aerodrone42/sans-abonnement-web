
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
    console.log('🔊 Starting speech synthesis for:', text.substring(0, 50) + '...');
    
    // Réinitialiser le flag d'arrêt forcé
    this.isForceStoppedRef.current = false;
    
    // Arrêter toute synthèse en cours proprement
    this.stop();

    // Créer l'utterance immédiatement
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    
    if (this.voice) {
      utterance.voice = this.voice;
      console.log('🎤 Using voice:', this.voice.name);
    }
    
    // Paramètres optimisés pour éviter les coupures
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1.0;
    
    // Gestion des événements pour debugging
    utterance.onstart = () => {
      console.log('🎯 Speech started successfully');
    };
    
    utterance.onend = () => {
      console.log('✅ Speech ended normally');
      this.currentUtterance = null;
      // Ne pas appeler onEnd si l'arrêt a été forcé
      if (onEnd && !this.isForceStoppedRef.current) {
        onEnd();
      }
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Speech synthesis error:', event.error);
      this.currentUtterance = null;
      if (onEnd && !this.isForceStoppedRef.current) {
        onEnd();
      }
    };

    // Démarrer la synthèse immédiatement
    try {
      if (!this.isForceStoppedRef.current) {
        console.log('🚀 Launching speech synthesis...');
        this.synth.speak(utterance);
        
        // Vérifier que la synthèse a bien démarré
        setTimeout(() => {
          if (!this.synth.speaking && !this.isForceStoppedRef.current) {
            console.warn('⚠️ Speech did not start, retrying...');
            this.synth.speak(utterance);
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ Error starting speech synthesis:', error);
      this.currentUtterance = null;
      if (onEnd) {
        onEnd();
      }
    }
  }

  stop(): void {
    console.log('🛑 Stopping speech synthesis - FORCE STOP');
    
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
        console.log('🔄 Force stopping remaining speech (2nd attempt)');
        this.synth.cancel();
      }
    }, 10);
    
    setTimeout(() => {
      if (this.synth.speaking) {
        console.log('🔄 Force stopping remaining speech (3rd attempt)');
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
