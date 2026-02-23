// app/api/checkout/route.ts — Lemon Squeezy checkout session
// Creates a hosted checkout URL and redirects the user.
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

interface LSCheckoutResponse {
  data?: {
    attributes?: {
      url?: string;
    };
  };
  errors?: Array<{ detail: string }>;
}

export async function POST() {
  try {
    // ── Auth ───────────────────────────────────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Env Validation ─────────────────────────────────────────────────────
    const apiKey    = process.env.LEMON_API_KEY;
    const storeId   = process.env.LEMON_STORE_ID;
    const variantId = process.env.LEMON_PRO_VARIANT_ID;
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    if (!apiKey || !storeId || !variantId) {
      console.error('[Checkout] Missing Lemon Squeezy env vars');
      return NextResponse.json(
        { error: 'Payment configuration error. Contact support.' },
        { status: 500 }
      );
    }

    // ── Create Checkout ────────────────────────────────────────────────────
    const res = await fetch(`${LS_API_BASE}/checkouts`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            // Pre-fill user email so they don't have to retype
            checkout_data: {
              email: user.email ?? '',
              custom: {
                user_id: user.id, // passed back in webhook for attribution
              },
            },
            checkout_options: {
              embed: false,
            },
            product_options: {
              redirect_url: `${appUrl}/dashboard?upgrade=success`,
              receipt_link_url: `${appUrl}/dashboard`,
            },
            expires_at: null, // session doesn't expire
          },
          relationships: {
            store: {
              data: { type: 'stores', id: storeId },
            },
            variant: {
              data: { type: 'variants', id: variantId },
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[Checkout] LS API error:', res.status, text.slice(0, 200));
      return NextResponse.json(
        { error: 'Failed to create checkout session.' },
        { status: 502 }
      );
    }

    const json: LSCheckoutResponse = await res.json();
    const url = json?.data?.attributes?.url;

    if (!url) {
      console.error('[Checkout] No URL in LS response:', JSON.stringify(json).slice(0, 200));
      return NextResponse.json(
        { error: 'Invalid checkout response from payment provider.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error('[Checkout] Unexpected error:', msg.slice(0, 200));
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
