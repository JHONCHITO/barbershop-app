"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Clock, DollarSign, Scissors, Save, X } from "lucide-react"

export function Servicios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("todos")
  const [editingService, setEditingService] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [servicios, setServicios] = useState([
    {
      id: 1,
      nombre: "Corte Clásico Hombre",
      descripcion: "Corte tradicional con tijeras y máquina",
      precio: 80000,
      duracion: 30,
      categoria: "corte",
      activo: true,
      popularidad: 95,
    },
    {
      id: 2,
      nombre: "Corte + Barba",
      descripcion: "Corte completo con arreglo de barba",
      precio: 100000,
      duracion: 45,
      categoria: "combo",
      activo: true,
      popularidad: 88,
    },
    {
      id: 3,
      nombre: "Barba Completa",
      descripcion: "Arreglo y perfilado de barba",
      precio: 60000,
      duracion: 20,
      categoria: "barba",
      activo: true,
      popularidad: 75,
    },
    {
      id: 4,
      nombre: "Corte Cabello Dama",
      descripcion: "Corte y peinado profesional para mujeres",
      precio: 140000,
      duracion: 60,
      categoria: "corte",
      activo: true,
      popularidad: 82,
    },
    {
      id: 5,
      nombre: "Afeitado Clásico",
      descripcion: "Afeitado tradicional con navaja",
      precio: 72000,
      duracion: 25,
      categoria: "barba",
      activo: true,
      popularidad: 65,
    },
    {
      id: 6,
      nombre: "Tratamiento Capilar",
      descripcion: "Tratamiento nutritivo para el cabello",
      precio: 140000,
      duracion: 40,
      categoria: "tratamiento",
      activo: false,
      popularidad: 45,
    },
  ])

  const [newService, setNewService] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    duracion: 0,
    categoria: "",
    activo: true,
  })

  const categorias = [
    { value: "todos", label: "Todos" },
    { value: "corte", label: "Cortes" },
    { value: "barba", label: "Barba" },
    { value: "combo", label: "Combos" },
    { value: "tratamiento", label: "Tratamientos" },
  ]

  const updateService = (id: number, field: string, value: any) => {
    setServicios((prev) => prev.map((servicio) => (servicio.id === id ? { ...servicio, [field]: value } : servicio)))
  }

  const addNewService = () => {
    if (newService.nombre && newService.categoria) {
      const newId = Math.max(...servicios.map((s) => s.id)) + 1
      setServicios((prev) => [
        ...prev,
        {
          ...newService,
          id: newId,
          popularidad: 50,
        },
      ])
      setNewService({
        nombre: "",
        descripcion: "",
        precio: 0,
        duracion: 0,
        categoria: "",
        activo: true,
      })
      setIsDialogOpen(false)
    }
  }

  const deleteService = (id: number) => {
    setServicios((prev) => prev.filter((servicio) => servicio.id !== id))
  }

  const getCategoryBadge = (categoria: string) => {
    const colors = {
      corte: "bg-blue-100 text-blue-800",
      barba: "bg-green-100 text-green-800",
      combo: "bg-purple-100 text-purple-800",
      tratamiento: "bg-orange-100 text-orange-800",
    }
    return (
      <Badge className={colors[categoria as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
      </Badge>
    )
  }

  const getPopularityBadge = (popularidad: number) => {
    if (popularidad >= 80) return <Badge className="bg-green-100 text-green-800">Popular</Badge>
    if (popularidad >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Moderado</Badge>
    return <Badge className="bg-red-100 text-red-800">Bajo</Badge>
  }

  const filteredServicios = servicios.filter((servicio) => {
    const matchesSearch =
      servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "todos" || servicio.categoria === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios de tu barbería</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Servicio</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Corte Cabello Dama"
                  value={newService.nombre}
                  onChange={(e) => setNewService((prev) => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del servicio"
                  value={newService.descripcion}
                  onChange={(e) => setNewService((prev) => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="precio">Precio (COP)</Label>
                  <Input
                    id="precio"
                    type="number"
                    placeholder="80000"
                    value={newService.precio || ""}
                    onChange={(e) => setNewService((prev) => ({ ...prev, precio: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duracion">Duración (min)</Label>
                  <Input
                    id="duracion"
                    type="number"
                    placeholder="30"
                    value={newService.duracion || ""}
                    onChange={(e) => setNewService((prev) => ({ ...prev, duracion: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={newService.categoria}
                  onValueChange={(value) => setNewService((prev) => ({ ...prev, categoria: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corte">Corte</SelectItem>
                    <SelectItem value="barba">Barba</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                    <SelectItem value="tratamiento">Tratamiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={newService.activo}
                  onCheckedChange={(checked) => setNewService((prev) => ({ ...prev, activo: checked }))}
                />
                <Label htmlFor="activo">Servicio activo</Label>
              </div>
              <Button className="w-full" onClick={addNewService}>
                Crear Servicio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => (
          <Card key={servicio.id} className={!servicio.activo ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    {editingService === servicio.id ? (
                      <Input
                        value={servicio.nombre}
                        onChange={(e) => updateService(servicio.id, "nombre", e.target.value)}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                    )}
                    {editingService === servicio.id ? (
                      <Textarea
                        value={servicio.descripcion}
                        onChange={(e) => updateService(servicio.id, "descripcion", e.target.value)}
                        className="text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{servicio.descripcion}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!servicio.activo && <Badge variant="secondary">Inactivo</Badge>}
                  <Switch
                    checked={servicio.activo}
                    onCheckedChange={(checked) => updateService(servicio.id, "activo", checked)}
                    size="sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {editingService === servicio.id ? (
                  <Select
                    value={servicio.categoria}
                    onValueChange={(value) => updateService(servicio.id, "categoria", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corte">Corte</SelectItem>
                      <SelectItem value="barba">Barba</SelectItem>
                      <SelectItem value="combo">Combo</SelectItem>
                      <SelectItem value="tratamiento">Tratamiento</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getCategoryBadge(servicio.categoria)
                )}
                {getPopularityBadge(servicio.popularidad)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  {editingService === servicio.id ? (
                    <Input
                      type="number"
                      value={servicio.precio}
                      onChange={(e) => updateService(servicio.id, "precio", Number(e.target.value))}
                      className="text-xl font-bold text-primary w-24"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">${servicio.precio.toLocaleString("es-CO")}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {editingService === servicio.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={servicio.duracion}
                        onChange={(e) => updateService(servicio.id, "duracion", Number(e.target.value))}
                        className="w-16"
                      />
                      <span className="text-sm">min</span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold">{servicio.duracion} min</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Popularidad</span>
                  <span>{servicio.popularidad}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${servicio.popularidad}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {editingService === servicio.id ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setEditingService(null)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingService(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setEditingService(servicio.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteService(servicio.id)}>
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
