
import { ClientInfo } from '../types/clientInfo';

export class ClientInfoExtractor {
  static extractClientInfo(
    message: string, 
    clientInfo: ClientInfo, 
    fillFormCallback: ((data: any) => void) | null
  ): ClientInfo {
    const lowerMessage = message.toLowerCase();
    const updatedInfo = { ...clientInfo };
    
    // Extraire le métier SEULEMENT si on est dans la phase d'accueil
    if (updatedInfo.conversationStage === 'accueil' && !updatedInfo.metier) {
      if (lowerMessage.includes('artisan') || lowerMessage.includes('plombier') || lowerMessage.includes('électricien') || lowerMessage.includes('maçon') || lowerMessage.includes('menuisier') || lowerMessage.includes('peintre') || lowerMessage.includes('chauffagiste') || lowerMessage.includes('couvreur')) {
        updatedInfo.metier = 'Artisan du bâtiment';
      } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('café') || lowerMessage.includes('bar') || lowerMessage.includes('boulangerie') || lowerMessage.includes('pâtisserie')) {
        updatedInfo.metier = 'Restauration/Alimentation';
      } else if (lowerMessage.includes('coiffeur') || lowerMessage.includes('esthétique') || lowerMessage.includes('massage') || lowerMessage.includes('spa')) {
        updatedInfo.metier = 'Beauté/Bien-être';
      } else if (lowerMessage.includes('commerce') || lowerMessage.includes('magasin') || lowerMessage.includes('boutique') || lowerMessage.includes('vente')) {
        updatedInfo.metier = 'Commerce/Retail';
      } else if (message.trim().length > 0 && !lowerMessage.includes('bonjour') && !lowerMessage.includes('informations')) {
        updatedInfo.metier = message.trim();
      }
    }
    
    // Extraction du choix de contact SEULEMENT après la proposition
    if (updatedInfo.conversationStage === 'proposition_contact') {
      if (lowerMessage.includes('formulaire') || lowerMessage.includes('email') || lowerMessage.includes('écrit') || lowerMessage.includes('devis')) {
        updatedInfo.choixContact = 'formulaire';
        updatedInfo.conversationStage = 'collecte_infos_formulaire';
        updatedInfo.formulaireEtape = 'nom';
        console.log('📋 Client a choisi le FORMULAIRE - début collecte nom');
      } else if (lowerMessage.includes('appel') || lowerMessage.includes('téléphone') || lowerMessage.includes('rappel')) {
        updatedInfo.choixContact = 'appel';
        updatedInfo.conversationStage = 'collecte_infos_rappel';
        console.log('📞 Client a choisi l\'APPEL - début collecte infos');
      }
    }

    // CORRECTION CRITIQUE: Extraction des informations personnelles SEULEMENT si le client a choisi "formulaire"
    if (updatedInfo.choixContact === 'formulaire' && updatedInfo.conversationStage === 'collecte_infos_formulaire') {
      // Nom/prénom
      if (updatedInfo.formulaireEtape === 'nom' && !updatedInfo.nom) {
        const cleanMessage = message.trim().replace(/^(je m'appelle|mon nom est|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          updatedInfo.nom = cleanMessage;
          updatedInfo.formulaireEtape = 'email';
          console.log('📝 Nom extrait et REMPLISSAGE IMMÉDIAT:', updatedInfo.nom);
          if (fillFormCallback) {
            fillFormCallback({ name: updatedInfo.nom });
            console.log('🎯 FORMULAIRE REMPLI avec le nom:', updatedInfo.nom);
          }
        }
      }
      // Email
      else if (updatedInfo.formulaireEtape === 'email' && !updatedInfo.email) {
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          updatedInfo.email = emailMatch[1];
          updatedInfo.formulaireEtape = 'tel';
          console.log('📝 Email extrait et REMPLISSAGE IMMÉDIAT:', updatedInfo.email);
          if (fillFormCallback) {
            fillFormCallback({ email: updatedInfo.email });
            console.log('🎯 FORMULAIRE REMPLI avec l\'email:', updatedInfo.email);
          }
        }
      }
      // Téléphone
      else if (updatedInfo.formulaireEtape === 'tel' && !updatedInfo.telephone) {
        const phoneMatch = message.match(/(\+33|0)[1-9][\d\s.-]{8,}/);
        if (phoneMatch) {
          updatedInfo.telephone = phoneMatch[0].replace(/[\s.-]/g, '');
          updatedInfo.formulaireEtape = 'entreprise';
          console.log('📝 Téléphone extrait et REMPLISSAGE IMMÉDIAT:', updatedInfo.telephone);
          if (fillFormCallback) {
            fillFormCallback({ phone: updatedInfo.telephone });
            console.log('🎯 FORMULAIRE REMPLI avec le téléphone:', updatedInfo.telephone);
          }
        }
      }
      // Entreprise
      else if (updatedInfo.formulaireEtape === 'entreprise' && !updatedInfo.entreprise) {
        const cleanMessage = message.trim().replace(/^(ma société|mon entreprise|la société|l'entreprise|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          updatedInfo.entreprise = cleanMessage;
          updatedInfo.formulaireEtape = 'message';
          console.log('📝 Entreprise extraite et REMPLISSAGE IMMÉDIAT:', updatedInfo.entreprise);
          if (fillFormCallback) {
            fillFormCallback({ business: updatedInfo.entreprise });
            console.log('🎯 FORMULAIRE REMPLI avec l\'entreprise:', updatedInfo.entreprise);
          }
        }
      }
      // Message final
      else if (updatedInfo.formulaireEtape === 'message' && updatedInfo.nom && updatedInfo.email) {
        let finalMessage = `Secteur d'activité: ${updatedInfo.metier || 'Non spécifié'}\n`;
        finalMessage += `Zone d'intervention: ${updatedInfo.zone || 'Non spécifiée'}\n`;
        finalMessage += `Situation actuelle: ${updatedInfo.situation || 'Non spécifiée'}\n`;
        finalMessage += `Message du client: ${message.trim()}\n`;
        finalMessage += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
        
        updatedInfo.message = finalMessage;
        updatedInfo.formulaireEtape = 'fini';
        console.log('📝 Message final construit et REMPLISSAGE IMMÉDIAT');
        if (fillFormCallback) {
          fillFormCallback({ message: finalMessage });
          console.log('🎯 FORMULAIRE REMPLI avec le message final');
        }
      }
    }
    
    console.log('📋 Infos client extraites STABLE:', updatedInfo);
    return updatedInfo;
  }
}
