"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { BarberosProvider } from "@/contexts/barberos-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BarberosProvider>{children}</BarberosProvider>
    </AuthProvider>
  );
}
