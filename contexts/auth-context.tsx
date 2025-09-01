"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Role = "admin" | "cliente";
export type User = { id: string; name: string; role: Role };

type AuthCtx = {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (role?: Role) => void;     // <— lo que usa tu Login
  loginAsAdmin: () => void;         // opcional/compat
  loginAsClient: () => void;        // opcional/compat
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Carga desde localStorage (persistencia simple)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
    if (raw) setUser(JSON.parse(raw));
  }, []);

  // Guarda cambios
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const login = (role: Role = "cliente") =>
    setUser({ id: role === "admin" ? "1" : "2", name: role === "admin" ? "Admin" : "Cliente", role });

  const loginAsAdmin = () => login("admin");
  const loginAsClient = () => login("cliente");
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? "cliente",
        isAuthenticated: !!user,
        login,
        loginAsAdmin,
        loginAsClient,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
