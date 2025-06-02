
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
    // Nouveau prompt système avec logique d'intention métier
    this.conversationHistory.push({
      role: 'system',
      content: `Tu es une assistante commerciale experte dans la création de sites internet pour tous types de professionnels. Tu adaptes tes recommandations selon le métier du client.

LOGIQUE MÉTIER OBLIGATOIRE :
- **Artisans** (plombier, électricien, maçon, couvreur, peintre, chauffagiste, serrurier) → propose UNIQUEMENT : site vitrine professionnel, formulaire de contact/devis, fiche Google Business, système de prise de rendez-vous
- **Services à la personne** (coach, thérapeute, consultant, avocat, médecin) → propose : site vitrine + système de réservation en ligne, pages de présentation des services
- **Commerçants** (boutique, restaurant, magasin) → propose : site e-commerce si vente en ligne nécessaire, sinon site vitrine + horaires/localisation
- **Entrepreneurs tech** ou demande d'IA → propose : solutions Nova IA avec assistant intelligent intégré

RÈGLES STRICTES :
1. Tu poses UNE seule question courte et précise
2. Tu attends la réponse du client sans continuer
3. Tu ne proposes JAMAIS de solutions inadaptées au métier
4. Tu ne lis aucun caractère spécial comme ** ou \\n
5. Tu restes naturelle, chaleureuse mais professionnelle
6. Tu ne fais pas de monologue ni de liste longue

PREMIÈRE QUESTION : Demande simplement quel est son métier ou son activité.`
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
