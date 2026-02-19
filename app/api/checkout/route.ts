// app/api/checkout/route.ts — Create a Lemon Squeezy checkout session
// POST /api/checkout { userId: string }
// Returns { url: string } — the hosted checkout URL to redirect to.
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    // ── Auth guard: verify the caller is actually logged in ─────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId } = body as { userId?: string };

    // Ensure the userId in the body matches the authenticated user (no spoofing)
    if (!userId || userId !== user.id) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }

    // ── Env var checks ────────────────────────────────────────────────────────
    const apiKey = process.env.LEMON_API_KEY;
    const storeId = process.env.LEMON_STORE_ID;
    const variantId = process.env.LEMON_PRO_VARIANT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    if (!apiKey || !storeId || !variantId) {
      console.error('[Checkout] Missing env vars:', {
        hasApiKey: !!apiKey,
        hasStoreId: !!storeId,
        hasVariantId: !!variantId,
      });
      return NextResponse.json({ error: 'Checkout not configured' }, { status: 500 });
    }

    // ── Build Lemon Squeezy v1 checkout payload ───────────────────────────────
    const payload = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            // Pass user.id as custom field so webhook can flip their status
            custom: { user_id: userId },
          },
          checkout_options: {
            // Pre-fill the email for a smoother UX
            email: user.email ?? undefined,
          },
          product_options: {
            redirect_url: `${appUrl}/dashboard?upgrade=success`,
            receipt_button_text: 'Back to Maverick',
            receipt_thank_you_note: "You're now Pro — go dominate. 🚀",
          },
          expires_at: null, // No expiry on checkout links
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
    };

    // ── Call Lemon Squeezy API ────────────────────────────────────────────────
    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[Checkout] LS API error:', res.status, text.slice(0, 500));
      return NextResponse.json(
        { error: `Checkout creation failed (${res.status})` },
        { status: 500 }
      );
    }

    const json = await res.json();
    const url = json?.data?.attributes?.url as string | undefined;

    if (!url) {
      console.error('[Checkout] No URL in LS response:', JSON.stringify(json).slice(0, 300));
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Checkout] Unexpected error:', msg.slice(0, 200));
    return NextResponse.json({ error: 'Checkout failed — please try again' }, { status: 500 });
  }
}
