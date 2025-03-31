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
      caballos: {
        Row: {
          altura: string | null
          color: string | null
          created_at: string
          edad: number | null
          entrenamiento: string | null
          historial_medico: string | null
          id: string
          nombre: string
          peso: string | null
          raza: string | null
          temperamento: string | null
          updated_at: string
        }
        Insert: {
          altura?: string | null
          color?: string | null
          created_at?: string
          edad?: number | null
          entrenamiento?: string | null
          historial_medico?: string | null
          id?: string
          nombre: string
          peso?: string | null
          raza?: string | null
          temperamento?: string | null
          updated_at?: string
        }
        Update: {
          altura?: string | null
          color?: string | null
          created_at?: string
          edad?: number | null
          entrenamiento?: string | null
          historial_medico?: string | null
          id?: string
          nombre?: string
          peso?: string | null
          raza?: string | null
          temperamento?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          apellido: string
          cedula: string
          created_at: string
          diagnostico: string | null
          email: string | null
          fecha_nacimiento: string | null
          id: string
          nombre: string
          objetivos: string | null
          observaciones: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido: string
          cedula: string
          created_at?: string
          diagnostico?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre: string
          objetivos?: string | null
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          cedula?: string
          created_at?: string
          diagnostico?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string
          objetivos?: string | null
          observaciones?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      personal: {
        Row: {
          apellido: string
          cargo: string | null
          cedula: string
          created_at: string
          email: string | null
          especialidad: string | null
          fecha_contratacion: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido: string
          cargo?: string | null
          cedula: string
          created_at?: string
          email?: string | null
          especialidad?: string | null
          fecha_contratacion?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          cargo?: string | null
          cedula?: string
          created_at?: string
          email?: string | null
          especialidad?: string | null
          fecha_contratacion?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sesiones: {
        Row: {
          actividades: string | null
          caballo_id: string
          created_at: string
          duracion: string | null
          estado: string | null
          fecha: string
          hora: string
          id: string
          observaciones: string | null
          paciente_id: string
          personal_id: string
          updated_at: string
        }
        Insert: {
          actividades?: string | null
          caballo_id: string
          created_at?: string
          duracion?: string | null
          estado?: string | null
          fecha: string
          hora: string
          id?: string
          observaciones?: string | null
          paciente_id: string
          personal_id: string
          updated_at?: string
        }
        Update: {
          actividades?: string | null
          caballo_id?: string
          created_at?: string
          duracion?: string | null
          estado?: string | null
          fecha?: string
          hora?: string
          id?: string
          observaciones?: string | null
          paciente_id?: string
          personal_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_caballo_id_fkey"
            columns: ["caballo_id"]
            isOneToOne: false
            referencedRelation: "caballos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_personal_id_fkey"
            columns: ["personal_id"]
            isOneToOne: false
            referencedRelation: "personal"
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
