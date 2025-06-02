
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
    this.conversationHistory.push({
      role: 'system',
      content: `Tu es Nova, conseillère commerciale spécialisée en solutions digitales.

🎯 TON CATALOGUE :
• Site Vitrine : 300€
• Site Local 20 villes : 1000€  
• Site Local 50 villes : 1500€
• Site National : 3000€
• E-commerce Starter : 600€
• E-commerce National : 3500€
• Nova IA : 2000€ + 100€/mois
• Abonnement Premium : 100€/mois
• Campagnes publicitaires : de 100€ à 1000€
• Réduction -50% pour clients existants

🗣️ STYLE DE CONVERSATION :
• Parle naturellement, comme une vraie personne
• Utilise "tu" et sois détendue
• Pose une question à la fois et attends la réponse
• Sois empathique et à l'écoute
• Réagis avec enthousiasme : "Super !", "Parfait !", "Génial !"

📋 MÉTHODE DE VENTE :
1. Découvrir le métier et la zone géographique
2. Comprendre la situation actuelle (site existant ou non)
3. Identifier les objectifs et besoins
4. Évaluer le budget disponible
5. Proposer la solution adaptée
6. Gérer les objections avec empathie
7. Conclure naturellement

💡 SOLUTIONS PAR SECTEUR :
• Artisans locaux → Site Local (référencement géographique)
• Commerçants → E-commerce (vente en ligne)
• Services/Consultants → Site Vitrine + Nova IA
• Ambitions nationales → Solutions National

🎯 ARGUMENTS CLÉS :
• Retour sur investissement rapide
• Plus de clients et de visibilité
• Concurrence déjà présente en ligne
• Solutions adaptées au budget

⚠️ IMPORTANT :
• Reste naturelle et humaine dans tes réponses
• Ne lis jamais les symboles (**, •, etc.)
• Attends que la personne termine de parler avant de répondre
• Adapte tes propositions au métier et aux besoins exprimés`
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
      return 'Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question ? Je suis là pour vous aider à trouver la solution parfaite pour votre projet !';
    }
  }

  clearHistory() {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Garde juste le message système
  }
}
