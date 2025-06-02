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
        this.clientInfo.conversationStage = 'collecte_infos';
        console.log('📋 Passage à la collecte d\'informations');
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
        
      case 'collecte_infos':
        basePrompt += `
ÉTAPE 5 - COLLECTE D'INFORMATIONS:
Solution choisie, maintenant collecte les infos pour le devis:
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

  private extractClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Détection du métier
    if (!this.clientInfo.metier) {
      const metiers = [
        'plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 
        'carreleur', 'couvreur', 'charpentier', 'serrurier', 'vitrier', 'fumiste',
        'terrassier', 'façadier', 'étancheur', 'solier', 'platrier'
      ];
      
      const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
      if (foundMetier) {
        this.clientInfo.metier = foundMetier;
        console.log('🔨 Métier détecté:', foundMetier);
      }
    }
    
    // Détection de la situation (a un site ou pas)
    if (!this.clientInfo.situation) {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || 
          lowerMessage.includes('non') && lowerMessage.includes('site')) {
        this.clientInfo.situation = 'Aucun site web';
        console.log('🌐 Situation: Pas de site');
      } else if (lowerMessage.includes('j\'ai un site') || lowerMessage.includes('site existe') ||
                 lowerMessage.includes('oui') && lowerMessage.includes('site')) {
        this.clientInfo.situation = 'Site existant';
        console.log('🌐 Situation: Site existant');
      }
    }
    
    // Détection de la zone d'intervention
    if (!this.clientInfo.zone) {
      if (lowerMessage.includes('national') || lowerMessage.includes('toute la france')) {
        this.clientInfo.zone = 'National';
      } else if (lowerMessage.includes('département') || lowerMessage.includes('région')) {
        this.clientInfo.zone = 'Départemental';
      } else if (lowerMessage.includes('ville') || lowerMessage.includes('local')) {
        this.clientInfo.zone = 'Local';
      } else {
        // Extraction des km
        const kmMatch = message.match(/(\d+)\s*km/);
        if (kmMatch) {
          const km = parseInt(kmMatch[1]);
          if (km <= 30) this.clientInfo.zone = 'Local';
          else if (km <= 100) this.clientInfo.zone = 'Départemental';
          else this.clientInfo.zone = 'Régional';
        }
      }
      
      if (this.clientInfo.zone) {
        console.log('🗺️ Zone détectée:', this.clientInfo.zone);
      }
    }
    
    // Extraction des infos personnelles (seulement à la fin)
    if (this.clientInfo.conversationStage === 'collecte_infos') {
      this.extractContactInfo(message);
    }
  }

  private extractContactInfo(message: string): void {
    // Extraction du nom
    if (!this.clientInfo.nom) {
      this.extractName(message);
    }
    
    // Extraction de l'email
    if (!this.clientInfo.email) {
      this.extractAndValidateEmail(message);
    }
    
    // Extraction du téléphone
    if (!this.clientInfo.telephone) {
      this.extractPhone(message);
    }
  }

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
        if (fullName.length >= 4) {
          this.clientInfo.nom = fullName;
          console.log('👤 Nom détecté:', this.clientInfo.nom);
          return true;
        }
      }
    }
    return false;
  }

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
    return false;
  }

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

  private async fillFormImmediately(): Promise<void> {
    if (!this.fillFormCallback) return;
    
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
