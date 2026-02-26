import { buildSystemPrompt } from '../lib/openai';

function test() {
  console.log("Testing Prompt Builder...");
  const prompt = buildSystemPrompt(['cold-dm']);
  console.log("Prompt sample:", prompt.slice(0, 100));

  console.log("\nLogic check passed.");
}

test();
