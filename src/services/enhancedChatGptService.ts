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
    
    // CORRECTION CRITIQUE: Ne plus extraire automatiquement le métier depuis n'importe quel message
    // Seulement extraire si on est dans la phase de qualification du métier
    if (this.clientInfo.conversationStage === 'accueil' && !this.clientInfo.metier) {
      if (lowerMessage.includes('artisan') || lowerMessage.includes('plombier') || lowerMessage.includes('électricien') || lowerMessage.includes('maçon') || lowerMessage.includes('menuisier') || lowerMessage.includes('peintre') || lowerMessage.includes('chauffagiste') || lowerMessage.includes('couvreur')) {
        this.clientInfo.metier = 'Artisan du bâtiment';
      } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('café') || lowerMessage.includes('bar') || lowerMessage.includes('boulangerie') || lowerMessage.includes('pâtisserie')) {
        this.clientInfo.metier = 'Restauration/Alimentation';
      } else if (lowerMessage.includes('coiffeur') || lowerMessage.includes('esthétique') || lowerMessage.includes('massage') || lowerMessage.includes('spa')) {
        this.clientInfo.metier = 'Beauté/Bien-être';
      } else if (lowerMessage.includes('commerce') || lowerMessage.includes('magasin') || lowerMessage.includes('boutique') || lowerMessage.includes('vente')) {
        this.clientInfo.metier = 'Commerce/Retail';
      } else if (message.trim().length > 0 && !lowerMessage.includes('bonjour') && !lowerMessage.includes('informations')) {
        this.clientInfo.metier = message.trim();
      }
    }
    
    // Extraction de la situation SEULEMENT si on est dans cette phase
    if (this.clientInfo.conversationStage === 'qualification_besoin' && !this.clientInfo.situation) {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || lowerMessage.includes('pas encore')) {
        this.clientInfo.situation = 'Aucun site web actuellement';
      } else if (lowerMessage.includes('ancien site') || lowerMessage.includes('obsolète') || lowerMessage.includes('refaire')) {
        this.clientInfo.situation = 'Site existant à moderniser';
      } else if (lowerMessage.includes('améliorer') || lowerMessage.includes('optimiser')) {
        this.clientInfo.situation = 'Site à améliorer';
      }
    }
    
    // Extraction de la zone SEULEMENT si on est dans cette phase
    if (this.clientInfo.conversationStage === 'qualification_zone' && !this.clientInfo.zone) {
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
        this.clientInfo.formulaireEtape = 'nom';
        console.log('📋 Client a choisi le FORMULAIRE - début collecte nom');
      } else if (lowerMessage.includes('appel') || lowerMessage.includes('téléphone') || lowerMessage.includes('rappel')) {
        this.clientInfo.choixContact = 'appel';
        this.clientInfo.conversationStage = 'collecte_infos_rappel';
        console.log('📞 Client a choisi l\'APPEL - début collecte infos');
      }
    }

    // Extraction des informations personnelles SEULEMENT si le client a choisi "formulaire"
    if (this.clientInfo.choixContact === 'formulaire' && this.clientInfo.conversationStage === 'collecte_infos_formulaire') {
      // Nom/prénom
      if (this.clientInfo.formulaireEtape === 'nom' && !this.clientInfo.nom) {
        this.clientInfo.nom = message.trim();
        this.clientInfo.formulaireEtape = 'email';
        console.log('📝 Nom extrait:', this.clientInfo.nom);
      }
      // Email
      else if (this.clientInfo.formulaireEtape === 'email' && !this.clientInfo.email) {
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          this.clientInfo.email = emailMatch[1];
          this.clientInfo.formulaireEtape = 'tel';
          console.log('📝 Email extrait:', this.clientInfo.email);
        }
      }
      // Téléphone
      else if (this.clientInfo.formulaireEtape === 'tel' && !this.clientInfo.telephone) {
        const phoneMatch = message.match(/(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})/);
        if (phoneMatch) {
          this.clientInfo.telephone = phoneMatch[0];
          this.clientInfo.formulaireEtape = 'entreprise';
          console.log('📝 Téléphone extrait:', this.clientInfo.telephone);
        }
      }
      // Entreprise
      else if (this.clientInfo.formulaireEtape === 'entreprise' && !this.clientInfo.entreprise) {
        this.clientInfo.entreprise = message.trim();
        this.clientInfo.formulaireEtape = 'message';
        console.log('📝 Entreprise extraite:', this.clientInfo.entreprise);
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
      
      // Construire le prompt système avec les bonnes instructions
      const systemPrompt = this.buildSystemPrompt();
      
      // Envoyer le message avec le prompt système approprié
      const response = await super.sendMessage(userMessage, systemPrompt);
      console.log('🎯 Réponse IA reçue STABLE:', response);
      
      // Remplir le formulaire SEULEMENT si le client a choisi "formulaire"
      if (this.clientInfo.choixContact === 'formulaire') {
        this.fillFormProgressively();
      }
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT STABLE:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  private buildSystemPrompt(): string {
    const basePrompt = `Tu es Nova, conseillère IA d'Aerodrone Multiservices, spécialiste en création de sites web et référencement local.

RÈGLES IMPORTANTES:
- Quand tu proposes un contact, tu dis "voulez-vous qu'ON VOUS RAPPELLE ou préférez-vous remplir un formulaire ?"
- JAMAIS "m'appeler" ou "appeler l'IA" - c'est VOUS qui rappelez le CLIENT
- Tu collectes: secteur → situation actuelle → zone géographique → proposition → choix contact
- Si formulaire choisi: nom → email → téléphone → entreprise → confirmation envoi

Informations actuelles du client:
- Métier: ${this.clientInfo.metier || 'Non spécifié'}
- Situation: ${this.clientInfo.situation || 'Non spécifiée'}
- Zone: ${this.clientInfo.zone || 'Non spécifiée'}
- Étape: ${this.clientInfo.conversationStage || 'accueil'}
- Choix contact: ${this.clientInfo.choixContact || 'Non choisi'}
- Étape formulaire: ${this.clientInfo.formulaireEtape || 'Aucune'}

Services Aerodrone:
- Site vitrine: 590€ (20 villes référencées)
- Site business: 990€ (50 villes référencées)  
- Site e-commerce: 1490€ (référencement national)

Reste naturelle, professionnelle et guide la conversation étape par étape.`;

    return basePrompt;
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

  // CORRECTION CRITIQUE: Remplir le formulaire SEULEMENT si le client a choisi "formulaire" ET étape par étape
  private fillFormProgressively(): void {
    if (!this.fillFormCallback || this.clientInfo.choixContact !== 'formulaire') {
      console.log('❌ Pas de remplissage - client n\'a pas choisi formulaire ou callback manquant');
      return;
    }
    
    const formData: any = {};
    let hasNewData = false;
    
    // Remplir SEULEMENT le champ correspondant à l'étape actuelle
    if (this.clientInfo.formulaireEtape === 'nom' && this.clientInfo.nom) {
      formData.name = this.clientInfo.nom.trim();
      hasNewData = true;
      console.log('📝 Remplissage du NOM:', formData.name);
    }
    
    if (this.clientInfo.formulaireEtape === 'email' && this.clientInfo.email) {
      formData.email = this.clientInfo.email.trim();
      hasNewData = true;
      console.log('📝 Remplissage de l\'EMAIL:', formData.email);
    }
    
    if (this.clientInfo.formulaireEtape === 'tel' && this.clientInfo.telephone) {
      formData.phone = this.clientInfo.telephone.trim();
      hasNewData = true;
      console.log('📝 Remplissage du TÉLÉPHONE:', formData.phone);
    }
    
    if (this.clientInfo.formulaireEtape === 'entreprise' && this.clientInfo.metier) {
      formData.business = this.clientInfo.metier.trim();
      hasNewData = true;
      console.log('📝 Remplissage de l\'ENTREPRISE:', formData.business);
    }
    
    if (this.clientInfo.formulaireEtape === 'message' && this.clientInfo.metier) {
      let message = `Secteur d'activité: ${this.clientInfo.metier || 'Non spécifié'}\n`;
      message += `Zone d'intervention: ${this.clientInfo.zone || 'Non spécifiée'}\n`;
      message += `Situation actuelle: ${this.clientInfo.situation || 'Non spécifiée'}\n`;
      message += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
      formData.message = message;
      hasNewData = true;
      console.log('📝 Remplissage du MESSAGE:', formData.message);
    }
    
    // Remplir le formulaire SEULEMENT si on a de nouvelles données ET que le client a choisi "formulaire"
    if (hasNewData && this.clientInfo.choixContact === 'formulaire') {
      console.log('📝 REMPLISSAGE FORMULAIRE STABLE (étape par étape):', formData);
      this.fillFormCallback(formData);
    } else {
      console.log('❌ Pas de remplissage formulaire - conditions non remplies ou pas de nouvelles données');
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
