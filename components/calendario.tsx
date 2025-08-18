"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Plus, Clock, User, Scissors, CheckCircle, XCircle } from "lucide-react"

export function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newCita, setNewCita] = useState({
    cliente: "",
    telefono: "",
    servicio: "",
    barbero: "",
    fecha: "",
    hora: "",
    notas: "",
    duracion: 30,
  })

  const [citas, setCitas] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      telefono: "+34 666 111 222",
      servicio: "Corte + Barba",
      hora: "10:00",
      barbero: "Carlos",
      fecha: "2024-01-15",
      estado: "confirmada",
      duracion: 45,
      notas: "Cliente regular, prefiere corte clásico",
    },
    {
      id: 2,
      cliente: "María García",
      telefono: "+34 666 333 444",
      servicio: "Corte Cabello Dama",
      hora: "10:30",
      barbero: "Ana",
      fecha: "2024-01-15",
      estado: "pendiente",
      duracion: 60,
      notas: "Primera vez, consultar preferencias",
    },
    {
      id: 3,
      cliente: "Luis Rodríguez",
      telefono: "+34 666 555 666",
      servicio: "Barba",
      hora: "11:00",
      barbero: "Carlos",
      fecha: "2024-01-15",
      estado: "confirmada",
      duracion: 20,
      notas: "",
    },
  ])

  const barberos = ["Carlos", "Ana", "Miguel"]
  const servicios = [
    { nombre: "Corte Clásico Hombre", duracion: 30 },
    { nombre: "Corte Cabello Dama", duracion: 60 },
    { nombre: "Corte + Barba", duracion: 45 },
    { nombre: "Barba Completa", duracion: 20 },
    { nombre: "Afeitado Clásico", duracion: 25 },
    { nombre: "Tratamiento Capilar", duracion: 40 },
  ]

  const horarios = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ]

  const checkAvailability = (fecha: string, hora: string, barbero: string, duracion: number) => {
    const citasDelDia = citas.filter((cita) => cita.fecha === fecha && cita.barbero === barbero)

    const horaInicio = Number.parseInt(hora.split(":")[0]) * 60 + Number.parseInt(hora.split(":")[1])
    const horaFin = horaInicio + duracion

    for (const cita of citasDelDia) {
      const citaInicio = Number.parseInt(cita.hora.split(":")[0]) * 60 + Number.parseInt(cita.hora.split(":")[1])
      const citaFin = citaInicio + cita.duracion

      if (
        (horaInicio >= citaInicio && horaInicio < citaFin) ||
        (horaFin > citaInicio && horaFin <= citaFin) ||
        (horaInicio <= citaInicio && horaFin >= citaFin)
      ) {
        return false
      }
    }
    return true
  }

  const createCita = () => {
    if (newCita.cliente && newCita.servicio && newCita.barbero && newCita.fecha && newCita.hora) {
      const servicio = servicios.find((s) => s.nombre === newCita.servicio)
      const duracion = servicio?.duracion || 30

      if (checkAvailability(newCita.fecha, newCita.hora, newCita.barbero, duracion)) {
        const newId = Math.max(...citas.map((c) => c.id)) + 1
        setCitas((prev) => [
          ...prev,
          {
            ...newCita,
            id: newId,
            estado: "pendiente",
            duracion,
          },
        ])
        setNewCita({
          cliente: "",
          telefono: "",
          servicio: "",
          barbero: "",
          fecha: "",
          hora: "",
          notas: "",
          duracion: 30,
        })
        setIsDialogOpen(false)
      } else {
        alert("El horario no está disponible para este barbero")
      }
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getCitasForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return citas.filter((cita) => cita.fecha === dateStr)
  }

  const getCitaForHour = (hora: string, barbero?: string) => {
    const dateStr = formatDate(selectedDate)
    return citas.find((cita) => cita.fecha === dateStr && cita.hora === hora && (!barbero || cita.barbero === barbero))
  }

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
            <Clock className="w-3 h-3 mr-1" />
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

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getAvailabilityForAllBarbers = (fecha: string, hora: string, duracion: number) => {
    return barberos.map((barbero) => ({
      barbero,
      disponible: checkAvailability(fecha, hora, barbero, duracion),
    }))
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">Gestiona citas y disponibilidad</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: "month" | "week" | "day") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      placeholder="Nombre del cliente"
                      value={newCita.cliente}
                      onChange={(e) => setNewCita((prev) => ({ ...prev, cliente: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      placeholder="+34 666 123 456"
                      value={newCita.telefono}
                      onChange={(e) => setNewCita((prev) => ({ ...prev, telefono: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="servicio">Servicio</Label>
                  <Select
                    value={newCita.servicio}
                    onValueChange={(value) => setNewCita((prev) => ({ ...prev, servicio: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicios.map((servicio) => (
                        <SelectItem key={servicio.nombre} value={servicio.nombre}>
                          {servicio.nombre} ({servicio.duracion} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="barbero">Barbero</Label>
                  <Select
                    value={newCita.barbero}
                    onValueChange={(value) => setNewCita((prev) => ({ ...prev, barbero: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un barbero" />
                    </SelectTrigger>
                    <SelectContent>
                      {barberos.map((barbero) => (
                        <SelectItem key={barbero} value={barbero}>
                          {barbero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={newCita.fecha}
                      onChange={(e) => setNewCita((prev) => ({ ...prev, fecha: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora">Hora</Label>
                    <Select
                      value={newCita.hora}
                      onValueChange={(value) => setNewCita((prev) => ({ ...prev, hora: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {horarios.map((hora) => {
                          const servicio = servicios.find((s) => s.nombre === newCita.servicio)
                          const duracion = servicio?.duracion || 30

                          let disponible = true
                          let textoDisponibilidad = ""

                          if (newCita.fecha && newCita.barbero) {
                            disponible = checkAvailability(newCita.fecha, hora, newCita.barbero, duracion)
                            textoDisponibilidad = disponible ? "" : " (Ocupado)"
                          } else if (newCita.fecha) {
                            const availability = getAvailabilityForAllBarbers(newCita.fecha, hora, duracion)
                            const disponibles = availability.filter((a) => a.disponible).length
                            textoDisponibilidad =
                              disponibles > 0 ? ` (${disponibles} disponibles)` : " (Todos ocupados)"
                            disponible = disponibles > 0
                          }

                          return (
                            <SelectItem
                              key={hora}
                              value={hora}
                              disabled={!disponible}
                              className={!disponible ? "text-red-500" : ""}
                            >
                              {hora}
                              {textoDisponibilidad}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notas">Notas (opcional)</Label>
                  <Textarea
                    id="notas"
                    placeholder="Notas adicionales sobre la cita"
                    value={newCita.notas}
                    onChange={(e) => setNewCita((prev) => ({ ...prev, notas: e.target.value }))}
                  />
                </div>

                <Button className="w-full" onClick={createCita}>
                  Agendar Cita
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => {
                const citasDelDia = getCitasForDate(day.date)
                const isSelected = formatDate(day.date) === formatDate(selectedDate)
                const isToday = formatDate(day.date) === formatDate(new Date())

                return (
                  <div
                    key={index}
                    className={`
                      p-2 min-h-[80px] border rounded cursor-pointer transition-colors
                      ${day.isCurrentMonth ? "bg-background" : "bg-muted/50"}
                      ${isSelected ? "bg-primary/10 border-primary" : "border-border"}
                      ${isToday ? "ring-2 ring-primary/20" : ""}
                      hover:bg-muted/50
                    `}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className={`text-sm ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1 mt-1">
                      {citasDelDia.slice(0, 2).map((cita) => (
                        <div key={cita.id} className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded truncate">
                          {cita.hora} {cita.cliente}
                        </div>
                      ))}
                      {citasDelDia.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{citasDelDia.length - 2} más</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vista del día seleccionado */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {horarios.map((hora) => {
                const cita = getCitaForHour(hora)
                return (
                  <div key={hora} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{hora}</div>
                      {cita && getEstadoBadge(cita.estado)}
                    </div>
                    {cita ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{cita.cliente}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{cita.servicio}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {cita.duracion} min - {cita.barbero}
                          </span>
                        </div>
                        {cita.telefono && <div className="text-xs text-muted-foreground">📞 {cita.telefono}</div>}
                        {cita.notas && (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{cita.notas}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Disponible</div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
