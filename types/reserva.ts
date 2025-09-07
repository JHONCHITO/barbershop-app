// /types/reserva.ts
import type { ObjectId } from "mongodb";

export type EstadoReserva = "pendiente-barbero" | "pendiente-cliente" | "confirmada" | "cancelada" | "completada";
export type Prioridad = "alta" | "normal";
export type BarberiaID = "principal" | "norte" | "sur"; // ajusta si tienes más

export interface ServicioPersonalizado {
  opciones: string[];
  extras: string[];
}

export interface ReservaDoc {
  _id?: ObjectId; // <-- IMPORTANTE: _id es ObjectId en Mongo
  cliente: string;
  telefono: string;
  email: string;
  servicio: string;
  servicioPersonalizado: ServicioPersonalizado;
  barbero: string;
  barberia: BarberiaID;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  duracion: number;
  estado: EstadoReserva;
  notas: string;
  notificaciones: string[];
  modificable: boolean;
  prioridad: Prioridad;
}

// Lo que expones a la UI:
export interface ReservaAPI extends Omit<ReservaDoc, "_id"> {
  id: string;
}
