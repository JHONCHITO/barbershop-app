// components/back-floating.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

type Section =
  | "dashboard"
  | "reservas"
  | "calendario"
  | "barberos"
  | "servicios"
  | "clientes"
  | "reportes"
  | "configuracion";

export default function BackFloating({
  inicioSection = "reservas",
  className = "",
}: {
  inicioSection?: Section;
  className?: string;
}) {
  const router = useRouter();

  const goBack = () => router.back();
  const goInicio = () => router.push(`/?section=${inicioSection}`);

  return (
    <div
      className={
        // contenedor flotante
        "fixed z-50 left-4 bottom-4 sm:left-6 sm:bottom-6 flex items-center gap-2 " +
        className
      }
    >
      {/* Botón Atrás (glass) */}
      <button
        type="button"
        onClick={goBack}
        className={
          "glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border " +
          "transition hover:brightness-110 active:translate-y-[1px]"
        }
        aria-label="Volver atrás"
        title="Volver atrás"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Atrás</span>
      </button>

      {/* Botón Inicio (neón) */}
      <button
        type="button"
        onClick={goInicio}
        className="btn-neon rounded-xl px-3 py-2 text-sm font-semibold"
        aria-label="Ir al inicio"
        title="Ir al inicio"
      >
        <Home className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Inicio</span>
      </button>
    </div>
  );
}
