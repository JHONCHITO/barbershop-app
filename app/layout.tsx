// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import BackFloating from "@/components/back-floating"; // 👈 botón flotante (Atrás/Inicio)

export const metadata: Metadata = {
  title: "BarberPro | Gestión Profesional",
  description: "Gestión de reservas y barberos",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* Fondo futurista + tipografía y fixes */}
      <body className="future-bg text-foreground antialiased overflow-x-hidden min-h-dvh">
        <Providers>
          {children}
        </Providers>

        {/* Botón flotante global (cámbialo a dashboard si lo prefieres) */}
        <BackFloating inicioSection="reservas" />
      </body>
    </html>
  );
}
