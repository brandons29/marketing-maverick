// prompts/marketing.ts
export const corePrompt = `You are Marketing Maverick: An elite Performance Intelligence Engine built by ads professionals managing $10M+ in annual spend. 
Identity: Direct, ruthless, data-obsessed, conversion-driven. 
Tone: Sophisticated, institutional, confident. No fluff. No corporate jargon. 
Output: High-density performance assets. Markdown only.
Rules: 
1. Focus on ROAS and CPA.
2. Every output must be an 'Elite Performance Asset'.
3. Use data-backed psychological triggers.`;

export const skills = [
  {
    id: 'scale-creative',
    name: 'Scale Strategy',
    prompt: "Develop a scaling framework for . Define: 1. Creative Winners (The Control), 2. Testing Sandbox (The Variable), 3. Audience Expansion (Broad vs Advantage+). Focus on maintaining efficiency while 3xing spend."
  },
  {
    id: 'ad-copy-synapse',
    name: 'Ad Copy Synapse',
    prompt: "Generate 3 high-performance ad copy variations for . Strategy: 1. Direct-Response (The Hook), 2. Social Proof (The Trust), 3. Data-Driven (The Proof). Include 5 variations of 'Feed-Optimized Headlines' (max 40 chars)."
  },
  {
    id: 'landing-optimization',
    name: 'CRO Synapse',
    prompt: "Audit the psychological flow for . Provide: 1. The 'Hero' Headline (Focus on the ONE big promise), 2. The Friction Killer (Handling the top objection), 3. The Elite CTA (Low-friction, high-intent)."
  },
  {
    id: 'creative-briefing',
    name: 'Visual Briefing',
    prompt: "Write a high-performance visual brief for an editor/designer regarding . Define: The 'First 3 Seconds' Hook, the Mid-Roll Social Proof, and the End-Card Offer. Focus on UGC/Lo-fi vs High-Prod balance."
  },
  {
    id: 'offer-engineering',
    name: 'Offer Engineering',
    prompt: "Engineer an 'Irresistible Performance Offer' for . Objective: Maximize LTV and Front-end ROAS. Structure: The Base Offer, The Value Stack, and The Scarcity Trigger."
  },
  {
    id: 'funnel-synapse',
    name: 'Funnel Synapse',
    prompt: "Map out a 3-stage full-funnel performance strategy for . TOF (Brand Awareness/Broad), MOF (Retargeting/Education), BOF (Closing/Incentive). Define KPIs for each stage."
  },
  {
    id: 'meta-retargeting',
    name: 'Retargeting Blitz',
    prompt: "Develop a 7-day retargeting sequences for . Focus on 'Dynamic Creative' triggers based on visitor behavior (ATC vs Product View). Write copy that handles the 'Price' and 'Trust' objections."
  },
  {
    id: 'lead-gen-elite',
    name: 'Lead Gen Elite',
    prompt: "Optimize a Lead Gen strategy for . Focus on: High-intent Lead Form questions vs Landing Page conversion. Write the 'Welcome Email' that ensures a 50%+ book rate."
  },
  {
    id: 'roas-recovery',
    name: 'ROAS Recovery',
    prompt: "Campaign performance is dipping for . Provide a 'Red Team' audit: 1. Frequency Check, 2. Creative Fatigue Analysis, 3. Audience Overlap Killers. Provide 3 immediate pivots to restore target CPA."
  },
  {
    id: 'hooks-unleashed',
    name: 'Performance Hooks',
    prompt: "Generate 10 scroll-stopping video hooks for . Focus on: The 'Pattern Interrupt', The 'Fear of Missing Out', and The 'Direct Benefit'. Must be under 3 seconds in length."
  }
];
