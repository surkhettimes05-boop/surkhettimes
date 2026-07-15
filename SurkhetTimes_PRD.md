# PRD: SurkhetTimes — Next-Generation Local News Platform

**Owner:** pk don | **Stage:** Solo founder, freelancer-built | **Market:** Karnali Province / Surkhet + Nepali diaspora

---

## 0. Reality Check First

The source doc is a generic global-media-2026 framework (Axios/Semafor-style, built for funded newsrooms with engineering teams). Most of it doesn't survive contact with a solo founder running a district news outlet. Before the PRD — the cut list:

**Cut entirely (not viable at this stage):**
- Dynamic real-time paywalls with propensity modeling — needs a data science team and enough traffic volume to train on. SurkhetTimes doesn't have either.
- "Inner Circle" private events / niche intelligence tier — no audience density in Surkhet to support a premium tier yet.
- Coral-style open-source community platform with SSO — overkill infrastructure for current scale; Facebook/WhatsApp groups do this job for free right now.
- 3D modeling / thermodynamic scrollytelling — irrelevant for a district outlet's story types and budget.
- Creator-personality-per-journalist strategy — you have effectively one editorial voice (yours + freelancers), not a newsroom of bylines to brand individually. Revisit only if you hire reporters.

**Keep and adapt (genuinely useful, low-cost to build):**
- Smart Brevity formatting
- AI-disclosed audio/video briefs (you already have the TTS anchor tool — this is your actual edge)
- WhatsApp/Telegram-first distribution (this is *the* channel in Nepal, more relevant here than in the original doc's context)
- Zoom summaries (short/long toggle)
- Trust/provenance signals
- Lifestyle hooks, localized (obituaries, job postings, weather/agriculture alerts, local government notices — not puzzles/recipes, which don't match Karnali's news-consumption habits)

Everything below is written against that filtered set.

---

## 1. Vision & Value Proposition

**Vision:** Become the trusted daily information utility for Surkhet and Karnali Province — the one source people and diaspora check before rumor/Facebook does.

**Core strategy — "AI-resistant, AI-assisted":**
- **Original local reporting** machines can't replicate: district government decisions, local business news, on-the-ground events, verified death/accident reports (rumor control is a real, underserved need in local Nepali news).
- **AI as production leverage, not content source** — your Nepali TTS anchor tool turns written reports into daily audio/video briefs at near-zero marginal cost. This is your actual moat versus other local outlets who don't have it.
- **Explain locally what national news means for Karnali** — budget announcements, policy changes, NRB rules — translated into "what this means for Surkhet" rather than reprinting wire copy.

---

## 2. Target Audience

| Segment | Description | Priority |
|---|---|---|
| **Local residents (Surkhet/Karnali)** | Daily consumers of local news, government notices, local business/events | Primary |
| **Nepali diaspora (Gulf, Malaysia, India, etc.)** | Migrant workers and families wanting home-district news; high emotional attachment, WhatsApp-native | High — underused audience |
| **Local businesses/advertisers** | Revenue source, not audience per se | Secondary but monetization-critical |
| **Casual social scrollers** | Facebook/TikTok-arrival traffic, low loyalty | Low priority — don't over-invest here early |

Note: the diaspora segment overlaps with the Qatar-corridor migrant worker population you looked at for SansarPay. Different product, same audience — worth remembering if you ever want cross-promotion.

---

## 3. Product Features

### A. Story Format — "Simple Brevity" (not full Semaform)
Full multi-layer Semaform (News / Reporter's View / View From / Room for Disagreement) is too much editorial overhead for your output volume. Simplified two-layer version instead:
- **The Facts** — short, objective, 3-5 bullet summary at top
- **Full Story** — below the fold, for those who want detail

### B. AI Audio/Video Briefs (your actual differentiator)
- Daily 2-3 minute Nepali-language audio/video digest using your existing anchor tool, pushed to WhatsApp/Telegram/YouTube Shorts/Facebook Reels.
- **Mandatory AI disclosure** on every AI-voiced piece — small label, not buried. This matters for trust and also protects you if AI-content scrutiny increases.
- Zero additional headcount cost — this is the leverage the big-media PRD assumed you'd need a studio for.

### C. Distribution — Messaging-First
- **WhatsApp channel/broadcast list** for daily brief — highest-retention channel for both local and diaspora audiences.
- **Telegram channel** as backup/archive (searchable history WhatsApp doesn't give well).
- **Facebook** for reach/discovery, not depth — treat as top-of-funnel, not the product.
- De-prioritize building your own app or PWA until WhatsApp/Telegram distribution is proven — don't build infrastructure the audience doesn't need yet.

### D. Local Utility Hooks (retention, not entertainment)
Swap the original doc's "puzzles/recipes/games" for what actually drives repeat visits in a district context:
- Obituary/death notices (high emotional utility, frequently searched, often shared)
- Local job postings
- Government notice board (tenders, exam results, closures)
- Weather + agriculture advisories (relevant to Karnali's farming population)

### E. Zoom Summaries
- Simple toggle: "Quick version" (3 bullets) vs "Full report" — cheap to implement, respects the fact that most readers are on mobile data and want the short version.

---

## 4. Trust & Transparency

- Label every AI-generated or AI-voiced piece clearly — non-negotiable, and increasingly a reputational risk if skipped.
- Simple corrections policy — visible "updated/corrected" tag on edited stories. Costs nothing, buys credibility that competitors likely don't bother with.
- Byline + short reporter/freelancer credit on original reporting (builds accountability without needing a full "creator persona" strategy).

---

## 5. Technical Requirements

Deliberately lightweight — no dedicated engineering team, freelancer-buildable:

- **CMS:** WordPress or a simple headless CMS — not custom-built. Don't reinvent this.
- **Distribution automation:** Script/tool to push new stories to WhatsApp broadcast + Telegram automatically (low-effort freelancer build, high leverage).
- **Audio/video pipeline:** Your existing TTS/anchor tool, formalized into a repeatable daily workflow rather than ad hoc generation.
- **Performance target:** Fast-loading mobile site — most of Karnali's readers are on 3G/4G, not fiber. Page weight matters more here than for a national outlet.
- Skip: SSO, community platform, design-token systems — solve problems you don't have yet.

---

## 6. Monetization Strategy

Realistic tiering for current scale:

1. **Local business advertising** — banner/sponsored posts from Surkhet businesses. Primary near-term revenue.
2. **Sponsored content / announcements** — local government or business paid notices (common model in district media already).
3. **Diaspora micro-donations or "support local news" tipping** — low-friction, doesn't require a subscription infrastructure build. Test appetite before building anything more complex.
4. **Skip for now:** subscriptions, paywalls, "Inner Circle" tiers — insufficient audience density to support them. Revisit only once daily active reach is large enough to segment.

---

## 7. Key Success Metrics (KPIs)

- **WhatsApp/Telegram broadcast list size** and daily open/engagement rate — your primary retention signal, more important than pageviews.
- **Weekly repeat visitors** (3+ times/week) — habitual use indicator.
- **Diaspora share of audience** — track separately; if this segment grows, it justifies a dedicated diaspora product later.
- **Ad revenue per 1,000 broadcast recipients** — tells you if the local ad model is actually viable before you over-invest.
- **Cost per daily brief produced** — should trend toward ~zero given the AI tooling; if it's not, the tool isn't doing its job.

---

## 8. Phased Roadmap

**Phase 1 (0-2 months):** Formalize daily AI brief production workflow. Launch WhatsApp broadcast + Telegram channel. Simple Facts/Full Story format on existing site.

**Phase 2 (2-4 months):** Add obituary/jobs/government-notice sections. Start local business ad sales using broadcast list size as the pitch. Track diaspora % of subscribers.

**Phase 3 (4-6+ months):** Only if Phase 1-2 metrics justify it — explore a lightweight diaspora-specific product (e.g., a weekly "Karnali digest" targeted at Gulf/Malaysia audiences) or a simple tipping/support mechanism.

Do not attempt Phase 3-type ideas (paywalls, community platforms, personality branding) until distribution and ad revenue are proven — that's the order the well-funded version of this PRD gets to skip, and you can't.
