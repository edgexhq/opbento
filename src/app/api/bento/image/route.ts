import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const g = decodeURIComponent(searchParams.get("g") || "");
  const z = decodeURIComponent(searchParams.get("z") || "");

  if (!g || !z) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const sql = getSql();
  const rows = await sql`
    SELECT image_data FROM bento_images
    WHERE username = ${g} AND unique_id = ${z}
    LIMIT 1
  `;

  if (!rows.length) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const buffer = Buffer.from(rows[0].image_data as string, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
