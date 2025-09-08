// app/api/reservas/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import type { Reserva } from "@/types/reserva";

// Fuerza Node runtime y sin caché
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDB();
    const docs = await db
      .collection<Reserva>("reservas")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Normaliza a { id: string, ... }
    const data = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { ...rest, id: String(_id) };
    });

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/reservas error →", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error al obtener reservas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Valida campos mínimos (ajusta a tus nombres reales si difieren)
    const required = ["cliente", "telefono", "servicio", "barbero", "fecha", "hora", "barberia"];
    const faltan = required.filter((k) => !body?.[k]);
    if (faltan.length) {
      return NextResponse.json(
        { ok: false, error: `Faltan campos: ${faltan.join(", ")}` },
        { status: 400 }
      );
    }

    const now = new Date();
    const reserva: Reserva = {
      ...body,
      estado: body.estado ?? "pendiente-barbero",
      createdAt: now,
      notificaciones: Array.isArray(body.notificaciones) ? body.notificaciones : [],
      modificable: body.modificable ?? true,
      prioridad: body.prioridad ?? "normal",
      duracion: typeof body.duracion === "number" ? body.duracion : 30,
    };

    const db = await getDB();
    const result = await db.collection<Reserva>("reservas").insertOne(reserva as any);

    // (Opcional) notificación para admin
    try {
      await db.collection("notifications").insertOne({
        type: "reserva_creada",
        reservaId: result.insertedId,
        createdAt: now,
        read: false,
      });
    } catch (e) {
      console.warn("No se pudo registrar notification (no crítico):", e);
    }

    const created = { ...reserva, id: String(result.insertedId) };
    console.log("POST /api/reservas creada →", created.id);

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/reservas error →", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error al crear reserva" },
      { status: 500 }
    );
  }
}
