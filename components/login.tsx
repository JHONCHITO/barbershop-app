"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { User, Shield, AlertCircle } from "lucide-react"

export function Login() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "cliente" | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleLogin = () => {
    if (!selectedRole) return

    setError("")
    const success = login(selectedRole, password)

    if (!success) {
      setError("Contraseña incorrecta")
    }
  }

  const handleClientAccess = () => {
    login("cliente")
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BarberPro</h1>
            <p className="text-gray-600">Gestión Profesional de Barbería</p>
          </div>

          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedRole("admin")}>
              <CardContent className="flex items-center p-6">
                <Shield className="h-12 w-12 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Administrador</h3>
                  <p className="text-gray-600">Acceso completo al sistema</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClientAccess}>
              <CardContent className="flex items-center p-6">
                <User className="h-12 w-12 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Cliente</h3>
                  <p className="text-gray-600">Acceso libre a reservas y servicios</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (selectedRole === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              Acceso Administrador
            </CardTitle>
            <CardDescription>Ingresa tu contraseña para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={handleLogin} className="w-full">
                Iniciar Sesión
              </Button>
              <Button variant="outline" onClick={() => setSelectedRole(null)} className="w-full">
                Volver
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">Contraseña por defecto: admin123</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
