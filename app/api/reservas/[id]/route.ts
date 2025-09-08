import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  // Nunca devuelvas la URI completa; solo confirma si existe
  const has = Boolean(process.env.MONGODB_URI);
  return NextResponse.json({ hasMONGODB_URI: has });
}
