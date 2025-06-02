
import { supabase } from '@/integrations/supabase/client';

export interface ConversationData {
  sessionId: string;
  clientInfo?: {
    metier?: string;
    zone?: string;
    budget?: string;
    urgence?: string;
    decideur?: string;
    situation?: string;
    objectif?: string;
  };
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    stage?: number;
  }>;
  outcome?: 'success' | 'abandoned' | 'scheduled_callback' | 'objection' | 'in_progress';
  conversionStage?: number;
}

export class LearningService {
  private currentConversation: ConversationData | null = null;

  // Démarrer une nouvelle conversation
  startConversation(sessionId: string): void {
    this.currentConversation = {
      sessionId,
      messages: [],
      outcome: 'in_progress',
      conversionStage: 1
    };
    console.log('🎯 Nouvelle conversation démarrée:', sessionId);
  }

  // Ajouter un message à la conversation en cours
  addMessage(role: 'user' | 'assistant', content: string, stage?: number): void {
    if (!this.currentConversation) return;

    this.currentConversation.messages.push({
      role,
      content,
      timestamp: new Date(),
      stage
    });

    if (stage) {
      this.currentConversation.conversionStage = Math.max(
        this.currentConversation.conversionStage || 1, 
        stage
      );
    }

    console.log(`📝 Message ajouté (${role}, étape ${stage}):`, content.substring(0, 50) + '...');
  }

  // Mettre à jour les informations client détectées
  updateClientInfo(info: Partial<ConversationData['clientInfo']>): void {
    if (!this.currentConversation) return;

    this.currentConversation.clientInfo = {
      ...this.currentConversation.clientInfo,
      ...info
    };

    console.log('👤 Infos client mises à jour:', this.currentConversation.clientInfo);
  }

  // Sauvegarder la conversation en base
  async saveConversation(outcome?: ConversationData['outcome']): Promise<void> {
    if (!this.currentConversation) return;

    try {
      if (outcome) {
        this.currentConversation.outcome = outcome;
      }

      const { error } = await supabase
        .from('conversations')
        .upsert({
          session_id: this.currentConversation.sessionId,
          client_info: this.currentConversation.clientInfo || {},
          conversation_data: {
            messages: this.currentConversation.messages,
            total_messages: this.currentConversation.messages.length
          },
          outcome: this.currentConversation.outcome,
          conversion_stage: this.currentConversation.conversionStage,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur sauvegarde conversation:', error);
      } else {
        console.log('✅ Conversation sauvegardée avec succès');
        
        // Si c'est un succès, enregistrer le pattern de réussite
        if (outcome === 'success' && this.currentConversation.clientInfo) {
          await this.recordSuccessPattern();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  // Enregistrer un pattern de succès
  private async recordSuccessPattern(): Promise<void> {
    if (!this.currentConversation?.clientInfo) return;

    try {
      const businessType = this.currentConversation.clientInfo.metier || 'unknown';
      const zone = this.currentConversation.clientInfo.zone || 'unknown';
      
      // Déterminer le type de zone
      let zoneType = 'local';
      if (zone.includes('national') || zone.includes('France')) {
        zoneType = 'national';
      } else if (zone.includes('département') || zone.includes('50km') || zone.includes('région')) {
        zoneType = 'départemental';
      }

      // Extraire les phrases clés des réponses de l'IA
      const aiMessages = this.currentConversation.messages
        .filter(m => m.role === 'assistant')
        .map(m => m.content);

      const successfulApproach = {
        key_phrases: this.extractKeyPhrases(aiMessages),
        final_stage_reached: this.currentConversation.conversionStage,
        client_profile: this.currentConversation.clientInfo
      };

      await supabase
        .from('success_patterns')
        .insert({
          business_type: businessType,
          zone_type: zoneType,
          successful_approach: successfulApproach,
          conversion_rate: 100, // Premier succès = 100%
          usage_count: 1,
          last_successful_use: new Date().toISOString()
        });

      console.log('🎯 Pattern de succès enregistré pour:', businessType, zoneType);
    } catch (error) {
      console.error('Erreur enregistrement pattern:', error);
    }
  }

  // Extraire les phrases clés des messages de l'IA
  private extractKeyPhrases(messages: string[]): string[] {
    const keyPhrases: string[] = [];
    
    messages.forEach(message => {
      // Phrases d'accroche
      if (message.includes('Exactement !') || message.includes('Je comprends')) {
        keyPhrases.push('empathie_validation');
      }
      
      // Création d'urgence
      if (message.includes('pendant ce temps') || message.includes('tes concurrents')) {
        keyPhrases.push('creation_urgence');
      }
      
      // Témoignages
      if (message.includes('J\'ai un') && message.includes('qui est passé')) {
        keyPhrases.push('temoignage_resultat');
      }
      
      // Questions qualifiantes
      if (message.includes('Tu fais quoi') || message.includes('Tu interviens sur')) {
        keyPhrases.push('qualification_metier_zone');
      }
    });

    return [...new Set(keyPhrases)]; // Éliminer les doublons
  }

  // Récupérer les meilleurs patterns pour un type de client
  async getBestPatterns(businessType: string, zoneType: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('success_patterns')
        .select('*')
        .eq('business_type', businessType)
        .eq('zone_type', zoneType)
        .order('conversion_rate', { ascending: false })
        .order('usage_count', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Erreur récupération patterns:', error);
        return [];
      }

      console.log(`📊 ${data?.length || 0} patterns trouvés pour ${businessType} - ${zoneType}`);
      return data || [];
    } catch (error) {
      console.error('Erreur patterns:', error);
      return [];
    }
  }

  // Récupérer un témoignage pertinent
  async getRelevantTestimonial(businessType: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('client_testimonials')
        .select('*')
        .eq('business_type', businessType)
        .eq('is_verified', true)
        .order('effectiveness_score', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('Aucun témoignage trouvé pour:', businessType);
        return null;
      }

      // Incrémenter le compteur d'utilisation
      await supabase
        .from('client_testimonials')
        .update({ usage_count: (data.usage_count || 0) + 1 })
        .eq('id', data.id);

      return `J'ai ${data.client_name || 'un client'} ${data.business_name ? `(${data.business_name}) ` : ''}${data.results_achieved || 'qui a eu d\'excellents résultats'} grâce à son site.`;
    } catch (error) {
      console.error('Erreur témoignage:', error);
      return null;
    }
  }

  // Terminer la conversation
  endConversation(outcome: ConversationData['outcome'] = 'abandoned'): void {
    if (this.currentConversation) {
      this.saveConversation(outcome);
      console.log('🏁 Conversation terminée avec outcome:', outcome);
      this.currentConversation = null;
    }
  }

  // Obtenir les stats de performance
  async getPerformanceStats(): Promise<{
    totalConversations: number;
    successRate: number;
    averageStage: number;
    topPatterns: any[];
  }> {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('outcome, conversion_stage');

      if (error) {
        console.error('Erreur stats:', error);
        return { totalConversations: 0, successRate: 0, averageStage: 0, topPatterns: [] };
      }

      const total = conversations?.length || 0;
      const successes = conversations?.filter(c => c.outcome === 'success').length || 0;
      const avgStage = conversations?.reduce((sum, c) => sum + (c.conversion_stage || 0), 0) / total || 0;

      const { data: patterns } = await supabase
        .from('success_patterns')
        .select('*')
        .order('conversion_rate', { ascending: false })
        .limit(5);

      return {
        totalConversations: total,
        successRate: (successes / total) * 100,
        averageStage: avgStage,
        topPatterns: patterns || []
      };
    } catch (error) {
      console.error('Erreur calcul stats:', error);
      return { totalConversations: 0, successRate: 0, averageStage: 0, topPatterns: [] };
    }
  }
}

export const learningService = new LearningService();
