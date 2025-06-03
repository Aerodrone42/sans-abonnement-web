
import { ClientInfo } from '../types/clientInfo';

export class ClientInfoExtractor {
  static extractClientInfo(
    message: string, 
    clientInfo: ClientInfo, 
    fillFormCallback: ((data: any) => void) | null
  ): ClientInfo {
    console.log('🔍 DÉBUT EXTRACTION - Message:', message);
    console.log('🔍 Callback disponible:', !!fillFormCallback);
    console.log('🔍 ClientInfo actuel:', clientInfo);
    
    const lowerMessage = message.toLowerCase();
    const updatedInfo = { ...clientInfo };
    
    // FORCER L'EXTRACTION à chaque message
    let formDataToFill: any = {};
    let shouldFillForm = false;

    // EXTRACTION DU NOM - FORCÉE et AGRESSIVE
    if (!updatedInfo.nom) {
      console.log('🔍 Tentative extraction NOM');
      
      // Pattern super agressif pour le nom
      let extractedName = '';
      
      // Si le message contient des mots clés de présentation
      if (lowerMessage.includes('je m\'appelle') || lowerMessage.includes('mon nom est') || lowerMessage.includes('c\'est') || lowerMessage.includes('je suis')) {
        const nameMatch = message.match(/(?:je m'appelle|mon nom est|c'est|je suis)\s+([a-zA-ZÀ-ÿ\s-]{2,30})/i);
        if (nameMatch) {
          extractedName = nameMatch[1].trim();
        }
      }
      
      // Si pas trouvé, chercher juste des mots qui ressemblent à un nom
      if (!extractedName && message.trim().length > 0) {
        const words = message.trim().split(/\s+/);
        // Prendre les 1-2 premiers mots s'ils ressemblent à un nom
        if (words.length >= 1 && words[0].match(/^[a-zA-ZÀ-ÿ-]{2,}$/)) {
          extractedName = words.slice(0, 2).join(' ');
        }
      }
      
      if (extractedName && extractedName.length > 1) {
        updatedInfo.nom = extractedName;
        formDataToFill.name = extractedName;
        shouldFillForm = true;
        console.log('✅ NOM EXTRAIT FORCÉ:', extractedName);
      }
    }

    // EXTRACTION EMAIL - TRÈS AGRESSIVE
    if (!updatedInfo.email) {
      console.log('🔍 Tentative extraction EMAIL');
      
      // Email standard
      const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      if (emailMatch) {
        updatedInfo.email = emailMatch[1].toLowerCase();
        formDataToFill.email = emailMatch[1].toLowerCase();
        shouldFillForm = true;
        console.log('✅ EMAIL EXTRAIT STANDARD:', emailMatch[1]);
      } else {
        // Reconstruction d'email dicté
        const words = message.toLowerCase().split(/\s+/);
        let emailParts = [];
        
        for (const word of words) {
          if (word.includes('@') || word.includes('arobase') || 
              word.includes('gmail') || word.includes('hotmail') || 
              word.includes('yahoo') || word.includes('outlook') ||
              word.includes('.com') || word.includes('.fr') ||
              word.includes('point')) {
            
            // Reconstruire l'email
            const reconstructed = message
              .toLowerCase()
              .replace(/arobase/g, '@')
              .replace(/point/g, '.')
              .replace(/\s+/g, '')
              .match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            
            if (reconstructed) {
              updatedInfo.email = reconstructed[1];
              formDataToFill.email = reconstructed[1];
              shouldFillForm = true;
              console.log('✅ EMAIL RECONSTRUIT:', reconstructed[1]);
              break;
            }
          }
        }
      }
    }

    // EXTRACTION TÉLÉPHONE - FORCÉE
    if (!updatedInfo.telephone) {
      console.log('🔍 Tentative extraction TÉLÉPHONE');
      
      const phonePattern = /(\+33|0)\s*[1-9](?:[\s.-]?\d){8}|([0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2})/g;
      const phoneMatch = message.match(phonePattern);
      
      if (phoneMatch) {
        const cleanPhone = phoneMatch[0].replace(/[\s.-]/g, '');
        if (cleanPhone.length >= 10) {
          updatedInfo.telephone = cleanPhone;
          formDataToFill.phone = cleanPhone;
          shouldFillForm = true;
          console.log('✅ TÉLÉPHONE EXTRAIT:', cleanPhone);
        }
      }
    }

    // EXTRACTION ENTREPRISE
    if (!updatedInfo.entreprise) {
      const businessMatch = message.match(/(?:ma société|mon entreprise|la société|l'entreprise|je travaille chez|chez)\s+([a-zA-ZÀ-ÿ\s&.-]{2,50})/i);
      if (businessMatch) {
        updatedInfo.entreprise = businessMatch[1].trim();
        formDataToFill.business = businessMatch[1].trim();
        shouldFillForm = true;
        console.log('✅ ENTREPRISE EXTRAITE:', businessMatch[1].trim());
      }
    }

    // REMPLISSAGE FORCÉ DU FORMULAIRE
    console.log('🎯 Données à remplir:', formDataToFill);
    console.log('🎯 Should fill form:', shouldFillForm);
    
    if (shouldFillForm && fillFormCallback) {
      console.log('🚀 REMPLISSAGE FORCÉ DU FORMULAIRE !');
      try {
        fillFormCallback(formDataToFill);
        console.log('✅ Callback exécuté avec succès');
      } catch (error) {
        console.error('❌ Erreur callback:', error);
      }
    } else if (!fillFormCallback) {
      console.error('❌ PAS DE CALLBACK DISPONIBLE !');
    }

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

    console.log('📋 Infos client FINALES:', updatedInfo);
    return updatedInfo;
  }
}
