import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";            // 👈 antes era "./globals.css"
import Providers from "./providers";
import BackFloating from "@/components/back-floating";

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
      <body className="future-bg text-foreground antialiased overflow-x-hidden min-h-dvh">
        <Providers>{children}</Providers>
        <BackFloating inicioSection="reservas" />
      </body>
    </html>
  );
}
