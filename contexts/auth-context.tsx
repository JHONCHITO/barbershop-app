"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "admin" | "cliente"

interface User {
  id: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (role: UserRole, password?: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("barberpro-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (role: UserRole, password?: string): boolean => {
    if (role === "admin") {
      if (password !== "Jhon6683") {
        return false
      }
      const adminUser = { id: "1", name: "Administrador", role: "admin" as UserRole }
      setUser(adminUser)
      localStorage.setItem("barberpro-user", JSON.stringify(adminUser))
      return true
    } else {
      const clientUser = { id: "2", name: "Cliente", role: "cliente" as UserRole }
      setUser(clientUser)
      localStorage.setItem("barberpro-user", JSON.stringify(clientUser))
      return true
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("barberpro-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
