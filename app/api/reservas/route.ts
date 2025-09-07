// /app/api/reservas/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { ReservaDoc, ReservaAPI } from "@/types/reserva";

const DB_NAME = process.env.MONGODB_DB || "barberpro";
const COLLECTION = "reservas";

const toAPI = (doc: ReservaDoc & { _id: ObjectId }): ReservaAPI => {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const items = (await db.collection<ReservaDoc>(COLLECTION).find({}).sort({ _id: -1 }).toArray()) as (ReservaDoc & { _id: ObjectId })[];
    return NextResponse.json(items.map(toAPI));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al listar" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<ReservaDoc>;

    // Validación mínima
    for (const f of ["cliente","servicio","barbero","barberia","fecha","hora"]) {
      if (!payload[f as keyof ReservaDoc]) {
        return NextResponse.json({ error: `Falta el campo ${f}` }, { status: 400 });
      }
    }

    const doc: ReservaDoc = {
      cliente: payload.cliente!,
      telefono: payload.telefono ?? "",
      email: payload.email ?? "",
      servicio: payload.servicio!,
      servicioPersonalizado: payload.servicioPersonalizado ?? { opciones: [], extras: [] },
      barbero: payload.barbero!,
      barberia: payload.barberia!,
      fecha: payload.fecha!,
      hora: payload.hora!,
      duracion: payload.duracion ?? 30,
      estado: payload.estado ?? "pendiente-barbero",
      notas: payload.notas ?? "",
      notificaciones: payload.notificaciones ?? [],
      modificable: payload.modificable ?? true,
      prioridad: payload.prioridad ?? "normal",
    };

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const res = await db.collection<ReservaDoc>(COLLECTION).insertOne(doc);

    // devolver la versión API (id como string)
    return NextResponse.json(toAPI({ ...doc, _id: res.insertedId as ObjectId }), { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al crear" }, { status: 500 });
  }
}
