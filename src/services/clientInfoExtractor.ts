
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
    
    // Données pour le remplissage automatique du formulaire
    let formDataToFill: any = {};
    let hasNewInfo = false;

    // EXTRACTION DU NOM - VERSION AMÉLIORÉE
    if (!updatedInfo.nom) {
      console.log('🔍 Tentative extraction NOM');
      
      let extractedName = '';
      
      // Patterns étendus pour le nom
      const namePatterns = [
        /(?:je m'appelle|mon nom est|c'est|je suis|nom[:\s]+|prénom[:\s]+)\s*([a-zA-ZÀ-ÿ\s-]{2,40})/i,
        /^([A-ZÀ-Ÿ][a-zA-ZÀ-ÿ-]{1,20}(?:\s+[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ-]{1,20}){0,3})/,
        /bonjour\s+(?:je suis\s+)?([a-zA-ZÀ-ÿ\s-]{2,30})/i,
        /salut\s+(?:c'est\s+)?([a-zA-ZÀ-ÿ\s-]{2,30})/i
      ];
      
      for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match) {
          extractedName = match[1].trim();
          // Nettoyer le nom extrait
          extractedName = extractedName.replace(/[.,!?]/g, '').trim();
          if (extractedName.length > 1 && !extractedName.match(/\b(bonjour|salut|merci|oui|non|ok)\b/i)) {
            break;
          } else {
            extractedName = '';
          }
        }
      }
      
      // Si toujours pas trouvé, essayer de détecter un nom en début de message
      if (!extractedName && message.trim().length > 0) {
        const words = message.trim().split(/\s+/);
        const firstWord = words[0];
        
        // Vérifier si le premier mot ressemble à un prénom
        if (firstWord.match(/^[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ-]{1,20}$/) && 
            !firstWord.match(/\b(Bonjour|Salut|Merci|Oui|Non|Ok|Je|Il|Elle|Mon|Ma|Le|La|Un|Une)\b/i)) {
          
          // Prendre le premier et éventuellement le deuxième mot
          if (words.length > 1 && words[1].match(/^[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ-]{1,20}$/)) {
            extractedName = `${firstWord} ${words[1]}`;
          } else {
            extractedName = firstWord;
          }
        }
      }
      
      if (extractedName && extractedName.length > 1) {
        updatedInfo.nom = extractedName;
        formDataToFill.nom = extractedName; // Utiliser 'nom' au lieu de 'name'
        hasNewInfo = true;
        console.log('✅ NOM EXTRAIT:', extractedName);
      }
    }

    // EXTRACTION EMAIL - VERSION AMÉLIORÉE
    if (!updatedInfo.email) {
      console.log('🔍 Tentative extraction EMAIL');
      
      // Email standard
      const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      if (emailMatch) {
        updatedInfo.email = emailMatch[1].toLowerCase();
        formDataToFill.email = emailMatch[1].toLowerCase();
        hasNewInfo = true;
        console.log('✅ EMAIL EXTRAIT:', emailMatch[1]);
      } else {
        // Patterns pour email dicté ou mal formaté
        const emailPatterns = [
          /([a-zA-Z0-9._%+-]+)\s*(?:arobase|@|at)\s*([a-zA-Z0-9.-]+)\s*(?:point|\.)\s*([a-zA-Z]{2,})/i,
          /email[:\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
          /mail[:\s]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
        ];
        
        for (const pattern of emailPatterns) {
          const match = message.match(pattern);
          if (match) {
            let email;
            if (match.length > 3) {
              // Email reconstruit depuis arobase/point
              email = `${match[1]}@${match[2]}.${match[3]}`.replace(/\s+/g, '');
            } else {
              email = match[1];
            }
            updatedInfo.email = email.toLowerCase();
            formDataToFill.email = email.toLowerCase();
            hasNewInfo = true;
            console.log('✅ EMAIL RECONSTRUIT:', email);
            break;
          }
        }
      }
    }

    // EXTRACTION TÉLÉPHONE - VERSION AMÉLIORÉE
    if (!updatedInfo.telephone) {
      console.log('🔍 Tentative extraction TÉLÉPHONE');
      
      const phonePatterns = [
        // Téléphone français standard
        /(\+33|0)\s*[1-9](?:[\s.-]?\d){8}/g,
        // Format avec espaces/tirets
        /([0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2})/g,
        // Téléphone avec mots-clés
        /(?:téléphone|tel|phone|portable)[:\s]*([0-9\s.-]{10,})/i,
        // Numéro dicté
        /([0-9]+[\s.-]*[0-9]+[\s.-]*[0-9]+[\s.-]*[0-9]+[\s.-]*[0-9]+)/g
      ];
      
      for (const pattern of phonePatterns) {
        const phoneMatch = message.match(pattern);
        if (phoneMatch) {
          const cleanPhone = phoneMatch[phoneMatch.length > 1 ? phoneMatch.length - 1 : 0]
            .replace(/[\s.-]/g, '');
          
          if (cleanPhone.length >= 10 && cleanPhone.match(/^[0-9+]+$/)) {
            updatedInfo.telephone = cleanPhone;
            formDataToFill.telephone = cleanPhone;
            hasNewInfo = true;
            console.log('✅ TÉLÉPHONE EXTRAIT:', cleanPhone);
            break;
          }
        }
      }
    }

    // EXTRACTION ENTREPRISE - VERSION CONSIDÉRABLEMENT AMÉLIORÉE
    if (!updatedInfo.entreprise) {
      console.log('🔍 Tentative extraction ENTREPRISE');
      
      let extractedBusiness = '';
      
      const businessPatterns = [
        // Patterns explicites
        /(?:ma société|mon entreprise|la société|l'entreprise|je travaille chez|chez|société[:\s]+|entreprise[:\s]+)\s+([a-zA-ZÀ-ÿ\s&.'-]{2,50})/i,
        // Patterns avec secteur
        /(?:dans le|secteur|domaine)[:\s]+([a-zA-ZÀ-ÿ\s&.'-]{3,40})/i,
        // Patterns business
        /(?:business|company|firm)[:\s]+([a-zA-ZÀ-ÿ\s&.'-]{2,50})/i,
        // Pattern pour SARL, SAS, etc.
        /([a-zA-ZÀ-ÿ\s&.'-]{2,30})\s+(?:SARL|SAS|SA|EURL|SNC|SASU)/i,
      ];
      
      for (const pattern of businessPatterns) {
        const match = message.match(pattern);
        if (match) {
          extractedBusiness = match[1].trim();
          // Nettoyer le nom d'entreprise
          extractedBusiness = extractedBusiness.replace(/[.,!?]$/, '').trim();
          if (extractedBusiness.length > 2) {
            break;
          } else {
            extractedBusiness = '';
          }
        }
      }
      
      // Détection de secteurs d'activité courants
      if (!extractedBusiness) {
        const secteurs = {
          'artisan': ['artisan', 'plombier', 'électricien', 'maçon', 'menuisier', 'peintre', 'chauffagiste', 'couvreur'],
          'restauration': ['restaurant', 'café', 'bar', 'boulangerie', 'pâtisserie', 'traiteur'],
          'beauté': ['coiffeur', 'esthétique', 'massage', 'spa', 'onglerie'],
          'commerce': ['commerce', 'magasin', 'boutique', 'vente', 'retail'],
          'services': ['conseil', 'consulting', 'formation', 'coaching'],
          'santé': ['médecin', 'dentiste', 'pharmacie', 'kiné', 'ostéopathe'],
          'tech': ['informatique', 'développement', 'web', 'digital', 'tech']
        };
        
        for (const [secteur, mots] of Object.entries(secteurs)) {
          if (mots.some(mot => lowerMessage.includes(mot))) {
            extractedBusiness = secteur.charAt(0).toUpperCase() + secteur.slice(1);
            break;
          }
        }
      }
      
      if (extractedBusiness && extractedBusiness.length > 2) {
        updatedInfo.entreprise = extractedBusiness;
        formDataToFill.entreprise = extractedBusiness;
        hasNewInfo = true;
        console.log('✅ ENTREPRISE EXTRAITE:', extractedBusiness);
      }
    }

    // REMPLISSAGE AUTOMATIQUE DU FORMULAIRE - VERSION AMÉLIORÉE
    console.log('🎯 Nouvelles données détectées:', hasNewInfo);
    console.log('🎯 Données à remplir:', formDataToFill);
    
    if (hasNewInfo && fillFormCallback) {
      console.log('🚀 REMPLISSAGE AUTOMATIQUE DU FORMULAIRE !');
      try {
        // Mapper les champs selon les noms attendus par le formulaire
        const mappedData = {
          // Essayer différents noms de champs possibles
          ...(formDataToFill.nom && { 
            name: formDataToFill.nom,
            nom: formDataToFill.nom,
            fullName: formDataToFill.nom,
            'nom-prenom': formDataToFill.nom
          }),
          ...(formDataToFill.email && { 
            email: formDataToFill.email,
            'email-professionnel': formDataToFill.email,
            mail: formDataToFill.email
          }),
          ...(formDataToFill.telephone && { 
            phone: formDataToFill.telephone,
            telephone: formDataToFill.telephone,
            tel: formDataToFill.telephone
          }),
          ...(formDataToFill.entreprise && { 
            company: formDataToFill.entreprise,
            entreprise: formDataToFill.entreprise,
            business: formDataToFill.entreprise,
            'entreprise-secteur': formDataToFill.entreprise
          })
        };
        
        fillFormCallback(mappedData);
        console.log('✅ Formulaire rempli automatiquement avec:', mappedData);
      } catch (error) {
        console.error('❌ Erreur remplissage formulaire:', error);
      }
    } else if (hasNewInfo && !fillFormCallback) {
      console.error('❌ NOUVELLES INFOS DÉTECTÉES MAIS PAS DE CALLBACK !');
    } else {
      console.log('ℹ️ Aucune nouvelle information détectée');
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
