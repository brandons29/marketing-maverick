import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { executeMatonAction, getMatonConnections } from '@/lib/maton';

// GET /api/maton — returns list of connected apps for this user
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('api_key').eq('id', user.id).single();
  if (!profile?.api_key) return NextResponse.json({ connections: [] });

  let matonKey: string | null = null;
  try { matonKey = JSON.parse(profile.api_key)?.maton ?? null; } catch { /* legacy key */ }
  if (!matonKey) return NextResponse.json({ connections: [] });

  const connections = await getMatonConnections(matonKey);
  return NextResponse.json({ connections });
}

// POST /api/maton — execute a Maton action
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { app, action, params, synapseContent } = body as {
      app: string;
      action: string;
      params: Record<string, unknown>;
      synapseContent?: string;
    };

    if (!app || !action) return NextResponse.json({ error: 'app and action are required' }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('api_key').eq('id', user.id).single();
    let matonKey: string | null = null;
    try { matonKey = JSON.parse(profile?.api_key ?? '')?.maton ?? null; } catch { /* legacy */ }
    if (!matonKey) return NextResponse.json({ error: 'Maton key not configured. Add it in Settings.' }, { status: 403 });

    // Auto-inject synapse content into params when relevant
    const enrichedParams = { ...params };
    if (synapseContent) {
      if (action === 'create-page') enrichedParams.content = synapseContent;
      if (action === 'create-document') enrichedParams.text = synapseContent;
      if (action === 'send-message') enrichedParams.text = enrichedParams.text || synapseContent;
      if (action === 'append-text') enrichedParams.text = synapseContent;
      if (action === 'create-draft') enrichedParams.body = synapseContent;
    }

    const result = await executeMatonAction(matonKey, { app, action, params: enrichedParams });
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
