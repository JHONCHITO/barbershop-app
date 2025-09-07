// components/sidebar.tsx (ejemplo simplificado)
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (s: any) => void;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "reservas", label: "Reservas" },
    { id: "calendario", label: "Calendario" },
    { id: "barberos", label: "Barberos" },
    { id: "servicios", label: "Servicios" },
    { id: "clientes", label: "Clientes" },
    { id: "reportes", label: "Reportes" },
    { id: "configuracion", label: "Configuración" },
  ];

  return (
    <>
      {/* botón móvil */}
      <button
        className="md:hidden p-3 border m-2 rounded-lg"
        onClick={() => setOpen(v => !v)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* sidebar fijo en desktop */}
      <aside className="hidden md:block w-64 shrink-0 border-r min-h-[100dvh] p-4">
        <nav className="space-y-1">
          {items.map(it => (
            <button
              key={it.id}
              onClick={() => setActiveSection(it.id as any)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg hover:bg-accent",
                activeSection === it.id && "bg-accent"
              )}
            >
              {it.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* drawer móvil */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-background border-r p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {items.map(it => (
                <button
                  key={it.id}
                  onClick={() => { setActiveSection(it.id as any); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg hover:bg-accent",
                    activeSection === it.id && "bg-accent"
                  )}
                >
                  {it.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
