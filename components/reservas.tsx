'use client';

import { useState } from "react";
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
  Settings, Bell, X,
} from "lucide-react";

/* ============================= */
/* Tipos estrictos               */
/* ============================= */

type BarberiaID = 'principal' | 'norte' | 'sur' | 'todas';

type EstadoReserva = 'pendiente-barbero' | 'pendiente-cliente' | 'confirmada' | 'cancelada' | 'completada';
type Prioridad = 'alta' | 'normal';

interface Barberia {
  id: BarberiaID;
  nombre: string;
  direccion: string;
  telefono: string;
}

interface Barbero {
  id: string;
  nombre: string;
  especialidad: string;
  rating: number;
  disponible: boolean;
  whatsapp: string;
}

interface ServicioPersonalizado {
  opciones: string[];
  extras: string[];
}

interface Reserva {
  id: number;
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
  cliente: string;
  telefono: string;
  email: string;
  barberia: BarberiaID | '';
  servicio: string;
  servicioPersonalizado: ServicioPersonalizado;
  barbero: string;
  fecha: string;
  hora: string;
  notas: string;
}

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
  opciones: string[];
  extras: string[];
  icono: string;
}

interface NotificacionBarbero {
  id: number;
  barbero: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  barberia: BarberiaID;
  timestamp: string;
  leida: boolean;
}

interface EditForm {
  fecha: string;
  hora: string;
  barbero: string;
  notas: string;
}

/* ============================= */
/* Componente                    */
/* ============================= */

export function Reservas() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<'todas' | EstadoReserva>("todas");
  const [selectedBarberia, setSelectedBarberia] = useState<BarberiaID>('principal');

  const [availabilityCheck, setAvailabilityCheck] = useState<{
    barberoId: string;
    fecha: string;
    hora: string;
    disponible: boolean;
    alternativas: string[];
  } | null>(null);

  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
  const [chatOpen, setChatOpen] = useState<Reserva | null>(null);
  const [barberiasDialogOpen, setBarberiasDialogOpen] = useState<boolean>(false);
  const [editingBarberia, setEditingBarberia] = useState<Barberia | null>(null);
  const [notificacionesBarbero, setNotificacionesBarbero] = useState<NotificacionBarbero[]>([]);
  const [showNotificacion, setShowNotificacion] = useState<boolean>(false);

  const [editForm, setEditForm] = useState<EditForm>({
    fecha: "",
    hora: "",
    barbero: "",
    notas: "",
  });

  const [newReserva, setNewReserva] = useState<NuevaReserva>({
    cliente: "",
    telefono: "",
    email: "",
    barberia: "",
    servicio: "",
    servicioPersonalizado: { opciones: [], extras: [] },
    barbero: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  const [barberias, setBarberias] = useState<Barberia[]>([
    { id: "principal", nombre: "Barbería Central", direccion: "Calle Napoles", telefono: "+57 3187092130" },
  ]);

  const serviciosPersonalizables: Servicio[] = [
    { id: "corte-hombre", nombre: "Corte Hombre", duracion: 30, opciones: ["Clásico","Moderno","Degradado","Rapado","Tijera"], extras: ["Lavado","Peinado","Cera"], icono: "✂️" },
    { id: "corte-dama",   nombre: "Corte Cabello Dama", duracion: 60, opciones: ["Corte recto","Capas","Flequillo","Degradado","Pixie"], extras: ["Lavado premium","Tratamiento","Peinado especial"], icono: "💇‍♀️" },
    { id: "corte-barba",  nombre: "Arreglo de Barba", duracion: 20, opciones: ["Recorte","Perfilado","Afeitado completo","Diseño"], extras: ["Aceite","Bálsamo","Masaje facial"], icono: "🧔" },
    { id: "combo",        nombre: "Corte + Barba", duracion: 45, opciones: ["Paquete completo","Estilo clásico","Look moderno"], extras: ["Tratamiento capilar","Masaje","Productos premium"], icono: "✨" },
  ];

  const barberosPorBarberia: Record<Exclude<BarberiaID, 'todas'>, Barbero[]> = {
    principal: [
      { id: "carlos", nombre: "Carlos Ruiz",  especialidad: "Cortes clásicos",  rating: 4.8, disponible: true,  whatsapp: "+57 300 111 2222" },
      { id: "ana",    nombre: "Ana López",    especialidad: "Cortes modernos",  rating: 4.9, disponible: true,  whatsapp: "+57 300 333 4444" },
      { id: "miguel", nombre: "Miguel Torres",especialidad: "Barbas y bigotes", rating: 4.7, disponible: false, whatsapp: "+57 300 555 6666" },
    ],
    norte: [
      { id: "pedro", nombre: "Pedro Sánchez", especialidad: "Degradados",       rating: 4.6, disponible: true,  whatsapp: "+57 300 777 8888" },
      { id: "lucia", nombre: "Lucía Martín",  especialidad: "Cortes femeninos", rating: 4.8, disponible: true,  whatsapp: "+57 300 999 0000" },
    ],
    sur: [
      { id: "david", nombre: "David García",  especialidad: "Estilos urbanos",  rating: 4.5, disponible: true,  whatsapp: "+57 300 111 3333" },
      { id: "sofia", nombre: "Sofía Ruiz",    especialidad: "Tratamientos",     rating: 4.9, disponible: true,  whatsapp: "+57 300 555 7777" },
    ],
  };

  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 1,
      cliente: "Juan Pérez",
      telefono: "+57 300 123 4567",
      email: "juan@email.com",
      servicio: "Corte + Barba",
      servicioPersonalizado: { opciones: ["Paquete completo"], extras: ["Masaje"] },
      barbero: "Carlos Ruiz",
      barberia: "principal",
      fecha: "2024-01-15",
      hora: "10:00",
      duracion: 45,
      estado: "pendiente-barbero",
      notas: "Cliente regular, prefiere corte clásico",
      notificaciones: ["Reserva creada", "Esperando confirmación del barbero"],
      modificable: true,
      prioridad: "normal",
    },
    {
      id: 2,
      cliente: "María García",
      telefono: "+57 300 789 0123",
      email: "maria@email.com",
      servicio: "Corte Cabello Dama",
      servicioPersonalizado: { opciones: ["Capas"], extras: ["Lavado premium","Tratamiento"] },
      barbero: "Ana López",
      barberia: "norte",
      fecha: "2024-01-15",
      hora: "10:30",
      duracion: 60,
      estado: "confirmada",
      notas: "Primera vez en la barbería",
      notificaciones: ["Reserva confirmada por Ana López"],
      modificable: true,
      prioridad: "alta",
    },
  ]);

  /* ============================= */
  /* Helpers                       */
  /* ============================= */

  const getBarberoWhatsApp = (nombreBarbero: string, barberia: BarberiaID) => {
    if (barberia === 'todas') return "";
    const list = barberosPorBarberia[barberia] || [];
    const b = list.find((x) => x.nombre === nombreBarbero);
    return b?.whatsapp ?? "";
  };

  const openWhatsApp = (r: Reserva) => {
    const wa = getBarberoWhatsApp(r.barbero, r.barberia);
    if (wa) {
      const msg = `Hola ${r.barbero}! Soy ${r.cliente}. Tengo una cita programada para el ${r.fecha} a las ${r.hora} para ${r.servicio}. ¿Podrías confirmarme la disponibilidad?`;
      const url = `https://wa.me/${wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    }
  };

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
    prioridad === "alta"
      ? <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><Heart className="w-3 h-3 mr-1 fill-current" />VIP</Badge>
      : null;

  /* ============================= */
  /* Acciones de reservas          */
  /* ============================= */

  const enviarNotificacionBarbero = (r: Reserva) => {
    const n: NotificacionBarbero = {
      id: Date.now(),
      barbero: r.barbero,
      cliente: r.cliente,
      servicio: r.servicio,
      fecha: r.fecha,
      hora: r.hora,
      barberia: r.barberia,
      timestamp: new Date().toLocaleString(),
      leida: false,
    };
    setNotificacionesBarbero(prev => [...prev, n]);
    setShowNotificacion(true);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Nueva cita solicitada`, {
        body: `${r.cliente} solicita cita para ${r.servicio} el ${r.fecha} a las ${r.hora}`,
        icon: "/barbershop-icon.png",
      });
    }
    setTimeout(() => setShowNotificacion(false), 5000);
  };

  const createReserva = () => {
    if (newReserva.cliente && newReserva.servicio && newReserva.barbero && newReserva.fecha && newReserva.hora && newReserva.barberia) {
      const servicio = serviciosPersonalizables.find(s => s.nombre === newReserva.servicio);
      const newId = (reservas.length ? Math.max(...reservas.map(r => r.id)) : 0) + 1;

      const nueva: Reserva = {
        id: newId,
        cliente: newReserva.cliente,
        telefono: newReserva.telefono,
        email: newReserva.email,
        servicio: newReserva.servicio,
        servicioPersonalizado: { ...newReserva.servicioPersonalizado },
        barbero: newReserva.barbero,
        barberia: newReserva.barberia as BarberiaID,
        fecha: newReserva.fecha,
        hora: newReserva.hora,
        duracion: servicio?.duracion || 30,
        estado: "pendiente-barbero",
        notas: newReserva.notas,
        notificaciones: ["Reserva creada", "Esperando confirmación del barbero"],
        modificable: true,
        prioridad: "normal",
      };

      setReservas(prev => [...prev, nueva]);
      enviarNotificacionBarbero(nueva);

      setNewReserva({
        cliente: "", telefono: "", email: "", barberia: "", servicio: "",
        servicioPersonalizado: { opciones: [], extras: [] }, barbero: "", fecha: "", hora: "", notas: "",
      });
    }
  };

  const aceptarReserva = (id: number) => {
    setReservas(prev => prev.map(r =>
      r.id === id ? { ...r, estado: "confirmada", notificaciones: [...r.notificaciones, "Reserva confirmada por el barbero"] } : r
    ));
  };

  const rechazarReserva = (id: number) => {
    setReservas(prev => prev.map(r =>
      r.id === id ? { ...r, estado: "cancelada", notificaciones: [...r.notificaciones, "Reserva rechazada por el barbero"] } : r
    ));
  };

  const eliminarReserva = (id: number) => {
    setReservas(prev => prev.filter(r => r.id !== id));
  };

  const abrirChat = (r: Reserva) => setChatOpen(r);

  const actualizarBarberia = (b: Barberia) => {
    setBarberias(prev => prev.map(x => x.id === b.id ? b : x));
    setEditingBarberia(null);
  };

  const guardarCambiosReserva = () => {
    if (!editingReserva) return;
    setReservas(prev =>
      prev.map(r =>
        r.id === editingReserva.id
          ? {
              ...r,
              fecha: editForm.fecha,
              hora: editForm.hora,
              barbero: editForm.barbero,
              notas: editForm.notas,
              notificaciones: [...r.notificaciones, `Reserva modificada ${new Date().toLocaleString()}`],
            }
          : r
      )
    );
    setEditingReserva(null);
  };

  /* ============================= */
  /* Filtro                        */
  /* ============================= */

  const filteredReservas = reservas.filter(r => {
    const matchesSearch = r.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      || r.servicio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todas" || r.estado === filterStatus;
    const matchesBarberia = selectedBarberia === "todas" || r.barberia === selectedBarberia;
    return matchesSearch && matchesFilter && matchesBarberia;
  });

  /* ============================= */
  /* Render                        */
  /* ============================= */

  return (
    <div className="p-6 space-y-6">
      {showNotificacion && notificacionesBarbero.length > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg border-l-4 border-white animate-pulse">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5" />
            <div>
              <p className="font-semibold">¡Nueva Cita Solicitada!</p>
              <p className="text-sm opacity-90">
                {notificacionesBarbero[notificacionesBarbero.length - 1]?.cliente} solicita cita con{" "}
                {notificacionesBarbero[notificacionesBarbero.length - 1]?.barbero}
              </p>
            </div>
            <button onClick={() => setShowNotificacion(false)} className="ml-auto text-white hover:text-gray-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Sistema de Reservas
          </h1>
          <p className="text-muted-foreground">Gestión completa con verificación en tiempo real</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBarberiasDialogOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200"
          >
            <Settings className="w-4 h-4 mr-2" />
            Gestionar Barberías
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Reserva
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Nueva Reserva - Sistema Completo</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="cliente" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cliente">👤 Cliente</TabsTrigger>
                  <TabsTrigger value="servicio">✂️ Servicio</TabsTrigger>
                  <TabsTrigger value="barbero">💼 Barbero</TabsTrigger>
                  <TabsTrigger value="confirmacion">✅ Confirmar</TabsTrigger>
                </TabsList>

                {/* Cliente */}
                <TabsContent value="cliente" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input id="nombre" placeholder="Nombre del cliente"
                        value={newReserva.cliente}
                        onChange={(e) => setNewReserva((p) => ({ ...p, cliente: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="+57 300 123 4567"
                        value={newReserva.telefono}
                        onChange={(e) => setNewReserva((p) => ({ ...p, telefono: e.target.value }))} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="cliente@email.com"
                      value={newReserva.email}
                      onChange={(e) => setNewReserva((p) => ({ ...p, email: e.target.value }))} />
                  </div>

                  <div>
                    <Label htmlFor="barberia">Seleccionar Barbería</Label>
                    <Select
                      value={newReserva.barberia}
                      onValueChange={(v: BarberiaID) => setNewReserva((p) => ({ ...p, barberia: v }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Elige una barbería" /></SelectTrigger>
                      <SelectContent>
                        {barberias.map((b) => (
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

                {/* Servicio */}
                <TabsContent value="servicio" className="space-y-4">
                  <div>
                    <Label>Seleccionar Servicio Base</Label>
                    <div className="grid gap-3 mt-2">
                      {serviciosPersonalizables.map((s) => (
                        <Card key={s.id}
                          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                            newReserva.servicio === s.nombre ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setNewReserva((p) => ({ ...p, servicio: s.nombre }))}
                        >
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{s.icono}</div>
                                <div>
                                  <h4 className="font-medium">{s.nombre}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{s.duracion} min
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Label className="text-xs font-medium">Opciones disponibles:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {s.opciones.map((o) => <Badge key={o} variant="outline" className="text-xs">{o}</Badge>)}
                              </div>
                            </div>
                            <div className="mt-2">
                              <Label className="text-xs font-medium">Extras disponibles:</Label>
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
                    <Textarea id="notas-servicio" rows={3}
                      placeholder="Describe exactamente lo que quieres..."
                      value={newReserva.notas}
                      onChange={(e) => setNewReserva((p) => ({ ...p, notas: e.target.value }))} />
                  </div>
                </TabsContent>

                {/* Barbero */}
                <TabsContent value="barbero" className="space-y-4">
                  <div>
                    <Label>Barberos Disponibles</Label>
                    <div className="grid gap-3 mt-2">
                      {(newReserva.barberia && newReserva.barberia !== 'todas'
                        ? barberosPorBarberia[newReserva.barberia]
                        : []
                      ).map((b) => (
                        <Card key={b.id}
                          className={`cursor-pointer transition-all border-2 ${
                            !b.disponible
                              ? "opacity-50"
                              : newReserva.barbero === b.nombre
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:shadow-md"
                          }`}
                          onClick={() => b.disponible && setNewReserva((p) => ({ ...p, barbero: b.nombre }))}
                        >
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${b.disponible ? "bg-green-500" : "bg-red-500"}`} />
                                <div>
                                  <h4 className="font-medium">{b.nombre}</h4>
                                  <p className="text-sm text-muted-foreground">{b.especialidad}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{b.rating}</span>
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
                      <Input id="fecha" type="date"
                        value={newReserva.fecha}
                        onChange={(e) => setNewReserva((p) => ({ ...p, fecha: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="hora">Hora Preferida</Label>
                      <Input id="hora" type="time"
                        value={newReserva.hora}
                        onChange={(e) => setNewReserva((p) => ({ ...p, hora: e.target.value }))} />
                    </div>
                  </div>

                  <Button
                    onClick={() => checkAvailability("carlos", newReserva.fecha, newReserva.hora)}
                    className="w-full" variant="outline"
                    disabled={!newReserva.fecha || !newReserva.hora || !newReserva.barbero}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Verificar Disponibilidad
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
                            <p className="text-sm mb-2 text-red-600">Horarios alternativos:</p>
                            <div className="flex gap-2">
                              {availabilityCheck.alternativas.map((h) => (
                                <Button key={h} variant="outline" size="sm"
                                  onClick={() => setNewReserva((p) => ({ ...p, hora: h }))}>
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
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5" />Resumen de la Reserva</CardTitle>
                    </CardHeader>
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
                      {newReserva.notas && (
                        <div className="mt-3 p-3 bg-white/50 rounded-lg">
                          <strong className="text-sm">Notas especiales:</strong>
                          <p className="text-sm text-muted-foreground mt-1">{newReserva.notas}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600" onClick={createReserva}>
                      <Calendar className="w-4 h-4 mr-2" /> Crear Reserva
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <MessageSquare className="w-4 h-4 mr-2" /> Enviar a Barbero
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por cliente, servicio o barbero..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-primary/20 focus:border-primary" />
              </div>
            </div>

            <Select value={selectedBarberia} onValueChange={(v: BarberiaID) => setSelectedBarberia(v)}>
              <SelectTrigger className="w-48 border-primary/20">
                <MapPin className="w-4 h-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las Barberías</SelectItem>
                {barberias.map((b) => <SelectItem key={b.id} value={b.id}>{b.nombre}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v: 'todas' | EstadoReserva) => setFilterStatus(v)}>
              <SelectTrigger className="w-48 border-primary/20">
                <Filter className="w-4 h-4 mr-2" /><SelectValue />
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

      {/* Lista de reservas */}
      <div className="grid gap-4">
        {filteredReservas.map((r) => (
          <Card key={r.id} className="border-2 border-border hover:border-primary/30 transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{r.cliente}</h3>
                    </div>
                    {getEstadoBadge(r.estado)}
                    {getPriorityBadge(r.prioridad)}
                    <Badge variant="outline" className="bg-primary/5 border-primary/20">
                      {barberias.find((b) => b.id === r.barberia)?.nombre}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Scissors className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-blue-900">Servicio</p>
                      </div>
                      <p className="text-blue-800">{r.servicio}</p>
                      {r.servicioPersonalizado && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-blue-700">Personalización:</p>
                          <p className="text-xs text-blue-600">{r.servicioPersonalizado.opciones.join(", ")}</p>
                          {r.servicioPersonalizado.extras.length > 0 && (
                            <p className="text-xs text-blue-600">+{r.servicioPersonalizado.extras.join(", ")}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-green-600" />
                        <p className="font-medium text-green-900">Barbero</p>
                      </div>
                      <p className="text-green-800">{r.barbero}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <p className="font-medium text-purple-900">Fecha y Hora</p>
                      </div>
                      <p className="text-purple-800">{r.fecha} - {r.hora}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />{r.duracion} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.telefono}</div>
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</div>
                    <Button variant="outline" size="sm" onClick={() => openWhatsApp(r)}
                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300">
                      <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp Barbero
                    </Button>
                  </div>

                  {r.notas && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-2">
                      <p className="text-sm text-amber-800"><strong>Nota:</strong> {r.notas}</p>
                    </div>
                  )}

                  {r.notificaciones.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-foreground mb-1">Historial:</p>
                      {r.notificaciones.map((n, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {n}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {r.estado === "pendiente-barbero" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => aceptarReserva(r.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />Aceptar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent hover:bg-red-50"
                        onClick={() => rechazarReserva(r.id)}>
                        <XCircle className="w-4 h-4 mr-1" />Rechazar
                      </Button>
                    </>
                  )}

                  {r.modificable && (
                    <Button variant="outline" size="sm" className="bg-transparent"
                      onClick={() => {
                        setEditingReserva(r);
                        setEditForm({
                          fecha: r.fecha ?? "",
                          hora: r.hora ?? "",
                          barbero: r.barbero ?? "",
                          notas: r.notas ?? "",
                        });
                      }}>
                      <Edit className="w-4 h-4 mr-1" />Modificar
                    </Button>
                  )}

                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => abrirChat(r)}>
                    <MessageSquare className="w-4 h-4 mr-1" />Chat
                  </Button>

                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-transparent hover:bg-red-50"
                    onClick={() => eliminarReserva(r.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gestión de Barberías */}
      <Dialog open={barberiasDialogOpen} onOpenChange={setBarberiasDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Gestión de Barberías</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {barberias.map((b) => (
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

      {editingBarberia && (
        <Dialog open={!!editingBarberia} onOpenChange={() => setEditingBarberia(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Barbería</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre de la Barbería</Label>
                <Input value={editingBarberia.nombre} onChange={(e) => setEditingBarberia({ ...editingBarberia, nombre: e.target.value })} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={editingBarberia.direccion} onChange={(e) => setEditingBarberia({ ...editingBarberia, direccion: e.target.value })} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={editingBarberia.telefono} onChange={(e) => setEditingBarberia({ ...editingBarberia, telefono: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => actualizarBarberia(editingBarberia)} className="flex-1">Guardar Cambios</Button>
                <Button variant="outline" onClick={() => setEditingBarberia(null)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat */}
      {chatOpen && (
        <Dialog open={!!chatOpen} onOpenChange={() => setChatOpen(null)}>
          <DialogContent className="max-w-md max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Chat - {chatOpen.cliente}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  <div className="bg-blue-100 p-2 rounded text-sm"><strong>Cliente:</strong> Hola, ¿está confirmada mi cita?</div>
                  <div className="bg-green-100 p-2 rounded text-sm ml-4"><strong>Barbero:</strong> ¡Hola! Sí, tu cita está confirmada para el {chatOpen.fecha} a las {chatOpen.hora}</div>
                  <div className="bg-blue-100 p-2 rounded text-sm"><strong>Cliente:</strong> Perfecto, ¿puedo cambiar algo del servicio?</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Escribe tu mensaje..." className="flex-1" />
                <Button>Enviar</Button>
              </div>
              <div className="text-xs text-muted-foreground">Chat en tiempo real con {chatOpen.barbero}</div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal edición reserva */}
      {editingReserva && (
        <Dialog open={!!editingReserva} onOpenChange={() => setEditingReserva(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modificar Reserva - {editingReserva.cliente}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Nueva Fecha</Label>
                <Input type="date" value={editForm.fecha}
                  onChange={(e) => setEditForm((p) => ({ ...p, fecha: e.target.value }))} />
              </div>

              <div>
                <Label>Nueva Hora</Label>
                <Input type="time" value={editForm.hora}
                  onChange={(e) => setEditForm((p) => ({ ...p, hora: e.target.value }))} />
              </div>

              <div>
                <Label>Cambiar Barbero</Label>
                <Select value={editForm.barbero}
                  onValueChange={(v) => setEditForm((p) => ({ ...p, barbero: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecciona barbero" /></SelectTrigger>
                  <SelectContent>
                    {(barberosPorBarberia[editingReserva.barberia as Exclude<BarberiaID, 'todas'>] 
  ?? barberosPorBarberia.principal).map((b) => (
                      <SelectItem key={b.id} value={b.nombre}>
                        {b.nombre} - {b.especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Modificar Servicio / Notas</Label>
                <Textarea placeholder="Describe los cambios en el servicio..."
                  value={editForm.notas}
                  onChange={(e) => setEditForm((p) => ({ ...p, notas: e.target.value }))} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={guardarCambiosReserva}
                  disabled={!editForm.fecha || !editForm.hora || !editForm.barbero}>
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setEditingReserva(null)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
