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
      errors: {
        Row: {
          count: number | null
          created_at: string | null
          error_message: string | null
          error_type: string
          id: string
          language: Database["public"]["Enums"]["language_enum"]
          line_number: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          error_message?: string | null
          error_type: string
          id: string
          language: Database["public"]["Enums"]["language_enum"]
          line_number: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          error_message?: string | null
          error_type?: string
          id?: string
          language?: Database["public"]["Enums"]["language_enum"]
          line_number?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_image: {
        Row: {
          created_at: string | null
          ext: string
          id: string
          name: string
          session_id: string
          size: number
          type: string
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          ext: string
          id?: string
          name: string
          session_id: string
          size: number
          type: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          ext?: string
          id?: string
          name?: string
          session_id?: string
          size?: number
          type?: string
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_documents_session_fk"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          code: string | null
          compilation_output: string | null
          concept: string | null
          created_at: string | null
          detected_code: string | null
          id: string
          language: Database["public"]["Enums"]["language_enum"] | null
          prompt: string | null
          status: Database["public"]["Enums"]["session_status"]
          summary: string | null
          user_id: string | null
        }
        Insert: {
          code?: string | null
          compilation_output?: string | null
          concept?: string | null
          created_at?: string | null
          detected_code?: string | null
          id: string
          language?: Database["public"]["Enums"]["language_enum"] | null
          prompt?: string | null
          status: Database["public"]["Enums"]["session_status"]
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string | null
          compilation_output?: string | null
          concept?: string | null
          created_at?: string | null
          detected_code?: string | null
          id?: string
          language?: Database["public"]["Enums"]["language_enum"] | null
          prompt?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          summary?: string | null
          user_id?: string | null
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
      language_enum: "c" | "bash" | "java" | "python"
      session_status: "pending" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
