"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"

export function Dashboard() {
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = [
    {
      title: "Citas Hoy",
      value: "12",
      change: "+2 desde ayer",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Ingresos del Día",
      value: "$1,250",
      change: "+15% vs ayer",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Clientes Activos",
      value: "89",
      change: "+5 esta semana",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Satisfacción",
      value: "4.8/5",
      change: "Excelente",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const proximasCitas = [
    {
      id: 1,
      cliente: "Juan Pérez",
      servicio: "Corte + Barba",
      hora: "10:00",
      barbero: "Carlos",
      estado: "confirmada",
    },
    {
      id: 2,
      cliente: "María García",
      servicio: "Corte Mujer",
      hora: "10:30",
      barbero: "Ana",
      estado: "pendiente",
    },
    {
      id: 3,
      cliente: "Luis Rodríguez",
      servicio: "Barba",
      hora: "11:00",
      barbero: "Carlos",
      estado: "confirmada",
    },
    {
      id: 4,
      cliente: "Ana Martínez",
      servicio: "Corte + Peinado",
      hora: "11:30",
      barbero: "Ana",
      estado: "cancelada",
    },
  ]

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        )
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "cancelada":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu barbería hoy</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Logo de la Barbería
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="logo-upload" className="text-sm font-medium">
                Subir Logo
              </Label>
              <div className="mt-2">
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {logo ? (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Logo de la barbería"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Próximas Citas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximasCitas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cita.cliente}</h3>
                    <p className="text-sm text-muted-foreground">{cita.servicio}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{cita.hora}</p>
                    <p className="text-sm text-muted-foreground">{cita.barbero}</p>
                  </div>
                  {getEstadoBadge(cita.estado)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
