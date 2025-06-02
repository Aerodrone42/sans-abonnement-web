export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_testimonials: {
        Row: {
          business_name: string | null
          business_type: string
          client_name: string | null
          created_at: string | null
          effectiveness_score: number | null
          id: string
          is_verified: boolean | null
          results_achieved: string | null
          service_sold: string | null
          testimonial_text: string
          usage_count: number | null
          zone: string | null
        }
        Insert: {
          business_name?: string | null
          business_type: string
          client_name?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          is_verified?: boolean | null
          results_achieved?: string | null
          service_sold?: string | null
          testimonial_text: string
          usage_count?: number | null
          zone?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string
          client_name?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          is_verified?: boolean | null
          results_achieved?: string | null
          service_sold?: string | null
          testimonial_text?: string
          usage_count?: number | null
          zone?: string | null
        }
        Relationships: []
      }
      conversation_analytics: {
        Row: {
          ai_response: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          response_time_seconds: number | null
          stage: number
          user_message: string | null
          user_reaction: string | null
        }
        Insert: {
          ai_response?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          response_time_seconds?: number | null
          stage: number
          user_message?: string | null
          user_reaction?: string | null
        }
        Update: {
          ai_response?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          response_time_seconds?: number | null
          stage?: number
          user_message?: string | null
          user_reaction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_analytics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_info: Json | null
          conversation_data: Json
          conversion_stage: number | null
          created_at: string | null
          id: string
          outcome: string | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          client_info?: Json | null
          conversation_data: Json
          conversion_stage?: number | null
          created_at?: string | null
          id?: string
          outcome?: string | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          client_info?: Json | null
          conversation_data?: Json
          conversion_stage?: number | null
          created_at?: string | null
          id?: string
          outcome?: string | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      success_patterns: {
        Row: {
          business_type: string
          conversion_rate: number | null
          created_at: string | null
          id: string
          last_successful_use: string | null
          objections_handled: Json | null
          successful_approach: Json
          usage_count: number | null
          zone_type: string
        }
        Insert: {
          business_type: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          last_successful_use?: string | null
          objections_handled?: Json | null
          successful_approach: Json
          usage_count?: number | null
          zone_type: string
        }
        Update: {
          business_type?: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          last_successful_use?: string | null
          objections_handled?: Json | null
          successful_approach?: Json
          usage_count?: number | null
          zone_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
