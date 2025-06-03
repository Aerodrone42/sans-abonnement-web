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
    
    // Extraire le métier SEULEMENT si on est dans la phase d'accueil
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
    
    // Extraction du choix de contact SEULEMENT après la proposition
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

    // CORRECTION CRITIQUE: Extraction des informations personnelles SEULEMENT si le client a choisi "formulaire"
    if (this.clientInfo.choixContact === 'formulaire' && this.clientInfo.conversationStage === 'collecte_infos_formulaire') {
      // Nom/prénom
      if (this.clientInfo.formulaireEtape === 'nom' && !this.clientInfo.nom) {
        // Nettoyer le message pour extraire seulement le nom
        const cleanMessage = message.trim().replace(/^(je m'appelle|mon nom est|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          this.clientInfo.nom = cleanMessage;
          this.clientInfo.formulaireEtape = 'email';
          console.log('📝 Nom extrait et REMPLISSAGE IMMÉDIAT:', this.clientInfo.nom);
          // REMPLIR IMMÉDIATEMENT le formulaire
          if (this.fillFormCallback) {
            this.fillFormCallback({ name: this.clientInfo.nom });
            console.log('🎯 FORMULAIRE REMPLI avec le nom:', this.clientInfo.nom);
          }
        }
      }
      // Email
      else if (this.clientInfo.formulaireEtape === 'email' && !this.clientInfo.email) {
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          this.clientInfo.email = emailMatch[1];
          this.clientInfo.formulaireEtape = 'tel';
          console.log('📝 Email extrait et REMPLISSAGE IMMÉDIAT:', this.clientInfo.email);
          // REMPLIR IMMÉDIATEMENT le formulaire
          if (this.fillFormCallback) {
            this.fillFormCallback({ email: this.clientInfo.email });
            console.log('🎯 FORMULAIRE REMPLI avec l\'email:', this.clientInfo.email);
          }
        }
      }
      // Téléphone
      else if (this.clientInfo.formulaireEtape === 'tel' && !this.clientInfo.telephone) {
        // Pattern plus flexible pour les numéros français
        const phoneMatch = message.match(/(\+33|0)[1-9][\d\s.-]{8,}/);
        if (phoneMatch) {
          this.clientInfo.telephone = phoneMatch[0].replace(/[\s.-]/g, '');
          this.clientInfo.formulaireEtape = 'entreprise';
          console.log('📝 Téléphone extrait et REMPLISSAGE IMMÉDIAT:', this.clientInfo.telephone);
          // REMPLIR IMMÉDIATEMENT le formulaire
          if (this.fillFormCallback) {
            this.fillFormCallback({ phone: this.clientInfo.telephone });
            console.log('🎯 FORMULAIRE REMPLI avec le téléphone:', this.clientInfo.telephone);
          }
        }
      }
      // Entreprise
      else if (this.clientInfo.formulaireEtape === 'entreprise' && !this.clientInfo.entreprise) {
        const cleanMessage = message.trim().replace(/^(ma société|mon entreprise|la société|l'entreprise|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          this.clientInfo.entreprise = cleanMessage;
          this.clientInfo.formulaireEtape = 'message';
          console.log('📝 Entreprise extraite et REMPLISSAGE IMMÉDIAT:', this.clientInfo.entreprise);
          // REMPLIR IMMÉDIATEMENT le formulaire
          if (this.fillFormCallback) {
            this.fillFormCallback({ business: this.clientInfo.entreprise });
            console.log('🎯 FORMULAIRE REMPLI avec l\'entreprise:', this.clientInfo.entreprise);
          }
        }
      }
      // Message final
      else if (this.clientInfo.formulaireEtape === 'message' && this.clientInfo.nom && this.clientInfo.email) {
        // Construire le message final avec toutes les infos collectées
        let finalMessage = `Secteur d'activité: ${this.clientInfo.metier || 'Non spécifié'}\n`;
        finalMessage += `Zone d'intervention: ${this.clientInfo.zone || 'Non spécifiée'}\n`;
        finalMessage += `Situation actuelle: ${this.clientInfo.situation || 'Non spécifiée'}\n`;
        finalMessage += `Message du client: ${message.trim()}\n`;
        finalMessage += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
        
        this.clientInfo.message = finalMessage;
        this.clientInfo.formulaireEtape = 'fini';
        console.log('📝 Message final construit et REMPLISSAGE IMMÉDIAT');
        // REMPLIR IMMÉDIATEMENT le formulaire avec le message final
        if (this.fillFormCallback) {
          this.fillFormCallback({ message: finalMessage });
          console.log('🎯 FORMULAIRE REMPLI avec le message final');
        }
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
      
      // Appeler la méthode parent
      const response = await super.sendMessage(userMessage);
      console.log('🎯 Réponse IA reçue STABLE:', response);
      
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
    
    if (this.clientInfo.conversationStage === 'accueil' && this.clientInfo.metier) {
      this.clientInfo.conversationStage = 'qualification_besoin';
      console.log('📋 Passage à la qualification du besoin');
    }
    else if (this.clientInfo.conversationStage === 'qualification_besoin') {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || lowerMessage.includes('pas encore')) {
        this.clientInfo.situation = 'Aucun site web actuellement';
        this.clientInfo.conversationStage = 'qualification_zone';
        console.log('📋 Passage à la qualification de zone');
      } else if (lowerMessage.includes('ancien site') || lowerMessage.includes('obsolète') || lowerMessage.includes('refaire')) {
        this.clientInfo.situation = 'Site existant à moderniser';
        this.clientInfo.conversationStage = 'qualification_zone';
        console.log('📋 Passage à la qualification de zone');
      }
    }
    else if (this.clientInfo.conversationStage === 'qualification_zone') {
      if (lowerMessage.includes('ville') || lowerMessage.includes('local') || lowerMessage.includes('quartier')) {
        this.clientInfo.zone = 'Local (20 villes recommandées)';
        this.clientInfo.conversationStage = 'proposition_adaptee';
        console.log('📋 Passage à la proposition adaptée');
      } else if (lowerMessage.includes('département') || lowerMessage.includes('région') || lowerMessage.includes('plusieurs villes')) {
        this.clientInfo.zone = 'Départemental/Régional (50 villes)';
        this.clientInfo.conversationStage = 'proposition_adaptee';
        console.log('📋 Passage à la proposition adaptée');
      }
    }
    else if (this.clientInfo.conversationStage === 'proposition_adaptee') {
      if (lowerMessage.includes('intéresse') || lowerMessage.includes('oui') || lowerMessage.includes('d\'accord') || lowerMessage.includes('ok')) {
        this.clientInfo.conversationStage = 'proposition_contact';
        console.log('📋 Passage à la proposition de contact');
      }
    }
  }

  private fillFormProgressively(): void {
    // Cette méthode est maintenant remplacée par le remplissage immédiat dans extractClientInfo
    console.log('📝 fillFormProgressively appelé mais remplissage immédiat déjà fait');
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
