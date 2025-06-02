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
    this.clientInfo.conversationStage = 'accueil';
    return "Bonjour ! Je suis Nova, votre conseillère IA d'Aerodrone Multiservices. Je vais vous poser quelques questions rapides pour vous conseiller au mieux. Quel est votre secteur d'activité ?";
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extraction du métier/secteur
    if (!this.clientInfo.metier && (lowerMessage.includes('artisan') || lowerMessage.includes('plombier') || lowerMessage.includes('électricien') || lowerMessage.includes('maçon') || lowerMessage.includes('menuisier') || lowerMessage.includes('peintre') || lowerMessage.includes('chauffagiste') || lowerMessage.includes('couvreur'))) {
      this.clientInfo.metier = 'Artisan du bâtiment';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('restaurant') || lowerMessage.includes('café') || lowerMessage.includes('bar') || lowerMessage.includes('boulangerie') || lowerMessage.includes('pâtisserie'))) {
      this.clientInfo.metier = 'Restauration/Alimentation';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('coiffeur') || lowerMessage.includes('esthétique') || lowerMessage.includes('massage') || lowerMessage.includes('spa'))) {
      this.clientInfo.metier = 'Beauté/Bien-être';
    } else if (!this.clientInfo.metier && (lowerMessage.includes('commerce') || lowerMessage.includes('magasin') || lowerMessage.includes('boutique') || lowerMessage.includes('vente'))) {
      this.clientInfo.metier = 'Commerce/Retail';
    } else if (!this.clientInfo.metier) {
      // Extraction générale du métier
      this.clientInfo.metier = message.trim();
    }
    
    // Extraction de la situation
    if (!this.clientInfo.situation) {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || lowerMessage.includes('pas encore')) {
        this.clientInfo.situation = 'Aucun site web actuellement';
      } else if (lowerMessage.includes('ancien site') || lowerMessage.includes('obsolète') || lowerMessage.includes('refaire')) {
        this.clientInfo.situation = 'Site existant à moderniser';
      } else if (lowerMessage.includes('améliorer') || lowerMessage.includes('optimiser')) {
        this.clientInfo.situation = 'Site à améliorer';
      }
    }
    
    // Extraction de la zone
    if (!this.clientInfo.zone) {
      if (lowerMessage.includes('ville') || lowerMessage.includes('local') || lowerMessage.includes('quartier')) {
        this.clientInfo.zone = 'Local (1 ville)';
      } else if (lowerMessage.includes('département') || lowerMessage.includes('région') || lowerMessage.includes('plusieurs villes')) {
        this.clientInfo.zone = 'Départemental/Régional';
      } else if (lowerMessage.includes('national') || lowerMessage.includes('france') || lowerMessage.includes('partout')) {
        this.clientInfo.zone = 'National';
      }
    }
    
    // Extraction nom/prénom
    if (lowerMessage.includes('je suis') || lowerMessage.includes('je m\'appelle') || lowerMessage.includes('mon nom')) {
      const nameMatch = message.match(/(?:je suis|je m'appelle|mon nom est)\s+([A-Za-zÀ-ÿ\s]+)/i);
      if (nameMatch) {
        this.clientInfo.nom = nameMatch[1].trim();
      }
    }
    
    // Extraction email
    const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      this.clientInfo.email = emailMatch[1];
    }
    
    // Extraction téléphone
    const phoneMatch = message.match(/(\+33|0)[1-9](\d{8}|\s\d{2}\s\d{2}\s\d{2}\s\d{2})/);
    if (phoneMatch) {
      this.clientInfo.telephone = phoneMatch[0];
    }
    
    console.log('📋 Infos client extraites:', this.clientInfo);
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      console.log('📝 Message utilisateur reçu:', userMessage);
      
      // Extraire les informations du client progressivement
      this.extractClientInfo(userMessage);
      
      // Déterminer l'étape actuelle de la conversation
      this.updateConversationStage(userMessage);
      
      // Créer un prompt intelligent selon l'étape
      const enhancedPrompt = this.createIntelligentPrompt(userMessage);
      
      // Envoyer le message à ChatGPT
      const response = await super.sendMessage(enhancedPrompt);
      console.log('🎯 Réponse IA reçue:', response);
      
      // Remplir le formulaire SEULEMENT à la fin du processus de vente
      if (this.clientInfo.conversationStage === 'collecte_infos' || this.clientInfo.conversationStage === 'finalisation') {
        await this.fillFormImmediately();
      }
      
      return response;
    } catch (error) {
      console.error('Erreur Enhanced ChatGPT:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ?';
    }
  }

  private updateConversationStage(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Progression intelligente selon les réponses du client
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
      if (lowerMessage.includes('intéresse') || lowerMessage.includes('oui') || lowerMessage.includes('d\'accord')) {
        this.clientInfo.conversationStage = 'proposition_contact';
        console.log('📋 Passage à la proposition de contact');
      }
    }
    else if (this.clientInfo.conversationStage === 'proposition_contact') {
      if (lowerMessage.includes('appel') || lowerMessage.includes('téléphone') || lowerMessage.includes('rappel')) {
        this.clientInfo.conversationStage = 'collecte_infos';
        console.log('📋 Passage à la collecte d\'informations pour rappel');
      } else if (lowerMessage.includes('formulaire') || lowerMessage.includes('écrit') || lowerMessage.includes('email')) {
        this.clientInfo.conversationStage = 'collecte_infos';
        console.log('📋 Passage à la collecte d\'informations pour formulaire');
      }
    }
  }

  private createIntelligentPrompt(userMessage: string): string {
    const catalog = `
CATALOGUE COMPLET (À UTILISER INTELLIGEMMENT):
• Site internet: 300€ (pour débuter)
• Site Local 20 villes: 1000€ (couverture locale)
• Site Local 50 villes: 1500€ (couverture départementale)
• Site national: 3000€ (couverture nationale)
• Site E-commerce: 600€ (vente en ligne locale)
• Site E-commerce National: 3500€ (vente en ligne nationale)
• Nova IA: 2000€ + 100€/mois (assistant intelligent 24h/24)`;

    let basePrompt = `Tu es Nova, conseillère commerciale experte pour Aerodrone Multiservices. 

RÈGLES DE VENTE INTELLIGENTE:
- QUALIFIE D'ABORD avant de proposer
- Ne propose QUE les solutions adaptées au besoin
- Pose UNE question à la fois
- Sois naturelle et consultative, pas robotique

${catalog}`;

    switch (this.clientInfo.conversationStage) {
      case 'accueil':
        basePrompt += `
ÉTAPE 1 - DÉCOUVERTE DU MÉTIER:
- Accueille chaleureusement
- Demande le secteur d'activité
- Montre ton expertise en posant la bonne première question`;
        break;
        
      case 'qualification_besoin':
        basePrompt += `
ÉTAPE 2 - QUALIFICATION DU BESOIN:
Métier détecté: ${this.clientInfo.metier}
- Demande s'il a déjà un site web
- Comprends sa situation actuelle
- Identifie son besoin principal`;
        break;
        
      case 'qualification_zone':
        basePrompt += `
ÉTAPE 3 - QUALIFICATION DE LA ZONE:
Métier: ${this.clientInfo.metier}
Situation: ${this.clientInfo.situation}
- Demande sur quelle zone il travaille (ville, département, région, national)
- Comprends son marché géographique
- Cette info déterminera quelle solution proposer`;
        break;
        
      case 'proposition_adaptee':
        basePrompt += `
ÉTAPE 4 - PROPOSITION CIBLÉE:
Métier: ${this.clientInfo.metier}
Situation: ${this.clientInfo.situation}
Zone: ${this.clientInfo.zone}

PROPOSE INTELLIGEMMENT selon la zone:
- Si 1 ville → Site Local 20 villes (1000€)
- Si département/région → Site Local 50 villes (1500€)  
- Si national → Site national (3000€)
- Si vente en ligne → E-commerce (600€ local ou 3500€ national)
- Si veut de l'IA → Nova IA (2000€)

NE propose QUE les 2-3 solutions les plus adaptées à son cas.
Explique pourquoi ces solutions correspondent à ses besoins.`;
        break;

      case 'proposition_contact':
        basePrompt += `
ÉTAPE 5 - PROPOSITION DE CONTACT:
Solution proposée et client intéressé.
MAINTENANT propose 2 options :
1. "Souhaitez-vous qu'on vous rappelle pour en discuter directement ?"
2. "Ou préférez-vous qu'on vous envoie un devis par email ?"

Laisse le client choisir sa préférence de contact.`;
        break;
        
      case 'collecte_infos':
        basePrompt += `
ÉTAPE 6 - COLLECTE D'INFORMATIONS:
Le client a choisi son mode de contact, maintenant collecte les infos :
- Demande nom et prénom
- Puis email
- Puis téléphone
- Une seule info à la fois`;
        break;
        
      default:
        basePrompt += `
Étape: ${this.clientInfo.conversationStage}
Continue la conversation de manière naturelle.`;
    }

    basePrompt += `

Message du client: "${userMessage}"
Infos collectées: Métier=${this.clientInfo.metier}, Situation=${this.clientInfo.situation}, Zone=${this.clientInfo.zone}

Réponds de manière consultative et intelligente.`;

    return basePrompt;
  }

  private async fillFormImmediately(): Promise<void> {
    if (!this.fillFormCallback) return;
    
    // CORRECTION: Ne remplir le formulaire que si on a collecté les infos de contact
    if (this.clientInfo.conversationStage !== 'collecte_infos') {
      console.log('⚠️ Formulaire non rempli - pas encore à l\'étape collecte_infos');
      return;
    }
    
    const formData: any = {};
    let hasData = false;
    
    if (this.clientInfo.nom && this.clientInfo.nom.trim()) {
      formData.name = this.clientInfo.nom.trim();
      hasData = true;
    }
    
    if (this.clientInfo.email && this.clientInfo.email.trim()) {
      formData.email = this.clientInfo.email.trim().toLowerCase();
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
    
    if (hasData) {
      let message = `Secteur d'activité: ${this.clientInfo.metier || 'Non spécifié'}\n`;
      message += `Zone d'intervention: ${this.clientInfo.zone || 'Non spécifiée'}\n`;
      
      if (this.clientInfo.siteDesire && this.clientInfo.tarif) {
        message += `Solution recommandée: ${this.clientInfo.siteDesire} - ${this.clientInfo.tarif}\n`;
      }
      
      message += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
      formData.message = message;
      
      console.log('📝 REMPLISSAGE du formulaire:', formData);
      this.fillFormCallback(formData);
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
    learningService.startConversation(this.sessionId);
    console.log('🔄 Nouvelle session démarrée:', this.sessionId);
  }
}
