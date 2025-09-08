// lib/api/reservas.ts
import type { Reserva } from "@/types/reserva";

export async function listReservas(): Promise<Reserva[]> {
  const res = await fetch("/api/reservas", { cache: "no-store" });
  const json = await res.json().catch(() => ({}));

  // Si el server manda { ok, data }, tómalo; si manda un array plano, úsalo;
  // si no, devuelve [] para no romper la UI.
  const data = Array.isArray(json) ? json : json?.data;

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || `HTTP ${res.status}`);
  }

  return Array.isArray(data) ? (data as Reserva[]) : [];
}

export async function createReserva(payload: Partial<Reserva>) {
  const res = await fetch("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || `HTTP ${res.status}`);
  }

  // devuelve el objeto creado si viene en json.data, o el json plain
  return json?.data ?? json;
}
