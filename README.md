# LÚMINA — Ophthalmology Platform

Full-stack Next.js 14 application. GDPR Article 9 compliant. Supabase (EU) backend.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Shadcn UI primitives
- **Supabase** (PostgreSQL + Auth + Realtime) — EU Frankfurt region
- **WATI** for WhatsApp template messages
- **Make.com / Telegram** for CEO lead notifications

---

## 1. Supabase Project Setup

### 1.1 Create project in EU region

1. Go to [supabase.com](https://supabase.com) → New Project
2. **Region: EU (Frankfurt)** — mandatory for GDPR Art. 9 compliance
3. Copy your **Project URL** and **anon key** from Settings → API

### 1.2 Run the schema

1. Open **SQL Editor** in your Supabase dashboard
2. Paste the full contents of `supabase/schema.sql`
3. Click **Run**

### 1.3 Configure Auth

1. Go to **Authentication → Providers → Email**
2. Enable **Magic Link** (passwordless — recommended for CEO single-user)
3. Set **Site URL** to your production domain (e.g. `https://lumina.es`)
4. Add `http://localhost:3000` to **Redirect URLs** for local dev
5. Under **Authentication → Email Templates**, customize the magic link email with your branding

### 1.4 Verify RLS

In the SQL Editor, confirm policies are active:
```sql
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public';
```
You should see policies for `patients`, `medical_intake`, `appointments`.

---

## 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## 3. WATI WhatsApp Setup

1. Create account at [wati.io](https://wati.io)
2. Connect your WhatsApp Business number
3. Create template messages with these exact names:
   - `lumina_consult_confirm_es` / `lumina_consult_confirm_en`
   - `lumina_surgery_confirm_es` / `lumina_surgery_confirm_en`
   - `lumina_postop_day1_es` / `lumina_postop_day1_en`
   - `lumina_postop_day7_es` / `lumina_postop_day7_en`
4. Get your API endpoint and token from WATI dashboard → API

---

## 4. Make.com / Telegram Notification

**Option A — Make.com:**
1. Create a new scenario with a **Webhook** trigger
2. Copy the webhook URL → `MAKE_WEBHOOK_URL` in `.env.local`
3. Add actions: send email, Slack message, etc.

**Option B — Telegram:**
1. Create a bot via [@BotFather](https://t.me/botfather) → copy token
2. Start a chat with your bot, get your chat ID via `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

---

## 5. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public intake form  
Open [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) — CEO dashboard (requires login)

---

## 6. Deployment (Vercel)

```bash
npm i -g vercel
vercel --prod
```

In Vercel dashboard → Settings → Environment Variables, add all variables from `.env.local`.

Set **Function Region** to `fra1` (Frankfurt) to keep data processing in the EU.

---

## 7. GDPR Compliance Notes

| Requirement | Implementation |
|---|---|
| Art. 9 — Health data protection | Supabase EU (Frankfurt), RLS on all tables |
| Art. 7 — Consent | Explicit checkbox, timestamped `gdpr_consent_at` |
| Art. 17 — Right to erasure | Delete patient row cascades to all related data |
| No PII in webhooks | `notify-ceo` sends only `patient_id` + metadata |
| Data sovereignty | No Typeform, Zapier, or Notion involved |

---

## 8. Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public intake form page
│   ├── login/page.tsx              # CEO magic link login
│   ├── admin/dashboard/page.tsx    # Protected Kanban dashboard
│   └── api/
│       ├── notify-ceo/route.ts     # Lead notification webhook
│       ├── whatsapp-trigger/route.ts
│       └── auth/
│           ├── callback/route.ts
│           └── signout/route.ts
├── components/
│   ├── PatientIntakeForm.tsx        # Public GDPR-gated form
│   ├── dashboard/
│   │   ├── KanbanBoard.tsx          # Realtime Kanban
│   │   ├── PatientCard.tsx
│   │   └── PatientSlideOver.tsx     # Detail + action triggers
│   └── ui/                          # Shadcn-style primitives
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── utils.ts
│   └── dateUtils.ts
├── middleware.ts                    # Auth guard for /admin/*
└── types/supabase.ts               # Full TypeScript types
```
