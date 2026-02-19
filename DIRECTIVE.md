# MASTER DIRECTIVE: Project Marketing Maverick

**Status:** READY FOR EXECUTION  
**Kickoff:** February 18, 2026 @ 2:00 AM MT  
**Objective:** Build and deploy a production-grade, revenue-generating SaaS for Swayze Media.

---

## 🏗️ 1. ARCHITECTURE & STACK
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide React
- **Backend:** Supabase (Auth & DB)
- **Payments:** Lemon Squeezy ($15/mo "Maverick" Tier)
- **Model:** BYOK (Bring Your Own Key) - Users provide their own OpenAI key.
- **Trial:** 5 free runs per user.

---

## 📂 2. REPO STRUCTURE
The night crew must scaffold the following structure in `/Users/brandonswayze/.openclaw/workspace/marketing-maverick`:

```
marketing-maverick/
├── app/
│   ├── dashboard/ page.tsx, layout.tsx
│   ├── api/
│   │   ├── chat/ route.ts (Proxy calls with user's key)
│   │   ├── checkout/ route.ts (LS Checkout flow)
│   │   ├── webhook/ lemon/ route.ts (LS Webhook handler)
│   │   └── auth/ signout/ route.ts
│   ├── auth/ login/page.tsx, signup/page.tsx
│   ├── pricing/ page.tsx
│   ├── settings/ page.tsx (API Key input)
│   └── layout.tsx (Global Nav + Auth Guard)
├── components/
│   ├── ChatWindow.tsx, SkillSelector.tsx, ApiKeyInput.tsx, PaywallModal.tsx
├── lib/
│   ├── supabase.ts, openai.ts, prompts.ts
├── prompts/
│   ├── marketing.ts (Hardcoded exports), marketing.json
├── .env.local
└── DEPLOYMENT_CHECKLIST.md
```

---

## 🧠 3. CORE LOGIC
- **Identity:** "Marketing Maverick" (Ruthless, no-BS, conversion-obsessed).
- **Menu:** 10 "Killer Prompts" (Cold DMs, LinkedIn Hooks, Ad Copy A/B, etc.).
- **BYOK Engine:** Backend routes requests to OpenAI using the `api_key` stored in the user's profile.
- **Paywall:** 
  - Free users: 5 runs max.
  - Pro users: Unlimited.
  - Upgrade: Lemon Squeezy -> Webhook -> Reset `run_count` to 0 + flip to `pro`.

---

## 🌓 4. NIGHT CREW MARCHING ORDERS

### **[2:00 AM] PHASE 1: Scaffolding & UI**
- Initialize Next.js project.
- Implement `app/layout.tsx` (Sticky Nav), `auth/signup`, and `auth/login`.
- Build the `dashboard/page.tsx` with the **Weapon Picker** sidebar.
- Style: Matte Black / Cyber Neon / Gold. High contrast.

### **[3:00 AM] PHASE 2: Logic & Revenue**
- Implement `lib/openai.ts` and `api/chat/route.ts` (The Maverick Engine).
- Wire `api/checkout` and `api/webhook/lemon`.
- **Crucial:** Ensure the webhook resets `run_count` and flips status to `pro`.
- Set up `settings/page.tsx` for secure API key entry.

### **[4:00 AM] PHASE 3: QA & Deployment**
- Audit all files against the blueprint.
- Run `npm run build` to verify production readiness.
- Initialize Git and push to `brandons29/marketing-maverick`.
- Verify Vercel auto-deploy is triggered.
- Document all findings in `memory/daily/nighttime-qa-YYYY-MM-DD.md`.

---

## 🛡️ 5. SECURITY RULES
- **API Keys:** Mask in UI (••••), encrypt in Supabase (`pgcrypto`), never log to console.
- **RLS:** `auth.uid() = id` must be strictly enforced on the `users` table.

---

## 📈 6. SUCCESS CRITERIA
- User can sign up without OAuth hassle.
- User can enter their own OpenAI key.
- User hits a paywall after 5 runs.
- Successful payment via LS test card flips status to Pro and resets counter.
- Code is clean, documented, and pushed to GitHub.

**Maverick Launch: GO.** 🚀
