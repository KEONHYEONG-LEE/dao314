import { NextResponse } from "next/server"

const KEY = process.env.VALIDATION_KEY ?? "25b84b0f52a9d3e014d1c801426eaf04de27d97538c22e93454ffc49409bf8f16fd83554c2cf553c3374f62482bab4e3bee8aa9803a7da91504003f208cf2f00"

const HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=3600",
}

export async function GET() {
  return new NextResponse(KEY, { status: 200, headers: HEADERS })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200, headers: HEADERS })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HEADERS })
}
