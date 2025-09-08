// app/api/admin/notificaciones/route.ts
import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDB();
    const items = await db
      .collection("admin_notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ ok: true, notifications: items }, { status: 200 });
  } catch (err) {
    console.error("API GET /api/admin/notificaciones error:", err);
    return NextResponse.json(
      { ok: false, message: "DB_ERROR_NOTIFS" },
      { status: 500 }
    );
  }
}
