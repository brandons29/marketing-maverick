// app/api/webhook/lemon/route.ts — DISABLED: Lemon Squeezy removed
// Marketing Maverick is a free tool — no payment webhooks needed.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Webhook endpoint disabled.' }, { status: 404 });
}
