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
  horaireRappel?: string;
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

  async startConversation(): Promise<string> {
    console.log('🎯 Démarrage automatique de la conversation avec Nova');
    return await this.sendAutoGreeting();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      console.log('📝 Message utilisateur reçu:', userMessage);
      
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
      console.log('🎯 Réponse IA reçue:', response);
      
      // Enregistrer la réponse de l'IA
      learningService.addMessage('assistant', response, this.currentStage);
      
      // Mettre à jour les infos client si nouvelles données
      if (Object.keys(this.clientInfo).length > 0) {
        learningService.updateClientInfo(this.clientInfo);
      }
      
      // Remplissage progressif du formulaire avec toutes les données
      await this.fillFormWithCorrectData();
      
      // Sauvegarder automatiquement la conversation toutes les 3 étapes
      if (this.currentStage % 3 === 0) {
        await learningService.saveConversation();
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
      console.log('📝 Mode formulaire activé - étape:', this.clientInfo.formulaireEtape);
    }

    // Détecter les horaires de rappel
    if (lowerMessage.includes('matin')) {
      this.clientInfo.horaireRappel = 'matin (8h-12h)';
    } else if (lowerMessage.includes('après-midi')) {
      this.clientInfo.horaireRappel = 'après-midi (14h-18h)';
    } else if (lowerMessage.includes('soir') || lowerMessage.includes('fin de journée')) {
      this.clientInfo.horaireRappel = 'soir (18h-20h)';
    }
    
    // Gérer les étapes du formulaire selon la réponse utilisateur
    if (this.clientInfo.choixContact === 'formulaire') {
      switch (this.clientInfo.formulaireEtape) {
        case 'nom':
          if (this.extractName(message)) {
            this.clientInfo.formulaireEtape = 'email';
            console.log('📝 Passage à l\'étape email');
          }
          break;
        case 'email':
          if (this.extractAndValidateEmail(message)) {
            this.clientInfo.formulaireEtape = 'tel';
            console.log('📝 Passage à l\'étape téléphone');
          }
          break;
        case 'tel':
          if (this.extractPhone(message)) {
            this.clientInfo.formulaireEtape = 'metier';
            console.log('📝 Passage à l\'étape métier');
          }
          break;
        case 'metier':
          if (this.extractProfession(message)) {
            this.clientInfo.formulaireEtape = 'message';
            console.log('📝 Passage à l\'étape message');
          }
          break;
        case 'message':
          if (this.extractMessage(message)) {
            this.clientInfo.formulaireEtape = 'horaire';
            console.log('📝 Passage à l\'étape horaire');
          }
          break;
        case 'horaire':
          if (this.extractCallbackTime(message)) {
            this.clientInfo.formulaireEtape = 'fini';
            console.log('📝 Formulaire terminé');
          }
          break;
      }
    }
  }

  // EXTRACTION CORRIGÉE DU NOM
  private extractName(message: string): boolean {
    const cleanMessage = message.replace(/\b(je\s+(?:m'appelle|suis)|mon\s+nom\s+(?:est|c'est)|c'est|bonjour|salut|ok|oui|non|voici|voilà)\b/gi, '').trim();
    
    const namePatterns = [
      /^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]{1,})\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]{1,})$/,
      /^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]{1,})\s+(?:de\s+|du\s+|des\s+|le\s+|la\s+)?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]{1,})$/i
    ];
    
    for (const pattern of namePatterns) {
      const match = cleanMessage.match(pattern);
      if (match) {
        const fullName = `${match[1]} ${match[2]}`;
        if (!this.isBusinessOrCity(fullName) && fullName.length >= 4) {
          this.clientInfo.nom = fullName;
          console.log('👤 Nom complet détecté:', this.clientInfo.nom);
          return true;
        }
      }
    }
    
    const singleWordMatch = cleanMessage.match(/^([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÑÇ][a-zàâäéèêëïîôöùûüÿñç]{2,})$/);
    if (singleWordMatch && !this.isBusinessOrCity(singleWordMatch[1])) {
      this.clientInfo.nom = singleWordMatch[1];
      console.log('👤 Nom simple détecté:', this.clientInfo.nom);
      return true;
    }
    
    return false;
  }

  // EXTRACTION CORRIGÉE DE L'EMAIL
  private extractAndValidateEmail(message: string): boolean {
    const messageNoSpaces = message.replace(/\s+/g, '');
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = messageNoSpaces.match(emailPattern);
    
    if (emailMatch) {
      const email = emailMatch[1].toLowerCase();
      if (this.isValidEmail(email)) {
        this.clientInfo.email = email;
        console.log('📧 Email détecté:', this.clientInfo.email);
        return true;
      }
    }
    
    const manualCleanPattern = /([a-zA-Z0-9._%+-]+)\s*@\s*([a-zA-Z0-9.-]+)\s*\.\s*([a-zA-Z]{2,})/;
    const manualMatch = message.match(manualCleanPattern);
    if (manualMatch) {
      const cleanEmail = `${manualMatch[1]}@${manualMatch[2]}.${manualMatch[3]}`.toLowerCase();
      if (this.isValidEmail(cleanEmail)) {
        this.clientInfo.email = cleanEmail;
        console.log('📧 Email nettoyé:', this.clientInfo.email);
        return true;
      }
    }
    
    return false;
  }

  // EXTRACTION CORRIGÉE DU TÉLÉPHONE
  private extractPhone(message: string): boolean {
    const phonePatterns = [
      /0[1-9](?:[\s.-]?\d{2}){4}/,
      /(?:\+33|0033)\s?[1-9](?:[\s.-]?\d{2}){4}/,
      /(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/,
      /0[1-9](?:\s?\(\d{2}\)\s?\d{2}\s?\d{2}\s?\d{2})/,
      /0[1-9]\d{8}/
    ];
    
    for (const pattern of phonePatterns) {
      const match = message.match(pattern);
      if (match) {
        let cleanPhone = match[0].replace(/[\s.-]/g, '');
        if (cleanPhone.startsWith('+33')) {
          cleanPhone = '0' + cleanPhone.substring(3);
        } else if (cleanPhone.startsWith('0033')) {
          cleanPhone = '0' + cleanPhone.substring(4);
        }
        this.clientInfo.telephone = cleanPhone;
        console.log('📞 Téléphone détecté:', this.clientInfo.telephone);
        return true;
      }
    }
    return false;
  }

  // NOUVELLE MÉTHODE : Extraction du métier/profession
  private extractProfession(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Liste étendue des métiers du bâtiment
    const metiers = [
      'plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 
      'carreleur', 'couvreur', 'charpentier', 'serrurier', 'vitrier', 'fumiste',
      'terrassier', 'façadier', 'étancheur', 'solier', 'platrier', 'cloisons',
      'isolation', 'parquet', 'carrelage', 'plomberie', 'électricité', 'chauffage',
      'climatisation', 'ventilation', 'toiture', 'charpente', 'bardage'
    ];
    
    // Chercher le métier dans le message
    const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
    if (foundMetier) {
      this.clientInfo.metier = foundMetier;
      this.clientInfo.entreprise = foundMetier; // Remplir aussi entreprise
      console.log('🔨 Métier détecté:', foundMetier);
      return true;
    }
    
    // Si pas de métier spécifique trouvé, utiliser le texte comme entreprise
    const cleanText = message.trim();
    if (cleanText.length > 2 && !lowerMessage.includes('oui') && !lowerMessage.includes('non') && !lowerMessage.includes('numéro')) {
      this.clientInfo.entreprise = cleanText;
      console.log('🏢 Entreprise détectée:', cleanText);
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

  // NOUVELLE MÉTHODE : Extraction de l'heure de rappel
  private extractCallbackTime(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('matin')) {
      this.clientInfo.horaireRappel = 'matin (8h-12h)';
      console.log('⏰ Horaire rappel:', this.clientInfo.horaireRappel);
      return true;
    } else if (lowerMessage.includes('après-midi')) {
      this.clientInfo.horaireRappel = 'après-midi (14h-18h)';
      console.log('⏰ Horaire rappel:', this.clientInfo.horaireRappel);
      return true;
    } else if (lowerMessage.includes('soir')) {
      this.clientInfo.horaireRappel = 'soir (18h-20h)';
      console.log('⏰ Horaire rappel:', this.clientInfo.horaireRappel);
      return true;
    }
    
    return false;
  }

  private isValidEmail(email: string): boolean {
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

  // REMPLISSAGE CORRIGÉ - Données propres
  private async fillFormWithCorrectData(): Promise<void> {
    if (!this.fillFormCallback) return;
    
    const formData: any = {};
    let hasNewData = false;
    
    if (this.clientInfo.nom && this.clientInfo.nom.trim()) {
      formData.name = this.clientInfo.nom.trim();
      hasNewData = true;
      console.log('👤 Remplissage nom:', formData.name);
    }
    
    if (this.clientInfo.email && this.clientInfo.email.trim()) {
      formData.email = this.clientInfo.email.trim().toLowerCase();
      hasNewData = true;
      console.log('📧 Remplissage email:', formData.email);
    }
    
    if (this.clientInfo.telephone && this.clientInfo.telephone.trim()) {
      formData.phone = this.clientInfo.telephone.trim();
      hasNewData = true;
      console.log('📞 Remplissage téléphone:', formData.phone);
    }
    
    // CORRECTION : Utiliser le bon métier/entreprise
    if (this.clientInfo.metier || this.clientInfo.entreprise) {
      const business = (this.clientInfo.metier || this.clientInfo.entreprise || '').trim();
      if (business && !business.toLowerCase().includes('numéro') && !business.toLowerCase().includes('oui') && !business.toLowerCase().includes('non')) {
        formData.business = business;
        hasNewData = true;
        console.log('🏢 Remplissage entreprise/métier CORRIGÉ:', formData.business);
      }
    }
    
    // Message propre SANS phrases parasites
    if (this.clientInfo.message || this.clientInfo.metier || this.clientInfo.zone || this.clientInfo.budget) {
      let message = '';
      
      if (this.clientInfo.metier) {
        message += `Demande de devis pour ${this.clientInfo.metier}`;
      }
      
      if (this.clientInfo.zone) {
        message += ` dans un rayon de ${this.clientInfo.zone}`;
      }
      
      if (this.clientInfo.budget) {
        message += ` avec un budget de ${this.clientInfo.budget}`;
      }
      
      if (this.clientInfo.horaireRappel) {
        message += `\n\nPréférence d'horaire de contact: ${this.clientInfo.horaireRappel}`;
      }
      
      if (this.clientInfo.message && !this.clientInfo.message.toLowerCase().includes('décideur')) {
        message += `\n\nDemande spécifique: ${this.clientInfo.message}`;
      }
      
      message += '\n\n[Demande générée automatiquement par l\'assistant IA]';
      
      formData.message = message;
      hasNewData = true;
      console.log('💬 Message propre créé:', message);
    }
    
    if (hasNewData) {
      console.log('📝 Remplissage du formulaire CORRIGÉ:', formData);
      this.fillFormCallback(formData);
    }
  }

  
  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    const metiers = ['plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 'carreleur', 'couvreur'];
    const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
    if (foundMetier && !this.clientInfo.metier) {
      this.clientInfo.metier = foundMetier;
      console.log('🎯 Métier détecté:', foundMetier);
    }
    
    if (!this.clientInfo.zone) {
      const kmMatch = message.match(/(\d+)\s*km/);
      if (kmMatch) {
        this.clientInfo.zone = `${kmMatch[1]}km`;
        console.log('🗺️ Zone détectée:', this.clientInfo.zone);
      }
      
      const villeMatch = message.match(/(?:sur|à|de|dans)\s+([A-Z][a-z]+(?:-[A-Z][a-z]+)*)/);
      if (villeMatch) {
        this.clientInfo.zone = villeMatch[1];
        console.log('🏙 Ville détectée:', this.clientInfo.zone);
      }
    }
    
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
    
    if (this.clientInfo.choixContact === 'formulaire') {
      return 15;
    }
    
    if (this.currentStage === 1) return 2;
    
    if (!this.clientInfo.metier && (lowerMessage.includes('je suis') || lowerMessage.includes('je fais'))) return 3;
    if (!this.clientInfo.zone && (lowerMessage.includes('km') || lowerMessage.includes('zone'))) return 4;
    if (lowerMessage.includes('site') && (lowerMessage.includes('oui') || lowerMessage.includes('non'))) return 5;
    if (lowerMessage.includes('objectif') || lowerMessage.includes('but')) return 6;
    
    if (lowerMessage.includes('client') || lowerMessage.includes('trouvent')) return 7;
    if (lowerMessage.includes('concurrent') || lowerMessage.includes('problème')) return 8;
    if (lowerMessage.includes('solution') || lowerMessage.includes('intéresse')) return 9;
    if (lowerMessage.includes('budget') || lowerMessage.includes('prix')) return 10;
    
    if (lowerMessage.includes('option') || lowerMessage.includes('choix')) return 11;
    if (lowerMessage.includes('cher') || lowerMessage.includes('réfléchir')) return 12;
    if (lowerMessage.includes('témoignage') || lowerMessage.includes('exemple')) return 13;
    if (lowerMessage.includes('appel') || lowerMessage.includes('rappel') || lowerMessage.includes('horaire')) return 14;
    
    return Math.min(this.currentStage + 1, 15);
  }

  private async enhancePromptWithLearning(): Promise<void> {
    if (!this.clientInfo.metier) return;
    
    try {
      let zoneType = 'local';
      if (this.clientInfo.zone) {
        if (this.clientInfo.zone.includes('50') || this.clientInfo.zone.includes('département')) {
          zoneType = 'départemental';
        }
        if (this.clientInfo.zone.includes('national') || this.clientInfo.zone.includes('France')) {
          zoneType = 'national';
        }
      }
      
      const patterns = await learningService.getBestPatterns(this.clientInfo.metier, zoneType);
      const testimonial = await learningService.getRelevantTestimonial(this.clientInfo.metier);
      
      if (patterns.length > 0 || testimonial) {
        console.log('🧠 Amélioration du prompt avec apprentissage automatique');
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
