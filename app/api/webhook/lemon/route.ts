// app/api/webhook/lemon/route.ts — Disabled (tool is 100% free, no payment processing)
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'No payment processing. Marketing Maverick is free.' }, { status: 200 });
}
