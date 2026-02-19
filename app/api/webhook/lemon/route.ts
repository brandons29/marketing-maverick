// app/api/webhook/lemon/route.ts — Lemon Squeezy webhook handler
// ──────────────────────────────────────────────────────────────────────────────
// SECURITY: Verifies HMAC-SHA256 signature before any DB writes.
// CRUCIAL:  subscription_created / subscription_updated / subscription_payment_success
//           → flip user to 'pro' + reset run_count to 0
//           subscription_cancelled / subscription_expired
//           → flip user back to 'free' (graceful downgrade)
// ──────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { headers } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LSMeta {
  event_name: string;
  custom_data?: { user_id?: string };
}

interface LSEvent {
  meta?: LSMeta;
  data?: {
    attributes?: {
      status?: string;
      user_email?: string;
    };
  };
}

// ─── HMAC Signature Verification ────────────────────────────────────────────
function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Webhook] LEMON_WEBHOOK_SECRET is not configured');
    return false;
  }
  if (!signature) {
    console.warn('[Webhook] Missing x-signature header');
    return false;
  }

  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');

  // timingSafeEqual prevents timing attacks — always use this for HMAC checks
  try {
    const digestBuf = Buffer.from(digest, 'hex');
    const sigBuf = Buffer.from(signature, 'hex');
    // Lengths must match before timingSafeEqual or it throws
    if (digestBuf.length !== sigBuf.length) return false;
    return timingSafeEqual(digestBuf, sigBuf);
  } catch {
    return false;
  }
}

// ─── Events that trigger a Pro upgrade ───────────────────────────────────────
const UPGRADE_EVENTS = new Set([
  'subscription_created',
  'subscription_updated',
  'subscription_payment_success',
  'subscription_resumed',
]);

// ─── Events that trigger a downgrade to free ─────────────────────────────────
const DOWNGRADE_EVENTS = new Set([
  'subscription_cancelled',
  'subscription_expired',
  'subscription_paused',
]);

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Read raw body BEFORE any parsing — signature is over the raw bytes
  const rawBody = await req.text();
  const h = await headers();
  const signature = h.get('x-signature');

  // ── 1. Verify signature ───────────────────────────────────────────────────
  if (!verifySignature(rawBody, signature)) {
    console.warn('[Webhook] Signature verification failed — request rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 2. Parse event ────────────────────────────────────────────────────────
  let event: LSEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  if (!eventName) {
    return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
  }

  // ── 3. Route by event type ────────────────────────────────────────────────
  const isUpgrade = UPGRADE_EVENTS.has(eventName);
  const isDowngrade = DOWNGRADE_EVENTS.has(eventName);

  if (!isUpgrade && !isDowngrade) {
    // Unhandled event — acknowledge silently so LS stops retrying
    console.log(`[Webhook] Skipping unhandled event: ${eventName}`);
    return NextResponse.json({ ok: true, skipped: eventName });
  }

  // ── 4. Extract user_id from custom_data ───────────────────────────────────
  const userId = event.meta?.custom_data?.user_id;
  if (!userId) {
    console.error(`[Webhook] No user_id in custom_data for event: ${eventName}`);
    // Return 200 to prevent LS from endlessly retrying a misconfigured checkout
    return NextResponse.json({ ok: true, warning: 'No user_id — skipped DB update' });
  }

  // ── 5. Service role DB write (bypasses RLS — admin only) ─────────────────
  const supabase = createServiceRoleClient();

  if (isUpgrade) {
    // CRUCIAL: flip to pro AND reset run_count to 0
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'pro',
        run_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error(`[Webhook] DB upgrade failed for ${userId}:`, error.message);
      // Return 500 so LS retries (this IS a real failure)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`[Webhook] ✅ Upgraded user ${userId} to Pro via "${eventName}" — run_count reset`);
  }

  if (isDowngrade) {
    // Graceful downgrade: flip back to free (keep run_count as-is)
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error(`[Webhook] DB downgrade failed for ${userId}:`, error.message);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`[Webhook] ⬇️  Downgraded user ${userId} to Free via "${eventName}"`);
  }

  return NextResponse.json({ ok: true });
}
