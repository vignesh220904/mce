export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          category: string
          created_at: string | null
          id: string
          priority: number | null
          suggestion_text: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          priority?: number | null
          suggestion_text: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          priority?: number | null
          suggestion_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          description: string | null
          icon_name: string
          id: string
          name: string
          points_reward: number | null
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name: string
          id?: string
          name: string
          points_reward?: number | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string
          id?: string
          name?: string
          points_reward?: number | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty_level: string
          duration_hours: number | null
          id: string
          is_free: boolean | null
          price_points: number | null
          thumbnail_url: string | null
          title: string
          total_lessons: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty_level: string
          duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          price_points?: number | null
          thumbnail_url?: string | null
          title: string
          total_lessons?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string
          duration_hours?: number | null
          id?: string
          is_free?: boolean | null
          price_points?: number | null
          thumbnail_url?: string | null
          title?: string
          total_lessons?: number | null
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          course_name: string
          created_at: string | null
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          time_spent_minutes: number | null
          user_id: string | null
          weak_concepts: string[] | null
        }
        Insert: {
          course_name: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
          weak_concepts?: string[] | null
        }
        Update: {
          course_name?: string
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
          weak_concepts?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          lesson_order: number
          quiz_data: Json | null
          title: string
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_order: number
          quiz_data?: Json | null
          title: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_order?: number
          quiz_data?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avg_score: number | null
          created_at: string | null
          current_streak: number | null
          email: string | null
          full_name: string | null
          global_rank: number | null
          id: string
          points_balance: number | null
          total_badges: number | null
          updated_at: string | null
        }
        Insert: {
          avg_score?: number | null
          created_at?: string | null
          current_streak?: number | null
          email?: string | null
          full_name?: string | null
          global_rank?: number | null
          id: string
          points_balance?: number | null
          total_badges?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_score?: number | null
          created_at?: string | null
          current_streak?: number | null
          email?: string | null
          full_name?: string | null
          global_rank?: number | null
          id?: string
          points_balance?: number | null
          total_badges?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          available: boolean | null
          category: string
          color: string | null
          cost_points: number
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          title: string
        }
        Insert: {
          available?: boolean | null
          category: string
          color?: string | null
          cost_points: number
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          title: string
        }
        Update: {
          available?: boolean | null
          category?: string
          color?: string | null
          cost_points?: number
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          id: string
          points_change: number
          status: string | null
          title: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_change: number
          status?: string | null
          title: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points_change?: number
          status?: string | null
          title?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          current_lesson_order: number | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          current_lesson_order?: number | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          current_lesson_order?: number | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_completions: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string | null
          quiz_score: number | null
          time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_score?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_score?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
