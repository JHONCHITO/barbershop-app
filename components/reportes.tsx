"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Star } from "lucide-react"

export function Reportes() {
  const ventasPorMes = [
    { mes: "Ene", ventas: 2400, citas: 48 },
    { mes: "Feb", ventas: 2100, citas: 42 },
    { mes: "Mar", ventas: 2800, citas: 56 },
    { mes: "Abr", ventas: 3200, citas: 64 },
    { mes: "May", ventas: 2900, citas: 58 },
    { mes: "Jun", ventas: 3400, citas: 68 },
    { mes: "Jul", ventas: 3800, citas: 76 },
    { mes: "Ago", ventas: 3600, citas: 72 },
    { mes: "Sep", ventas: 3100, citas: 62 },
    { mes: "Oct", ventas: 3500, citas: 70 },
    { mes: "Nov", ventas: 3900, citas: 78 },
    { mes: "Dic", ventas: 4200, citas: 84 },
  ]

  const serviciosMasPopulares = [
    { nombre: "Corte + Barba", valor: 35, color: "#8b5cf6" },
    { nombre: "Corte Clásico", valor: 25, color: "#06b6d4" },
    { nombre: "Barba", valor: 20, color: "#10b981" },
    { nombre: "Corte Mujer", valor: 15, color: "#f59e0b" },
    { nombre: "Otros", valor: 5, color: "#ef4444" },
  ]

  const rendimientoBarberos = [
    { nombre: "Carlos", citas: 156, ingresos: 3900, rating: 4.9 },
    { nombre: "Ana", citas: 142, ingresos: 4260, rating: 4.8 },
    { nombre: "Miguel", citas: 128, ingresos: 3200, rating: 4.7 },
  ]

  const estadisticasGenerales = [
    {
      titulo: "Ingresos del Mes",
      valor: "€4,200",
      cambio: "+12%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      titulo: "Citas Completadas",
      valor: "84",
      cambio: "+8%",
      tendencia: "up",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      titulo: "Nuevos Clientes",
      valor: "12",
      cambio: "-3%",
      tendencia: "down",
      icon: Users,
      color: "text-purple-600",
    },
    {
      titulo: "Satisfacción Media",
      valor: "4.8/5",
      cambio: "+0.2",
      tendencia: "up",
      icon: Star,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">Analiza el rendimiento de tu barbería</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="mes">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estadisticasGenerales.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.tendencia === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.titulo}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.valor}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon
                    className={`h-3 w-3 mr-1 ${stat.tendencia === "up" ? "text-green-600" : "text-red-600"}`}
                  />
                  {stat.cambio} vs mes anterior
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos y Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#8b5cf6" name="Ingresos (€)" />
                <Bar dataKey="citas" fill="#06b6d4" name="Citas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Servicios Más Populares */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviciosMasPopulares}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  label={({ nombre, valor }) => `${nombre}: ${valor}%`}
                >
                  {serviciosMasPopulares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento de Barberos */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Barberos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rendimientoBarberos.map((barbero, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">{barbero.nombre[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{barbero.nombre}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{barbero.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{barbero.citas}</p>
                    <p className="text-sm text-muted-foreground">Citas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">€{barbero.ingresos}</p>
                    <p className="text-sm text-muted-foreground">Ingresos</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Top Performer</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencia de Crecimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Crecimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ventas" stroke="#8b5cf6" strokeWidth={3} name="Ingresos (€)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
