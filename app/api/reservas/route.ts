// app/api/reservas/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// (Opcional) Define un tipo local sencillo si no quieres depender de "@/types/reserva"
type ReservaDoc = {
  cliente: string;
  telefono: string;
  email?: string;
  servicio: string;
  servicioPersonalizado?: { opciones: string[]; extras: string[] };
  barbero: string;
  barberia: string;   // "principal" | "norte" | "sur" (o lo que uses)
  fecha: string;      // "YYYY-MM-DD"
  hora: string;       // "HH:mm"
  duracion?: number;
  estado?: "pendiente-barbero" | "pendiente-cliente" | "confirmada" | "cancelada" | "completada";
  notas?: string;
  notificaciones?: string[];
  modificable?: boolean;
  prioridad?: "alta" | "normal";
  createdAt?: Date;
};

export async function GET() {
  try {
    const db = await getDB();
    const docs = await db
      .collection<ReservaDoc>("reservas")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Normaliza: id en vez de _id
    const data = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { ...rest, id: String(_id) };
    });

    return NextResponse.json({ ok: true, data });
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

    // Valida campos mínimos
    const required = ["cliente", "telefono", "servicio", "barbero", "fecha", "hora", "barberia"];
    const faltan = required.filter((k) => !body?.[k]);
    if (faltan.length) {
      return NextResponse.json(
        { ok: false, error: `Faltan campos: ${faltan.join(", ")}` },
        { status: 400 }
      );
    }

    const now = new Date();
    const reserva: ReservaDoc = {
      ...body,
      estado: body.estado ?? "pendiente-barbero",
      createdAt: now,
      notificaciones: Array.isArray(body.notificaciones) ? body.notificaciones : [],
      modificable: body.modificable ?? true,
      prioridad: body.prioridad ?? "normal",
      duracion: typeof body.duracion === "number" ? body.duracion : 30,
    };

    const db = await getDB();
    const result = await db.collection<ReservaDoc>("reservas").insertOne(reserva as any);

    // Notificación (opcional, si tienes polling del admin)
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
