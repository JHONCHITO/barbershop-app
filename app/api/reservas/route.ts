// app/api/reservas/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDb();
    const reservas = await db.collection("reservas").find({}).toArray();
    return NextResponse.json({ ok: true, reservas });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDb();
    const { insertedId } = await db.collection("reservas").insertOne({
      ...body,
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, id: insertedId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Error inesperado" },
      { status: 500 }
    );
  }
}
