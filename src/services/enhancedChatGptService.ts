import { ChatGPTService } from './chatGptService';
import { learningService, ConversationData } from './learningService';

export class EnhancedChatGPTService extends ChatGPTService {
  private sessionId: string;
  private currentStage: number = 1;
  private clientInfo: ConversationData['clientInfo'] = {};
  private fillFormCallback: ((data: any) => void) | null = null;
  private submitFormCallback: (() => Promise<void>) | null = null;

  constructor(apiKey: string) {
    super(apiKey);
    this.sessionId = this.generateSessionId();
    learningService.startConversation(this.sessionId);
    console.log('🚀 EnhancedChatGPTService initialisé avec session:', this.sessionId);
  }

  // Nouvelle méthode pour configurer les callbacks de formulaire
  setFormCallbacks(fillForm: (data: any) => void, submitForm: () => Promise<void>) {
    this.fillFormCallback = fillForm;
    this.submitFormCallback = submitForm;
    console.log('✅ Callbacks de formulaire configurés');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Analyser le message utilisateur pour extraire les infos
      this.extractClientInfo(userMessage);
      
      // Déterminer l'étape actuelle
      this.currentStage = this.determineCurrentStage(userMessage);
      
      // Enregistrer le message utilisateur
      learningService.addMessage('user', userMessage, this.currentStage);
      
      // Récupérer des patterns ou témoignages pertinents si on en a
      await this.enhancePromptWithLearning();
      
      // Envoyer le message à ChatGPT (méthode parent)
      const response = await super.sendMessage(userMessage);
      
      // Enregistrer la réponse de l'IA
      learningService.addMessage('assistant', response, this.currentStage);
      
      // Mettre à jour les infos client si nouvelles données
      if (Object.keys(this.clientInfo).length > 0) {
        learningService.updateClientInfo(this.clientInfo);
        
        // Remplir le formulaire automatiquement si on a assez d'infos
        this.tryAutoFillForm();
      }
      
      // Sauvegarder automatiquement la conversation toutes les 3 étapes
      if (this.currentStage % 3 === 0) {
        await learningService.saveConversation();
      }
      
      // Détecter si la conversation est terminée avec succès
      if (this.isSuccessfulConversion(response)) {
        learningService.endConversation('success');
        
        // Essayer d'envoyer automatiquement si le formulaire est complet
        this.tryAutoSubmitForm();
      }
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Détecter le nom
    const namePatterns = [
      /je\s+(?:m'appelle|suis)\s+([a-zA-Z\-\s]+)/i,
      /mon\s+nom\s+(?:est|c'est)\s+([a-zA-Z\-\s]+)/i,
      /c'est\s+([a-zA-Z\-\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && !this.clientInfo.nom) {
        this.clientInfo.nom = match[1].trim();
        console.log('👤 Nom détecté:', this.clientInfo.nom);
        break;
      }
    }
    
    // Détecter l'email
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = message.match(emailPattern);
    if (emailMatch && !this.clientInfo.email) {
      this.clientInfo.email = emailMatch[1];
      console.log('📧 Email détecté:', this.clientInfo.email);
    }
    
    // Détecter le téléphone
    const phonePatterns = [
      /(?:0[1-9])(?:[\s.-]?\d{2}){4}/,
      /(?:\+33|0033)[1-9](?:[\s.-]?\d{2}){4}/,
      /(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/
    ];
    
    for (const pattern of phonePatterns) {
      const match = message.match(pattern);
      if (match && !this.clientInfo.telephone) {
        this.clientInfo.telephone = match[0];
        console.log('📞 Téléphone détecté:', this.clientInfo.telephone);
        break;
      }
    }
    
    // Détecter le métier
    const metiers = ['plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 'carreleur', 'couvreur'];
    const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
    if (foundMetier && !this.clientInfo.metier) {
      this.clientInfo.metier = foundMetier;
      console.log('🎯 Métier détecté:', foundMetier);
    }
    
    // Détecter la zone
    if ((lowerMessage.includes('km') || lowerMessage.includes('kilomètre')) && !this.clientInfo.zone) {
      const kmMatch = message.match(/(\d+)\s*km/);
      if (kmMatch) {
        this.clientInfo.zone = `${kmMatch[1]}km`;
        console.log('🗺️ Zone détectée:', this.clientInfo.zone);
      }
    }
    
    // Détecter les villes
    const villes = ['paris', 'lyon', 'marseille', 'toulouse', 'bordeaux', 'lille', 'nantes', 'strasbourg'];
    const foundVille = villes.find(ville => lowerMessage.includes(ville));
    if (foundVille && !this.clientInfo.zone) {
      this.clientInfo.zone = foundVille;
      console.log('🏙️ Ville détectée:', foundVille);
    }
    
    // Détecter le budget
    if (lowerMessage.includes('€') || lowerMessage.includes('euro')) {
      const budgetMatch = message.match(/(\d+)\s*€/);
      if (budgetMatch && !this.clientInfo.budget) {
        this.clientInfo.budget = `${budgetMatch[1]}€`;
        console.log('💰 Budget détecté:', this.clientInfo.budget);
      }
    }
  }

  private tryAutoFillForm(): void {
    if (!this.fillFormCallback) return;
    
    const formData: any = {};
    
    // Mapper les infos collectées vers les champs du formulaire
    if (this.clientInfo.nom) {
      formData.name = this.clientInfo.nom;
    }
    
    if (this.clientInfo.email) {
      formData.email = this.clientInfo.email;
    }
    
    if (this.clientInfo.telephone) {
      formData.phone = this.clientInfo.telephone;
    }
    
    if (this.clientInfo.metier) {
      formData.business = this.clientInfo.metier;
    }
    
    // Créer un message personnalisé basé sur les infos collectées
    if (this.clientInfo.metier || this.clientInfo.zone || this.clientInfo.budget) {
      let message = `Demande de devis - ${this.clientInfo.metier || 'Professionnel'}`;
      
      if (this.clientInfo.zone) {
        message += ` - Zone: ${this.clientInfo.zone}`;
      }
      
      if (this.clientInfo.budget) {
        message += ` - Budget: ${this.clientInfo.budget}`;
      }
      
      message += `\n\nConversation avec l'IA : Le client a exprimé un intérêt pour nos services. Session: ${this.sessionId}`;
      
      formData.message = message;
    }
    
    // Remplir le formulaire si on a au moins quelques infos
    if (Object.keys(formData).length > 0) {
      console.log('🤖 Remplissage automatique du formulaire:', formData);
      this.fillFormCallback(formData);
    }
  }

  private async tryAutoSubmitForm(): Promise<void> {
    if (!this.submitFormCallback) return;
    
    // Vérifier qu'on a les infos minimales (nom, email, message)
    if (this.clientInfo.nom && this.clientInfo.email) {
      console.log('🚀 Envoi automatique du formulaire...');
      try {
        await this.submitFormCallback();
        console.log('✅ Formulaire envoyé automatiquement avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi automatique:', error);
      }
    }
  }

  private determineCurrentStage(message: string): number {
    const lowerMessage = message.toLowerCase();
    
    // Étape 1: Accueil (toujours au début)
    if (this.currentStage === 1) return 2;
    
    // Étape 2-6: Questions de qualification
    if (!this.clientInfo.metier && (lowerMessage.includes('je suis') || lowerMessage.includes('je fais'))) return 3;
    if (!this.clientInfo.zone && (lowerMessage.includes('km') || lowerMessage.includes('zone'))) return 4;
    if (lowerMessage.includes('site') && (lowerMessage.includes('oui') || lowerMessage.includes('non'))) return 5;
    if (lowerMessage.includes('objectif') || lowerMessage.includes('but')) return 6;
    
    // Étapes 7-10: Problématique et qualification
    if (lowerMessage.includes('client') || lowerMessage.includes('trouvent')) return 7;
    if (lowerMessage.includes('concurrent') || lowerMessage.includes('problème')) return 8;
    if (lowerMessage.includes('solution') || lowerMessage.includes('intéresse')) return 9;
    if (lowerMessage.includes('budget') || lowerMessage.includes('prix')) return 10;
    
    // Étapes 11-14: Proposition et closing
    if (lowerMessage.includes('option') || lowerMessage.includes('choix')) return 11;
    if (lowerMessage.includes('cher') || lowerMessage.includes('réfléchir')) return 12;
    if (lowerMessage.includes('témoignage') || lowerMessage.includes('exemple')) return 13;
    if (lowerMessage.includes('appel') || lowerMessage.includes('rappel')) return 14;
    
    return Math.min(this.currentStage + 1, 14);
  }

  private async enhancePromptWithLearning(): Promise<void> {
    if (!this.clientInfo.metier) return;
    
    try {
      // Déterminer le type de zone
      let zoneType = 'local';
      if (this.clientInfo.zone) {
        if (this.clientInfo.zone.includes('50') || this.clientInfo.zone.includes('département')) {
          zoneType = 'départemental';
        }
        if (this.clientInfo.zone.includes('national') || this.clientInfo.zone.includes('France')) {
          zoneType = 'national';
        }
      }
      
      // Récupérer les meilleurs patterns
      const patterns = await learningService.getBestPatterns(this.clientInfo.metier, zoneType);
      
      // Récupérer un témoignage pertinent
      const testimonial = await learningService.getRelevantTestimonial(this.clientInfo.metier);
      
      if (patterns.length > 0 || testimonial) {
        console.log('🧠 Amélioration du prompt avec apprentissage automatique');
        // Note: Le prompt système est déjà optimisé, ces données servent pour l'analytics
      }
    } catch (error) {
      console.error('Erreur amélioration prompt:', error);
    }
  }

  private isSuccessfulConversion(response: string): boolean {
    const successKeywords = [
      'parfait !',
      'clique sur le bouton',
      'je te rappelle demain',
      'on va faire quelque chose',
      'super !',
      'génial'
    ];
    
    return successKeywords.some(keyword => 
      response.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Nouvelle méthode pour obtenir les stats de performance
  async getPerformanceStats() {
    return await learningService.getPerformanceStats();
  }

  // Méthode pour forcer la fin d'une conversation
  endConversation(outcome: ConversationData['outcome'] = 'abandoned'): void {
    learningService.endConversation(outcome);
  }

  // Override de clearHistory pour démarrer une nouvelle session
  clearHistory(): void {
    learningService.endConversation('abandoned');
    super.clearHistory();
    this.sessionId = this.generateSessionId();
    this.currentStage = 1;
    this.clientInfo = {};
    learningService.startConversation(this.sessionId);
    console.log('🔄 Nouvelle session démarrée:', this.sessionId);
  }
}
