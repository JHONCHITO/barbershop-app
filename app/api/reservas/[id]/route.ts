// /app/api/reservas/[id]/route.ts
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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as Partial<ReservaDoc>;
    const _id = new ObjectId(params.id); // <-- convertir a ObjectId

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // quitamos _id si viene en body por accidente
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _ignore, ...changes } = body;

    const result = await db
      .collection<ReservaDoc>(COLLECTION)
      .findOneAndUpdate(
        { _id },                   // <-- filtrar por ObjectId
        { $set: changes },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(toAPI(result as ReservaDoc & { _id: ObjectId }));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const _id = new ObjectId(params.id); // <-- convertir a ObjectId

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const res = await db.collection<ReservaDoc>(COLLECTION).deleteOne({ _id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al eliminar" }, { status: 500 });
  }
}
