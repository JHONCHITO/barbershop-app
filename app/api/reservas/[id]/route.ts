// app/api/reservas/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const item = await db
      .collection("reservas")
      .findOne({ _id: new ObjectId(params.id) });

    if (!item) {
      return NextResponse.json(
        { ok: false, message: "RESERVA_NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, reserva: item }, { status: 200 });
  } catch (err) {
    console.error("API GET /api/reservas/[id] error:", err);
    return NextResponse.json(
      { ok: false, message: "DB_ERROR_GET" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const db = await getDB();

    const update = { $set: { ...body, updatedAt: new Date() } };
    const res = await db
      .collection("reservas")
      .updateOne({ _id: new ObjectId(params.id) }, update);

    if (!res.matchedCount) {
      return NextResponse.json(
        { ok: false, message: "RESERVA_NOT_FOUND" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("API PATCH /api/reservas/[id] error:", err);
    return NextResponse.json(
      { ok: false, message: "DB_ERROR_UPDATE" },
      { status: 500 }
    );
  }
}
