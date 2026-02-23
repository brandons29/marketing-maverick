// app/api/webhook/lemon/route.ts — Lemon Squeezy payment webhook
// Handles subscription_created, order_created → flip to pro + reset run_count
// Handles subscription_expired, order_refunded → downgrade to free
import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import crypto from 'crypto';

// ─── Signature Verification ───────────────────────────────────────────────────
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

// ─── LS Webhook Payload Types ─────────────────────────────────────────────────
interface LSWebhookPayload {
  meta?: {
    event_name?: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data?: {
    attributes?: {
      user_email?: string;
      status?: string;
    };
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Webhook/Lemon] LEMON_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn('[Webhook/Lemon] Invalid signature — rejecting');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  let payload: LSWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventName = payload?.meta?.event_name;
  const userId    = payload?.meta?.custom_data?.user_id;

  if (!userId) {
    // Some LS events (e.g. store-level) don't carry user_id — silently ack
    console.warn('[Webhook/Lemon] No user_id in custom_data for event:', eventName);
    return NextResponse.json({ ok: true, note: 'no user_id, skipped' });
  }

  const supabase = createServiceRoleClient(); // bypasses RLS

  try {
    switch (eventName) {
      // ── Upgrade to Pro ──────────────────────────────────────────────────
      case 'subscription_created':
      case 'order_created': {
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'pro',
            run_count: 0,   // reset the counter — pro gets a clean slate
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (error) {
          console.error(`[Webhook/Lemon] Failed to upgrade user ${userId}:`, error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log(`[Webhook/Lemon] ✅ Upgraded user ${userId} to pro (event: ${eventName})`);
        break;
      }

      // ── Downgrade to Free ───────────────────────────────────────────────
      case 'subscription_expired':
      case 'order_refunded': {
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'free',
            updated_at: new Date().toISOString(),
            // Note: we preserve run_count on downgrade so they see their history
          })
          .eq('id', userId);

        if (error) {
          console.error(`[Webhook/Lemon] Failed to downgrade user ${userId}:`, error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log(`[Webhook/Lemon] ⬇️  Downgraded user ${userId} to free (event: ${eventName})`);
        break;
      }

      default:
        // Unhandled event — log and ack (never return 4xx, LS will retry)
        console.log(`[Webhook/Lemon] Unhandled event "${eventName}" for user ${userId} — ack`);
    }

    return NextResponse.json({ ok: true, event: eventName });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Webhook/Lemon] Unexpected error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
