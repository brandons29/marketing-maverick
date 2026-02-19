# Marketing Maverick: Deployment Checklist

## 1. Supabase Setup
- [ ] Create new project: "Marketing Maverick"
- [ ] SQL Editor: Run `supabase_schema.sql`
- [ ] Authentication: Enable Email/Password provider (Confirm email is optional)
- [ ] Row Level Security: Verify `auth.uid() = id` policy is active on `users` table
- [ ] Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Get `SUPABASE_SERVICE_ROLE_KEY` (for the Lemon Squeezy webhook)

## 2. Lemon Squeezy Setup
- [ ] Create Store: "Swayze Media Maverick"
- [ ] Create Product: "Maverick Pro" ($15/mo recurring subscription)
- [ ] Get `LEMON_PRO_VARIANT_ID`
- [ ] Get `LEMON_API_KEY` (Settings -> API)
- [ ] Webhook: Set POST URL to `https://[your-vercel-domain].vercel.app/api/webhook/lemon`
- [ ] Webhook: Select event `subscription_created`
- [ ] Webhook: Set `LEMON_WEBHOOK_SECRET`
- [ ] Sandbox Test: Pay with test card (4242...), verify webhook fires & status flips

## 3. Deployment (Vercel)
- [ ] Initialize Git: `git init`
- [ ] Commit MVP: `git add . && git commit -m "Maverick MVP"`
- [ ] Connect Remote: `git remote add origin https://github.com/brandons29/marketing-maverick.git`
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Import to Vercel: Go to vercel.com → New Project → Import Repo
- [ ] Set Env Vars: Add all keys in Vercel Dashboard > Settings > Environment Variables
- [ ] Deploy 🚀

## 4. Final Verification
- [ ] Flow Test: Signup -> Confirm Email -> Add Key -> Run 5 Times
- [ ] Paywall Test: Verify "Unleash" button locks at 6th run
- [ ] Upgrade Test: Pay via Lemon Squeezy -> Verify webhook resets runs to 0
- [ ] Dashboard Verify: Ensure "Unlimited" badge shows for Pro users
- [ ] Console Audit: Verify API keys never hit server logs or client console

## 5. Domain & Launch
- [ ] Buy Domain: (e.g., marketingmaverick.ai)
- [ ] Vercel DNS: Point custom domain to project
- [ ] Assets: Add favicon from favicon.io
- [ ] Launch: Post to Product Hunt / Indie Hackers / X
