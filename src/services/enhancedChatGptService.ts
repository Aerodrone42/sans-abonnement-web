
import { ChatGPTService } from './chatGptService';
import { learningService, ConversationData } from './learningService';
import { ClientInfo } from '../types/clientInfo';
import { ClientInfoExtractor } from './clientInfoExtractor';
import { ConversationStageManager } from './conversationStageManager';
import { SystemPromptBuilder } from './systemPromptBuilder';

export class EnhancedChatGPTService extends ChatGPTService {
  private sessionId: string;
  private currentStage: number = 1;
  private clientInfo: ClientInfo = {};
  private fillFormCallback: ((data: any) => void) | null = null;
  private submitFormCallback: (() => Promise<void>) | null = null;
  private isInitialized: boolean = false;

  constructor(apiKey: string) {
    super(apiKey);
    this.sessionId = this.generateSessionId();
    this.isInitialized = true;
    learningService.startConversation(this.sessionId);
    console.log('🚀 EnhancedChatGPTService STABLE initialisé avec session:', this.sessionId);
  }

  setFormCallbacks(fillForm: (data: any) => void, submitForm: () => Promise<void>) {
    this.fillFormCallback = fillForm;
    this.submitFormCallback = submitForm;
    console.log('✅ Callbacks de formulaire configurés STABLE');
  }

  async startConversation(): Promise<string> {
    if (!this.isInitialized) {
      console.log('❌ Service non initialisé, impossible de démarrer');
      return "Erreur d'initialisation du service IA";
    }
    
    console.log('🎯 Démarrage STABLE de la conversation avec Nova');
    this.clientInfo.conversationStage = 'accueil';
    return "Bonjour ! Je suis Nova, votre conseillère IA d'Aerodrone Multiservices. Je vais vous poser quelques questions rapides pour vous conseiller au mieux. Quel est votre secteur d'activité ?";
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      if (!this.isInitialized) {
        console.log('❌ Service non initialisé pour sendMessage');
        return "Erreur de service, veuillez rafraîchir la page";
      }

      console.log('📝 Message utilisateur reçu STABLE:', userMessage);
      
      // CORRECTION CRITIQUE: S'assurer que le callback est toujours passé
      console.log('🔧 Callback disponible:', !!this.fillFormCallback);
      
      // Extraire les informations du client progressivement avec le callback
      this.clientInfo = ClientInfoExtractor.extractClientInfo(
        userMessage, 
        this.clientInfo, 
        this.fillFormCallback // IMPORTANT: toujours passer le callback
      );
      
      // Déterminer l'étape actuelle de la conversation
      this.clientInfo = ConversationStageManager.updateConversationStage(
        userMessage, 
        this.clientInfo
      );
      
      // Appeler la méthode parent
      const response = await super.sendMessage(userMessage);
      console.log('🎯 Réponse IA reçue STABLE:', response);
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT STABLE:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  async getPerformanceStats() {
    return await learningService.getPerformanceStats();
  }

  endConversation(outcome: ConversationData['outcome'] = 'abandoned'): void {
    learningService.endConversation(outcome);
  }

  clearHistory(): void {
    learningService.endConversation('abandoned');
    super.clearHistory();
    this.sessionId = this.generateSessionId();
    this.currentStage = 1;
    this.clientInfo = { conversationStage: 'accueil' };
    this.isInitialized = true;
    learningService.startConversation(this.sessionId);
    console.log('🔄 Nouvelle session STABLE démarrée:', this.sessionId);
  }
}
