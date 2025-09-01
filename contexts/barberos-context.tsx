"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type BarberiaID = "principal" | "norte" | "sur";
export type EstadoBarbero = "Activo" | "Descanso";

export type Barbero = {
  id: string;
  nombre: string;
  especialidad?: string;
  rating?: number;
  disponible?: boolean;
  whatsapp?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  horario?: string;
  especialidades?: string[];
  hoy?: number;
  semana?: number;
  experienciaAnios?: number;
  estado?: EstadoBarbero;
  avatar?: string;      // imagen que vive en /public
  biografia?: string;
};

type BarberosMap = Record<BarberiaID, Barbero[]>;

type Ctx = {
  barberos: BarberosMap;
  setBarberos: React.Dispatch<React.SetStateAction<BarberosMap>>;
  getBarberosDe: (id: BarberiaID) => Barbero[];
  upsertBarbero: (barberia: BarberiaID, payload: Barbero, originalId?: string) => void;
  eliminarBarbero: (barberia: BarberiaID, id: string) => void;
};

const BarberosContext = createContext<Ctx | undefined>(undefined);

/** IMPORTANTE: clave nueva para ignorar caches viejas de localStorage */
const STORAGE_KEY = "barberos:data:v2";

/** Rutas que SÍ existen en tu carpeta /public */
const AVATAR_M    = "/modern-barbershop-cut.png";
const AVATAR_F    = "/women-haircut-salon.png";
const AVATAR_ALT  = "/classic-barbershop-haircut.png";
const PLACEHOLDER = "/placeholder-user.jpg";

/** Datos demo iniciales con rutas válidas */
const initial: BarberosMap = {
  principal: [
    {
      id: "carlos",
      nombre: "Carlos Ruiz",
      especialidad: "Cortes clásicos",
      rating: 4.9,
      disponible: true,
      whatsapp: "+573001112222",
      email: "carlos@barberpro.com",
      telefono: "+34 666 111 222",
      direccion: "Calle Mayor 123, Madrid",
      horario: "09:00 - 18:00",
      especialidades: ["Corte Clásico", "Barba", "Afeitado"],
      hoy: 8,
      semana: 45,
      experienciaAnios: 8,
      estado: "Activo",
      avatar: AVATAR_M,
    },
    {
      id: "ana",
      nombre: "Ana López",
      especialidad: "Cortes modernos",
      rating: 4.8,
      disponible: true,
      whatsapp: "+573003334444",
      email: "ana@barberpro.com",
      telefono: "+34 666 333 444",
      direccion: "Avenida Libertad 45, Madrid",
      horario: "10:00 - 19:00",
      especialidades: ["Corte Mujer", "Peinados", "Tratamientos"],
      hoy: 6,
      semana: 38,
      experienciaAnios: 6,
      estado: "Activo",
      avatar: AVATAR_F,
    },
    {
      id: "miguel",
      nombre: "Miguel Torres",
      especialidad: "Barbas y color",
      rating: 4.7,
      disponible: false,
      whatsapp: "+573005556666",
      email: "miguel@barberpro.com",
      telefono: "+34 666 555 666",
      direccion: "Plaza Central 8, Madrid",
      horario: "11:00 - 20:00",
      especialidades: ["Corte Moderno", "Diseño", "Color"],
      hoy: 5,
      semana: 32,
      experienciaAnios: 4,
      estado: "Descanso",
      avatar: AVATAR_ALT,
    },
  ],
  norte: [
    {
      id: "pedro",
      nombre: "Pedro Sánchez",
      especialidad: "Degradados",
      rating: 4.6,
      disponible: true,
      whatsapp: "+573007778888",
      email: "pedro@barberpro.com",
      telefono: "+34 666 777 888",
      direccion: "Av. Norte 10",
      horario: "09:00 - 18:00",
      especialidades: ["Degradado", "Corte clásico"],
      hoy: 4,
      semana: 27,
      experienciaAnios: 5,
      estado: "Activo",
      avatar: PLACEHOLDER,
    },
    {
      id: "lucia",
      nombre: "Lucía Martín",
      especialidad: "Cortes femeninos",
      rating: 4.8,
      disponible: true,
      whatsapp: "+573009990000",
      email: "lucia@barberpro.com",
      telefono: "+34 666 999 000",
      direccion: "Av. Norte 12",
      horario: "10:00 - 19:00",
      especialidades: ["Corte Mujer", "Peinado"],
      hoy: 3,
      semana: 20,
      experienciaAnios: 3,
      estado: "Activo",
      avatar: PLACEHOLDER,
    },
  ],
  sur: [
    {
      id: "david",
      nombre: "David García",
      especialidad: "Estilos urbanos",
      rating: 4.5,
      disponible: true,
      whatsapp: "+573001113333",
      email: "david@barberpro.com",
      telefono: "+34 666 111 333",
      direccion: "Cll Sur 1",
      horario: "09:00 - 18:00",
      especialidades: ["Urban", "Fade"],
      hoy: 2,
      semana: 15,
      experienciaAnios: 2,
      estado: "Activo",
      avatar: PLACEHOLDER,
    },
    {
      id: "sofia",
      nombre: "Sofía Ruiz",
      especialidad: "Tratamientos",
      rating: 4.9,
      disponible: true,
      whatsapp: "+573005557777",
      email: "sofia@barberpro.com",
      telefono: "+34 666 555 777",
      direccion: "Cll Sur 2",
      horario: "10:00 - 19:00",
      especialidades: ["Tratamientos", "Peinados"],
      hoy: 3,
      semana: 22,
      experienciaAnios: 7,
      estado: "Activo",
      avatar: PLACEHOLDER,
    },
  ],
};

export function BarberosProvider({ children }: { children: ReactNode }) {
  const [barberos, setBarberos] = useState<BarberosMap>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BarberosMap) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(barberos));
    } catch {}
  }, [barberos]);

  const getBarberosDe = (id: BarberiaID) => barberos[id] || [];

  const upsertBarbero = (
    barberia: BarberiaID,
    payload: Barbero,
    originalId?: string
  ) => {
    setBarberos((prev) => {
      const current = prev[barberia] || [];
      const next = originalId
        ? current.map((b) => (b.id === originalId ? { ...payload } : b))
        : [...current, payload];
      return { ...prev, [barberia]: next };
    });
  };

  const eliminarBarbero = (barberia: BarberiaID, id: string) => {
    setBarberos((prev) => ({
      ...prev,
      [barberia]: (prev[barberia] || []).filter((b) => b.id !== id),
    }));
  };

  return (
    <BarberosContext.Provider
      value={{ barberos, setBarberos, getBarberosDe, upsertBarbero, eliminarBarbero }}
    >
      {children}
    </BarberosContext.Provider>
  );
}

export function useBarberos() {
  const ctx = useContext(BarberosContext);
  if (!ctx) throw new Error("useBarberos must be used within a BarberosProvider");
  return ctx;
}
