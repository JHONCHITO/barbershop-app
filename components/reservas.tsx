// components/reservas.tsx
"use client";

/**
 * 5.1) Quitamos por completo almacenamiento local y BroadcastChannel.
 * - Se eliminaron: STORAGE_KEY, loadReservas, saveReservas, bcRef, syncAndBroadcast,
 *   listeners de "storage" y "BroadcastChannel", y el seeding demo.
 *
 * 5.2) Helpers de API centralizados: api.list / api.create / api.patch / api.remove
 * 5.3) Estado + carga inicial desde API (useEffect con fetch)
 * 5.4) createReserva ahora hace POST a /api/reservas
 * 5.5) handleEnviarABarbero también hace POST (mismo endpoint) con estado "pendiente-barbero"
 * 5.6) Acciones admin (aceptar/rechazar/posponer/eliminar) hacen PATCH/DELETE y recargan
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus, Search, Filter, Edit, Trash2, Phone, Mail, Clock, CheckCircle,
  XCircle, Calendar, User, MapPin, Star, MessageSquare, Scissors, Heart,
  Settings, X, Eye, EyeOff, CalendarClock
} from "lucide-react";

import { useBarberos } from "@/contexts/barberos-context";
import type { BarberiaID, Barbero } from "@/contexts/barberos-context";

/* ==================== Tipos (UI) ==================== */
// Nota: en la DB normalmente el id es string (ObjectId). En UI usamos id: string.
type BarberiaIDView = BarberiaID | "todas";
type EstadoReserva = "pendiente-barbero" | "pendiente-cliente" | "confirmada" | "cancelada" | "completada";
type Prioridad = "alta" | "normal";

type ReservasProps = {
  preselectBarbero?: string;
  preselectBarberia?: BarberiaIDView;
  /** Si true = vista administrador (muestra lista, filtros y acciones) */
  isAdmin?: boolean;
};

interface Barberia {
  id: BarberiaIDView;
  nombre: string;
  direccion: string;
  telefono: string;
}
interface ServicioPersonalizado { opciones: string[]; extras: string[]; }
interface ReservaDB {
  id: string; // <- viene de la API
  cliente: string;
  telefono: string;
  email: string;
  servicio: string;
  servicioPersonalizado: ServicioPersonalizado;
  barbero: string;
  barberia: BarberiaID;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  duracion: number;
  estado: EstadoReserva;
  notas: string;
  notificaciones: string[];
  modificable: boolean;
  prioridad: Prioridad;
}
interface NuevaReserva {
  cliente: string; telefono: string; email: string;
  barberia: BarberiaIDView | "";
  servicio: string; servicioPersonalizado: ServicioPersonalizado;
  barbero: string; fecha: string; hora: string; notas: string;
}
interface Servicio {
  id: string; nombre: string; duracion: number; opciones: string[]; extras: string[]; icono: string;
}
interface EditForm { fecha: string; hora: string; barbero: string; notas: string; }

/* ==================== 5.2) Helpers de API ==================== */
const api = {
  async list() {
    const r = await fetch("/api/reservas", { cache: "no-store" });
    if (!r.ok) throw new Error("No se pudo cargar reservas");
    return (await r.json()) as ReservaDB[];
  },
  async create(payload: Omit<ReservaDB, "id" | "notificaciones" | "modificable" | "prioridad" | "estado" | "duracion"> & {
    estado?: EstadoReserva;
    duracion?: number;
    notificaciones?: string[];
    modificable?: boolean;
    prioridad?: Prioridad;
  }) {
    const r = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("No se pudo crear la reserva");
    return (await r.json()) as ReservaDB;
  },
  async patch(id: string, changes: Partial<ReservaDB>) {
    const r = await fetch(`/api/reservas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    if (!r.ok) throw new Error("No se pudo actualizar la reserva");
    return (await r.json()) as ReservaDB;
  },
  async remove(id: string) {
    const r = await fetch(`/api/reservas/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("No se pudo eliminar la reserva");
    return true;
  },
};

export default function Reservas({
  preselectBarbero,
  preselectBarberia,
  isAdmin = false,
}: ReservasProps) {
  const { getBarberosDe } = useBarberos();

  /* ------- Filtros/Vista ------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todas" | EstadoReserva>("todas");
  const [selectedBarberia, setSelectedBarberia] = useState<BarberiaIDView>("principal");
  const [barberiaClienteSel, setBarberiaClienteSel] = useState<BarberiaID>("principal");
  const [verComoCliente, setVerComoCliente] = useState(true); // solo lo ve admin

  /* ------- Verificación ------- */
  const [availabilityCheck, setAvailabilityCheck] = useState<{
    barberoId: string; fecha: string; hora: string; disponible: boolean; alternativas: string[];
  } | null>(null);

  /* ------- Modales y estados ------- */
  const [editingReserva, setEditingReserva] = useState<ReservaDB | null>(null);
  const [barberiasDialogOpen, setBarberiasDialogOpen] = useState(false);
  const [editingBarberia, setEditingBarberia] = useState<Barberia | null>(null);

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [wizardMsg, setWizardMsg] = useState<{ type: "error" | "ok"; text: string } | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ fecha: "", hora: "", barbero: "", notas: "" });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newReserva, setNewReserva] = useState<NuevaReserva>({
    cliente: "", telefono: "", email: "", barberia: "", servicio: "",
    servicioPersonalizado: { opciones: [], extras: [] }, barbero: "", fecha: "", hora: "", notas: "",
  });

  /* ------- Barberías demo (estático en UI) ------- */
  const [barberias, setBarberias] = useState<Barberia[]>([
    { id: "principal", nombre: "Barbería Central", direccion: "Calle Nápoles", telefono: "+57 3187092130" },
    { id: "norte", nombre: "Barbería Norte", direccion: "Av. Norte 123", telefono: "+57 3000000001" },
    { id: "sur", nombre: "Barbería Sur", direccion: "Cll Sur 45", telefono: "+57 3000000002" },
    { id: "todas", nombre: "Todas las Barberías", direccion: "", telefono: "" },
  ]);

  const serviciosPersonalizables: Servicio[] = [
    { id: "corte-hombre", nombre: "Corte Hombre",      duracion: 30, opciones: ["Clásico","Moderno","Degradado","Rapado","Tijera"], extras: ["Lavado","Peinado","Cera"], icono: "✂️" },
    { id: "corte-dama",   nombre: "Corte Cabello Dama", duracion: 60, opciones: ["Corte recto","Capas","Flequillo","Degradado","Pixie"], extras: ["Lavado premium","Tratamiento","Peinado especial"], icono: "💇‍♀️" },
    { id: "corte-barba",  nombre: "Arreglo de Barba",   duracion: 20, opciones: ["Recorte","Perfilado","Afeitado completo","Diseño"], extras: ["Aceite","Bálsamo","Masaje facial"], icono: "🧔" },
    { id: "combo",        nombre: "Corte + Barba",      duracion: 45, opciones: ["Paquete completo","Estilo clásico","Look moderno"], extras: ["Tratamiento capilar","Masaje","Productos premium"], icono: "✨" },
  ];

  /* ==================== 5.3) Estado + carga inicial desde API ==================== */
  const [reservas, setReservas] = useState<ReservaDB[]>([]);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setReservas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  /* ==================== Helpers UI ==================== */
  const findBarberByName = (barberia: BarberiaIDView, nombre: string): Barbero | undefined =>
    barberia === "todas" ? undefined : getBarberosDe(barberia as BarberiaID).find(b => b.nombre === nombre);

  const checkAvailability = (barberoId: string, fecha: string, hora: string) => {
    const isAvailable = Math.random() > 0.3;
    const alternativeSlots = ["09:00", "11:00", "14:00", "16:00", "17:30"];
    setAvailabilityCheck({
      barberoId, fecha, hora,
      disponible: isAvailable,
      alternativas: isAvailable ? [] : alternativeSlots.slice(0, 3),
    });
  };

  const getEstadoBadge = (estado: EstadoReserva) => {
    switch (estado) {
      case "confirmada":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmada</Badge>;
      case "pendiente-barbero":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pendiente Barbero</Badge>;
      case "pendiente-cliente":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><User className="w-3 h-3 mr-1" />Pendiente Cliente</Badge>;
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelada</Badge>;
      case "completada":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><Star className="w-3 h-3 mr-1" />Completada</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getPriorityBadge = (prioridad: Prioridad) =>
    prioridad === "alta" ? (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <Heart className="w-3 h-3 mr-1" />VIP
      </Badge>
    ) : null;

  /* ==================== 5.4) Crear reserva (POST) ==================== */
  const canCreate =
    !!(newReserva.cliente && newReserva.servicio && newReserva.barbero &&
       newReserva.fecha && newReserva.hora && newReserva.barberia && newReserva.barberia !== "todas");

  const createReserva = async () => {
    setWizardMsg(null);
    if (!canCreate) {
      setWizardMsg({ type: "error", text: "Faltan datos obligatorios para crear la reserva." });
      return;
    }
    try {
      setSaving(true);
      const base = serviciosPersonalizables.find(s => s.nombre === newReserva.servicio);
      await api.create({
        cliente: newReserva.cliente,
        telefono: newReserva.telefono || "",
        email: newReserva.email || "",
        servicio: newReserva.servicio,
        servicioPersonalizado: { ...newReserva.servicioPersonalizado },
        barbero: newReserva.barbero,
        barberia: newReserva.barberia as BarberiaID,
        fecha: newReserva.fecha,
        hora: newReserva.hora,
        duracion: base?.duracion ?? 30,
        estado: "pendiente-barbero",
        notas: newReserva.notas || "",
        notificaciones: ["Reserva creada", "Esperando confirmación del barbero"],
        modificable: true,
        prioridad: "normal",
      });

      // limpiar y recargar
      setNewReserva({
        cliente: "", telefono: "", email: "", barberia: "", servicio: "",
        servicioPersonalizado: { opciones: [], extras: [] }, barbero: "", fecha: "", hora: "", notas: "",
      });
      setAvailabilityCheck(null);
      await reload();
      setWizardMsg({ type: "ok", text: "Reserva creada correctamente ✅" });
      setNewDialogOpen(false);
    } catch (e: any) {
      console.error(e);
      setWizardMsg({ type: "error", text: e?.message || "No se pudo crear la reserva" });
    } finally {
      setSaving(false);
    }
  };

  /* ==================== 5.5) Enviar a barbero (POST) ==================== */
  const canNotify =
    !!(newReserva.cliente && newReserva.barbero && newReserva.servicio &&
       newReserva.fecha && newReserva.hora && newReserva.barberia && newReserva.barberia !== "todas");

  const handleEnviarABarbero = async () => {
    if (!canNotify) {
      setWizardMsg({ type: "error", text: "Completa cliente, servicio, barbero, fecha, hora y barbería para enviar al barbero." });
      return;
    }
    try {
      setSaving(true);
      const base = serviciosPersonalizables.find(s => s.nombre === newReserva.servicio);
      await api.create({
        cliente: newReserva.cliente,
        telefono: newReserva.telefono || "",
        email: newReserva.email || "",
        servicio: newReserva.servicio,
        servicioPersonalizado: { ...newReserva.servicioPersonalizado },
        barbero: newReserva.barbero,
        barberia: newReserva.barberia as BarberiaID,
        fecha: newReserva.fecha,
        hora: newReserva.hora,
        duracion: base?.duracion ?? 30,
        estado: "pendiente-barbero",
        notas: newReserva.notas || "",
        notificaciones: ["Solicitud enviada al barbero"],
        modificable: true,
        prioridad: "normal",
      });

      await reload();
      setWizardMsg({ type: "ok", text: "Enviado al barbero para confirmación ✅" });
    } catch (e: any) {
      console.error(e);
      setWizardMsg({ type: "error", text: e?.message || "No se pudo enviar al barbero" });
    } finally {
      setSaving(false);
    }
  };

  /* ==================== 5.6) Acciones admin (PATCH/DELETE) ==================== */
  const aceptarReserva  = async (id: string) => {
    const r = reservas.find(x => x.id === id);
    const notis = [...(r?.notificaciones ?? []), "Reserva confirmada por el barbero"];
    await api.patch(id, { estado: "confirmada", notificaciones: notis });
    await reload();
  };

  const rechazarReserva = async (id: string) => {
    const r = reservas.find(x => x.id === id);
    const notis = [...(r?.notificaciones ?? []), "Reserva rechazada por el barbero"];
    await api.patch(id, { estado: "cancelada", notificaciones: notis });
    await reload();
  };

  const eliminarReserva = async (id: string) => {
    await api.remove(id);
    await reload();
  };

  const guardarCambiosReserva = async () => {
    if (!editingReserva) return;
    const notis = [...editingReserva.notificaciones, `Reserva modificada ${new Date().toLocaleString()}`];
    await api.patch(editingReserva.id, {
      fecha: editForm.fecha,
      hora: editForm.hora,
      barbero: editForm.barbero,
      notas: editForm.notas,
      notificaciones: notis,
    });
    setEditingReserva(null);
    await reload();
  };

  /* ------- Preselección (cuando navegas con query) ------- */
  useEffect(() => {
    if (preselectBarberia && preselectBarberia !== "todas") {
      setSelectedBarberia(preselectBarberia);
      setBarberiaClienteSel(preselectBarberia as BarberiaID);
    }
    if (preselectBarbero) {
      setNewReserva(p => ({
        ...p,
        barberia: ((preselectBarberia && preselectBarberia !== "todas") ? preselectBarberia : (p.barberia || "principal")) as BarberiaIDView,
        barbero: preselectBarbero,
      }));
    }
  }, [preselectBarbero, preselectBarberia]);

  /* ------- Filtros (solo admin) ------- */
  const filteredReservas = reservas.filter(r => {
    const matchesSearch   = r.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      || r.servicio.toLowerCase().includes(searchTerm.toLowerCase())
      || r.barbero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter   = filterStatus === "todas" || r.estado === filterStatus;
    const matchesBarberia = selectedBarberia === "todas" || r.barberia === selectedBarberia;
    return matchesSearch && matchesFilter && matchesBarberia;
  });

  /* ------- Posponer (admin) ------- */
  const [posponerDe, setPosponerDe] = useState<ReservaDB | null>(null);
  const [posFecha, setPosFecha] = useState("");
  const [posHora, setPosHora] = useState("");
  const confirmarPosponer = async () => {
    if (!posponerDe || !posFecha || !posHora) return;
    const notis = [...posponerDe.notificaciones, `Barbería propuso reprogramar a ${posFecha} ${posHora}`];
    await api.patch(posponerDe.id, { fecha: posFecha, hora: posHora, estado: "pendiente-cliente", notificaciones: notis });
    setPosponerDe(null); setPosFecha(""); setPosHora("");
    await reload();
  };

  /* ==================== Render ==================== */
  return (
    <div className="p-6 space-y-6">
      {/* Header + botón Nueva Reserva (visible a todos) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Sistema de Reservas
          </h1>
          <p className="text-muted-foreground">
            {loading ? "Cargando reservas..." : "Gestión completa con verificación en tiempo real"}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Botones SOLO admin */}
          {isAdmin && (
            <>
              <Button variant="outline" onClick={() => setBarberiasDialogOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />Gestionar Barberías
              </Button>
              <Button variant="outline" onClick={() => setVerComoCliente(v => !v)}>
                {verComoCliente ? (<><EyeOff className="w-4 h-4 mr-2" />Ocultar vista cliente</>)
                 : (<><Eye className="w-4 h-4 mr-2" />Ver como cliente</>)}
              </Button>
            </>
          )}

          {/* Wizard Nueva Reserva (cliente/admin) */}
          <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setWizardMsg(null)} className="bg-gradient-to-r from-primary to-purple-600" disabled={saving}>
                <Plus className="w-4 h-4 mr-2" />
                {saving ? "Guardando..." : "Nueva Reserva"}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-foreground">
              <DialogHeader><DialogTitle className="text-xl">Nueva Reserva - Sistema Completo</DialogTitle></DialogHeader>

              <Tabs defaultValue="cliente" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cliente">👤 Cliente</TabsTrigger>
                  <TabsTrigger value="servicio">✂️ Servicio</TabsTrigger>
                  <TabsTrigger value="barbero">💼 Barbero</TabsTrigger>
                  <TabsTrigger value="confirmacion">✅ Confirmar</TabsTrigger>
                </TabsList>

                {/* Paso Cliente */}
                <TabsContent value="cliente" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input id="nombre" placeholder="Nombre del cliente"
                        value={newReserva.cliente}
                        onChange={(e) => setNewReserva(p => ({ ...p, cliente: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="+57 300 123 4567"
                        value={newReserva.telefono}
                        onChange={(e) => setNewReserva(p => ({ ...p, telefono: e.target.value }))} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="cliente@email.com"
                      value={newReserva.email}
                      onChange={(e) => setNewReserva(p => ({ ...p, email: e.target.value }))} />
                  </div>

                  <div>
                    <Label htmlFor="barberia">Seleccionar Barbería</Label>
                    <Select value={newReserva.barberia} onValueChange={(v) => setNewReserva(p => ({ ...p, barberia: v as BarberiaIDView }))}>
                      <SelectTrigger><SelectValue placeholder="Elige una barbería" /></SelectTrigger>
                      <SelectContent>
                        {barberias.filter(b => b.id !== "todas").map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <div>
                                <p className="font-medium">{b.nombre}</p>
                                <p className="text-xs text-muted-foreground">{b.direccion}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Paso Servicio */}
                <TabsContent value="servicio" className="space-y-4">
                  <div>
                    <Label>Seleccionar Servicio Base</Label>
                    <div className="grid gap-3 mt-2">
                      {serviciosPersonalizables.map((s) => (
                        <Card key={s.id}
                          className={`cursor-pointer transition-all hover:shadow-md border-2 ${newReserva.servicio === s.nombre ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setNewReserva(p => ({ ...p, servicio: s.nombre }))}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{s.icono}</div>
                              <div>
                                <h4 className="font-medium">{s.nombre}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{s.duracion} min
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Label className="text-xs font-medium">Opciones:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.opciones.map((o) => <Badge key={o} variant="outline" className="text-xs">{o}</Badge>)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <Label className="text-xs font-medium">Extras:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.extras.map((e) => <Badge key={e} variant="secondary" className="text-xs">+{e}</Badge>)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notas-servicio">Detalles Específicos del Servicio</Label>
                    <Textarea id="notas-servicio" rows={3} placeholder="Describe exactamente lo que quieres..."
                      value={newReserva.notas} onChange={(e) => setNewReserva(p => ({ ...p, notas: e.target.value }))} />
                  </div>
                </TabsContent>

                {/* Paso Barbero */}
                <TabsContent value="barbero" className="space-y-4">
                  <div>
                    <Label>Barberos Disponibles</Label>
                    <div className="grid gap-3 mt-2">
                      {(newReserva.barberia && newReserva.barberia !== "todas"
                        ? getBarberosDe(newReserva.barberia as BarberiaID)
                        : []
                      ).map((b) => (
                        <Card key={b.id}
                          className={`cursor-pointer transition-all border-2 ${
                            !b.disponible ? "opacity-50"
                              : newReserva.barbero === b.nombre ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:shadow-md"}`}
                          onClick={() => b.disponible && setNewReserva(p => ({ ...p, barbero: b.nombre }))}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <img src={b.avatar || "/placeholder.svg"} alt={b.nombre} className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <h4 className="font-medium">{b.nombre}</h4>
                                  <p className="text-sm text-muted-foreground">{b.especialidad}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{Number(b.rating ?? 0).toFixed(1)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha">Fecha Preferida</Label>
                      <Input id="fecha" type="date" value={newReserva.fecha}
                        onChange={(e) => setNewReserva(p => ({ ...p, fecha: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="hora">Hora Preferida</Label>
                      <Input id="hora" type="time" value={newReserva.hora}
                        onChange={(e) => setNewReserva(p => ({ ...p, hora: e.target.value }))} />
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      const b = findBarberByName(newReserva.barberia as BarberiaID, newReserva.barbero);
                      checkAvailability(b?.id || "desconocido", newReserva.fecha, newReserva.hora);
                    }}
                    className="w-full" variant="outline"
                    disabled={!newReserva.fecha || !newReserva.hora || !newReserva.barbero}
                  >
                    <Clock className="w-4 h-4 mr-2" /> Verificar Disponibilidad
                  </Button>

                  {availabilityCheck && (
                    <Alert className={availabilityCheck.disponible ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      <AlertDescription>
                        {availabilityCheck.disponible ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" /> ¡Horario disponible! Puedes reservar.
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                              <XCircle className="w-4 h-4" /> Horario no disponible
                            </div>
                            <p className="text-sm mb-2">Horarios alternativos:</p>
                            <div className="flex gap-2">
                              {availabilityCheck.alternativas.map((h) => (
                                <Button key={h} variant="outline" size="sm"
                                  onClick={() => setNewReserva(p => ({ ...p, hora: h }))}>
                                  {h}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* Confirmación */}
                <TabsContent value="confirmacion" className="space-y-4">
                  <Card className="border-2 border-primary/20">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5" />Resumen de la Reserva</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Cliente:</strong> {newReserva.cliente || "No especificado"}</div>
                        <div><strong>Teléfono:</strong> {newReserva.telefono || "No especificado"}</div>
                        <div><strong>Servicio:</strong> {newReserva.servicio || "No seleccionado"}</div>
                        <div><strong>Barbero:</strong> {newReserva.barbero || "No seleccionado"}</div>
                        <div><strong>Fecha:</strong> {newReserva.fecha || "No seleccionada"}</div>
                        <div><strong>Hora:</strong> {newReserva.hora || "No seleccionada"}</div>
                        <div><strong>Barbería:</strong> {barberias.find((b) => b.id === newReserva.barberia)?.nombre || "No seleccionada"}</div>
                        <div><strong>Duración:</strong> {serviciosPersonalizables.find((s) => s.nombre === newReserva.servicio)?.duracion || 0} min</div>
                      </div>

                      {wizardMsg && (
                        <Alert className={wizardMsg.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                          <AlertDescription>{wizardMsg.text}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={createReserva} disabled={!canCreate || saving}>
                      <Calendar className="w-4 h-4 mr-2" /> {saving ? "Guardando..." : "Crear Reserva"}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleEnviarABarbero} disabled={!canNotify || saving}>
                      <MessageSquare className="w-4 h-4 mr-2" /> {saving ? "Enviando..." : "Enviar a Barbero"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros (SOLO admin) */}
      {isAdmin && (
        <Card className="border-2 border-primary/10">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4" />
                  <Input placeholder="Buscar por cliente, servicio o barbero..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>

              <Select value={selectedBarberia} onValueChange={(v) => setSelectedBarberia(v as BarberiaIDView)}>
                <SelectTrigger className="w-48">
                  <MapPin className="w-4 h-4 mr-2" /><SelectValue placeholder="Filtrar por barbería" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las Barberías</SelectItem>
                  {barberias.filter(b => b.id !== "todas").map((b) => (
                    <SelectItem key={b.id} value={b.id as BarberiaID}>{b.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "todas" | EstadoReserva)}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los Estados</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="pendiente-barbero">Pendiente Barbero</SelectItem>
                  <SelectItem value="pendiente-cliente">Pendiente Cliente</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de reservas (SOLO admin) */}
      {isAdmin && (
        <div className="grid gap-4">
          {filteredReservas.map((r) => (
            <Card key={r.id} className="border-2">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">{r.cliente}</h3>
                      </div>
                      {getEstadoBadge(r.estado)}
                      {r.prioridad === "alta" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <Heart className="w-3 h-3 mr-1" />VIP
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {barberias.find((b) => b.id === r.barberia)?.nombre}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Scissors className="w-4 h-4" /><p className="font-medium">Servicio</p>
                        </div>
                        <p>{r.servicio}</p>
                        {r.servicioPersonalizado && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs">Personalización:</p>
                            <p className="text-xs">{r.servicioPersonalizado.opciones.join(", ")}</p>
                            {r.servicioPersonalizado.extras.length > 0 && (
                              <p className="text-xs">+{r.servicioPersonalizado.extras.join(", ")}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4" /><p className="font-medium">Barbero</p>
                        </div>
                        <p>{r.barbero}</p>
                      </div>

                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4" /><p className="font-medium">Fecha y Hora</p>
                        </div>
                        <p>{r.fecha} - {r.hora}</p>
                        <p className="text-xs mt-1"><Clock className="w-3 h-3 inline mr-1" />{r.duracion} min</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-2 text-sm">
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.telefono}</div>
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</div>
                    </div>

                    {r.notas && (
                      <div className="border p-3 rounded-lg mb-2">
                        <p className="text-sm"><strong>Nota:</strong> {r.notas}</p>
                      </div>
                    )}

                    {r.notificaciones.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Historial:</p>
                        {r.notificaciones.map((n, i) => (<p key={i} className="text-xs">• {n}</p>))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {r.estado === "pendiente-barbero" && (
                      <>
                        <Button size="sm" onClick={() => aceptarReserva(r.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />Aceptar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rechazarReserva(r.id)}>
                          <XCircle className="w-4 h-4 mr-1" />Rechazar
                        </Button>
                        <Button size="sm" variant="outline"
                          onClick={() => { setPosponerDe(r); setPosFecha(r.fecha); setPosHora(r.hora); }}>
                          <CalendarClock className="w-4 h-4 mr-1" />Posponer
                        </Button>
                      </>
                    )}

                    {r.modificable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingReserva(r);
                          setEditForm({ fecha: r.fecha ?? "", hora: r.hora ?? "", barbero: r.barbero ?? "", notas: r.notas ?? "" });
                        }}>
                        <Edit className="w-4 h-4 mr-1" />Modificar
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => eliminarReserva(r.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vista pública de Barberos (para cliente) — el admin la puede ocultar */}
      {verComoCliente && (
        <Card className="border-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Barberos — Vista del cliente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Label>Filtrar por barbería</Label>
              <Select value={barberiaClienteSel} onValueChange={(v) => setBarberiaClienteSel(v as BarberiaID)}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  {barberias.filter(b => b.id !== "todas").map(b => (<SelectItem key={b.id} value={b.id as BarberiaID}>{b.nombre}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getBarberosDe(barberiaClienteSel).map((b) => (
                <Card key={b.id} className="border-2">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={b.avatar || "/placeholder.svg"} alt={b.nombre} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{b.nombre}</h3>
                            <Badge className={b.disponible ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                              {b.disponible ? "Activo" : "Descanso"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{b.especialidad}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{Number(b.rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="col-span-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> {b.direccion || "—"}</div>
                      <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {b.email || "—"}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {b.telefono || "—"}</div>
                      <div className="col-span-2 flex items-center gap-2"><Clock className="w-3 h-3" /> {b.horario || "—"}</div>
                    </div>

                    {b.especialidades && b.especialidades.length > 0 && (
                      <div>
                        <p className="text-xs mb-1">Especialidades</p>
                        <div className="flex flex-wrap gap-1">
                          {b.especialidades.map((e) => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestión de Barberías – SOLO admin */}
      {isAdmin && (
        <Dialog open={barberiasDialogOpen} onOpenChange={setBarberiasDialogOpen}>
          <DialogContent className="max-w-2xl bg-white text-foreground">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Gestión de Barberías</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {barberias.filter(b => b.id !== "todas").map((b) => (
                <Card key={b.id} className="border-2">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{b.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{b.direccion}</p>
                        <p className="text-sm text-muted-foreground">{b.telefono}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setEditingBarberia(b)}>
                        <Edit className="w-4 h-4 mr-1" />Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Editar Barbería – SOLO admin */}
      {isAdmin && editingBarberia && (
        <Dialog open={!!editingBarberia} onOpenChange={(open) => !open && setEditingBarberia(null)}>
          <DialogContent className="bg-white text-foreground">
            <DialogHeader><DialogTitle>Editar Barbería</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nombre de la Barbería</Label>
                <Input value={editingBarberia.nombre} onChange={(e) => setEditingBarberia({ ...editingBarberia, nombre: e.target.value })} />
              </div>
              <div><Label>Dirección</Label>
                <Input value={editingBarberia.direccion} onChange={(e) => setEditingBarberia({ ...editingBarberia, direccion: e.target.value })} />
              </div>
              <div><Label>Teléfono</Label>
                <Input value={editingBarberia.telefono} onChange={(e) => setEditingBarberia({ ...editingBarberia, telefono: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  setBarberias(prev => prev.map(x => x.id === editingBarberia.id ? editingBarberia : x));
                  setEditingBarberia(null);
                }} className="flex-1">Guardar Cambios</Button>
                <Button variant="outline" onClick={() => setEditingBarberia(null)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Posponer – SOLO admin */}
      {isAdmin && posponerDe && (
        <Dialog open={!!posponerDe} onOpenChange={(open) => { if (!open) setPosponerDe(null); }}>
          <DialogContent className="max-w-sm bg-white text-foreground">
            <DialogHeader><DialogTitle>Proponer nueva fecha/hora</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Fecha</Label><Input type="date" value={posFecha} onChange={e => setPosFecha(e.target.value)} /></div>
              <div><Label>Hora</Label><Input type="time" value={posHora} onChange={e => setPosHora(e.target.value)} /></div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={confirmarPosponer} disabled={!posFecha || !posHora}>Enviar propuesta</Button>
                <Button variant="outline" onClick={() => setPosponerDe(null)}>Cancelar</Button>
              </div>
              <p className="text-xs">El estado pasará a <strong>Pendiente Cliente</strong> y se agregará una notificación al historial.</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
