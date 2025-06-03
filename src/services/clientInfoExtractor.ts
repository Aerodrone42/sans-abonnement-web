
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

    // AMÉLIORATION: Extraction plus robuste et IMMÉDIATE des informations personnelles
    let formDataToFill: any = {};
    let shouldFillForm = false;

    // EXTRACTION DU NOM - patterns améliorés
    if (!updatedInfo.nom) {
      const namePatterns = [
        /(?:je m'appelle|mon nom est|c'est|je suis)\s+([a-zA-ZÀ-ÿ\s-]{2,30})/gi,
        /^([a-zA-ZÀ-ÿ\s-]{2,30})(?:\s|$)/i // Nom en début de phrase
      ];
      
      for (const pattern of namePatterns) {
        const nameMatch = message.match(pattern);
        if (nameMatch && nameMatch[1]) {
          const extractedName = nameMatch[1].trim()
            .replace(/^(et|donc|alors|euh|ben|oui|non|voilà)\s+/gi, '')
            .replace(/\s+(email|mail|téléphone|tél|entreprise|société).*$/gi, '');
          
          if (extractedName.length > 1 && extractedName.length < 50) {
            updatedInfo.nom = extractedName;
            formDataToFill.name = extractedName;
            shouldFillForm = true;
            console.log('📝 Nom extrait AMÉLIORÉ:', extractedName);
            break;
          }
        }
      }
    }

    // EXTRACTION EMAIL - patterns améliorés avec reconstruction
    if (!updatedInfo.email) {
      // Pattern standard pour email complet
      let emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      
      if (emailMatch) {
        updatedInfo.email = emailMatch[1].toLowerCase();
        formDataToFill.email = emailMatch[1].toLowerCase();
        shouldFillForm = true;
        console.log('📝 Email extrait STANDARD:', emailMatch[1]);
      } else {
        // Reconstruction d'email à partir de mots séparés
        const emailParts = [];
        const words = message.toLowerCase().split(/\s+/);
        
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          
          // Chercher des parties d'email
          if (word.includes('@') || word.includes('gmail') || word.includes('hotmail') || 
              word.includes('yahoo') || word.includes('outlook') || word.endsWith('.com') ||
              word.endsWith('.fr') || word.includes('arobase')) {
            
            // Reconstruire l'email à partir des mots autour
            let emailCandidate = '';
            let startIndex = Math.max(0, i - 3);
            let endIndex = Math.min(words.length, i + 3);
            
            for (let j = startIndex; j < endIndex; j++) {
              let part = words[j]
                .replace(/arobase/gi, '@')
                .replace(/point/gi, '.')
                .replace(/\s+/g, '')
                .replace(/[^\w@.-]/g, '');
              
              if (part) {
                emailCandidate += part;
              }
            }
            
            // Vérifier si on a un email valide
            const reconstructedMatch = emailCandidate.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (reconstructedMatch) {
              updatedInfo.email = reconstructedMatch[1].toLowerCase();
              formDataToFill.email = reconstructedMatch[1].toLowerCase();
              shouldFillForm = true;
              console.log('📝 Email RECONSTRUIT:', reconstructedMatch[1]);
              break;
            }
          }
        }
      }
    }

    // EXTRACTION TÉLÉPHONE - patterns améliorés
    if (!updatedInfo.telephone) {
      const phonePatterns = [
        /(\+33|0)\s*[1-9](?:[\s.-]?\d){8}/g,
        /([0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2})/g
      ];
      
      for (const pattern of phonePatterns) {
        const phoneMatch = message.match(pattern);
        if (phoneMatch) {
          const cleanPhone = phoneMatch[0].replace(/[\s.-]/g, '');
          if (cleanPhone.length >= 10) {
            updatedInfo.telephone = cleanPhone;
            formDataToFill.phone = cleanPhone;
            shouldFillForm = true;
            console.log('📝 Téléphone extrait AMÉLIORÉ:', cleanPhone);
            break;
          }
        }
      }
    }

    // EXTRACTION ENTREPRISE - patterns améliorés
    if (!updatedInfo.entreprise) {
      const businessPatterns = [
        /(?:ma société|mon entreprise|la société|l'entreprise|je travaille chez|chez)\s+([a-zA-ZÀ-ÿ\s&.-]{2,50})/gi,
        /(?:^|[.,]\s*)([a-zA-ZÀ-ÿ\s&.-]{2,50})(?:\s+(?:sarl|sas|eurl|sa|sasu|auto|entrepreneur))/gi
      ];
      
      for (const pattern of businessPatterns) {
        const businessMatch = message.match(pattern);
        if (businessMatch && businessMatch[1]) {
          const extractedBusiness = businessMatch[1].trim()
            .replace(/^(et|donc|alors|euh|ben|oui|non|voilà)\s+/gi, '');
          
          if (extractedBusiness.length > 1 && extractedBusiness.length < 60) {
            updatedInfo.entreprise = extractedBusiness;
            formDataToFill.business = extractedBusiness;
            shouldFillForm = true;
            console.log('📝 Entreprise extraite AMÉLIORÉE:', extractedBusiness);
            break;
          }
        }
      }
    }

    // REMPLISSAGE IMMÉDIAT ET FORCÉ du formulaire si des infos ont été détectées
    if (shouldFillForm && fillFormCallback) {
      console.log('🎯 REMPLISSAGE AUTOMATIQUE DÉCLENCHÉ:', formDataToFill);
      fillFormCallback(formDataToFill);
    }

    // GESTION DU MODE FORMULAIRE STRUCTURÉ
    if (updatedInfo.choixContact === 'formulaire' && updatedInfo.conversationStage === 'collecte_infos_formulaire') {
      // Progression dans les étapes seulement si l'info correspondante a été extraite
      if (updatedInfo.formulaireEtape === 'nom' && updatedInfo.nom) {
        updatedInfo.formulaireEtape = 'email';
      } else if (updatedInfo.formulaireEtape === 'email' && updatedInfo.email) {
        updatedInfo.formulaireEtape = 'tel';
      } else if (updatedInfo.formulaireEtape === 'tel' && updatedInfo.telephone) {
        updatedInfo.formulaireEtape = 'entreprise';
      } else if (updatedInfo.formulaireEtape === 'entreprise' && updatedInfo.entreprise) {
        updatedInfo.formulaireEtape = 'message';
      } else if (updatedInfo.formulaireEtape === 'message' && updatedInfo.nom && updatedInfo.email) {
        // Construction du message final
        let finalMessage = `Secteur d'activité: ${updatedInfo.metier || 'Non spécifié'}\n`;
        finalMessage += `Zone d'intervention: ${updatedInfo.zone || 'Non spécifiée'}\n`;
        finalMessage += `Situation actuelle: ${updatedInfo.situation || 'Non spécifiée'}\n`;
        finalMessage += `Message du client: ${message.trim()}\n`;
        finalMessage += '\n[Demande qualifiée par l\'assistant IA Nova - Aerodrone Multiservices]';
        
        updatedInfo.message = finalMessage;
        updatedInfo.formulaireEtape = 'fini';
        
        if (fillFormCallback) {
          console.log('🎯 REMPLISSAGE FINAL COMPLET');
          fillFormCallback({ 
            message: finalMessage,
            name: updatedInfo.nom,
            email: updatedInfo.email,
            phone: updatedInfo.telephone || '',
            business: updatedInfo.entreprise || ''
          });
        }
      }
    }
    
    console.log('📋 Infos client extraites AMÉLIORÉES:', updatedInfo);
    return updatedInfo;
  }
}
