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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          imageurl: string
          location: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          imageurl?: string
          location: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          imageurl?: string
          location?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      priest_bookings: {
        Row: {
          address: string
          booking_date: string
          created_at: string
          id: string
          notes: string | null
          price: number
          priest_id: string
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          booking_date: string
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          priest_id: string
          purpose: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          booking_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          price?: number
          priest_id?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "priest_bookings_priest_id_fkey"
            columns: ["priest_id"]
            isOneToOne: false
            referencedRelation: "priest_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      priest_profiles: {
        Row: {
          approval_status: string
          availability: string
          avatar_url: string
          base_price: number
          created_at: string
          description: string
          experience_years: number
          id: string
          location: string
          name: string
          rating: number
          specialties: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string
          availability?: string
          avatar_url?: string
          base_price?: number
          created_at?: string
          description: string
          experience_years?: number
          id?: string
          location?: string
          name: string
          rating?: number
          specialties?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string
          availability?: string
          avatar_url?: string
          base_price?: number
          created_at?: string
          description?: string
          experience_years?: number
          id?: string
          location?: string
          name?: string
          rating?: number
          specialties?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      priests: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
          phone_number: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: never
          name: string
          phone_number: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: never
          name?: string
          phone_number?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          is_priest: boolean | null
          last_name: string | null
          priest_status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          is_priest?: boolean | null
          last_name?: string | null
          priest_status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_priest?: boolean | null
          last_name?: string | null
          priest_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          booking_date: string
          created_at: string
          id: string
          notes: string | null
          service_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          service_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          duration: string
          icon: string
          id: string
          price: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          icon: string
          id?: string
          price: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          icon?: string
          id?: string
          price?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      teachings: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          date: string
          description: string
          id: string
          imageurl: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          date: string
          description: string
          id?: string
          imageurl?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          imageurl?: string | null
          title?: string
          updated_at?: string
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
