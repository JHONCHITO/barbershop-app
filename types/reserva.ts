// types/reserva.ts
export interface Reserva {
  cliente: string;
  telefono: string;
  email?: string;
  servicio: string;
  servicioPersonalizado?: { opciones: string[]; extras: string[] };
  barbero: string;
  barberia: string; // id de barbería (p.ej. "principal"|"norte"|etc.)
  fecha: string;    // YYYY-MM-DD
  hora: string;     // HH:mm
  duracion?: number;
  estado?: "pendiente-barbero" | "pendiente-cliente" | "confirmada" | "cancelada" | "completada";
  notas?: string;
  notificaciones?: string[];
  modificable?: boolean;
  prioridad?: "alta" | "normal";
  createdAt?: Date;
}
