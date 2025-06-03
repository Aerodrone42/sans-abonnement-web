
import { ClientInfo } from '../types/clientInfo';

export class ConversationStageManager {
  static updateConversationStage(message: string, clientInfo: ClientInfo): ClientInfo {
    const lowerMessage = message.toLowerCase();
    const updatedInfo = { ...clientInfo };
    
    if (updatedInfo.conversationStage === 'accueil' && updatedInfo.metier) {
      updatedInfo.conversationStage = 'qualification_besoin';
      console.log('📋 Passage à la qualification du besoin');
    }
    else if (updatedInfo.conversationStage === 'qualification_besoin') {
      if (lowerMessage.includes('pas de site') || lowerMessage.includes('aucun site') || lowerMessage.includes('pas encore')) {
        updatedInfo.situation = 'Aucun site web actuellement';
        updatedInfo.conversationStage = 'qualification_zone';
        console.log('📋 Passage à la qualification de zone');
      } else if (lowerMessage.includes('ancien site') || lowerMessage.includes('obsolète') || lowerMessage.includes('refaire')) {
        updatedInfo.situation = 'Site existant à moderniser';
        updatedInfo.conversationStage = 'qualification_zone';
        console.log('📋 Passage à la qualification de zone');
      }
    }
    else if (updatedInfo.conversationStage === 'qualification_zone') {
      if (lowerMessage.includes('ville') || lowerMessage.includes('local') || lowerMessage.includes('quartier')) {
        updatedInfo.zone = 'Local (20 villes recommandées)';
        updatedInfo.conversationStage = 'proposition_adaptee';
        console.log('📋 Passage à la proposition adaptée');
      } else if (lowerMessage.includes('département') || lowerMessage.includes('région') || lowerMessage.includes('plusieurs villes')) {
        updatedInfo.zone = 'Départemental/Régional (50 villes)';
        updatedInfo.conversationStage = 'proposition_adaptee';
        console.log('📋 Passage à la proposition adaptée');
      }
    }
    else if (updatedInfo.conversationStage === 'proposition_adaptee') {
      if (lowerMessage.includes('intéresse') || lowerMessage.includes('oui') || lowerMessage.includes('d\'accord') || lowerMessage.includes('ok')) {
        updatedInfo.conversationStage = 'proposition_contact';
        console.log('📋 Passage à la proposition de contact');
      }
    }
    
    return updatedInfo;
  }
}
