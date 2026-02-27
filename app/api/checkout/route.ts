// app/api/checkout/route.ts — Disabled (tool is 100% free)
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Marketing Maverick is completely free. No checkout required.' },
    { status: 200 }
  );
}
