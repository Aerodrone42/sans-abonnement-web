
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

    // CORRECTION CRITIQUE: Extraction et REMPLISSAGE IMMÉDIAT des informations personnelles
    if (updatedInfo.choixContact === 'formulaire' && updatedInfo.conversationStage === 'collecte_infos_formulaire') {
      // Nom/prénom
      if (updatedInfo.formulaireEtape === 'nom' && !updatedInfo.nom) {
        const cleanMessage = message.trim().replace(/^(je m'appelle|mon nom est|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          updatedInfo.nom = cleanMessage;
          updatedInfo.formulaireEtape = 'email';
          console.log('📝 Nom extrait:', updatedInfo.nom);
          // REMPLISSAGE IMMÉDIAT ET FORCÉ
          if (fillFormCallback) {
            console.log('🎯 DÉCLENCHEMENT REMPLISSAGE FORMULAIRE - NOM');
            fillFormCallback({ name: updatedInfo.nom });
          }
        }
      }
      // Email
      else if (updatedInfo.formulaireEtape === 'email' && !updatedInfo.email) {
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          updatedInfo.email = emailMatch[1];
          updatedInfo.formulaireEtape = 'tel';
          console.log('📝 Email extrait:', updatedInfo.email);
          // REMPLISSAGE IMMÉDIAT ET FORCÉ
          if (fillFormCallback) {
            console.log('🎯 DÉCLENCHEMENT REMPLISSAGE FORMULAIRE - EMAIL');
            fillFormCallback({ email: updatedInfo.email });
          }
        }
      }
      // Téléphone
      else if (updatedInfo.formulaireEtape === 'tel' && !updatedInfo.telephone) {
        const phoneMatch = message.match(/(\+33|0)[1-9][\d\s.-]{8,}/);
        if (phoneMatch) {
          updatedInfo.telephone = phoneMatch[0].replace(/[\s.-]/g, '');
          updatedInfo.formulaireEtape = 'entreprise';
          console.log('📝 Téléphone extrait:', updatedInfo.telephone);
          // REMPLISSAGE IMMÉDIAT ET FORCÉ
          if (fillFormCallback) {
            console.log('🎯 DÉCLENCHEMENT REMPLISSAGE FORMULAIRE - TÉLÉPHONE');
            fillFormCallback({ phone: updatedInfo.telephone });
          }
        }
      }
      // Entreprise
      else if (updatedInfo.formulaireEtape === 'entreprise' && !updatedInfo.entreprise) {
        const cleanMessage = message.trim().replace(/^(ma société|mon entreprise|la société|l'entreprise|c'est|oui|non|alors|donc|euh|ben)/gi, '').trim();
        if (cleanMessage.length > 1) {
          updatedInfo.entreprise = cleanMessage;
          updatedInfo.formulaireEtape = 'message';
          console.log('📝 Entreprise extraite:', updatedInfo.entreprise);
          // REMPLISSAGE IMMÉDIAT ET FORCÉ
          if (fillFormCallback) {
            console.log('🎯 DÉCLENCHEMENT REMPLISSAGE FORMULAIRE - ENTREPRISE');
            fillFormCallback({ business: updatedInfo.entreprise });
          }
        }
      }
      // Message final et ENVOI AUTOMATIQUE
      else if (updatedInfo.formulaireEtape === 'message' && updatedInfo.nom && updatedInfo.email) {
        let finalMessage = `Secteur d'activité: ${updatedInfo.metier || 'Non spécifié'}\n`;
        finalMessage += `Zone d'intervention: ${updatedInfo.zone || 'Non spécifiée'}\n`;
        finalMessage += `Situation actuelle: ${updatedInfo.situation || 'Non spécifiée'}\n`;
        finalMessage += `Message du client: ${message.trim()}\n`;
        finalMessage += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
        
        updatedInfo.message = finalMessage;
        updatedInfo.formulaireEtape = 'fini';
        console.log('📝 Message final construit');
        // REMPLISSAGE FINAL ET COMPLET
        if (fillFormCallback) {
          console.log('🎯 DÉCLENCHEMENT REMPLISSAGE FORMULAIRE COMPLET - MESSAGE FINAL');
          fillFormCallback({ 
            message: finalMessage,
            // S'assurer que tous les champs sont remplis
            name: updatedInfo.nom,
            email: updatedInfo.email,
            phone: updatedInfo.telephone || '',
            business: updatedInfo.entreprise || ''
          });
        }
      }
    }

    // NOUVEAU: Détection automatique des informations dans n'importe quel message
    // même si on n'est pas dans le mode formulaire structuré
    if (!updatedInfo.choixContact || updatedInfo.choixContact !== 'formulaire') {
      let shouldFillForm = false;
      let formData: any = {};

      // Extraction automatique du nom si présent
      const namePatterns = [
        /je m'appelle ([a-zA-ZÀ-ÿ\s]+)/gi,
        /mon nom est ([a-zA-ZÀ-ÿ\s]+)/gi,
        /c'est ([a-zA-ZÀ-ÿ\s]+)/gi
      ];
      
      for (const pattern of namePatterns) {
        const nameMatch = message.match(pattern);
        if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 1) {
          formData.name = nameMatch[1].trim();
          shouldFillForm = true;
          console.log('📝 Nom détecté automatiquement:', formData.name);
          break;
        }
      }

      // Extraction automatique de l'email
      const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        formData.email = emailMatch[1];
        shouldFillForm = true;
        console.log('📝 Email détecté automatiquement:', formData.email);
      }

      // Extraction automatique du téléphone
      const phoneMatch = message.match(/(\+33|0)[1-9][\d\s.-]{8,}/);
      if (phoneMatch) {
        formData.phone = phoneMatch[0].replace(/[\s.-]/g, '');
        shouldFillForm = true;
        console.log('📝 Téléphone détecté automatiquement:', formData.phone);
      }

      // Si des informations ont été détectées, remplir le formulaire
      if (shouldFillForm && fillFormCallback) {
        console.log('🎯 REMPLISSAGE AUTOMATIQUE DU FORMULAIRE DÉTECTÉ');
        fillFormCallback(formData);
      }
    }
    
    console.log('📋 Infos client extraites:', updatedInfo);
    return updatedInfo;
  }
}
