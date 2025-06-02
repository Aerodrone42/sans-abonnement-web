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
      
      // Extraire les informations détaillées du client
      this.extractDetailedClientInfo(userMessage);
      
      // Détecter l'étape du questionnaire formulaire
      this.handleFormQuestionnaireFlow(userMessage);
      
      // Déterminer l'étape actuelle
      this.currentStage = this.determineCurrentStage(userMessage);
      
      // Enregistrer le message utilisateur
      learningService.addMessage('user', userMessage, this.currentStage);
      
      // Récupérer des patterns ou témoignages pertinents si on en a
      await this.enhancePromptWithLearning();
      
      // Créer un prompt focalisé avec le catalogue officiel
      const enhancedPrompt = this.createDetailedPrompt(userMessage);
      
      // Envoyer le message amélioré à ChatGPT
      const response = await super.sendMessage(enhancedPrompt);
      console.log('🎯 Réponse IA reçue:', response);
      
      // Enregistrer la réponse de l'IA
      learningService.addMessage('assistant', response, this.currentStage);
      
      // Mettre à jour les infos client si nouvelles données
      if (Object.keys(this.clientInfo).length > 0) {
        learningService.updateClientInfo(this.clientInfo);
      }
      
      // REMPLIR IMMÉDIATEMENT le formulaire avec TOUTES les données disponibles
      await this.fillFormImmediately();
      
      // Vérifier si le formulaire est complet et demander confirmation d'envoi
      await this.checkAndRequestSendConfirmation();
      
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

  // NOUVELLE MÉTHODE: Extraction détaillée des informations client
  private extractDetailedClientInfo(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extraction du métier
    const metiers = [
      'plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 
      'carreleur', 'couvreur', 'charpentier', 'serrurier', 'vitrier', 'fumiste',
      'terrassier', 'façadier', 'étancheur', 'solier', 'platrier'
    ];
    
    const foundMetier = metiers.find(metier => lowerMessage.includes(metier));
    if (foundMetier && !this.clientInfo.metier) {
      this.clientInfo.metier = foundMetier;
      this.clientInfo.entreprise = foundMetier;
      console.log('🔨 Métier détecté:', foundMetier);
    }
    
    // Extraction du type de site souhaité
    if (lowerMessage.includes('site vitrine') || lowerMessage.includes('site internet')) {
      this.clientInfo.siteDesire = 'Site internet';
      this.clientInfo.tarif = '300€';
    } else if (lowerMessage.includes('site local 20') || lowerMessage.includes('20 villes')) {
      this.clientInfo.siteDesire = 'Site Local 20 villes';
      this.clientInfo.tarif = '1000€';
    } else if (lowerMessage.includes('site local 50') || lowerMessage.includes('50 villes')) {
      this.clientInfo.siteDesire = 'Site Local 50 villes';
      this.clientInfo.tarif = '1500€';
    } else if (lowerMessage.includes('site national')) {
      this.clientInfo.siteDesire = 'Site national';
      this.clientInfo.tarif = '3000€';
    } else if (lowerMessage.includes('e-commerce national')) {
      this.clientInfo.siteDesire = 'Site E-commerce National';
      this.clientInfo.tarif = '3500€';
    } else if (lowerMessage.includes('e-commerce') || lowerMessage.includes('boutique')) {
      this.clientInfo.siteDesire = 'Site E-commerce';
      this.clientInfo.tarif = '600€';
    } else if (lowerMessage.includes('nova') || lowerMessage.includes('intelligence artificielle')) {
      this.clientInfo.siteDesire = 'Nova IA';
      this.clientInfo.tarif = '2000€ + 100€/mois';
    }
    
    // Extraction de la préférence de contact
    if (lowerMessage.includes('appeler') || lowerMessage.includes('rappel') || lowerMessage.includes('téléphone')) {
      this.clientInfo.preferenceContact = 'Appel téléphonique';
    } else if (lowerMessage.includes('formulaire') || lowerMessage.includes('message') || lowerMessage.includes('email')) {
      this.clientInfo.preferenceContact = 'Message/Email';
    }
    
    // Extraction des horaires de rappel
    if (lowerMessage.includes('matin')) {
      this.clientInfo.horaireRappel = 'matin (8h-12h)';
    } else if (lowerMessage.includes('après-midi')) {
      this.clientInfo.horaireRappel = 'après-midi (14h-18h)';
    } else if (lowerMessage.includes('soir') || lowerMessage.includes('fin de journée')) {
      this.clientInfo.horaireRappel = 'soir (18h-20h)';
    }
    
    console.log('📊 Infos client détaillées extraites:', this.clientInfo);
  }

  // NOUVELLE MÉTHODE: Prompt détaillé avec catalogue complet
  private createDetailedPrompt(userMessage: string): string {
    const catalog = `
CATALOGUE OFFICIEL AERODRONE MULTISERVICES:

📱 SITES WEB:
• Site internet: 300€ (option: 5000 affichages + référencement express 24h sur 10 villes pour 200€)
• Site Local 20 villes: 1000€ (+ 15000 affichages inclus + référencement express 24h Google)
• Site Local 50 villes: 1500€ (+ 15000 affichages inclus + référencement express 24h Google)
• Site national: 3000€ (+ 15000 affichages inclus + référencement express 24h Google)
• Site E-commerce: 600€ (+ 15000 affichages inclus + référencement express 24h Google)
• Site E-commerce National: 3500€ (+ 15000 affichages inclus + référencement express 24h Google)
• Nova IA (avec intelligence artificielle): 2000€ + 100€/mois (+ 15000 affichages inclus + référencement express 24h Google)

📈 MARKETING/VISIBILITÉ:
• Abonnement premium: 100€
• 5000 affichages: 100€
• 10000 affichages: 300€
• 15000 affichages: 350€
• 20000 affichages: 400€
• 30000 affichages: 500€
• 100000 affichages: 1000€

AVANTAGES: Tous les sites bénéficient de 15000 affichages au lancement + référencement express en 24h sur Google (sauf site vitrine 300€).`;

    const basePrompt = `Tu es Nova, conseillère commerciale pour Aerodrone Multiservices. 

RÈGLES STRICTES:
- Utilise UNIQUEMENT les prix et prestations du catalogue ci-dessus
- NE JAMAIS inventer de chiffres ou prestations
- Pose des questions courtes et précises
- Collecte: nom, email, téléphone, métier, type de site souhaité, préférence de contact
- NE DEMANDE JAMAIS si c'est le décideur (inutile)
- Remplis le formulaire au fur et à mesure des réponses

${catalog}

TON OBJECTIF:
1. Identifier le métier du client
2. Comprendre ses besoins (quel type de site)
3. Proposer la solution adaptée du catalogue
4. Demander sa préférence de contact (appel vs formulaire)
5. Si appel: demander horaire préféré
6. Remplir le formulaire avec TOUTES les informations

Message du client: "${userMessage}"

Réponds naturellement et remplis le formulaire immédiatement avec les infos disponibles.`;

    return basePrompt;
  }

  // NOUVELLE MÉTHODE: Remplissage immédiat du formulaire
  private async fillFormImmediately(): Promise<void> {
    if (!this.fillFormCallback) return;
    
    const formData: any = {};
    let hasData = false;
    
    // Remplir le nom
    if (this.clientInfo.nom && this.clientInfo.nom.trim()) {
      formData.name = this.clientInfo.nom.trim();
      hasData = true;
      console.log('👤 Remplissage immédiat nom:', formData.name);
    }
    
    // Remplir l'email
    if (this.clientInfo.email && this.clientInfo.email.trim()) {
      formData.email = this.clientInfo.email.trim().toLowerCase();
      hasData = true;
      console.log('📧 Remplissage immédiat email:', formData.email);
    }
    
    // Remplir le téléphone
    if (this.clientInfo.telephone && this.clientInfo.telephone.trim()) {
      formData.phone = this.clientInfo.telephone.trim();
      hasData = true;
      console.log('📞 Remplissage immédiat téléphone:', formData.phone);
    }
    
    // Remplir l'entreprise/métier
    if (this.clientInfo.metier || this.clientInfo.entreprise) {
      const business = (this.clientInfo.metier || this.clientInfo.entreprise || '').trim();
      if (business) {
        formData.business = business;
        hasData = true;
        console.log('🏢 Remplissage immédiat entreprise:', formData.business);
      }
    }
    
    // Créer un message COMPLET avec tous les détails
    if (hasData || this.clientInfo.siteDesire || this.clientInfo.preferenceContact) {
      let message = '';
      
      // Informations de base
      if (this.clientInfo.metier) {
        message += `Secteur d'activité: ${this.clientInfo.metier}\n`;
      }
      
      // Type de site souhaité et tarif
      if (this.clientInfo.siteDesire && this.clientInfo.tarif) {
        message += `Site souhaité: ${this.clientInfo.siteDesire} - ${this.clientInfo.tarif}\n`;
      }
      
      // Préférence de contact
      if (this.clientInfo.preferenceContact) {
        message += `Préférence de contact: ${this.clientInfo.preferenceContact}\n`;
      }
      
      // Horaire de rappel
      if (this.clientInfo.horaireRappel) {
        message += `Horaire de rappel souhaité: ${this.clientInfo.horaireRappel}\n`;
      }
      
      // Demande spécifique du client
      if (this.clientInfo.message && !this.clientInfo.message.toLowerCase().includes('décideur')) {
        message += `\nDemande spécifique: ${this.clientInfo.message}\n`;
      }
      
      message += '\n[Demande générée par l\'assistant IA Nova - Aerodrone Multiservices]';
      
      formData.message = message;
      console.log('💬 Message complet créé:', message);
    }
    
    if (hasData || formData.message) {
      console.log('📝 REMPLISSAGE IMMÉDIAT du formulaire:', formData);
      this.fillFormCallback(formData);
    }
  }

  // NOUVELLE MÉTHODE: Vérification et demande de confirmation d'envoi
  private async checkAndRequestSendConfirmation(): Promise<void> {
    // Vérifier si le formulaire est suffisamment rempli
    const hasEssentialData = this.clientInfo.nom && this.clientInfo.email && 
                           (this.clientInfo.metier || this.clientInfo.entreprise);
    
    if (hasEssentialData && this.clientInfo.formulaireEtape === 'fini') {
      console.log('📋 Formulaire complet détecté - demande de confirmation d\'envoi');
      
      // Marquer qu'on attend une confirmation
      this.clientInfo.formulaireEtape = 'attente_confirmation';
      console.log('✋ En attente de confirmation client pour envoi');
    }
  }

  private handleFormQuestionnaireFlow(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Gérer la confirmation d'envoi
    if (this.clientInfo.formulaireEtape === 'attente_confirmation') {
      if (lowerMessage.includes('oui') || lowerMessage.includes('envoyez') || 
          lowerMessage.includes('envoyer') || lowerMessage.includes('d\'accord') ||
          lowerMessage.includes('ok') || lowerMessage.includes('allez-y')) {
        console.log('✅ Confirmation d\'envoi reçue du client');
        this.triggerFormSubmission();
        return;
      } else if (lowerMessage.includes('non') || lowerMessage.includes('pas encore') ||
                 lowerMessage.includes('attendre')) {
        console.log('❌ Client refuse l\'envoi pour le moment');
        this.clientInfo.formulaireEtape = 'en_attente';
        return;
      }
    }
    
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
            this.clientInfo.formulaireEtape = 'fini';
            console.log('📝 Formulaire terminé - prêt pour envoi');
          }
          break;
      }
    }
  }

  // NOUVELLE MÉTHODE : Déclencher l'envoi du formulaire après confirmation
  private async triggerFormSubmission(): Promise<void> {
    console.log('🚀 Déclenchement de l\'envoi automatique du formulaire');
    if (this.submitFormCallback) {
      try {
        await this.submitFormCallback();
        this.clientInfo.formulaireEtape = 'envoyé';
        console.log('✅ Formulaire envoyé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi automatique:', error);
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

  // MÉTHODE MISE À JOUR: Extraction du métier sans question décideur
  private extractProfession(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Liste étendue des métiers du bâtiment
    const metiers = [
      'plombier', 'électricien', 'maçon', 'peintre', 'chauffagiste', 'menuisier', 
      'carreleur', 'couvreur', 'charpentier', 'serrurier', 'vitrier', 'fumiste',
      'terrassier', 'façadier', 'étancheur', 'solier', 'platrier', 'cloisons',
      'isolation', 'parquet', 'carrelage', 'plomberie', 'électricité', 'chauffage',
      'climatisation', 'ventilation', 'toiture', 'charpente', 'bardage', 'architecte',
      'bureau d\'études', 'promotion immobilière', 'agence immobilière'
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
    if (cleanText.length > 2 && !lowerMessage.includes('oui') && !lowerMessage.includes('non')) {
      this.clientInfo.entreprise = cleanText;
      console.log('🏢 Entreprise détectée:', cleanText);
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
