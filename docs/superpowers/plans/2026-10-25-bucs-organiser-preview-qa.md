# BUCS Organiser Preview Data and Matchweek QA Implementation Plan

> **For agentic workers:** Execute inline. Follow red-green-refactor for every behavior change and record task completion in the execution ledger.

**Goal:** Use the BUCS organiser workbook as a local-only, non-factual preview dataset and correct matchweek selection so availability is honored per fixture and four reserves are shown.

**Architecture:** A pure parser converts the workbook's Ranking List and Fixture List into typed preview records. A guarded seed command writes those records, synthetic identities and deterministic availability responses only to a database whose name contains `preview`. Matchweek selection consumes fixture-specific responses, fills eligible teams strongest-first, and computes four reserves.

**Tech Stack:** Next.js 16.4.2, React 19.3, TypeScript 5.9, Mongoose 9, Vitest 5, `read-excel-file`.

**Spec:** `docs/beta-launch-checklist.md`

## Global Constraints

- Never write preview names or inferred fixture details to production.
- Never commit the source workbook, player roster or generated identity mapping.
- Skip “No Fixture” and unresolved “Cup Tie” cells.
- Normalize Matchweek 2 to 2026-10-07 and Matchweek 6 to 2026-11-04.
- Use Matchweek 6 as the preview's five-team open week.
- Keep rank eligibility: a player can answer their own team or a stronger team, never a weaker team.
- Preserve four players per team and add four reserves.
- No database schema, HTTP API or production data changes.
- Keep the beta-launch checklist draft-only; launch details remain unresolved.
- The user explicitly requested that issue #16 be closed after this revised preview/QA scope is complete.

## Review Focus

- Availability for one fixture must never place a player into a different fixture.
- Non-contiguous team numbers must map to the correct fixtures.
- Duplicate or conflicting answers must not duplicate a selected player.
- The preview seed must refuse production databases and default to dry-run.
- Actual names and synthetic identities must remain outside the public repository.

---

### Task 1: Documentation and ticket scope

**Files:**
- Create: `docs/beta-launch-checklist.md`
- Modify: `TASKS.md`

- [ ] Write the draft beta launch checklist with unresolved launch blockers, rehearsal steps, fallback and sign-off.
- [ ] Update T13 to describe preview data and logic QA separately from the future real-data beta launch.
- [ ] Create a follow-up GitHub issue for the real beta launch and update #16's body/title without closing it yet.
- [ ] Verify Markdown formatting and commit.

### Task 2: Pure workbook parser

**Files:**
- Create: `lib/bucs-organiser/parse.ts`
- Test: `lib/bucs-organiser/parse.test.ts`

**Interfaces:**
- Produces: `parseRankingRows(rows: readonly unknown[][]): PreviewPlayer[]`
- Produces: `parseFixtureRows(rows: readonly unknown[][]): PreviewFixtureParseResult`

- [ ] Write failing tests for 39 ranks, trimmed names, 33 fixtures, two skipped cup entries, UK date normalization and invalid row rejection.
- [ ] Run the focused test and confirm the expected missing-module failure.
- [ ] Implement the typed parser and deterministic canonical matchweek dates.
- [ ] Run focused tests and the full suite; commit.

### Task 3: Preview-only seed command

**Files:**
- Modify: `package.json`
- Create: `scripts/seed-bucs-preview.ts`
- Test: `lib/bucs-organiser/preview-policy.test.ts`
- Test: `lib/bucs-organiser/preview-policy.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: parser from Task 2.
- Produces: `assertPreviewDatabaseName(name: string): void`
- Produces: command `npm run db:seed:bucs-preview -- --file <xlsx> [--apply]`

- [ ] Write failing tests that accept names containing `preview` and reject `prod`, `production` and unrelated names.
- [ ] Run focused tests and confirm failure.
- [ ] Implement the guard, xlsx reader, dry-run report and preview reset/upsert path.
- [ ] Seed 39 players, 33 fixtures, one open Matchweek 6, rank-1 and captain auth accounts, and the deterministic preview availability scenario.
- [ ] Run focused tests, full suite, lint and build; document usage and commit.

### Task 4: Fixture-specific selection and reserves

**Files:**
- Modify: `lib/selection/matchweek.ts`
- Modify: `lib/selection/matchweek.test.ts`
- Modify: `app/team-sheet/page.tsx`
- Modify: `app/fixtures/[fixtureId]/team-sheet/page.tsx`

**Interfaces:**
- Produces: `MatchweekResponse = SelectionResponse & { fixtureId: string }`
- Produces: `SelectionReserve = { position: number; playerId: string | null }`
- Produces: `MatchweekSelection.reserves: SelectionReserve[]`

- [ ] Write failing tests for per-fixture availability, eligibility, duplicate prevention, non-contiguous team numbers, deterministic rank order and four reserves.
- [ ] Run focused tests and confirm expected failures.
- [ ] Implement fixture-scoped selection and reserve calculation.
- [ ] Update both team-sheet callers to pass `fixtureId`.
- [ ] Run focused tests and the full suite; commit.

### Task 5: Team-sheet UI and preview QA

**Files:**
- Modify: `components/team-sheet/matchweek-sheet.tsx`
- Modify: `app/availability/page.tsx`

- [ ] Render Reserve 1–4 and clarify responded-player counts.
- [ ] Change availability guidance from matchweek-wide wording to fixture-specific wording.
- [ ] Run full tests, lint and build under Node 24.
- [ ] Run the preview seed and verify rankings, fixtures, availability, response tracker, five teams, four reserves and mobile layouts.
- [ ] Confirm production was untouched, update #16 acceptance text, and close #16 only after the branch is merged.
