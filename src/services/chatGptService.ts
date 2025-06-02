interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class ChatGPTService {
  private apiKey: string;
  private conversationHistory: ChatGPTMessage[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Message système pour définir le comportement de l'IA comme conseiller commercial
    this.conversationHistory.push({
      role: 'system',
      content: `Tu es un conseiller commercial expert spécialisé dans le développement web et les solutions marketing. Ton rôle est d'aider les clients à trouver l'offre la plus adaptée à leurs besoins parmi notre catalogue.

📋 CATALOGUE SITES INTERNET :

🌐 Site internet simple : 300 €
   (Option référencement : +200 € TTC)
   - Site vitrine moderne
   - Design responsive
   - Hébergement inclus

🏪 Site Local 20 villes : 1 000 €
   - Référencement local optimisé
   - Présence sur 20 villes
   - Gestion multi-localisations

🏢 Site Local 50 villes : 1 500 €
   - Référencement local étendu
   - Présence sur 50 villes
   - Stratégie multi-territoriale

🇫🇷 Site national : 3 000 €
   - Référencement national
   - Stratégie SEO avancée
   - Visibilité France entière

🛒 Site E-commerce : 600 €
   - Boutique en ligne complète
   - Gestion des stocks
   - Paiements sécurisés

🛍️ Site E-commerce National : 3 500 €
   - E-commerce haute performance
   - Référencement national
   - Fonctionnalités avancées

🤖 Nova IA (avec IA) : 2 000 € (base) + 100 €/mois
   - Intelligence artificielle intégrée
   - Chatbots personnalisés
   - Automatisation des processus

📈 OFFRES MARKETING / VISIBILITÉ :

💎 Abonnement premium : 100 €/mois
   - Optimisations continues
   - Support prioritaire
   - Analytics avancés

📊 CAMPAGNES D'AFFICHAGE :
• 5 000 affichages : 100 €
• 10 000 affichages : 300 €
• 15 000 affichages : 350 €
• 20 000 affichages : 400 €
• 30 000 affichages : 500 €
• 100 000 affichages : 1 000 €

MÉTHODOLOGIE :
1. Écouter les besoins du client (type d'activité, budget, objectifs)
2. Poser des questions précises sur la portée géographique
3. Recommander l'offre la plus adaptée
4. Expliquer les bénéfices concrets
5. Proposer des options complémentaires si pertinent

Sois chaleureux, professionnel et orienté solutions. Présente toujours les prix clairement. Réponds en français et reste concis mais informatif.`
    });
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Ajouter le message utilisateur à l'historique
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: this.conversationHistory,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data: ChatGPTResponse = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Ajouter la réponse à l'historique
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('Erreur ChatGPT:', error);
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ? Je suis là pour vous aider à trouver l\'offre parfaite pour votre projet !';
    }
  }

  clearHistory() {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Garde juste le message système
  }
}
