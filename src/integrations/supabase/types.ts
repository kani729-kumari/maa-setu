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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          patient_id: string
          provider_name: string
          reason: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          patient_id: string
          provider_name: string
          reason?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          patient_id?: string
          provider_name?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          action: string | null
          created_at: string
          id: string
          patient_id: string
          reason: string
          resolved: boolean
          severity: string
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          patient_id: string
          reason: string
          resolved?: boolean
          severity?: string
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          patient_id?: string
          reason?: string
          resolved?: boolean
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          provider_name: string | null
          scheduled_at: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          provider_name?: string | null
          scheduled_at: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          provider_name?: string | null
          scheduled_at?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      care_gaps: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          item: string
          patient_id: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          item: string
          patient_id: string
          status?: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          item?: string
          patient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_gaps_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          decided_at: string | null
          id: string
          patient_id: string
          provider_id: string | null
          provider_name: string
          purpose: string | null
          requested_at: string
          status: string
        }
        Insert: {
          decided_at?: string | null
          id?: string
          patient_id: string
          provider_id?: string | null
          provider_name: string
          purpose?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          decided_at?: string | null
          id?: string
          patient_id?: string
          provider_id?: string | null
          provider_name?: string
          purpose?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_name: string
          file_path: string | null
          id: string
          ocr_status: string
          ocr_text: string | null
          patient_id: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          file_name: string
          file_path?: string | null
          id?: string
          ocr_status?: string
          ocr_text?: string | null
          patient_id: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_name?: string
          file_path?: string | null
          id?: string
          ocr_status?: string
          ocr_text?: string | null
          patient_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          contact: string | null
          created_at: string
          distance_km: number | null
          district: string | null
          emergency: boolean
          id: string
          is_open: boolean
          name: string
          type: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          distance_km?: number | null
          district?: string | null
          emergency?: boolean
          id?: string
          is_open?: boolean
          name: string
          type: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          distance_km?: number | null
          district?: string | null
          emergency?: boolean
          id?: string
          is_open?: boolean
          name?: string
          type?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          access_level: string
          created_at: string
          full_name: string
          id: string
          patient_id: string
          phone: string
          relationship: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          full_name: string
          id?: string
          patient_id: string
          phone: string
          relationship: string
        }
        Update: {
          access_level?: string
          created_at?: string
          full_name?: string
          id?: string
          patient_id?: string
          phone?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          attachment_url: string | null
          created_at: string
          hospital_name: string | null
          id: string
          notes: string | null
          patient_id: string
          pregnancy_month: number | null
          pregnancy_week: number | null
          provider_id: string | null
          provider_name: string | null
          recommendations: string | null
          record_type: string
          recorded_at: string
          summary: string | null
          title: string
          verified: boolean
          vitals: Json
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          hospital_name?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          pregnancy_month?: number | null
          pregnancy_week?: number | null
          provider_id?: string | null
          provider_name?: string | null
          recommendations?: string | null
          record_type: string
          recorded_at?: string
          summary?: string | null
          title: string
          verified?: boolean
          vitals?: Json
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          hospital_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          pregnancy_month?: number | null
          pregnancy_week?: number | null
          provider_id?: string | null
          provider_name?: string | null
          recommendations?: string | null
          record_type?: string
          recorded_at?: string
          summary?: string | null
          title?: string
          verified?: boolean
          vitals?: Json
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          blood_group: string | null
          created_at: string
          district: string | null
          edd: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          hospital_id: string | null
          id: string
          lmp: string | null
          mhid: string
          pregnancy_number: number
          profile_id: string | null
          registered_at: string
          registered_by: string | null
          state: string | null
          status: string
          village: string | null
        }
        Insert: {
          age: number
          blood_group?: string | null
          created_at?: string
          district?: string | null
          edd?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          hospital_id?: string | null
          id?: string
          lmp?: string | null
          mhid: string
          pregnancy_number?: number
          profile_id?: string | null
          registered_at?: string
          registered_by?: string | null
          state?: string | null
          status?: string
          village?: string | null
        }
        Update: {
          age?: number
          blood_group?: string | null
          created_at?: string
          district?: string | null
          edd?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          hospital_id?: string | null
          id?: string
          lmp?: string | null
          mhid?: string
          pregnancy_number?: number
          profile_id?: string | null
          registered_at?: string
          registered_by?: string | null
          state?: string | null
          status?: string
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string
          hospital_id: string | null
          id: string
          is_demo: boolean
          phone: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          hospital_id?: string | null
          id?: string
          is_demo?: boolean
          phone?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          hospital_id?: string | null
          id?: string
          is_demo?: boolean
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          done: boolean
          due_date: string
          id: string
          kind: string
          patient_id: string
          title: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          due_date: string
          id?: string
          kind: string
          patient_id: string
          title: string
        }
        Update: {
          created_at?: string
          done?: boolean
          due_date?: string
          id?: string
          kind?: string
          patient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          created_at: string
          engine: string
          factors: Json
          id: string
          level: string
          patient_id: string
          score: number
        }
        Insert: {
          created_at?: string
          engine?: string
          factors?: Json
          id?: string
          level: string
          patient_id: string
          score: number
        }
        Update: {
          created_at?: string
          engine?: string
          factors?: Json
          id?: string
          level?: string
          patient_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_benefits: {
        Row: {
          created_at: string
          id: string
          note: string | null
          patient_id: string
          scheme: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          patient_id: string
          scheme: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          patient_id?: string
          scheme?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_benefits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinations: {
        Row: {
          created_at: string
          given_at: string | null
          id: string
          name: string
          patient_id: string
          status: string
        }
        Insert: {
          created_at?: string
          given_at?: string | null
          id?: string
          name: string
          patient_id: string
          status?: string
        }
        Update: {
          created_at?: string
          given_at?: string | null
          id?: string
          name?: string
          patient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
