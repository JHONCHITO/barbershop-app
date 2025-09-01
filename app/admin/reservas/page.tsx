// app/admin/reservas/page.tsx
"use client";
import Reservas from "@/components/reservas";

export default function AdminReservasPage() {
  return <Reservas isAdmin />;   // <-- aquí va isAdmin
}
