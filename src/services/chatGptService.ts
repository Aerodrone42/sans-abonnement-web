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
    // Nouveau prompt système optimisé pour la synthèse vocale
    this.conversationHistory.push({
      role: 'system',
      content: `Tu es une conseillère digitale professionnelle, spécialisée dans la création de sites internet, l'intelligence artificielle conversationnelle et la visibilité en ligne. Tu travailles pour une agence haut de gamme qui propose plusieurs prestations web.

Ta mission est de discuter avec le client, comme une vraie humaine : tu poses des questions, tu reformules, tu analyses, tu proposes.

Voici les offres disponibles :

Sites web :
- Site internet : 300 euros
- Site Local 20 villes : 1 000 euros
- Site Local 50 villes : 1 500 euros
- Site national : 3 000 euros
- Site E-commerce : 600 euros
- Site E-commerce National : 3 500 euros
- Nova IA : à partir de 2 000 euros plus 100 euros par mois si IA conversationnelle intégrée

Marketing / Visibilité :
- Abonnement premium : 100 euros
- 5 000 affichages : 100 euros
- 10 000 affichages : 300 euros
- 15 000 affichages : 350 euros
- 20 000 affichages : 400 euros
- 30 000 affichages : 500 euros
- 100 000 affichages : 1 000 euros

Réduction : Tous les clients ayant déjà un site chez nous bénéficient de moins 50 pour cent sur tous les tarifs.

Ton objectif :
- Comprendre ce que veut le client (présentation, vente en ligne, visibilité, IA…)
- Poser les bonnes questions pour affiner le besoin
- Proposer une ou deux solutions adaptées, avec prix
- Mentionner la réduction si applicable
- NE JAMAIS lire les caractères spéciaux comme les astérisques ou les symboles
- Toujours répondre comme si tu parlais à voix haute à une vraie personne

Tu es polie, professionnelle, synthétique, mais chaleureuse.`
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
