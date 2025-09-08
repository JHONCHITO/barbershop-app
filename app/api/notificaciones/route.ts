// app/api/notificaciones/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: lista últimas notificaciones
export async function GET() {
  try {
    const db = await getDB();
    const docs = await db
      .collection("notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const data = docs.map((d: any) => ({ ...d, id: String(d._id) }));
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    console.error("GET /api/notificaciones error →", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error al obtener notificaciones" },
      { status: 500 }
    );
  }
}

// PATCH: marcar como leída(s)
// payload: { ids: string[] }  ó  { id: string }
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids)
      ? body.ids
      : body?.id
      ? [body.id]
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Faltan ids" },
        { status: 400 }
      );
    }

    const db = await getDB();
    await db.collection("notifications").updateMany(
      { _id: { $in: ids.map((x) => new ObjectId(x)) } },
      { $set: { read: true } }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("PATCH /api/notificaciones error →", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Error al actualizar notificaciones" },
      { status: 500 }
    );
  }
}
