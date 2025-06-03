
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
  siteDesire?: string;
  tarif?: string;
  preferenceContact?: string;
  conversationStage?: string;
}

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

  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extraction du métier/secteur - ÉVITER LES DOUBLONS
    if (!this.clientInfo.metier && (lowerMessage.includes('artisan') || lowerMessage.includes('plombier') || lowerMessage.includes('électricien') || lowerMessage.includes('maçon') || lowerMessage.includes('menuisier') || lowerMessage.includes('peintre') || lowerMessage.includes('chauffagiste') || lowerMessage.includes('couvreur'))) {
      this.clientInfo.metier = 'Artisan du bâtiment';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('restaurant') || lowerMessage.includes('café') || lowerMessage.includes('bar') || lowerMessage.includes('boulangerie') || lowerMessage.includes('pâtisserie'))) {
      this.clientInfo.metier = 'Restauration/Alimentation';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('coiffeur') || lowerMessage.includes('esthétique') || lowerMessage.includes('massage') || lowerMessage.includes('spa'))) {
      this.clientInfo.metier = 'Beauté/Bien-être';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('commerce') || lowerMessage.includes('magasin') || lowerMessage.includes('boutique') || lowerMessage.includes('vente'))) {
      this.clientInfo.metier = 'Commerce/Retail';
    } else if (!this.clientInfo.metier && message.trim().length > 0 && this.clientInfo.conversationStage === 'accueil') {
      // Extraction générale du métier SEULEMENT si pas déjà défini ET dans la phase d'accueil
      this.clientInfo.metier = message.trim();
    }
    
    // Extraction de la situation - ÉVITER LES DOUBLONS
    if (!this.clientInfo.situation) {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || lowerMessage.includes('pas encore')) {
        this.clientInfo.situation = 'Aucun site web actuellement';
      } else if (lowerMessage.includes('ancien site') || lowerMessage.includes('obsolète') || lowerMessage.includes('refaire')) {
        this.clientInfo.situation = 'Site existant à moderniser';
      } else if (lowerMessage.includes('améliorer') || lowerMessage.includes('optimiser')) {
        this.clientInfo.situation = 'Site à améliorer';
      }
    }
    
    // Extraction de la zone - ÉVITER LES DOUBLONS
    if (!this.clientInfo.zone) {
      if (lowerMessage.includes('ville') || lowerMessage.includes('local') || lowerMessage.includes('quartier')) {
        this.clientInfo.zone = 'Local (20 villes recommandées)';
      } else if (lowerMessage.includes('département') || lowerMessage.includes('région') || lowerMessage.includes('plusieurs villes')) {
        this.clientInfo.zone = 'Départemental/Régional (50 villes)';
      } else if (lowerMessage.includes('national') || lowerMessage.includes('france') || lowerMessage.includes('partout')) {
        this.clientInfo.zone = 'National';
      }
    }

    // Détecter le choix de contact SEULEMENT après la proposition
    if (this.clientInfo.conversationStage === 'proposition_contact') {
      if (lowerMessage.includes('formulaire') || lowerMessage.includes('email') || lowerMessage.includes('écrit') || lowerMessage.includes('devis')) {
        this.clientInfo.choixContact = 'formulaire';
        this.clientInfo.conversationStage = 'collecte_infos_formulaire';
        console.log('📋 Client a choisi le FORMULAIRE - début collecte infos');
      } else if (lowerMessage.includes('appel') || lowerMessage.includes('téléphone') || lowerMessage.includes('rappel')) {
        this.clientInfo.choixContact = 'appel';
        this.clientInfo.conversationStage = 'collecte_infos_rappel';
        console.log('📞 Client a choisi l\'APPEL - début collecte infos');
      }
    }

    // Extraction nom/prénom - SEULEMENT pendant la collecte d'infos
    if ((this.clientInfo.conversationStage === 'collecte_infos_formulaire' || this.clientInfo.conversationStage === 'collecte_infos_rappel') && !this.clientInfo.nom) {
      if (lowerMessage.includes('je suis') || lowerMessage.includes('je m\'appelle') || lowerMessage.includes('mon nom')) {
        const nameMatch = message.match(/(?:je suis|je m'appelle|mon nom est)\s+([A-Za-zÀ-ÿ\s]+)/i);
        if (nameMatch) {
          this.clientInfo.nom = nameMatch[1].trim();
        }
      } else if (this.clientInfo.formulaireEtape === 'nom') {
        // Si on est dans l'étape nom du formulaire, tout le message est le nom
        this.clientInfo.nom = message.trim();
      }
    }
    
    // Extraction email - SEULEMENT pendant la collecte d'infos ET exactement comme donné
    if ((this.clientInfo.conversationStage === 'collecte_infos_formulaire' || this.clientInfo.conversationStage === 'collecte_infos_rappel') && !this.clientInfo.email) {
      const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        this.clientInfo.email = emailMatch[1]; // EXACTEMENT comme donné par le client
      }
    }
    
    // Extraction téléphone - SEULEMENT pendant la collecte d'infos
    if ((this.clientInfo.conversationStage === 'collecte_infos_formulaire' || this.clientInfo.conversationStage === 'collecte_infos_rappel') && !this.clientInfo.telephone) {
      const phoneMatch = message.match(/(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})/);
      if (phoneMatch) {
        this.clientInfo.telephone = phoneMatch[0];
      }
    }
    
    console.log('📋 Infos client extraites STABLE:', this.clientInfo);
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      if (!this.isInitialized) {
        console.log('❌ Service non initialisé pour sendMessage');
        return "Erreur de service, veuillez rafraîchir la page";
      }

      console.log('📝 Message utilisateur reçu STABLE:', userMessage);
      
      // Extraire les informations du client progressivement
      this.extractClientInfo(userMessage);
      
      // Déterminer l'étape actuelle de la conversation
      this.updateConversationStage(userMessage);
      
      // CORRECTION CRITIQUE: Utiliser le sendMessage de base SANS modification
      const response = await super.sendMessage(userMessage);
      console.log('🎯 Réponse IA reçue STABLE:', response);
      
      // CORRECTION CRITIQUE: Remplir le formulaire SEULEMENT si le client a choisi "formulaire"
      if (this.clientInfo.choixContact === 'formulaire') {
        this.fillFormProgressively();
      }
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT STABLE:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  private updateConversationStage(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // CORRECTION: Progression plus intelligente sans répétitions
    if (this.clientInfo.conversationStage === 'accueil' && this.clientInfo.metier) {
      this.clientInfo.conversationStage = 'qualification_besoin';
      console.log('📋 Passage à la qualification du besoin');
    }
    else if (this.clientInfo.conversationStage === 'qualification_besoin' && this.clientInfo.situation) {
      this.clientInfo.conversationStage = 'qualification_zone';
      console.log('📋 Passage à la qualification de zone');
    }
    else if (this.clientInfo.conversationStage === 'qualification_zone' && this.clientInfo.zone) {
      this.clientInfo.conversationStage = 'proposition_adaptee';
      console.log('📋 Passage à la proposition adaptée');
    }
    else if (this.clientInfo.conversationStage === 'proposition_adaptee') {
      if (lowerMessage.includes('intéresse') || lowerMessage.includes('oui') || lowerMessage.includes('d\'accord') || lowerMessage.includes('ok')) {
        this.clientInfo.conversationStage = 'proposition_contact';
        console.log('📋 Passage à la proposition de contact');
      }
    }
    // Les transitions vers collecte_infos sont gérées dans extractClientInfo
  }

  // CORRECTION CRITIQUE: Remplir le formulaire SEULEMENT si le client a choisi "formulaire"
  private fillFormProgressively(): void {
    if (!this.fillFormCallback || this.clientInfo.choixContact !== 'formulaire') {
      console.log('❌ Pas de remplissage - client n\'a pas choisi formulaire ou callback manquant');
      return;
    }
    
    const formData: any = {};
    let hasData = false;
    
    if (this.clientInfo.nom && this.clientInfo.nom.trim()) {
      formData.name = this.clientInfo.nom.trim();
      hasData = true;
    }
    
    if (this.clientInfo.email && this.clientInfo.email.trim()) {
      formData.email = this.clientInfo.email.trim(); // EXACTEMENT comme donné, sans transformation
      hasData = true;
    }
    
    if (this.clientInfo.telephone && this.clientInfo.telephone.trim()) {
      formData.phone = this.clientInfo.telephone.trim();
      hasData = true;
    }
    
    if (this.clientInfo.metier || this.clientInfo.entreprise) {
      const business = (this.clientInfo.metier || this.clientInfo.entreprise || '').trim();
      if (business) {
        formData.business = business;
        hasData = true;
      }
    }
    
    // Remplir le formulaire SEULEMENT si on a des données ET que le client a choisi "formulaire"
    if (hasData && this.clientInfo.choixContact === 'formulaire') {
      let message = `Secteur d'activité: ${this.clientInfo.metier || 'Non spécifié'}\n`;
      message += `Zone d'intervention: ${this.clientInfo.zone || 'Non spécifiée'}\n`;
      message += `Situation actuelle: ${this.clientInfo.situation || 'Non spécifiée'}\n`;
      message += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
      formData.message = message;
      
      console.log('📝 REMPLISSAGE FORMULAIRE STABLE (client a choisi formulaire):', formData);
      this.fillFormCallback(formData);
    } else {
      console.log('❌ Pas de remplissage formulaire - conditions non remplies');
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
    this.isInitialized = true; // MAINTENIR L'ÉTAT INITIALISÉ
    learningService.startConversation(this.sessionId);
    console.log('🔄 Nouvelle session STABLE démarrée:', this.sessionId);
  }
}
