
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
      content: `Tu es un conseiller commercial expert spécialisé dans le développement web et l'IA. Ton rôle est d'aider les clients à trouver la formule la plus adaptée à leurs besoins parmi nos services.

NOS FORMULES DISPONIBLES :

🚀 FORMULE STARTER (2 000€ - 5 000€)
- Site vitrine moderne et responsive
- 3-5 pages optimisées SEO
- Formulaire de contact
- Intégration réseaux sociaux
- Hébergement 1 an inclus
- Idéal pour : artisans, petites entreprises, professions libérales

💼 FORMULE BUSINESS (5 000€ - 15 000€)
- Site web dynamique avec CMS
- E-commerce ou plateforme métier
- Système de réservation/commande
- Tableau de bord administrateur
- Formation utilisateur incluse
- Idéal pour : PME, boutiques en ligne, services B2B

🤖 FORMULE IA PREMIUM (15 000€ - 50 000€)
- Application web avec IA intégrée
- Chatbots intelligents personnalisés
- Automatisation des processus
- Analyse de données avancée
- Interface utilisateur sur-mesure
- Support technique premium
- Idéal pour : grandes entreprises, projets innovants, transformation digitale

ÉTAPES DE CONSEIL :
1. Écoute active du projet client
2. Questions pertinentes sur les besoins, budget, délais
3. Analyse et recommandation de la formule adaptée
4. Explication des bénéfices concrets
5. Proposition de prochaines étapes

Sois chaleureux, professionnel et orienté solutions. Pose des questions précises pour bien cerner les besoins. Réponds toujours en français et sois concis mais complet.`
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
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ? Je suis là pour vous aider à trouver la formule parfaite pour votre projet !';
    }
  }

  clearHistory() {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Garde juste le message système
  }
}
