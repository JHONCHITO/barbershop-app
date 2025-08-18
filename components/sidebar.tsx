"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Users, Scissors, UserCheck, BarChart3, Settings, Clock, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const adminMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "reservas", label: "Reservas", icon: Clock },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "barberos", label: "Barberos", icon: Users },
  { id: "servicios", label: "Servicios", icon: Scissors },
  { id: "clientes", label: "Clientes", icon: UserCheck },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "configuracion", label: "Configuración", icon: Settings },
]

const clienteMenuItems = [
  { id: "reservas", label: "Reservas", icon: Clock },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "barberos", label: "Barberos", icon: Users },
  { id: "servicios", label: "Servicios", icon: Scissors },
]

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { user, logout } = useAuth()

  const menuItems = user?.role === "admin" ? adminMenuItems : clienteMenuItems

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-4 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-foreground">BarberPro</h1>
        <p className="text-sm text-muted-foreground">Gestión Profesional</p>
        <div className="mt-2 px-2 py-1 bg-purple-100 rounded-md">
          <p className="text-xs font-medium text-purple-800">{user?.role === "admin" ? "Administrador" : "Cliente"}</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
