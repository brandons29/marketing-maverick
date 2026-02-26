import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { callAI } from '@/lib/ai-engine';
import { INGESTION_PROMPT } from '@/prompts/ingestion';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, text } = await req.json();

    if (!url && !text) {
      return NextResponse.json({ error: 'URL or text is required' }, { status: 400 });
    }

    let contentToAnalyze = text || '';

    // 1. Scrape URL if provided
    if (url) {
      try {
        const { stdout, stderr } = await execPromise(`defuddle "${url}" --md`);
        if (stderr && !stdout) {
          console.error('Defuddle error:', stderr);
          // Fallback to simple fetch or just fail
        } else {
          contentToAnalyze = stdout;
        }
      } catch (err) {
        console.error('Defuddle execution failed:', err);
        // Fallback to text if provided, else fail
        if (!text) {
          return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
        }
      }
    }

    // 2. Fetch User's API Key
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('api_key')
      .single();

    if (profileError || !profile?.api_key) {
      return NextResponse.json({ error: 'API Key not found. Please set one in Settings.' }, { status: 400 });
    }

    // 3. Extract Context using AI (Use Gemini for high context if available, else Sonnet)
    // We'll use the first available model that is good at extraction
    const extractionResult = await callAI(
      profile.api_key,
      `Analyze the following content and extract the Business Digital Twin JSON:\n\n${contentToAnalyze}`,
      [], // No extra skills needed
      'gemini-3-1-pro' // Hardcoded for high-context ingestion or fallback to whatever is first
    );

    // 4. Parse and Clean JSON
    let businessContext = {};
    try {
      // Find JSON block in the AI response
      const jsonMatch = extractionResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        businessContext = JSON.parse(jsonMatch[0]);
      } else {
        businessContext = JSON.parse(extractionResult);
      }
    } catch (err) {
      console.error('Failed to parse AI extraction:', extractionResult);
      return NextResponse.json({ error: 'Failed to structure business context' }, { status: 500 });
    }

    // 5. Update Supabase
    const serviceRole = createServiceRoleClient();
    const { error: updateError } = await serviceRole
      .from('users')
      .update({ business_context: businessContext })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to save business context' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      context: businessContext 
    });

  } catch (err: any) {
    console.error('Ingest API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
