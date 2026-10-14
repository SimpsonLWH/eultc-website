# Stage review - 14 October 2026

Written after finishing the last two Milestone 1 tickets (T11 #14 and T12 #15).
Covers where the V1 beta stands, what is verified working, the open risks, and
the UX gap between the deployed product and the visual baseline.

## Milestone status

| Milestone | State | Notes |
| --- | --- | --- |
| M1 - Foundations | **Complete (5/5)** | T01, T02, T03 closed earlier; T11 and T12 merged on 14 Oct. |
| M2 - V1 BUCS: core | 2/3 | T04 and T05 merged; T06 (response tracker) open. |
| M3 - V1 BUCS: selection | 1/3 | T07 done; T08 (team sheet) and T09 (rankings) open. |
| M4 - V1 BUCS: beta | 0/2 | T10 (dashboard) and T13 (real data, QA, launch checklist) open. |

## Verified working today

- Production deploys from `main` on Vercel, with a preview deployment per pull
  request (verified on PR #35).
- GitHub Actions runs `npm ci`, lint, tests and build on every PR and push to
  `main` (verified green on Node 24 from `.nvmrc`; 31 tests pass).
- `main` now requires a pull request and the `ci` check; direct pushes and
  force-pushes are blocked (admins can override for emergencies).
- Auth (dev login), fixtures and admin forms, the weekly availability form
  (including the MongoDB write path) and the ranked selection engine are merged
  and pass lint, tests and build on Node 24 with Mongoose 9.

## Open findings

### 1. Production database is unreachable (being fixed separately)

`/api/health` times out or returns 503, `/api/rankings` returns
`{"error":"database unavailable"}`, and data-backed pages (/fixtures,
/availability) stay on their skeleton shell because the streamed content never
arrives. Reported cause: the production `MONGODB_URI` was dropped from the
Vercel environment; another session is restoring it. The triage recipe is in
docs/deployment.md (incident log). The beta is not demoable against production
data until this is fixed.

### 2. Board drift (mostly fixed today)

- T05 merged on 13 Oct but stayed "Todo" on the board - fixed in the T11 PR.
- The fixture model changed on 13 Oct (`teamsPlaying` became `gender` +
  `teamNumber`, commit 435591f) while the T02/T04 ticket text still describes
  `teamsPlaying`. The ticket text is historical and was left as written; the
  current model is documented by the code and formatTeamLabel helper.

### 3. Parallel stream coordination

The `feat/eultc-branding` branch (crest palette, club badge, glass nav,
semantic tokens) was written before today's merges and needs a rebase or merge
of `main` before its PR. It is the only approved in-flight UI stream; new UI
work should stack on it rather than duplicate it.

## UX review: deployed site vs the visual baseline

The Lovable demo (https://tennis-hub-zenith.lovable.app) remains the visual
baseline: full-bleed court imagery, a bold hero, photo-led news and feature
cards, and club-flavoured copy. The deployed product currently reads as a
generic SaaS dashboard:

- Blue palette (pre-branding branch), default Geist typography, an "EU"
  monogram instead of the crest.
- Home shows a "Match operations" heading, a 2x2 grid of workspace cards with
  Open/Preparing/Draft badges, an "Open workspace" link on each, and a "Find a
  player" search box - none of it in club language.
- No photography or imagery anywhere; 375px nav is cramped but functional.

The branding branch closes the identity half of this gap (crest green, badge
logo, glass nav, semantic tokens). The structure half - hero, imagery slots,
copy, type and empty states - does not exist yet and is tracked in #36, which
should land inside the T10/T08/T09 work.

## Recommended next steps

1. Restore the production `MONGODB_URI` and confirm `/api/health` returns
   `{"ok":true,"database":"connected"}` (in progress elsewhere).
2. Land the rebased branding branch.
3. Work the remaining tickets in order: T06, then T08 + T09, then T10 + T13
   for the beta, with the UX pass (#36) folded into T10/T08/T09.
4. Migrate auth off the next-auth v5 beta to Better Auth (#37) as the next
   standalone ticket after M1, before T08/T09/T10 build more UI on the session
   shape.
5. Adopt TypeScript 7 once typescript-eslint supports the TS 7.1 API (#38).
