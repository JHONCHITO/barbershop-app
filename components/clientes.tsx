"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar, Star, Save, X } from "lucide-react"

export function Clientes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingClient, setEditingClient] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan@email.com",
      telefono: "+57 300 123 4567",
      fechaRegistro: "2023-06-15",
      ultimaVisita: "2024-01-10",
      totalVisitas: 15,
      gastoTotal: 1200000,
      servicioFavorito: "Corte + Barba",
      barberoFavorito: "Carlos Ruiz",
      rating: 5,
      notas: "Cliente regular, muy puntual",
      estado: "activo",
      avatar: "/hombre-cliente.png",
      direccion: "Calle 123 #45-67, Bogotá",
      fechaNacimiento: "1985-03-15",
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria@email.com",
      telefono: "+57 300 789 0123",
      fechaRegistro: "2023-08-22",
      ultimaVisita: "2024-01-12",
      totalVisitas: 8,
      gastoTotal: 240000,
      servicioFavorito: "Corte Mujer",
      barberoFavorito: "Ana López",
      rating: 5,
      notas: "Prefiere citas por la mañana",
      estado: "activo",
      avatar: "/woman-client.png",
      direccion: "Calle 456 #78-90, Bogotá",
      fechaNacimiento: "1990-05-20",
    },
    {
      id: 3,
      nombre: "Luis Rodríguez",
      email: "luis@email.com",
      telefono: "+57 300 345 6789",
      fechaRegistro: "2023-03-10",
      ultimaVisita: "2023-12-20",
      totalVisitas: 22,
      gastoTotal: 550000,
      servicioFavorito: "Barba",
      barberoFavorito: "Carlos Ruiz",
      rating: 4,
      notas: "Cliente VIP, descuento especial",
      estado: "vip",
      avatar: "/senior-client.png",
      direccion: "Calle 789 #01-23, Bogotá",
      fechaNacimiento: "1975-10-10",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana@email.com",
      telefono: "+57 300 901 2345",
      fechaRegistro: "2023-11-05",
      ultimaVisita: "2023-11-05",
      totalVisitas: 1,
      gastoTotal: 30000,
      servicioFavorito: "Corte Mujer",
      barberoFavorito: "Ana López",
      rating: 5,
      notas: "Cliente nueva",
      estado: "nuevo",
      avatar: "/joven-cliente.png",
      direccion: "Calle 012 #34-56, Bogotá",
      fechaNacimiento: "2000-01-01",
    },
  ])

  const [newClient, setNewClient] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    notas: "",
    estado: "nuevo",
  })

  const updateClient = (id: number, field: string, value: any) => {
    setClientes((prev) => prev.map((cliente) => (cliente.id === id ? { ...cliente, [field]: value } : cliente)))
  }

  const addNewClient = () => {
    if (newClient.nombre && newClient.email && newClient.telefono) {
      const newId = Math.max(...clientes.map((c) => c.id)) + 1
      setClientes((prev) => [
        ...prev,
        {
          ...newClient,
          id: newId,
          fechaRegistro: new Date().toISOString().split("T")[0],
          ultimaVisita: new Date().toISOString().split("T")[0],
          totalVisitas: 0,
          gastoTotal: 0,
          servicioFavorito: "",
          barberoFavorito: "",
          rating: 5,
          avatar: "",
        },
      ])
      setNewClient({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        fechaNacimiento: "",
        notas: "",
        estado: "nuevo",
      })
      setIsDialogOpen(false)
    }
  }

  const deleteClient = (id: number) => {
    setClientes((prev) => prev.filter((cliente) => cliente.id !== id))
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "vip":
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
      case "nuevo":
        return <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
      case "inactivo":
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu base de clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del cliente"
                  value={newClient.nombre}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="+57 300 123 4567"
                  value={newClient.telefono}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, telefono: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Dirección completa"
                  value={newClient.direccion}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, direccion: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  placeholder="Notas sobre el cliente..."
                  value={newClient.notas}
                  onChange={(e) => setNewClient((prev) => ({ ...prev, notas: e.target.value }))}
                />
              </div>
              <Button className="w-full" onClick={addNewClient}>
                Agregar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{clientes.length}</div>
            <p className="text-sm text-muted-foreground">Total Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter((c) => c.estado === "activo").length}
            </div>
            <p className="text-sm text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {clientes.filter((c) => c.estado === "vip").length}
            </div>
            <p className="text-sm text-muted-foreground">VIP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {clientes.filter((c) => c.estado === "nuevo").length}
            </div>
            <p className="text-sm text-muted-foreground">Nuevos</p>
          </CardContent>
        </Card>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={cliente.avatar || "/placeholder.svg"} alt={cliente.nombre} />
                    <AvatarFallback>
                      {cliente.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {editingClient === cliente.id ? (
                        <Input
                          value={cliente.nombre}
                          onChange={(e) => updateClient(cliente.id, "nombre", e.target.value)}
                          className="text-lg font-semibold"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold">{cliente.nombre}</h3>
                      )}
                      {getEstadoBadge(cliente.estado)}
                      <div className="flex items-center">{renderStars(cliente.rating)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {editingClient === cliente.id ? (
                            <Input
                              value={cliente.telefono}
                              onChange={(e) => updateClient(cliente.id, "telefono", e.target.value)}
                              className="text-sm"
                            />
                          ) : (
                            cliente.telefono
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {editingClient === cliente.id ? (
                            <Input
                              value={cliente.email}
                              onChange={(e) => updateClient(cliente.id, "email", e.target.value)}
                              className="text-sm"
                            />
                          ) : (
                            cliente.email
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Visitas:</span> {cliente.totalVisitas}
                        </p>
                        <p>
                          <span className="font-medium">Gasto total:</span> $
                          {cliente.gastoTotal.toLocaleString("es-CO")}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          <span className="font-medium">Servicio favorito:</span> {cliente.servicioFavorito}
                        </p>
                        <p>
                          <span className="font-medium">Barbero favorito:</span> {cliente.barberoFavorito}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Registro: {new Date(cliente.fechaRegistro).toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Última visita: {new Date(cliente.ultimaVisita).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                    </div>

                    {cliente.notas && (
                      <p className="mt-2 text-sm text-muted-foreground italic">Nota: {cliente.notas}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingClient === cliente.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditingClient(null)}>
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingClient(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditingClient(cliente.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteClient(cliente.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
