// types/reserva.ts
export interface Reserva {
  cliente: string;
  telefono: string;
  servicio: string;
  barbero: string;
  fecha: string;     // YYYY-MM-DD
  hora: string;      // HH:mm
  duracion: number;  // minutos
  barberia: string;
  estado?: "pendiente" | "confirmada" | "cancelada";
  createdAt?: Date;
}
