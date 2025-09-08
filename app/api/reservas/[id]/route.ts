// app/api/reservas/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId, WithId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Reserva = {
  _id?: ObjectId;
  cliente?: string;
  barbero?: string;
  servicio?: string;
  fecha?: string | Date;
  createdAt?: Date;
  updatedAt?: Date;
  // agrega aquí los campos reales de tu modelo
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const reserva = await db
      .collection<Reserva>("reservas")
      .findOne({ _id: new ObjectId(params.id) });

    if (!reserva) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, reserva });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patch = (await req.json()) as Partial<Reserva>;
    const db = await getDb();
    const col = db.collection<Reserva>("reservas");

    // Devolver el documento actualizado directamente (sin metadatos):
    const updated: WithId<Reserva> | null = await col.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: patch, $currentDate: { updatedAt: true } },
      {
        returnDocument: "after",
        includeResultMetadata: false as const,
      }
    );

    if (!updated) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, reserva: updated });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const { deletedCount } = await db
      .collection<Reserva>("reservas")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (!deletedCount) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
