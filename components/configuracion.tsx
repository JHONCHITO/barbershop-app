"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Bell, Users, CreditCard, Shield, Palette, Save, Upload } from "lucide-react"

export function Configuracion() {
  const [configuracion, setConfiguracion] = useState({
    // Información del negocio
    nombreNegocio: "BarberPro",
    direccion: "Calle Principal 123",
    telefono: "+34 666 000 111",
    email: "info@barberpro.com",
    horarioApertura: "09:00",
    horarioCierre: "20:00",
    diasLaborales: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],

    // Notificaciones
    notificacionesEmail: true,
    notificacionesSMS: false,
    recordatoriosCitas: true,
    confirmacionAutomatica: false,

    // Reservas
    tiempoAnticipacion: 24,
    duracionSlot: 30,
    permitirCancelacion: true,
    tiempoCancelacion: 2,

    // Pagos
    aceptarEfectivo: true,
    aceptarTarjeta: true,
    aceptarTransferencia: false,
    propinaSugerida: 10,

    // Tema
    temaOscuro: false,
    colorPrimario: "#8b5cf6",
    idioma: "es",
  })

  const handleSave = () => {
    console.log("Guardando configuración:", configuracion)
    // Aquí iría la lógica para guardar en la base de datos
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu barbería</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="negocio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="negocio" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Negocio
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="reservas" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Reservas
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="apariencia" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Información del Negocio */}
        <TabsContent value="negocio">
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreNegocio">Nombre del Negocio</Label>
                  <Input
                    id="nombreNegocio"
                    value={configuracion.nombreNegocio}
                    onChange={(e) => setConfiguracion({ ...configuracion, nombreNegocio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={configuracion.telefono}
                    onChange={(e) => setConfiguracion({ ...configuracion, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={configuracion.direccion}
                  onChange={(e) => setConfiguracion({ ...configuracion, direccion: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={configuracion.email}
                  onChange={(e) => setConfiguracion({ ...configuracion, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horarioApertura">Horario de Apertura</Label>
                  <Input
                    id="horarioApertura"
                    type="time"
                    value={configuracion.horarioApertura}
                    onChange={(e) => setConfiguracion({ ...configuracion, horarioApertura: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="horarioCierre">Horario de Cierre</Label>
                  <Input
                    id="horarioCierre"
                    type="time"
                    value={configuracion.horarioCierre}
                    onChange={(e) => setConfiguracion({ ...configuracion, horarioCierre: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Logo del Negocio</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Store className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones en tu email</p>
                </div>
                <Switch
                  checked={configuracion.notificacionesEmail}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, notificacionesEmail: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por SMS</Label>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones por mensaje de texto</p>
                </div>
                <Switch
                  checked={configuracion.notificacionesSMS}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, notificacionesSMS: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordatorios de Citas</Label>
                  <p className="text-sm text-muted-foreground">Enviar recordatorios automáticos a clientes</p>
                </div>
                <Switch
                  checked={configuracion.recordatoriosCitas}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, recordatoriosCitas: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirmación Automática</Label>
                  <p className="text-sm text-muted-foreground">Confirmar citas automáticamente</p>
                </div>
                <Switch
                  checked={configuracion.confirmacionAutomatica}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, confirmacionAutomatica: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservas */}
        <TabsContent value="reservas">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Reservas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tiempoAnticipacion">Tiempo de Anticipación (horas)</Label>
                <Input
                  id="tiempoAnticipacion"
                  type="number"
                  value={configuracion.tiempoAnticipacion}
                  onChange={(e) =>
                    setConfiguracion({ ...configuracion, tiempoAnticipacion: Number.parseInt(e.target.value) })
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">Tiempo mínimo requerido para hacer una reserva</p>
              </div>

              <div>
                <Label htmlFor="duracionSlot">Duración de Slot (minutos)</Label>
                <Select
                  value={configuracion.duracionSlot.toString()}
                  onValueChange={(value) =>
                    setConfiguracion({ ...configuracion, duracionSlot: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir Cancelaciones</Label>
                  <p className="text-sm text-muted-foreground">Los clientes pueden cancelar sus citas</p>
                </div>
                <Switch
                  checked={configuracion.permitirCancelacion}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, permitirCancelacion: checked })}
                />
              </div>

              {configuracion.permitirCancelacion && (
                <div>
                  <Label htmlFor="tiempoCancelacion">Tiempo Límite para Cancelar (horas)</Label>
                  <Input
                    id="tiempoCancelacion"
                    type="number"
                    value={configuracion.tiempoCancelacion}
                    onChange={(e) =>
                      setConfiguracion({ ...configuracion, tiempoCancelacion: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pagos */}
        <TabsContent value="pagos">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Efectivo</Label>
                  <p className="text-sm text-muted-foreground">Aceptar pagos en efectivo</p>
                </div>
                <Switch
                  checked={configuracion.aceptarEfectivo}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, aceptarEfectivo: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tarjeta de Crédito/Débito</Label>
                  <p className="text-sm text-muted-foreground">Aceptar pagos con tarjeta</p>
                </div>
                <Switch
                  checked={configuracion.aceptarTarjeta}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, aceptarTarjeta: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Transferencia Bancaria</Label>
                  <p className="text-sm text-muted-foreground">Aceptar transferencias</p>
                </div>
                <Switch
                  checked={configuracion.aceptarTransferencia}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, aceptarTransferencia: checked })}
                />
              </div>

              <div>
                <Label htmlFor="propinaSugerida">Propina Sugerida (%)</Label>
                <Input
                  id="propinaSugerida"
                  type="number"
                  value={configuracion.propinaSugerida}
                  onChange={(e) =>
                    setConfiguracion({ ...configuracion, propinaSugerida: Number.parseInt(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="passwordActual">Contraseña Actual</Label>
                <Input id="passwordActual" type="password" />
              </div>

              <div>
                <Label htmlFor="passwordNueva">Nueva Contraseña</Label>
                <Input id="passwordNueva" type="password" />
              </div>

              <div>
                <Label htmlFor="passwordConfirmar">Confirmar Nueva Contraseña</Label>
                <Input id="passwordConfirmar" type="password" />
              </div>

              <Button>Cambiar Contraseña</Button>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Autenticación de Dos Factores</h3>
                <p className="text-sm text-muted-foreground mb-4">Agrega una capa extra de seguridad a tu cuenta</p>
                <Button variant="outline">Configurar 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="apariencia">
          <Card>
            <CardHeader>
              <CardTitle>Personalización de Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tema Oscuro</Label>
                  <p className="text-sm text-muted-foreground">Usar tema oscuro en la interfaz</p>
                </div>
                <Switch
                  checked={configuracion.temaOscuro}
                  onCheckedChange={(checked) => setConfiguracion({ ...configuracion, temaOscuro: checked })}
                />
              </div>

              <div>
                <Label htmlFor="colorPrimario">Color Primario</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    id="colorPrimario"
                    type="color"
                    value={configuracion.colorPrimario}
                    onChange={(e) => setConfiguracion({ ...configuracion, colorPrimario: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={configuracion.colorPrimario}
                    onChange={(e) => setConfiguracion({ ...configuracion, colorPrimario: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="idioma">Idioma</Label>
                <Select
                  value={configuracion.idioma}
                  onValueChange={(value) => setConfiguracion({ ...configuracion, idioma: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
