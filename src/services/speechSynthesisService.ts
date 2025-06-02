
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

  // NOUVELLE MÉTHODE: Nettoyer le texte des caractères spéciaux
  private cleanTextForSpeech(text: string): string {
    return text
      // Remplacer les caractères spéciaux par leur équivalent parlé
      .replace(/€/g, ' euros')
      .replace(/\$/g, ' dollars')
      .replace(/%/g, ' pourcent')
      .replace(/&/g, ' et ')
      .replace(/@/g, ' arobase ')
      .replace(/#/g, ' dièse ')
      .replace(/\*/g, ' ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' égal ')
      .replace(/_/g, ' ')
      .replace(/\|/g, ' ')
      .replace(/\\/g, ' ')
      .replace(/\//g, ' ')
      .replace(/\^/g, ' ')
      .replace(/`/g, ' ')
      .replace(/~/g, ' ')
      .replace(/\[/g, ' ')
      .replace(/\]/g, ' ')
      .replace(/\{/g, ' ')
      .replace(/\}/g, ' ')
      .replace(/<>/g, ' ')
      .replace(/</g, ' ')
      .replace(/>/g, ' ')
      
      // Nettoyer les points de suspension
      .replace(/\.{3,}/g, ' ')
      .replace(/\.{2}/g, '. ')
      
      // Nettoyer les tirets multiples
      .replace(/-{2,}/g, ' ')
      .replace(/_{2,}/g, ' ')
      
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      
      // Nettoyer les émojis et caractères Unicode spéciaux
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, ' ')
      
      // Nettoyer les caractères de contrôle
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      
      // Trim final
      .trim();
  }

  speak(text: string, onEnd?: () => void): void {
    console.log('🔊 Texte original:', text.substring(0, 50) + '...');
    
    // NETTOYER le texte avant la synthèse
    const cleanText = this.cleanTextForSpeech(text);
    console.log('🧹 Texte nettoyé:', cleanText.substring(0, 50) + '...');
    
    // Arrêter toute synthèse en cours
    this.synth.cancel();
    
    // Réinitialiser le flag d'arrêt forcé APRÈS avoir arrêté la synthèse précédente
    this.isForceStoppedRef.current = false;

    // Créer l'utterance avec le texte nettoyé
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
