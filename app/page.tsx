"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Login } from "@/components/login"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { Reservas } from "@/components/reservas"
import { Calendario } from "@/components/calendario"
import { Barberos } from "@/components/barberos"
import { Servicios } from "@/components/servicios"
import { Clientes } from "@/components/clientes"
import { Reportes } from "@/components/reportes"
import { Configuracion } from "@/components/configuracion"

export default function Home() {
  const [activeSection, setActiveSection] = useState("reservas")
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (user?.role === "admin") {
      setActiveSection("dashboard")
    } else {
      setActiveSection("reservas")
    }
  }, [user])

  if (!isAuthenticated) {
    return <Login />
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return user?.role === "admin" ? <Dashboard /> : <Reservas />
      case "reservas":
        return <Reservas />
      case "calendario":
        return <Calendario />
      case "barberos":
        return <Barberos />
      case "servicios":
        return <Servicios />
      case "clientes":
        return <Clientes />
      case "reportes":
        return user?.role === "admin" ? <Reportes /> : <Reservas />
      case "configuracion":
        return user?.role === "admin" ? <Configuracion /> : <Reservas />
      default:
        return user?.role === "admin" ? <Dashboard /> : <Reservas />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
