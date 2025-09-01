"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound, Scissors, Sparkles, Lock } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@barberpro.com";
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";

/**
 * Interfaz de acceso:
 * - Selección Admin/Cliente
 * - Modal con email/contraseña para Admin
 * - Botón primario "Ingresar" (submit), y soporte para Enter
 */
function LoginInner() {
  const router = useRouter();
  const auth = useAuth() as any;

  // Modal Admin
  const [adminOpen, setAdminOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterAsClient = () => {
    if (auth?.login && typeof auth.login === "function") {
      auth.login("cliente");
    } else {
      auth?.setRole?.("cliente");
      auth?.setUser?.({ name: "Cliente", role: "cliente" });
      auth?.setIsAuthenticated?.(true);
    }
    router.push("/");
  };

  const submitAdmin = async () => {
    setError(null);
    setLoading(true);
    try {
      if (auth?.login && typeof auth.login === "function") {
        await auth.login("admin", { email, password: pass });
      } else {
        const ok = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASS;
        if (!ok) throw new Error("Correo o contraseña inválidos.");
        auth?.setRole?.("admin");
        auth?.setUser?.({ name: "Administrador", role: "admin", email });
        auth?.setIsAuthenticated?.(true);
      }
      setAdminOpen(false);
      setEmail("");
      setPass("");
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar sesión como administrador.");
    } finally {
      setLoading(false);
    }
  };

  const tiles = useMemo(
    () => [
      {
        role: "admin" as const,
        title: "Entrar como Admin",
        desc: "Gestiona barberos, reservas, reportes y configuración.",
        icon: <ShieldCheck className="h-6 w-6" />,
        gradient: "from-emerald-500 to-teal-500",
        glow: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)]",
        onClick: () => setAdminOpen(true),
      },
      {
        role: "cliente" as const,
        title: "Entrar como Cliente",
        desc: "Explora barberos, agenda tu cita y recibe confirmación.",
        icon: <UserRound className="h-6 w-6" />,
        gradient: "from-indigo-500 to-purple-600",
        glow: "shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]",
        onClick: () => enterAsClient(),
      },
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const canSubmit = !!email && !!pass && !loading;

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // evita recarga
    if (canSubmit) submitAdmin();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Decoración de fondo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-10">
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-5 py-2 backdrop-blur-md ring-1 ring-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Scissors className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-wide text-white/70">BarberPro</span>
            <span className="text-base font-semibold">Gestión Profesional</span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Interfaz de acceso
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Elige cómo{" "}
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              quieres entrar
            </span>
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Selecciona tu perfil para continuar. Podrás cambiarlo más tarde al cerrar sesión.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-6 md:grid-cols-2">
          {tiles.map(({ role, title, desc, icon, gradient, glow, onClick }) => (
            <div key={role} className="transform transition duration-300 ease-out hover:-translate-y-0.5">
              <Card className={`group relative overflow-hidden border-white/10 bg-white/5 text-white backdrop-blur-md ${glow}`}>
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-1 ring-white/20 transition-opacity group-hover:opacity-100" />
                <CardContent className="relative p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      <p className="text-xs text-white/70">{desc}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button
                      onClick={onClick}
                      className={`w-full rounded-xl bg-gradient-to-r ${gradient} py-5 text-base font-semibold shadow-lg transition-transform hover:scale-[1.02]`}
                    >
                      {title}
                    </Button>
                  </div>

                  <div className="mt-4 text-[11px] text-white/50">
                    {role === "admin" ? "Requiere permisos de administrador." : "Acceso rápido para reservar y consultar barberos."}
                  </div>
                </CardContent>

                <div className={`pointer-events-none absolute -bottom-24 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r ${gradient} opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-30`} />
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-white/50">
          Al continuar aceptas nuestras{" "}
          <span className="underline decoration-white/30 underline-offset-2">Condiciones</span> y{" "}
          <span className="underline decoration-white/30 underline-offset-2">Política de privacidad</span>.
        </div>
      </main>

      {/* Modal Admin */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="bg-white text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acceso Administrador
            </DialogTitle>
            <DialogDescription>
              Introduce tus credenciales de administrador para continuar.
            </DialogDescription>
          </DialogHeader>

          {/* FORM => soporta Enter */}
          <form onSubmit={onFormSubmit} className="space-y-3">
            <div>
              <Label htmlFor="admin-email">Correo</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@barberpro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="admin-pass">Contraseña</Label>
              <Input
                id="admin-pass"
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600" aria-live="polite">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button type="submit" className="flex-1" disabled={!canSubmit}>
                {loading ? "Verificando..." : "Ingresar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setAdminOpen(false)}>
                Cancelar
              </Button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Tip: configura <code>NEXT_PUBLIC_ADMIN_EMAIL</code> y <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> en tu <code>.env.local</code>.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Login() {
  return <LoginInner />;
}
