// components/servicios.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// 🔁 quitamos Badge de shadcn para evitar choques de tipos
// import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Scissors,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

type Categoria = "corte" | "barba" | "combo" | "tratamiento";
type CategoriaFiltro = "todos" | Categoria;

type ServicioData = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // minutos
  categoria: Categoria;
  activo: boolean;
  popularidad: number; // 0-100
};

// Utilidad pequeña para COP
const fmtCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

// Etiquetas simples en lugar de Badge (evitamos tipos de shadcn según tu setup)
function Pill({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
        className
      }
    >
      {children}
    </span>
  );
}

function CategoryPill({ categoria }: { categoria: Categoria }) {
  const map: Record<Categoria, string> = {
    corte: "bg-blue-100/70 text-blue-900",
    barba: "bg-green-100/70 text-green-900",
    combo: "bg-purple-100/70 text-purple-900",
    tratamiento: "bg-orange-100/70 text-orange-900",
  };
  const label = categoria.charAt(0).toUpperCase() + categoria.slice(1);
  return <Pill className={map[categoria]}>{label}</Pill>;
}

function PopularityPill({ value }: { value: number }) {
  if (value >= 80) return <Pill className="bg-green-100/70 text-green-900">Popular</Pill>;
  if (value >= 60) return <Pill className="bg-yellow-100/70 text-yellow-900">Moderado</Pill>;
  return <Pill className="bg-red-100/70 text-red-900">Bajo</Pill>;
}

export function Servicios({ isAdmin = false }: { isAdmin?: boolean }) {
  const { role } = useAuth();
  const admin = isAdmin || role === "admin";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<CategoriaFiltro>("todos");
  const [editingService, setEditingService] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [servicios, setServicios] = useState<ServicioData[]>([
    { id: 1, nombre: "Corte Clásico Hombre", descripcion: "Corte tradicional con tijeras y máquina", precio: 80000, duracion: 30, categoria: "corte", activo: true, popularidad: 95 },
    { id: 2, nombre: "Corte + Barba", descripcion: "Corte completo con arreglo de barba", precio: 100000, duracion: 45, categoria: "combo", activo: true, popularidad: 88 },
    { id: 3, nombre: "Barba Completa", descripcion: "Arreglo y perfilado de barba", precio: 60000, duracion: 20, categoria: "barba", activo: true, popularidad: 75 },
    { id: 4, nombre: "Corte Cabello Dama", descripcion: "Corte y peinado profesional para mujeres", precio: 140000, duracion: 60, categoria: "corte", activo: true, popularidad: 82 },
    { id: 5, nombre: "Afeitado Clásico", descripcion: "Afeitado tradicional con navaja", precio: 72000, duracion: 25, categoria: "barba", activo: true, popularidad: 65 },
    { id: 6, nombre: "Tratamiento Capilar", descripcion: "Tratamiento nutritivo para el cabello", precio: 140000, duracion: 40, categoria: "tratamiento", activo: false, popularidad: 45 },
  ]);

  const [newService, setNewService] = useState<Omit<ServicioData, "id" | "popularidad">>({
    nombre: "",
    descripcion: "",
    precio: 0,
    duracion: 0,
    categoria: "corte",
    activo: true,
  });

  const categorias: { value: CategoriaFiltro; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "corte", label: "Cortes" },
    { value: "barba", label: "Barba" },
    { value: "combo", label: "Combos" },
    { value: "tratamiento", label: "Tratamientos" },
  ];

  const updateService = <K extends keyof ServicioData>(
    id: number,
    field: K,
    value: ServicioData[K]
  ) => {
    if (!admin) return;
    setServicios((prev: ServicioData[]) =>
      prev.map((s: ServicioData) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addNewService = () => {
    if (!admin) return;
    if (newService.nombre && newService.categoria) {
      const maxId = servicios.length ? Math.max(...servicios.map((s) => s.id)) : 0;
      const nuevo: ServicioData = { ...newService, id: maxId + 1, popularidad: 50 };
      setServicios((prev: ServicioData[]) => [...prev, nuevo]);
      setNewService({
        nombre: "",
        descripcion: "",
        precio: 0,
        duracion: 0,
        categoria: "corte",
        activo: true,
      });
      setIsDialogOpen(false);
    }
  };

  const deleteService = (id: number) => {
    if (!admin) return;
    setServicios((prev: ServicioData[]) => prev.filter((s: ServicioData) => s.id !== id));
  };

  const filteredServicios = servicios.filter((servicio: ServicioData) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      servicio.nombre.toLowerCase().includes(q) ||
      servicio.descripcion.toLowerCase().includes(q);
    const matchesCategory =
      filterCategory === "todos" || servicio.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios de tu barbería</p>
        </div>

        {admin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="self-start sm:self-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Button>
            </DialogTrigger>
            {/* glass en el diálogo */}
            <DialogContent className="max-w-md glass border">
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
                    onChange={(e) =>
                      setNewService((p) => ({ ...p, nombre: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada del servicio"
                    value={newService.descripcion}
                    onChange={(e) =>
                      setNewService((p) => ({ ...p, descripcion: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precio">Precio (COP)</Label>
                    <Input
                      id="precio"
                      type="number"
                      inputMode="numeric"
                      placeholder="80000"
                      value={newService.precio || ""}
                      onChange={(e) =>
                        setNewService((p) => ({
                          ...p,
                          precio: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="duracion">Duración (min)</Label>
                    <Input
                      id="duracion"
                      type="number"
                      inputMode="numeric"
                      placeholder="30"
                      value={newService.duracion || ""}
                      onChange={(e) =>
                        setNewService((p) => ({
                          ...p,
                          duracion: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={newService.categoria}
                    onValueChange={(value) =>
                      setNewService((p) => ({
                        ...p,
                        categoria: value as Categoria,
                      }))
                    }
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
                <div className="flex items-center gap-2">
                  <Switch
                    id="activo"
                    checked={newService.activo}
                    onCheckedChange={(checked: boolean) =>
                      setNewService((p) => ({ ...p, activo: checked }))
                    }
                  />
                  <Label htmlFor="activo">Servicio activo</Label>
                </div>
                <Button className="w-full" onClick={addNewService}>
                  Crear Servicio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card className="glass border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Input
              className="flex-1"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={filterCategory}
              onValueChange={(v) => setFilterCategory(v as CategoriaFiltro)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServicios.map((servicio: ServicioData) => {
          const enEdicion = admin && editingService === servicio.id;

          return (
            <Card
              key={servicio.id}
              className={(servicio.activo ? "" : "opacity-60 ") + "glass border"}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Scissors className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {enEdicion ? (
                        <Input
                          value={servicio.nombre}
                          onChange={(e) =>
                            updateService(servicio.id, "nombre", e.target.value)
                          }
                          className="text-lg font-semibold"
                        />
                      ) : (
                        <CardTitle className="text-lg truncate">
                          {servicio.nombre}
                        </CardTitle>
                      )}
                      {enEdicion ? (
                        <Textarea
                          value={servicio.descripcion}
                          onChange={(e) =>
                            updateService(
                              servicio.id,
                              "descripcion",
                              e.target.value
                            )
                          }
                          className="text-sm mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {servicio.descripcion}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!servicio.activo && (
                      <Pill className="bg-slate-200/70 text-slate-900">
                        Inactivo
                      </Pill>
                    )}
                    <Switch
                      checked={servicio.activo}
                      onCheckedChange={
                        admin
                          ? (checked: boolean) =>
                              updateService(servicio.id, "activo", checked)
                          : undefined
                      }
                      disabled={!admin}
                      aria-disabled={!admin}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {enEdicion ? (
                    <Select
                      value={servicio.categoria}
                      onValueChange={(v) =>
                        updateService(servicio.id, "categoria", v as Categoria)
                      }
                    >
                      <SelectTrigger className="w-36">
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
                    <CategoryPill categoria={servicio.categoria} />
                  )}
                  <PopularityPill value={servicio.popularidad} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                    {enEdicion ? (
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={servicio.precio}
                        onChange={(e) =>
                          updateService(
                            servicio.id,
                            "precio",
                            Number(e.target.value || 0)
                          )
                        }
                        className="text-xl font-bold text-primary"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary truncate">
                        {fmtCOP(servicio.precio)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {enEdicion ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={servicio.duracion}
                          onChange={(e) =>
                            updateService(
                              servicio.id,
                              "duracion",
                              Number(e.target.value || 0)
                            )
                          }
                          className="max-w-[6rem]"
                        />
                        <span className="text-sm">min</span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold">
                        {servicio.duracion} min
                      </span>
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

                {admin && (
                  <div className="flex gap-2">
                    {enEdicion ? (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingService(null)}
                        >
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteService(servicio.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
