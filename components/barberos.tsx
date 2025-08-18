"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Star, Phone, Mail, Calendar, Save, X, MapPin } from "lucide-react"

export function Barberos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBarbero, setEditingBarbero] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [barberos, setBarberos] = useState([
    {
      id: 1,
      nombre: "Carlos Ruiz",
      email: "carlos@barberpro.com",
      telefono: "+34 666 111 222",
      direccion: "Calle Mayor 123, Madrid",
      especialidades: ["Corte Clásico", "Barba", "Afeitado"],
      experiencia: "8 años",
      rating: 4.9,
      citasHoy: 8,
      citasSemana: 45,
      horarioInicio: "09:00",
      horarioFin: "18:00",
      estado: "activo",
      avatar: "/professional-male-barber.png",
      biografia: "Especialista en cortes clásicos con más de 8 años de experiencia",
      salario: 2500,
      comision: 15,
    },
    {
      id: 2,
      nombre: "Ana López",
      email: "ana@barberpro.com",
      telefono: "+34 666 333 444",
      direccion: "Avenida Libertad 45, Madrid",
      especialidades: ["Corte Mujer", "Peinados", "Tratamientos"],
      experiencia: "6 años",
      rating: 4.8,
      citasHoy: 6,
      citasSemana: 38,
      horarioInicio: "10:00",
      horarioFin: "19:00",
      estado: "activo",
      avatar: "/professional-female-barber.png",
      biografia: "Experta en cortes femeninos y tratamientos capilares",
      salario: 2200,
      comision: 12,
    },
    {
      id: 3,
      nombre: "Miguel Torres",
      email: "miguel@barberpro.com",
      telefono: "+34 666 555 666",
      direccion: "Plaza Central 8, Madrid",
      especialidades: ["Corte Moderno", "Diseño", "Color"],
      experiencia: "4 años",
      rating: 4.7,
      citasHoy: 5,
      citasSemana: 32,
      horarioInicio: "11:00",
      horarioFin: "20:00",
      estado: "descanso",
      avatar: "/joven-barbero-moderno.png",
      biografia: "Especialista en tendencias modernas y técnicas de color",
      salario: 2000,
      comision: 10,
    },
  ])

  const [newBarbero, setNewBarbero] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    especialidades: [] as string[],
    experiencia: "",
    horarioInicio: "09:00",
    horarioFin: "18:00",
    biografia: "",
    salario: 0,
    comision: 0,
  })

  const especialidadesDisponibles = [
    "Corte Clásico",
    "Corte Moderno",
    "Corte Mujer",
    "Barba",
    "Afeitado",
    "Peinados",
    "Tratamientos",
    "Diseño",
    "Color",
  ]

  const updateBarbero = (id: number, field: string, value: any) => {
    setBarberos((prev) => prev.map((barbero) => (barbero.id === id ? { ...barbero, [field]: value } : barbero)))
  }

  const addNewBarbero = () => {
    if (newBarbero.nombre && newBarbero.email) {
      const newId = Math.max(...barberos.map((b) => b.id)) + 1
      setBarberos((prev) => [
        ...prev,
        {
          ...newBarbero,
          id: newId,
          rating: 4.5,
          citasHoy: 0,
          citasSemana: 0,
          estado: "activo",
          avatar: "/placeholder.svg",
        },
      ])
      setNewBarbero({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        especialidades: [],
        experiencia: "",
        horarioInicio: "09:00",
        horarioFin: "18:00",
        biografia: "",
        salario: 0,
        comision: 0,
      })
      setIsDialogOpen(false)
    }
  }

  const deleteBarbero = (id: number) => {
    setBarberos((prev) => prev.filter((barbero) => barbero.id !== id))
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "descanso":
        return <Badge className="bg-yellow-100 text-yellow-800">Descanso</Badge>
      case "inactivo":
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const filteredBarberos = barberos.filter(
    (barbero) =>
      barbero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barbero.especialidades.some((esp) => esp.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Barberos</h1>
          <p className="text-muted-foreground">Gestiona tu equipo de profesionales</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Barbero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Barbero</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre del barbero"
                    value={newBarbero.nombre}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="barbero@email.com"
                    value={newBarbero.email}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    placeholder="+34 666 123 456"
                    value={newBarbero.telefono}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experiencia">Años de Experiencia</Label>
                  <Input
                    id="experiencia"
                    placeholder="5 años"
                    value={newBarbero.experiencia}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, experiencia: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Calle, número, ciudad"
                  value={newBarbero.direccion}
                  onChange={(e) => setNewBarbero((prev) => ({ ...prev, direccion: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horarioInicio">Horario Inicio</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={newBarbero.horarioInicio}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, horarioInicio: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="horarioFin">Horario Fin</Label>
                  <Input
                    id="horarioFin"
                    type="time"
                    value={newBarbero.horarioFin}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, horarioFin: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salario">Salario Base (€)</Label>
                  <Input
                    id="salario"
                    type="number"
                    placeholder="2000"
                    value={newBarbero.salario || ""}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, salario: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="comision">Comisión (%)</Label>
                  <Input
                    id="comision"
                    type="number"
                    placeholder="15"
                    value={newBarbero.comision || ""}
                    onChange={(e) => setNewBarbero((prev) => ({ ...prev, comision: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="biografia">Biografía</Label>
                <Textarea
                  id="biografia"
                  placeholder="Descripción profesional del barbero"
                  value={newBarbero.biografia}
                  onChange={(e) => setNewBarbero((prev) => ({ ...prev, biografia: e.target.value }))}
                />
              </div>

              <div>
                <Label>Especialidades</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {especialidadesDisponibles.map((esp) => (
                    <label key={esp} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={newBarbero.especialidades.includes(esp)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewBarbero((prev) => ({ ...prev, especialidades: [...prev.especialidades, esp] }))
                          } else {
                            setNewBarbero((prev) => ({
                              ...prev,
                              especialidades: prev.especialidades.filter((s) => s !== esp),
                            }))
                          }
                        }}
                      />
                      <span className="text-sm">{esp}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={addNewBarbero}>
                Agregar Barbero
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              placeholder="Buscar barberos por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Barberos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarberos.map((barbero) => (
          <Card key={barbero.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={barbero.avatar || "/placeholder.svg"} alt={barbero.nombre} />
                    <AvatarFallback>
                      {barbero.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {editingBarbero === barbero.id ? (
                      <Input
                        value={barbero.nombre}
                        onChange={(e) => updateBarbero(barbero.id, "nombre", e.target.value)}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <CardTitle className="text-lg">{barbero.nombre}</CardTitle>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{barbero.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getEstadoBadge(barbero.estado)}
                  {editingBarbero === barbero.id && (
                    <Select
                      value={barbero.estado}
                      onValueChange={(value) => updateBarbero(barbero.id, "estado", value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="descanso">Descanso</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {editingBarbero === barbero.id ? (
                    <Input
                      value={barbero.email}
                      onChange={(e) => updateBarbero(barbero.id, "email", e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span>{barbero.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {editingBarbero === barbero.id ? (
                    <Input
                      value={barbero.telefono}
                      onChange={(e) => updateBarbero(barbero.id, "telefono", e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span>{barbero.telefono}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {editingBarbero === barbero.id ? (
                    <Input
                      value={barbero.direccion}
                      onChange={(e) => updateBarbero(barbero.id, "direccion", e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span>{barbero.direccion}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {editingBarbero === barbero.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={barbero.horarioInicio}
                        onChange={(e) => updateBarbero(barbero.id, "horarioInicio", e.target.value)}
                        className="w-20"
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        value={barbero.horarioFin}
                        onChange={(e) => updateBarbero(barbero.id, "horarioFin", e.target.value)}
                        className="w-20"
                      />
                    </div>
                  ) : (
                    <span>
                      {barbero.horarioInicio} - {barbero.horarioFin}
                    </span>
                  )}
                </div>
              </div>

              {editingBarbero === barbero.id && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Salario (€)</Label>
                      <Input
                        type="number"
                        value={barbero.salario}
                        onChange={(e) => updateBarbero(barbero.id, "salario", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Comisión (%)</Label>
                      <Input
                        type="number"
                        value={barbero.comision}
                        onChange={(e) => updateBarbero(barbero.id, "comision", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Biografía</Label>
                    <Textarea
                      value={barbero.biografia}
                      onChange={(e) => updateBarbero(barbero.id, "biografia", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-1">
                  {barbero.especialidades.map((esp) => (
                    <Badge key={esp} variant="secondary" className="text-xs">
                      {esp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{barbero.citasHoy}</p>
                  <p className="text-xs text-muted-foreground">Hoy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{barbero.citasSemana}</p>
                  <p className="text-xs text-muted-foreground">Semana</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{barbero.experiencia}</p>
                  <p className="text-xs text-muted-foreground">Exp.</p>
                </div>
              </div>

              <div className="flex gap-2">
                {editingBarbero === barbero.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setEditingBarbero(null)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingBarbero(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setEditingBarbero(barbero.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteBarbero(barbero.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
