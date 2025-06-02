import { ChatGPTService } from './chatGptService';
import { learningService, ConversationData } from './learningService';

interface ClientInfo {
  nom?: string;
  email?: string;
  telephone?: string;
  metier?: string;
  zone?: string;
  budget?: string;
  urgence?: string;
  decideur?: string;
  situation?: string;
  objectif?: string;
  choixContact?: string;
  formulaireEtape?: string;
  entreprise?: string;
  message?: string;
}

export class EnhancedChatGPTService extends ChatGPTService {
  private sessionId: string;
  private currentStage: number = 1;
  private clientInfo: ClientInfo = {};
  private fillFormCallback: ((data: any) => void) | null = null;
  private submitFormCallback: (() => Promise<void>) | null = null;

  constructor(apiKey: string) {
    super(apiKey);
    this.sessionId = this.generateSessionId();
    learningService.startConversation(this.sessionId);
    console.log('🚀 EnhancedChatGPTService initialisé avec session:', this.sessionId);
  }

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
      
      // Détecter l'étape du questionnaire formulaire
      this.handleFormQuestionnaireFlow(userMessage);
      
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
      }
      
      // Sauvegarder automatiquement la conversation toutes les 3 étapes
      if (this.currentStage % 3 === 0) {
        await learningService.saveConversation();
      }
      
      // Gérer le remplissage et envoi automatique du formulaire à la fin
      if (this.shouldFillAndSubmitForm(response)) {
        await this.finalizeFormSubmission();
      }
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  private handleFormQuestionnaireFlow(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Détecter le choix de contact
    if (lowerMessage.includes('formulaire') || lowerMessage.includes('demande') || lowerMessage.includes('contact')) {
      this.clientInfo.choixContact = 'formulaire';
      if (!this.clientInfo.formulaireEtape) {
        this.clientInfo.formulaireEtape = 'nom';
      }
    }
    
    // Gérer les étapes du formulaire selon la réponse utilisateur
    if (this.clientInfo.choixContact === 'formulaire') {
      switch (this.clientInfo.formulaireEtape) {
        case 'nom':
          if (this.extractName(message)) {
            this.clientInfo.formulaireEtape = 'email';
          }
          break;
        case 'email':
          if (this.extractAndValidateEmail(message)) {
            this.clientInfo.formulaireEtape = 'tel';
          }
          break;
        case 'tel':
          if (this.extractPhone(message)) {
            this.clientInfo.formulaireEtape = 'entreprise';
          }
          break;
        case 'entreprise':
          if (this.extractBusiness(message)) {
            this.clientInfo.formulaireEtape = 'message';
          }
          break;
        case 'message':
          if (this.extractMessage(message)) {
            this.clientInfo.formulaireEtape = 'fini';
          }
          break;
      }
    }
  }

  private extractName(message: string): boolean {
    // Patterns pour détecter un nom
    const namePatterns = [
      /^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+(?:\s+[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+)*)/,
      /(?:je\s+(?:m'appelle|suis)\s+)([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+(?:\s+[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+)*)/,
      /(?:mon\s+nom\s+(?:est|c'est)\s+)([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+(?:\s+[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]+)*)/
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        const detectedName = match[1].trim();
        if (detectedName.length > 2 && !this.isBusinessOrCity(detectedName)) {
          this.clientInfo.nom = detectedName;
          console.log('👤 Nom détecté et validé:', this.clientInfo.nom);
          return true;
        }
      }
    }
    return false;
  }

  private extractAndValidateEmail(message: string): boolean {
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = message.match(emailPattern);
    
    if (emailMatch) {
      const email = emailMatch[1].toLowerCase();
      
      // Vérifications basiques de validité
      if (this.isValidEmail(email)) {
        this.clientInfo.email = email;
        console.log('📧 Email détecté et validé:', this.clientInfo.email);
        return true;
      } else {
        console.log('❌ Email invalide détecté:', email);
        return false; // L'IA demandera de corriger
      }
    }
    return false;
  }

  private extractPhone(message: string): boolean {
    const phonePatterns = [
      /(?:0[1-9])(?:[\s.-]?\d{2}){4}/,
      /(?:\+33|0033)[1-9](?:[\s.-]?\d{2}){4}/,
      /(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/
    ];
    
    for (const pattern of phonePatterns) {
      const match = message.match(pattern);
      if (match) {
        this.clientInfo.telephone = match[0];
        console.log('📞 Téléphone détecté:', this.clientInfo.telephone);
        return true;
      }
    }
    return false;
  }

  private extractBusiness(message: string): boolean {
    // Extraire l'entreprise ou secteur d'activité
    const businessText = message.trim();
    if (businessText.length > 2) {
      this.clientInfo.entreprise = businessText;
      console.log('🏢 Entreprise détectée:', this.clientInfo.entreprise);
      return true;
    }
    return false;
  }

  private extractMessage(message: string): boolean {
    const messageText = message.trim();
    if (messageText.length > 5) {
      this.clientInfo.message = messageText;
      console.log('💬 Message détecté:', this.clientInfo.message);
      return true;
    }
    return false;
  }

  private isValidEmail(email: string): boolean {
    // Vérifications basiques
    if (!email.includes('@') || !email.includes('.')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('..')) return false;
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [local, domain] = parts;
    if (local.length === 0 || domain.length === 0) return false;
    if (!domain.includes('.')) return false;
    
    return true;
  }

  private isBusinessOrCity(text: string): boolean {
    const lowerText = text.toLowerCase();
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'bordeaux', 'lille', 'nantes', 'strasbourg'];
    const businesses = ['plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier'];
    
    return cities.some(city => lowerText.includes(city)) || 
           businesses.some(business => lowerText.includes(business));
  }

  private shouldFillAndSubmitForm(response: string): boolean {
    return this.clientInfo.formulaireEtape === 'fini' &&
           this.clientInfo.nom &&
           this.clientInfo.email &&
           response.toLowerCase().includes('je remplis votre demande');
  }

  private async finalizeFormSubmission(): Promise<void> {
    if (!this.fillFormCallback || !this.submitFormCallback) {
      console.log('❌ Callbacks de formulaire manquants');
      return;
    }
    
    const formData: any = {};
    
    // Mapper les infos collectées vers les champs du formulaire
    if (this.clientInfo.nom) formData.name = this.clientInfo.nom;
    if (this.clientInfo.email) formData.email = this.clientInfo.email;
    if (this.clientInfo.telephone) formData.phone = this.clientInfo.telephone;
    if (this.clientInfo.entreprise || this.clientInfo.metier) {
      formData.business = this.clientInfo.entreprise || this.clientInfo.metier;
    }
    
    // Créer un message personnalisé complet
    let message = `Demande générée par l'IA - ${this.clientInfo.metier || 'Professionnel'}`;
    
    if (this.clientInfo.zone) message += ` - Zone: ${this.clientInfo.zone}`;
    if (this.clientInfo.budget) message += ` - Budget: ${this.clientInfo.budget}`;
    if (this.clientInfo.message) message += `\n\nDemande du client: ${this.clientInfo.message}`;
    
    message += `\n\nSession IA: ${this.sessionId}`;
    formData.message = message;
    
    console.log('🤖 Remplissage automatique du formulaire:', formData);
    
    // Remplir le formulaire
    this.fillFormCallback(formData);
    
    // Attendre un peu puis envoyer
    setTimeout(async () => {
      try {
        if (this.submitFormCallback) {
          await this.submitFormCallback();
          console.log('✅ Formulaire envoyé automatiquement avec succès');
          
          // Marquer la conversation comme réussie
          learningService.endConversation('success');
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi automatique:', error);
      }
    }, 1500);
  }

  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Détecter le métier
    const metiers = ['plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 'carreleur', 'couvreur'];
    const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
    if (foundMetier && !this.clientInfo.metier) {
      this.clientInfo.metier = foundMetier;
      console.log('🎯 Métier détecté:', foundMetier);
    }
    
    // Détecter la zone - améliorer la détection
    if (!this.clientInfo.zone) {
      // Détecter les kilomètres
      const kmMatch = message.match(/(\d+)\s*km/);
      if (kmMatch) {
        this.clientInfo.zone = `${kmMatch[1]}km`;
        console.log('🗺️ Zone détectée:', this.clientInfo.zone);
      }
      
      // Détecter les villes - pattern amélioré
      const villeMatch = message.match(/(?:sur|à|de|dans)\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)*)/);
      if (villeMatch) {
        this.clientInfo.zone = villeMatch[1];
        console.log('🏙️ Ville détectée:', this.clientInfo.zone);
      }
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

  private determineCurrentStage(message: string): number {
    const lowerMessage = message.toLowerCase();
    
    // Étapes du questionnaire formulaire (15)
    if (this.clientInfo.choixContact === 'formulaire') {
      return 15;
    }
    
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
    
    return Math.min(this.currentStage + 1, 15);
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
      'je te rappelle',
      'on va faire quelque chose',
      'super !',
      'génial',
      'excellent',
      'formidable'
    ];
    
    return successKeywords.some(keyword => 
      response.toLowerCase().includes(keyword.toLowerCase())
    );
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
    this.clientInfo = {};
    learningService.startConversation(this.sessionId);
    console.log('🔄 Nouvelle session démarrée:', this.sessionId);
  }
}
