// app/api/checkout/route.ts — DISABLED: Marketing Maverick is free
// Payments and Lemon Squeezy integration have been removed.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Payments are disabled — this tool is free.' }, { status: 404 });
}
