// lib/openai.ts — BYOK OpenAI wrapper for Marketing Maverick
// Users supply their own API key; we never store or log it in plaintext.
import OpenAI from 'openai';
import marketingData from '@/prompts/marketing.json';

const corePrompt = marketingData.core;
const skillsList = marketingData.skills;

// ─── Standard (non-streaming) call ──────────────────────────────────────────
export async function callOpenAI(
  userApiKey: string,
  userMessage: string,
  selectedSkills: string[] = [],
  model: string = 'gpt-4o-mini'
): Promise<string> {
  if (!userApiKey?.trim()) throw new Error('No API key provided');

  // Instantiate with the user's own key — never a platform key
  const openai = new OpenAI({
    apiKey: userApiKey,
    // Explicit timeout: 60s — prevents runaway requests on slow models
    timeout: 60_000,
    maxRetries: 1,
  });

  // Build system prompt: core identity + selected skill overlays
  const systemContent = buildSystemPrompt(selectedSkills);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMessage.trim() },
      ],
      temperature: 0.75,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');
    return content;
  } catch (err: unknown) {
    // Map OpenAI errors to user-friendly messages — never expose raw key details
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        throw new Error('Invalid OpenAI API key. Check your key in Settings.');
      }
      if (err.status === 429) {
        throw new Error('OpenAI rate limit hit. Wait a moment and try again.');
      }
      if (err.status === 402) {
        throw new Error('OpenAI billing issue. Check your account at platform.openai.com.');
      }
      if (err.status === 404) {
        throw new Error(`Model "${model}" not available on your OpenAI plan.`);
      }
      // Generic API error — safe to surface status only
      throw new Error(`OpenAI error (${err.status}): ${err.message.slice(0, 120)}`);
    }
    // Re-throw non-API errors (network timeouts, etc.)
    throw err;
  }
}

// ─── Streaming call (Server-Sent Events) ────────────────────────────────────
// Returns a ReadableStream compatible with Next.js streaming responses.
export async function streamOpenAI(
  userApiKey: string,
  userMessage: string,
  selectedSkills: string[] = [],
  model: string = 'gpt-4o-mini'
): Promise<ReadableStream<Uint8Array>> {
  if (!userApiKey?.trim()) throw new Error('No API key provided');

  const openai = new OpenAI({ apiKey: userApiKey, timeout: 60_000, maxRetries: 0 });
  const systemContent = buildSystemPrompt(selectedSkills);

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMessage.trim() },
      ],
      temperature: 0.75,
      max_tokens: 1500,
      stream: true,
    });

    // Convert OpenAI's async iterable to a Web ReadableStream
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              // SSE format: "data: <content>\n\n"
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }
          // Signal end of stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  } catch (err: unknown) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) throw new Error('Invalid OpenAI API key. Check Settings.');
      if (err.status === 429) throw new Error('OpenAI rate limit hit. Try again shortly.');
      throw new Error(`OpenAI error (${err.status}): ${err.message.slice(0, 120)}`);
    }
    throw err;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildSystemPrompt(selectedSkills: string[]): string {
  if (!selectedSkills.length) {
    return `${corePrompt}\n\nDefault mode: make it sell. No fluff, all results.`;
  }
  const selected = skillsList.filter((s) => selectedSkills.includes(s.id));
  return `${corePrompt}\n\n${selected.map((s) => s.prompt).join('\n\n')}`;
}

// ─── Lightweight key validator (no network call) ─────────────────────────────
export function isValidOpenAIKeyFormat(key: string): boolean {
  // Modern LS keys: sk-proj-... or sk-...
  return /^sk-(proj-)?[A-Za-z0-9_-]{20,}$/.test(key.trim());
}
