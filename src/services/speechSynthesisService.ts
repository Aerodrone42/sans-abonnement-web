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
      
      // Prioriser les voix françaises les plus naturelles
      this.voice = 
        // Chercher d'abord les voix Google françaises (les plus naturelles)
        voices.find(voice => 
          voice.lang.startsWith('fr') && 
          voice.name.includes('Google') && 
          (voice.name.includes('Amélie') || voice.name.includes('Céline') || voice.name.includes('Française'))
        ) ||
        // Puis les voix Microsoft françaises
        voices.find(voice => 
          voice.lang.startsWith('fr') && 
          voice.name.includes('Microsoft') &&
          (voice.name.includes('Hortense') || voice.name.includes('Julie'))
        ) ||
        // Puis toute voix française premium
        voices.find(voice => 
          voice.lang.startsWith('fr') && 
          (voice.name.includes('Premium') || voice.name.includes('Enhanced'))
        ) ||
        // Sinon première voix française disponible
        voices.find(voice => voice.lang.startsWith('fr')) || 
        voices[0];
      
      console.log('Voice selected:', this.voice?.name, 'Lang:', this.voice?.lang);
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  speak(text: string, onEnd?: () => void): void {
    console.log('🔊 Starting speech synthesis for:', text.substring(0, 50) + '...');
    
    // Arrêter toute synthèse en cours
    this.synth.cancel();
    
    // Réinitialiser le flag d'arrêt forcé APRÈS avoir arrêté la synthèse précédente
    this.isForceStoppedRef.current = false;

    // Créer l'utterance
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    
    if (this.voice) {
      utterance.voice = this.voice;
      console.log('🎤 Using voice:', this.voice.name);
    }
    
    // Paramètres optimisés pour une voix plus naturelle
    utterance.rate = 0.95;        // Légèrement plus lent pour être plus naturel
    utterance.pitch = 1.1;        // Pitch légèrement plus élevé pour une voix féminine agréable
    utterance.volume = 0.9;       // Volume légèrement réduit pour éviter la saturation
    
    // Gestion des événements
    utterance.onstart = () => {
      console.log('🎯 Speech started successfully');
    };
    
    utterance.onend = () => {
      console.log('✅ Speech ended normally');
      this.currentUtterance = null;
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

    // Démarrer immédiatement
    console.log('🚀 Launching speech synthesis...');
    this.synth.speak(utterance);
  }

  stop(): void {
    console.log('🛑 Stopping speech synthesis - FORCE STOP');
    
    // Marquer l'arrêt comme forcé
    this.isForceStoppedRef.current = true;
    
    if (this.currentUtterance) {
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }
    
    // Arrêter immédiatement
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
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
