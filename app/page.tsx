// app/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

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

export const dynamic = "force-dynamic";

type BarberiaIDView = "principal" | "norte" | "sur" | "todas";
type Section =
  | "dashboard" | "reservas" | "calendario" | "barberos"
  | "servicios" | "clientes" | "reportes" | "configuracion";

function HomeCore() {
  const { isAuthenticated, user, role } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("reservas");

  const search = useSearchParams();
  const qsSection = (search.get("section") as Section | null) ?? undefined;
  const preselectBarbero = search.get("barbero") ?? undefined;
  const preselectBarberia = (search.get("barberia") as BarberiaIDView | null) ?? undefined;

  useEffect(() => {
    if (qsSection) setActiveSection(qsSection);
    else setActiveSection((user?.role === "admin" ? "dashboard" : "reservas") as Section);
  }, [user, qsSection]);

  if (!isAuthenticated) return <Login />;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return role === "admin"
          ? <Dashboard />
          : <Reservas preselectBarbero={preselectBarbero} preselectBarberia={preselectBarberia} isAdmin={false} />;
      case "reservas":
        return <Reservas
          preselectBarbero={preselectBarbero}
          preselectBarberia={preselectBarberia}
          isAdmin={role === "admin"}
        />;
      case "calendario":
        return <Calendario />;
      case "barberos":
        return <Barberos />;
      case "servicios":
        return <Servicios />;
      case "clientes":
        return <Clientes />;
      case "reportes":
        return role === "admin" ? <Reportes /> : <Reservas isAdmin={false} />;
      case "configuracion":
        return role === "admin" ? <Configuracion /> : <Reservas isAdmin={false} />;
      default:
        return role === "admin" ? <Dashboard /> : <Reservas isAdmin={false} />;
    }
  };

  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="page-container py-4 sm:py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6">Cargando…</div>}>
      <HomeCore />
    </Suspense>
  );
}
