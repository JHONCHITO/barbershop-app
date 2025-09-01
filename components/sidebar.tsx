"use client";

import * as React from "react";
import {
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Users,
  Wrench,
  BarChart3,
  NotebookPen,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

// 👇 Usa el mismo union de secciones que en page.tsx
export type Section =
  | "dashboard"
  | "reservas"
  | "calendario"
  | "barberos"
  | "servicios"
  | "clientes"
  | "reportes"
  | "configuracion";

type SidebarProps = {
  activeSection: Section;
  // 👇 Acepta el setter de React (esto resuelve tu error)
  setActiveSection: React.Dispatch<React.SetStateAction<Section>>;
};

type Item = {
  key: Section;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const items: Readonly<Item[]> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { key: "reservas", label: "Reservas", icon: NotebookPen },
  { key: "calendario", label: "Calendario", icon: CalendarDays },
  { key: "barberos", label: "Barberos", icon: Scissors },
  { key: "servicios", label: "Servicios", icon: Wrench },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "reportes", label: "Reportes", icon: BarChart3, adminOnly: true },
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { role, logout } = useAuth() as any;

  return (
    <aside className="w-64 shrink-0 border-r bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 flex flex-col">
      <div className="px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
            BP
          </div>
          <div className="leading-tight">
            <p className="text-sm text-muted-foreground">BarberPro</p>
            <p className="text-base font-semibold">Gestión Profesional</p>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {items
          .filter((it) => (it.adminOnly ? role === "admin" : true))
          .map((it) => {
            const Icon = it.icon;
            const active = activeSection === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setActiveSection(it.key)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200"
                    : "hover:bg-muted"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-emerald-600" : "text-muted-foreground")} />
                <span className="font-medium">{it.label}</span>
                {it.adminOnly && (
                  <span className="ml-auto text-[10px] rounded bg-amber-100 text-amber-800 px-1.5 py-0.5">Admin</span>
                )}
              </button>
            );
          })}
      </nav>

      <div className="mt-auto p-3 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => typeof logout === "function" && logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
