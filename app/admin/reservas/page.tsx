"use client";

import useSWR from "swr";
import { useEffect, useMemo, useRef } from "react";
import { Toaster, toast } from "sonner";

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || "Error");
  return j.data as any[];
};

export default function AdminReservasPage() {
  const { data, error, isLoading } = useSWR("/api/reservas", fetcher, {
    refreshInterval: 10000,
  });

  const prevIdsRef = useRef<string[]>([]);
  const currentIds = useMemo(() => (data || []).map((r) => String(r._id)), [data]);

  useEffect(() => {
    if (prevIdsRef.current.length === 0) {
      prevIdsRef.current = currentIds;
      return;
    }
    const nuevos = currentIds.filter((id) => !prevIdsRef.current.includes(id));
    if (nuevos.length > 0) {
      toast.success(`🆕 ${nuevos.length} reserva(s) nueva(s)`);
      prevIdsRef.current = currentIds;
    }
  }, [currentIds]);

  return (
    <div className="page-container py-6">
      <Toaster richColors position="top-right" />
      <h1 className="text-2xl font-semibold mb-4">Reservas (Admin)</h1>

      {isLoading && <p>Cargando…</p>}
      {error && <p className="text-red-500">Error: {(error as Error).message}</p>}

      <div className="grid gap-3">
        {(data || []).map((r) => (
          <div key={String(r._id)} className="glass rounded-lg p-4">
            <div className="text-sm opacity-70">{new Date(r.fecha).toLocaleString()}</div>
            <div className="font-medium text-lg">{r.clienteNombre}</div>
            <div className="text-sm">Barbero: {r.barberoId} — Servicio: {r.servicioId}</div>
            {r.notas ? <div className="text-sm mt-1 opacity-80">Notas: {r.notas}</div> : null}
            <div className="text-xs mt-2 opacity-60">Estado: {r.estado}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
