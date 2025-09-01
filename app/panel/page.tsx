// app/panel/page.tsx
"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

// ✅ imports correctos (default vs named)
import Login from "@/components/login";
import Reservas from "@/components/reservas";
import { Barberos } from "@/components/barberos";

import { Sidebar } from "@/components/sidebar";
import { Dashboard } from "@/components/dashboard";
import { Calendario } from "@/components/calendario";
import { Servicios } from "@/components/servicios";
import { Clientes } from "@/components/clientes";
import { Reportes } from "@/components/reportes";
import { Configuracion } from "@/components/configuracion";

// Evita SSG/ISR cuando hay uso de search params
export const dynamic = "force-dynamic"; // alternativamente: export const revalidate = 0;

type BarberiaIDView = "principal" | "norte" | "sur" | "todas";
type Section =
  | "dashboard"
  | "reservas"
  | "calendario"
  | "barberos"
  | "servicios"
  | "clientes"
  | "reportes"
  | "configuracion";

// --- Componente con la lógica que usa useSearchParams, envuelto en Suspense ---
function PanelCore() {
  const { isAuthenticated, user, role } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("reservas");

  // Lee querystring (?section=reservas&barbero=...&barberia=...)
  const search = useSearchParams();
  const qsSection = (search.get("section") as Section | null) ?? undefined;
  const preselectBarbero = search.get("barbero") ?? undefined;
  const preselectBarberia = (search.get("barberia") as BarberiaIDView | null) ?? undefined;

  useEffect(() => {
    if (qsSection) {
      setActiveSection(qsSection);
    } else {
      setActiveSection((user?.role === "admin" ? "dashboard" : "reservas") as Section);
    }
  }, [user, qsSection]);

  if (!isAuthenticated) return <Login />;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return role === "admin" ? (
          <Dashboard />
        ) : (
          <Reservas preselectBarbero={preselectBarbero} preselectBarberia={preselectBarberia} />
        );
      case "reservas":
        return <Reservas preselectBarbero={preselectBarbero} preselectBarberia={preselectBarberia} />;
      case "calendario":
        return <Calendario />;
      case "barberos":
        return <Barberos />; // (El componente ya bloquea edición si role !== "admin")
      case "servicios":
        return <Servicios />;
      case "clientes":
        return <Clientes />;
      case "reportes":
        return role === "admin" ? <Reportes /> : <Reservas />;
      case "configuracion":
        return role === "admin" ? <Configuracion /> : <Reservas />;
      default:
        return role === "admin" ? <Dashboard /> : <Reservas />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}

// --- Página: solo actúa como boundary de Suspense ---
export default function Panel() {
  return (
    <Suspense fallback={<div className="p-6">Cargando panel…</div>}>
      <PanelCore />
    </Suspense>
  );
}
