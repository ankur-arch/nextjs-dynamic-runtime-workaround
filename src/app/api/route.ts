import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ data: "hello" });
}

export const runtime =
  process.env.NODE_ENV === "production" ? "edge" : "nodejs";

// export const runtime = "edge";
