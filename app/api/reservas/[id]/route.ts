import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const doc = await db.collection("reservas").findOne({ _id: new ObjectId(params.id) });
    if (!doc) return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    return NextResponse.json({ ok: true, data: doc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error al obtener reserva" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    updates.updatedAt = new Date().toISOString();

    const db = await getDb();
    const result = await db
      .collection("reservas")
      .findOneAndUpdate({ _id: new ObjectId(params.id) }, { $set: updates }, { returnDocument: "after" });

    const value = (result as any)?.value ?? null;
    if (!value) return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });

    revalidateTag("reservas");
    return NextResponse.json({ ok: true, data: value });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const del = await db.collection("reservas").deleteOne({ _id: new ObjectId(params.id) });
    if (del.deletedCount === 0) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    revalidateTag("reservas");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error al eliminar" }, { status: 500 });
  }
}
