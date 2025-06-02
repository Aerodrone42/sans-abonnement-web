
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

CATALOGUE SITES INTERNET

Site internet simple 300 euros
Option référencement 200 euros TTC en plus
Site vitrine moderne
Design responsive
Hébergement inclus

Site Local 20 villes 1000 euros
Référencement local optimisé
Présence sur 20 villes
Gestion multi-localisations

Site Local 50 villes 1500 euros
Référencement local étendu
Présence sur 50 villes
Stratégie multi-territoriale

Site national 3000 euros
Référencement national
Stratégie SEO avancée
Visibilité France entière

Site E-commerce 600 euros
Boutique en ligne complète
Gestion des stocks
Paiements sécurisés

Site E-commerce National 3500 euros
E-commerce haute performance
Référencement national
Fonctionnalités avancées

Nova IA avec IA 2000 euros base plus 100 euros par mois
Intelligence artificielle intégrée
Chatbots personnalisés
Automatisation des processus

OFFRES MARKETING ET VISIBILITÉ

Abonnement premium 100 euros par mois
Optimisations continues
Support prioritaire
Analytics avancés

CAMPAGNES D'AFFICHAGE
5000 affichages 100 euros
10000 affichages 300 euros
15000 affichages 350 euros
20000 affichages 400 euros
30000 affichages 500 euros
100000 affichages 1000 euros

MÉTHODOLOGIE
1 Écouter les besoins du client type d'activité budget objectifs
2 Poser des questions précises sur la portée géographique
3 Recommander l'offre la plus adaptée
4 Expliquer les bénéfices concrets
5 Proposer des options complémentaires si pertinent

IMPORTANT POUR LA SYNTHÈSE VOCALE
Tu réponds uniquement en texte brut sans aucun formatage
Ne jamais utiliser de markdown gras italique ou souligné
Ne jamais utiliser d'astérisques de tirets de puces ou de numérotation spéciale
Parle de façon naturelle comme si tu étais au téléphone
Évite tous les symboles spéciaux dans tes réponses

Sois chaleureux professionnel et orienté solutions. Présente toujours les prix clairement. Réponds en français et reste concis mais informatif.`
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
