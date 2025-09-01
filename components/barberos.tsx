// components/barberos.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Edit, Trash2, Star, Phone, Mail, Calendar,
  Save, X, MapPin, ImagePlus, MessageSquare, LockKeyhole
} from "lucide-react";

import { useBarberos } from "@/contexts/barberos-context";
import { useAuth } from "@/contexts/auth-context";
import type { BarberiaID, Barbero, EstadoBarbero } from "@/contexts/barberos-context";

function fileToDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export function Barberos() {
  const router = useRouter();
  const { role } = useAuth() as any;      // "admin" | "cliente"
  const isAdmin = role === "admin";

  const { getBarberosDe, upsertBarbero, eliminarBarbero } = useBarberos();

  const [barberiaSel, setBarberiaSel] = useState<BarberiaID>("principal");
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<{ originalId: string; data: Barbero } | null>(null);
  const [creating, setCreating] = useState<Barbero | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lista = getBarberosDe(barberiaSel);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (b) =>
        b.nombre.toLowerCase().includes(q) ||
        (b.especialidad?.toLowerCase().includes(q) ?? false) ||
        (b.especialidades?.join(", ").toLowerCase().includes(q) ?? false)
    );
  }, [lista, searchTerm]);

  const getEstadoBadge = (estado?: EstadoBarbero, disponible?: boolean) => {
    const val = estado ?? (disponible ? "Activo" : "Descanso");
    if (val === "Activo") return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Descanso</Badge>;
  };

  const startCreate = () => {
    setIsDialogOpen(true);
    setCreating({
      id: `b-${Date.now()}`,
      nombre: "",
      especialidad: "",
      rating: 4.8,
      disponible: true,
      whatsapp: "",
      email: "",
      telefono: "",
      direccion: "",
      horario: "",
      especialidades: [],
      hoy: 0,
      semana: 0,
      experienciaAnios: 0,
      estado: "Activo",
      avatar: "",
      biografia: "",
    });
  };

  const saveBarbero = () => {
    const payload = editing ? editing.data : (creating as Barbero);
    if (!payload.nombre) return alert("El nombre es obligatorio.");
    upsertBarbero(barberiaSel, payload, editing?.originalId);
    setEditing(null);
    setCreating(null);
    setIsDialogOpen(false);
  };

  const onAvatarChange = async (file?: File) => {
    if (!file) return;
    const dataUrl = await fileToDataURL(file);
    if (editing) setEditing({ ...editing, data: { ...editing.data, avatar: dataUrl } });
    if (creating) setCreating({ ...creating, avatar: dataUrl });
  };

  const goToReservasConBarbero = (b: Barbero) => {
    // navegamos al home con la sección reservas y el barbero/barbería preseleccionados
    const url = `/?section=reservas&barbero=${encodeURIComponent(b.nombre)}&barberia=${barberiaSel}`;
    router.push(url);
  };

  const openWhatsApp = (b: Barbero) => {
    const wa = (b.whatsapp || b.telefono || "").toString();
    if (!wa) {
      alert("Este barbero no tiene WhatsApp configurado.");
      return;
    }
    const msg = `Hola ${b.nombre}, me gustaría reservar una cita.`;
    const link = `https://wa.me/${wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold">Barberos</h1>
            <p className="text-muted-foreground">
              Gestiona tu equipo de profesionales {isAdmin ? null : (
                <span className="inline-flex items-center gap-1 text-amber-600 ml-2">
                  <LockKeyhole className="h-4 w-4" /> Vista de solo lectura
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Select value={barberiaSel} onValueChange={(v: BarberiaID) => setBarberiaSel(v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Barbería" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="principal">Barbería Central</SelectItem>
              <SelectItem value="norte">Barbería Norte</SelectItem>
              <SelectItem value="sur">Barbería Sur</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={startCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Barbero
                </Button>
              </DialogTrigger>

              {(editing || creating) && (
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editing ? "Editar Barbero" : "Nuevo Barbero"}</DialogTitle>
                  </DialogHeader>

                  {(() => {
                    const b = (editing ? editing.data : (creating as Barbero)) as Barbero;
                    const update = (patch: Partial<Barbero>) =>
                      editing
                        ? setEditing({ ...editing, data: { ...editing.data, ...patch } })
                        : setCreating({ ...(creating as Barbero), ...patch });

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={b.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {b.nombre ? b.nombre.split(" ").map((n) => n[0]).join("") : "BP"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => onAvatarChange(e.target.files?.[0])}
                            />
                            <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center gap-2 text-sm underline">
                              <ImagePlus className="w-4 h-4" /> Subir/Actualizar foto
                            </Label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Nombre</Label>
                            <Input value={b.nombre} onChange={(e) => update({ nombre: e.target.value })} />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input type="email" value={b.email ?? ""} onChange={(e) => update({ email: e.target.value })} />
                          </div>
                          <div>
                            <Label>Teléfono</Label>
                            <Input value={b.telefono ?? ""} onChange={(e) => update({ telefono: e.target.value })} />
                          </div>
                          <div>
                            <Label>WhatsApp</Label>
                            <Input value={b.whatsapp ?? ""} onChange={(e) => update({ whatsapp: e.target.value })} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Dirección</Label>
                            <Input value={b.direccion ?? ""} onChange={(e) => update({ direccion: e.target.value })} />
                          </div>
                          <div>
                            <Label>Horario</Label>
                            <Input placeholder="09:00 - 18:00" value={b.horario ?? ""} onChange={(e) => update({ horario: e.target.value })} />
                          </div>
                          <div>
                            <Label>Especialidad principal</Label>
                            <Input value={b.especialidad ?? ""} onChange={(e) => update({ especialidad: e.target.value })} />
                          </div>
                          <div>
                            <Label>Especialidades (separadas por coma)</Label>
                            <Input
                              value={(b.especialidades || []).join(", ")}
                              onChange={(e) =>
                                update({ especialidades: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                              }
                            />
                          </div>
                          <div>
                            <Label>Rating</Label>
                            <Input
                              type="number"
                              step="0.1"
                              min={0}
                              max={5}
                              value={b.rating ?? 0}
                              onChange={(e) => update({ rating: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Estado</Label>
                            <Select
                              value={(b.estado ?? (b.disponible ? "Activo" : "Descanso")) as EstadoBarbero}
                              onValueChange={(v: EstadoBarbero) => update({ estado: v, disponible: v === "Activo" })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Descanso">Descanso</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Citas hoy</Label>
                            <Input type="number" value={b.hoy ?? 0} onChange={(e) => update({ hoy: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Citas semana</Label>
                            <Input type="number" value={b.semana ?? 0} onChange={(e) => update({ semana: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Experiencia (años)</Label>
                            <Input
                              type="number"
                              value={b.experienciaAnios ?? 0}
                              onChange={(e) => update({ experienciaAnios: Number(e.target.value) })}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Bio</Label>
                            <Textarea
                              value={b.biografia ?? ""}
                              onChange={(e) => update({ biografia: e.target.value })}
                              placeholder="(opcional)"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1" onClick={saveBarbero}>
                            <Save className="w-4 h-4 mr-2" /> Guardar
                          </Button>
                          <Button variant="outline" onClick={() => { setEditing(null); setCreating(null); setIsDialogOpen(false); }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </DialogContent>
              )}
            </Dialog>
          )}
        </div>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar barberos por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={b.avatar || "/placeholder.svg"} alt={b.nombre} />
                    <AvatarFallback>
                      {b.nombre ? b.nombre.split(" ").map((n) => n[0]).join("") : "BP"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{b.nombre}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {Number(b.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                {getEstadoBadge(b.estado, b.disponible)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {b.email ?? "—"}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {b.telefono ?? "—"}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {b.direccion ?? "—"}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {b.horario ?? "—"}</div>

              {b.especialidades?.length ? (
                <div>
                  <p className="text-xs mb-1">Especialidades</p>
                  <div className="flex flex-wrap gap-1">
                    {b.especialidades.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Acciones */}
              {isAdmin ? (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setEditing({ originalId: b.id, data: { ...b } });
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200"
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${b.nombre}?`)) eliminarBarbero(barberiaSel, b.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => goToReservasConBarbero(b)}
                    title="Enviar solicitud de cita al administrador"
                  >
                    <Calendar className="w-4 h-4 mr-1" /> Pedir cita
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => openWhatsApp(b)}
                    title="Chatear por WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </div>
              )}

              {!isAdmin && (
                <p className="mt-2 text-xs text-amber-700">
                  Edición disponible solo para el administrador
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
