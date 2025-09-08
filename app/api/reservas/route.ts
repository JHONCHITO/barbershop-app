import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

type Reserva = {
  _id?: string;
  clienteNombre: string;
  clienteTelefono?: string;
  barberoId: string;
  servicioId: string;
  fecha: string; // ISO
  estado?: "pendiente" | "confirmada" | "cancelada";
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
};

async function notifyAdmin(reserva: Reserva) {
  const url = process.env.ADMIN_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Nueva reserva",
        message: `Cliente: ${reserva.clienteNombre}\nBarbero: ${reserva.barberoId}\nServicio: ${reserva.servicioId}\nFecha: ${reserva.fecha}`,
        reserva,
      }),
    });
  } catch (e) {
    console.error("No se pudo notificar al admin:", e);
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const reservas = await db.collection<Reserva>("reservas").find({}).sort({ fecha: 1 }).toArray();
    return NextResponse.json({ ok: true, data: reservas });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "No se pudo cargar reservas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Reserva>;
    if (!body.clienteNombre || !body.barberoId || !body.servicioId || !body.fecha) {
      return NextResponse.json({ ok: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const nueva: Reserva = {
      clienteNombre: body.clienteNombre,
      clienteTelefono: body.clienteTelefono || "",
      barberoId: body.barberoId,
      servicioId: body.servicioId,
      fecha: body.fecha,
      estado: "pendiente",
      notas: body.notas || "",
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const { insertedId } = await db.collection<Reserva>("reservas").insertOne(nueva);
    const creada = { ...nueva, _id: String(insertedId) };

    await notifyAdmin(creada);
    revalidateTag("reservas");

    return NextResponse.json({ ok: true, data: creada }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "No se pudo crear la reserva" }, { status: 500 });
  }
}
