import OpenAI from 'openai';
import { corePrompt, skills as skillsList } from '@/prompts/marketing';

// ─── Standard (non-streaming) call ──────────────────────────────────────────
export async function callOpenAI(
  userApiKey: string,
  userMessage: string,
  selectedSkills: string[] = [],
  model: string = 'gpt-4o-mini'
): Promise<string> {
  if (!userApiKey?.trim()) throw new Error('No API key provided');

  const openai = new OpenAI({
    apiKey: userApiKey,
    timeout: 60_000,
    maxRetries: 1,
  });

  const systemContent = buildSystemPrompt(selectedSkills);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMessage.trim() },
      ],
      temperature: 0.75,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');
    return content;
  } catch (err: unknown) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) throw new Error('Invalid OpenAI API key. Check your key in Settings.');
      if (err.status === 429) throw new Error('OpenAI rate limit hit. Wait a moment and try again.');
      if (err.status === 402) throw new Error('OpenAI billing issue. Check your account at platform.openai.com.');
      if (err.status === 404) throw new Error(`Model "${model}" not available on your OpenAI plan.`);
      throw new Error(`OpenAI error (${err.status}): ${err.message.slice(0, 120)}`);
    }
    throw err;
  }
}

// ─── Streaming call (Server-Sent Events) ────────────────────────────────────
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
      max_tokens: 2000,
      stream: true,
    });

    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }
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

export function buildSystemPrompt(selectedSkills: string[]): string {
  if (!selectedSkills.length) {
    return `${corePrompt}\n\nDefault mode: Execute high-performance strategic analysis. No fluff. All results. Focus on ROAS and CPA.`;
  }
  const selected = skillsList.filter((s) => selectedSkills.includes(s.id));
  return `${corePrompt}\n\nSelected Strategy Modules:\n${selected.map((s) => `- ${s.name}: ${s.prompt}`).join('\n')}\n\nConstraint: Synthesize all selected modules into one high-density performance asset.`;
}
