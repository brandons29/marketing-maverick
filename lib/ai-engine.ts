/**
 * Maverick Multi-Provider AI Engine
 * Supports: OpenAI, Anthropic (Claude), Google (Gemini), xAI (Grok)
 * Keys stored as JSON: { openai: "sk-...", anthropic: "sk-ant-...", google: "AIza...", xai: "xai-..." }
 */
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from './openai';

export type Provider = 'openai' | 'anthropic' | 'google' | 'xai' | 'maton';

export interface ProviderKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  xai?: string;
  maton?: string;
}

export const MODEL_CATALOG = [
  // OpenAI
  { id: 'gpt-5.3-codex',  provider: 'openai'    as Provider, label: 'GPT-5.3 Codex',  desc: 'Agentic · Ultra High Speed', group: 'OpenAI' },
  { id: 'gpt-5',          provider: 'openai'    as Provider, label: 'GPT-5',          desc: 'Elite · Multi-Model Logic', group: 'OpenAI' },
  { id: 'gpt-4o',         provider: 'openai'    as Provider, label: 'GPT-4o',         desc: 'Stable · Production', group: 'OpenAI' },
  // Anthropic
  { id: 'claude-5-sonnet-202602',     provider: 'anthropic' as Provider, label: 'Claude 5 Sonnet', desc: 'Cutting Edge · Newest', group: 'Claude' },
  { id: 'claude-4-6-sonnet-202601',   provider: 'anthropic' as Provider, label: 'Claude 4.6 Sonnet', desc: 'Ultra High Performance', group: 'Claude' },
  { id: 'claude-3-7-sonnet-20250219', provider: 'anthropic' as Provider, label: 'Claude 3.7 Sonnet', desc: 'Stable Elite Strategy', group: 'Claude' },
  // Google
  { id: 'gemini-3-1-pro',             provider: 'google'    as Provider, label: 'Gemini 3.1 Pro',  desc: 'Apex · 1M Context', group: 'Gemini' },
  { id: 'gemini-3-0-flash',           provider: 'google'    as Provider, label: 'Gemini 3.0 Flash',  desc: 'Ultra Fast Intelligence', group: 'Gemini' },
  { id: 'gemini-2-0-pro-exp-02-05',   provider: 'google'    as Provider, label: 'Gemini 2.0 Pro',    desc: 'Experimental Pro', group: 'Gemini' },
  // xAI
  { id: 'grok-4-1',                   provider: 'xai'       as Provider, label: 'Grok-4.1',          desc: 'Supreme · Real-time Intel', group: 'Grok' },
  { id: 'grok-3',                     provider: 'xai'       as Provider, label: 'Grok-3',            desc: 'Stable Grok Intelligence', group: 'Grok' },
];

export function getProviderForModel(modelId: string): Provider {
  return MODEL_CATALOG.find(m => m.id === modelId)?.provider ?? 'openai';
}

function parseKeys(raw: string): ProviderKeys {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object') return parsed as ProviderKeys;
  } catch {}
  // Legacy: plain string = OpenAI key
  return { openai: raw };
}

// ─── Standard call ───────────────────────────────────────────────────────────
export async function callAI(
  rawKey: string,
  userMessage: string,
  selectedSkills: string[],
  modelId: string
): Promise<string> {
  const keys = parseKeys(rawKey);
  const provider = getProviderForModel(modelId);
  const systemContent = buildSystemPrompt(selectedSkills);

  if (provider === 'openai') {
    const key = keys.openai;
    if (!key) throw new Error('OpenAI key not configured. Add it in Settings.');
    const client = new OpenAI({ apiKey: key, timeout: 60_000, maxRetries: 1 });
    const res = await client.chat.completions.create({
      model: modelId, temperature: 0.75, max_tokens: 2000,
      messages: [{ role: 'system', content: systemContent }, { role: 'user', content: userMessage }],
    });
    return res.choices[0]?.message?.content ?? '';
  }

  if (provider === 'anthropic') {
    const key = keys.anthropic;
    if (!key) throw new Error('Anthropic (Claude) key not configured. Add it in Settings.');
    const client = new Anthropic({ apiKey: key });
    const res = await client.messages.create({
      model: modelId, max_tokens: 2000,
      system: systemContent,
      messages: [{ role: 'user', content: userMessage }],
    });
    return (res.content[0] as any)?.text ?? '';
  }

  if (provider === 'google') {
    const key = keys.google;
    if (!key) throw new Error('Google (Gemini) key not configured. Add it in Settings.');
    const client = new GoogleGenerativeAI(key);
    const model = client.getGenerativeModel({ model: modelId, systemInstruction: systemContent });
    const res = await model.generateContent(userMessage);
    return res.response.text();
  }

  if (provider === 'xai') {
    const key = keys.xai;
    if (!key) throw new Error('xAI (Grok) key not configured. Add it in Settings.');
    // xAI is OpenAI-compatible
    const client = new OpenAI({ apiKey: key, baseURL: 'https://api.x.ai/v1', timeout: 60_000, maxRetries: 1 });
    const res = await client.chat.completions.create({
      model: modelId, temperature: 0.75, max_tokens: 2000,
      messages: [{ role: 'system', content: systemContent }, { role: 'user', content: userMessage }],
    });
    return res.choices[0]?.message?.content ?? '';
  }

  throw new Error(`Unknown provider for model: ${modelId}`);
}

// ─── Streaming call ──────────────────────────────────────────────────────────
export async function streamAI(
  rawKey: string,
  userMessage: string,
  selectedSkills: string[],
  modelId: string
): Promise<ReadableStream<Uint8Array>> {
  const keys = parseKeys(rawKey);
  const provider = getProviderForModel(modelId);
  const systemContent = buildSystemPrompt(selectedSkills);
  const encoder = new TextEncoder();

  const makeStream = (asyncIter: AsyncIterable<string>) =>
    new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of asyncIter) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

  if (provider === 'openai') {
    const key = keys.openai;
    if (!key) throw new Error('OpenAI key not configured. Add it in Settings.');
    const client = new OpenAI({ apiKey: key, timeout: 60_000, maxRetries: 0 });
    const stream = await client.chat.completions.create({
      model: modelId, temperature: 0.75, max_tokens: 2000, stream: true,
      messages: [{ role: 'system', content: systemContent }, { role: 'user', content: userMessage }],
    });
    return makeStream((async function* () { for await (const c of stream) { const d = c.choices[0]?.delta?.content; if (d) yield d; } })());
  }

  if (provider === 'anthropic') {
    const key = keys.anthropic;
    if (!key) throw new Error('Anthropic (Claude) key not configured. Add it in Settings.');
    const client = new Anthropic({ apiKey: key });
    const stream = client.messages.stream({
      model: modelId, max_tokens: 2000,
      system: systemContent,
      messages: [{ role: 'user', content: userMessage }],
    });
    return makeStream((async function* () { for await (const ev of stream) { if (ev.type === 'content_block_delta' && (ev.delta as any).type === 'text_delta') yield (ev.delta as any).text; } })());
  }

  if (provider === 'google') {
    const key = keys.google;
    if (!key) throw new Error('Google (Gemini) key not configured. Add it in Settings.');
    const client = new GoogleGenerativeAI(key);
    const model = client.getGenerativeModel({ model: modelId, systemInstruction: systemContent });
    const result = await model.generateContentStream(userMessage);
    return makeStream((async function* () { for await (const chunk of result.stream) { yield chunk.text(); } })());
  }

  if (provider === 'xai') {
    const key = keys.xai;
    if (!key) throw new Error('xAI (Grok) key not configured. Add it in Settings.');
    const client = new OpenAI({ apiKey: key, baseURL: 'https://api.x.ai/v1', timeout: 60_000, maxRetries: 0 });
    const stream = await client.chat.completions.create({
      model: modelId, temperature: 0.75, max_tokens: 2000, stream: true,
      messages: [{ role: 'system', content: systemContent }, { role: 'user', content: userMessage }],
    });
    return makeStream((async function* () { for await (const c of stream) { const d = c.choices[0]?.delta?.content; if (d) yield d; } })());
  }

  throw new Error(`Unknown provider for model: ${modelId}`);
}
