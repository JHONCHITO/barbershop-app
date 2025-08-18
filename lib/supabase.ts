import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de base de datos
export interface Barberia {
  id: string
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  telefono?: string
  rol: "admin" | "barbero" | "cliente"
  barberia_id?: string
  avatar_url?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Barbero {
  id: string
  usuario_id: string
  barberia_id: string
  especialidades: string[]
  experiencia: number
  salario: number
  direccion?: string
  whatsapp?: string
  horario_inicio: string
  horario_fin: string
  dias_trabajo: string[]
  created_at: string
  updated_at: string
}

export interface Servicio {
  id: string
  barberia_id: string
  nombre: string
  descripcion?: string
  precio: number
  duracion: number
  categoria?: string
  activo: boolean
  imagen_url?: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  usuario_id: string
  fecha_nacimiento?: string
  preferencias?: string
  notas?: string
  total_visitas: number
  ultima_visita?: string
  created_at: string
  updated_at: string
}

export interface Reserva {
  id: string
  cliente_id: string
  barbero_id: string
  barberia_id: string
  fecha_hora: string
  estado: "pendiente" | "confirmada" | "en_proceso" | "completada" | "cancelada"
  notas?: string
  created_at: string
  updated_at: string
}
