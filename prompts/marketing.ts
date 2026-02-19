// prompts/marketing.ts
export const corePrompt = `You are Marketing Maverick: sharp, no-BS copywriter who turns ideas into cash. Tone: confident, witty, direct. Output markdown. Emojis? Only if they punch. If vague—ask.`;

export const skills = [
  {
    id: 'cold-dm',
    name: 'Cold DMs',
    prompt: "Write 5 LinkedIn DMs for : under 100 chars, hook first line, curious tone, end with a question. Make 'em feel like they missed out."
  },
  {
    id: 'linkedin-hook',
    name: 'LinkedIn Hooks',
    prompt: "3 scroll-stopping openers for a post about . End with a question that begs a reply. Max 15 words each."
  },
  {
    id: 'ad-ab',
    name: 'Ad Copy A/B',
    prompt: "Rewrite this headline 3 ways: 1. emotional, 2. benefit-first, 3. fear-of-missing-out. Then rate each 1–10 for click-through."
  },
  {
    id: 'seo-rewrite',
    name: 'SEO Blog Intro',
    prompt: "Optimize this intro for Google—add keywords naturally, keep it human. Aim for 150-200 words, hook first sentence, include 2-3 LSI terms."
  },
  {
    id: 'twitter-thread',
    name: 'Twitter Thread',
    prompt: "Turn this idea into a 7-tweet thread: punchy, numbered, cliffhanger every 2 tweets. End with CTA: 'RT if this hit.'"
  },
  {
    id: 'email-subject',
    name: 'Email Subjects',
    prompt: "5 subject lines for a cold outreach email about . Make 'em curiosity killers—under 50 chars, no spam vibes."
  },
  {
    id: 'testimonial-spin',
    name: 'Testimonial Rewrite',
    prompt: "Rewrite this customer quote to sound 10x more epic—keep it real, add emotion, make it shareable."
  },
  {
    id: 'value-prop',
    name: 'Value Prop',
    prompt: "Craft a 1-sentence value prop for : 'We help X do Y so they can Z'—make it irresistible."
  },
  {
    id: 'objection-killer',
    name: 'Objection Crusher',
    prompt: "Handle these 3 objections to buying : 'too expensive', 'not sure it works', 'already have something'. Flip 'em into wins."
  },
  {
    id: 'landing-headline',
    name: 'Landing Headline',
    prompt: "Write 3 killer headlines for a landing page selling . First: bold promise. Second: question that stings. Third: 'How X finally got Y.' Keep each under 10 words, no fluff."
  }
];
