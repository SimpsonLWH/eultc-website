# EULTC V1 beta - task board

## Product context

EULTC is Edinburgh University Lawn Tennis Club. The V1 beta is BUCS-only: it replaces the men's BUCS weekly signup Google Sheet/Form with one workflow.

- Players submit weekly availability per fixture (home or away) before the captain's deadline.
- The app tracks who has responded and shows a live team sheet.
- There is one ranking list (for example 1 to 36). Teams have 4 players. If N teams play that week, the top 4xN signed-up players by rank get games.
- Slots are filled sequentially, strongest first: the best available player is seed 1 of team 1, then seed 2, and so on. If only rank 36 signs up, they are seed 1 of team 1.
- Rankings are edited only by admins (team captains) for now.

Out of scope for V1: news/social posts, newsletters, forum/Q&A, travel reimbursements, membership validation, game finder, box leagues, other sports, multi-university support.

Visual baseline: the Lovable demo (https://tennis-hub-zenith.lovable.app). It is a polished UI shell with mock data and no backend. Match its layout, spacing and mobile-first polish; do not copy its mock-data approach or its colours. The colour palette comes from the EULTC crest and is defined in T01.

Wider club proposal (proposed planning context; does not change anything in this plan): [docs/project-proposal.md](docs/project-proposal.md).

How to work this board: see CONTRIBUTING.md. Status values: Todo, In progress, Done.

## Summary

| ID | Title | Size | Depends on | Suggested owner | Issue |
|----|-------|------|------------|-----------------|-------|
| T01 | App shell, layout and design tokens | S | none | Lewis | [#4](https://github.com/SimpsonLWH/eultc-website/issues/4) |
| T02 | Data model and database setup | M | none | Lewis | [#5](https://github.com/SimpsonLWH/eultc-website/issues/5) (done, closed) |
| T03 | Authentication and roles | M | T01, T02 | Daniel | [#6](https://github.com/SimpsonLWH/eultc-website/issues/6) (done, closed) |
| T04 | Fixtures list, fixture detail and admin fixture forms | M | T01, T02 | Lewis | [#7](https://github.com/SimpsonLWH/eultc-website/issues/7) (done, closed) |
| T05 | Weekly availability form | M | T01, T02, T03, T04 | Lewis | [#8](https://github.com/SimpsonLWH/eultc-website/issues/8) (done, closed) |
| T06 | Response tracker (admin) | S | T05 | Daniel | [#9](https://github.com/SimpsonLWH/eultc-website/issues/9) |
| T07 | Ranked selection engine | M | T02 | Daniel | [#10](https://github.com/SimpsonLWH/eultc-website/issues/10) |
| T08 | Live team sheet | M | T05, T07 | Lewis | [#11](https://github.com/SimpsonLWH/eultc-website/issues/11) |
| T09 | Rankings page and admin ranking editor | M | T01, T02, T03 | Daniel | [#12](https://github.com/SimpsonLWH/eultc-website/issues/12) |
| T10 | Home dashboard and logged-out view | S | T04, T09 | Lewis | [#13](https://github.com/SimpsonLWH/eultc-website/issues/13) |
| T11 | Deployment and CI | S | T01 | either | [#14](https://github.com/SimpsonLWH/eultc-website/issues/14) (done, closed) |
| T12 | Tooling cleanups and Node version | S | none | either | [#15](https://github.com/SimpsonLWH/eultc-website/issues/15) (done, closed) |
| T13 | Seed real data, QA pass and beta launch checklist | S | T04-T12 | both (joint) | [#16](https://github.com/SimpsonLWH/eultc-website/issues/16) |

Every ticket is independently mergeable and must leave the app deployable. Each issue links to its dependencies by issue URL; implementers should also read the ticket's Collision warning where one is present.

## Milestones

Work issues in milestone order; an issue is ready when everything it depends on is closed. Live view: https://github.com/SimpsonLWH/eultc-website/milestones. M5-M8 are proposed planning only, not approved scope.

| Milestone | Delivers | Issues |
|-----------|----------|--------|
| M1 - Foundations | App shell and design tokens, data layer, auth and roles, deploy/CI, tooling cleanups | [#4](https://github.com/SimpsonLWH/eultc-website/issues/4) T01, [#5](https://github.com/SimpsonLWH/eultc-website/issues/5) T02 (done), [#6](https://github.com/SimpsonLWH/eultc-website/issues/6) T03 (done), [#14](https://github.com/SimpsonLWH/eultc-website/issues/14) T11, [#15](https://github.com/SimpsonLWH/eultc-website/issues/15) T12 |
| M2 - V1 BUCS: core | Fixtures and admin forms, the availability form, the response tracker | [#7](https://github.com/SimpsonLWH/eultc-website/issues/7) T04 (done), [#8](https://github.com/SimpsonLWH/eultc-website/issues/8) T05, [#9](https://github.com/SimpsonLWH/eultc-website/issues/9) T06 |
| M3 - V1 BUCS: selection | Selection engine, live team sheet, rankings and admin editor | [#10](https://github.com/SimpsonLWH/eultc-website/issues/10) T07, [#11](https://github.com/SimpsonLWH/eultc-website/issues/11) T08, [#12](https://github.com/SimpsonLWH/eultc-website/issues/12) T09 |
| M4 - V1 BUCS: beta | Dashboard, real seed data, captain QA pass, launch checklist | [#13](https://github.com/SimpsonLWH/eultc-website/issues/13) T10, [#16](https://github.com/SimpsonLWH/eultc-website/issues/16) T13 |
| M5 - Club members: phase 1 (proposed) | Match results, stats and leaderboards, reminders, training sign-ups | [#17](https://github.com/SimpsonLWH/eultc-website/issues/17), [#18](https://github.com/SimpsonLWH/eultc-website/issues/18), [#19](https://github.com/SimpsonLWH/eultc-website/issues/19), [#22](https://github.com/SimpsonLWH/eultc-website/issues/22) |
| M6 - Club members: phase 2 (proposed) | Membership/payment checks, travel reimbursements | [#20](https://github.com/SimpsonLWH/eultc-website/issues/20), [#21](https://github.com/SimpsonLWH/eultc-website/issues/21) |
| M7 - Club hub (proposed) | News and notifications, calendars, polls | [#23](https://github.com/SimpsonLWH/eultc-website/issues/23), [#24](https://github.com/SimpsonLWH/eultc-website/issues/24), [#25](https://github.com/SimpsonLWH/eultc-website/issues/25) |
| M8 - Future: LTA box league (proposed) | LTA box-league integration feasibility check | [#26](https://github.com/SimpsonLWH/eultc-website/issues/26) |

## Tickets

### T01 - App shell, layout and design tokens
- Status: Done
- Owner: daniel-neyla
- Type: chore
- Size: S
- Depends on: none
- Touches: app/layout.tsx, app/globals.css, app/page.tsx, components/nav.tsx, components/ui/, app/availability/page.tsx, app/selection/page.tsx, app/team-sheet/page.tsx, app/fixtures/page.tsx
- Suggested owner: Lewis

**Why:** Every other ticket renders inside this shell, so it merges first and stays deliberately small. It locks in a club palette drawn from the EULTC crest and the demo's layout discipline, so the beta reads as one product, not four pages by two devs.

**Scope:**
- Replace the placeholder home page with a minimal nav home: "EULTC", one line about the BUCS beta, and the four nav links.
- Nav (mobile-first, collapses to a plain menu on small screens): Availability -> /availability, Selection -> /selection, Team sheet -> /team-sheet, Fixtures and rankings -> /fixtures. Show the active item.
- Create placeholder pages for those four routes so no nav link 404s. Each placeholder states which ticket will fill it (T04, T05, T06 or T08). Later tickets replace the placeholder in place.
- Tailwind v4 theme tokens in app/globals.css using @theme, anchored on the EULTC crest (deep club green, white, near-black silhouettes). Do not reuse the Lovable demo's palette: no demo green #264429, no yellow #FDDC26.
  - Brand scale, sampled from the crest ring: --color-club-700: #1B3720 (primary), --color-club-600: #2C5436 (hover), --color-club-800: #122616 (pressed and deep surfaces), --color-club-950: #0D1D11 (header and footer bands), --color-club-100: #EAF1EB (tinted surfaces), --color-club-50: #F6F8F6 (page background).
  - Text and lines: --color-ink: #121A14 (headings, inspired by the crest's near-black #0A0A0A), --color-muted: #5B6660 (secondary text), --color-line: #E2E8E3 (borders and dividers). Cards are white on the club-50 background.
  - --radius token: 0.5rem.
  - Buttons: primary is club-700 with white text and club-600 on hover; secondary is white with club-700 text and a line border; ghost is transparent with ink text. Focus ring: club-600 at 40 percent opacity.
- Status colours stay functional and outside the brand scale: available = club-100 background with club-800 text; unavailable = red-100/red-800; pending or deadlines = amber-100/amber-800; info = blue-100/blue-800. Tailwind's default red, amber and blue values are fine.
- Typography: a modern pairing that suits the crest - SF Pro Display where available, otherwise Inter. Load Inter via next/font and set the body stack to "SF Pro Display", var(--font-inter), system-ui, sans-serif. Drop Geist Mono.
- Shared UI primitives in components/ui/: Button (primary/secondary/ghost, sm/md), Card (title, body, footer), Input (label, error text), Badge (neutral, success, warning, danger). Real button/input/label elements, visible focus rings, no icon-only controls. Radii: buttons rounded-lg, cards rounded-2xl, inputs rounded-md, badges rounded-full.
- Per-page metadata with a title template like "%s - EULTC".

**Out of scope:** Any real data, auth, database or forms; availability/selection/team-sheet logic; the logged-in dashboard (T10); copying demo mock content such as news, Q&A and reports.

**Acceptance criteria:**
- [ ] The four nav items route to four pages that load without errors.
- [ ] bg-club-700 and text-club-700 work as Tailwind utilities in later tickets.
- [ ] Button, Card, Input and Badge exist with the listed variants and are used on the placeholder pages.
- [ ] All colour tokens come from the crest-derived club scale above; no demo green (#264429) or yellow accent survives anywhere.
- [ ] Layout works at 375px: no horizontal scroll, nav usable.
- [ ] npm run lint and npm run build pass.

**How to test:** npm run dev; visit / and each nav route at 375px and at desktop width; check the active nav state; confirm there are no console errors.

### T02 - Data model and database setup
- Status: Done
- Owner: Lewis
- Type: chore
- Size: M
- Depends on: none
- Touches: lib/db/, lib/db/models/, app/api/, scripts/seed.ts, .env.example, package.json, README.md
- Suggested owner: Lewis

**Why:** Availability, selection and the team sheet all read the same collections. One schema now stops parallel tickets from inventing their own shapes halfway through the track.

**Scope:**
- Stack (decided): MongoDB with Mongoose (8.x while the dev machines run Node 20.12; revisit with T12). Development uses any MongoDB connection string - a MongoDB Atlas free cluster or a local mongod. No Docker requirement. Production uses a managed Atlas cluster; record the Atlas database name in the PR.
- Collections (camelCase fields, ObjectId refs, timestamps):
  - players: name, email (unique, lowercased), rankingPosition (integer, unique), isActive (default true).
  - user_roles: email to role mapping (player or admin), plus an optional auth provider user id for T03. Seeded admin flags are fine.
  - fixtures: opponent, date, venue, homeOrAway (home or away), teamsPlaying (integer, 1-10), availabilityDeadline, status (draft, open, closed, cancelled).
  - availability_responses: playerId, fixtureId, status (available or unavailable), note (nullable). Unique index on (playerId, fixtureId).
  - team_selections: fixtureId, teamNumber, seedPosition, playerId. Unique index on (fixtureId, teamNumber, seedPosition). This collection exists for the published-sheet split; the V1 live team sheet renders computed teams and does not write to it.
- No SQL migrations: Mongoose declares the schemas and the seed script syncs indexes (syncIndexes). Response rule used everywhere: a fixture accepts availability while status is "open" and now is before availabilityDeadline.
- Next.js route handlers under app/api are the API surface for the UI: /api/health, /api/fixtures, /api/fixtures/[fixtureId] and /api/rankings return JSON and call lib/db only. Later tickets add their own routes in the same shape rather than querying the database from components.
- Seed script: 36 fake players with realistic names ranked 1-36, 2 admin roles (Lewis and Daniel placeholder emails), 3 fixtures (one home, one away, one in the past) with deadlines and 4/3/2 teams. Seed must be safe to re-run.
- Typed data-access layer in lib/db: models behind a thin module per collection with the queries later tickets need (listFixtures, getFixture, upsertAvailability, listRankings and so on). Pages never touch the Mongoose connection directly.
- .env.example listing every variable (MONGODB_URI, plus auth variables as they land). README "Local development" section: point MONGODB_URI at your database, run the seed.
- npm script: db:seed (tsx plus the env loader used by the script).

**Out of scope:** UI of any kind; auth flows (T03); writing to team_selections; real club data (T13).

**Acceptance criteria:**
- [ ] A fresh database plus npm run db:seed gives 36 players, 3 fixtures and 2 admin roles.
- [ ] Unique indexes exist on players.email, players.rankingPosition and availability_responses(playerId, fixtureId).
- [ ] Re-running the seed does not duplicate rows.
- [ ] lib/db exports typed helpers; no page imports Mongoose or the connection directly.
- [ ] The API routes return JSON from the seeded database: /api/health, /api/fixtures, /api/fixtures/[fixtureId] and /api/rankings.
- [ ] .env.example lists every required variable and the README explains setup in under 15 lines.

**How to test:** set MONGODB_URI in .env.local (Atlas free tier or any local mongod), run npm run db:seed twice, confirm 36 players, 3 fixtures and 2 admins with no duplicates, then curl the API routes.

### T03 - Authentication and roles
- Status: Done
- Owner: Daniel
- Type: feat
- Size: M
- Depends on: T01, T02
- Touches: app/sign-in/, app/auth/, lib/auth/, .env.example, app/layout.tsx (session-aware header)
- Suggested owner: Daniel

**Why:** Availability is per player, so the app must know who is signed in before any of the weekly loop works, and captains need a stricter role than players.

**Scope:**
- Sign-in with email magic link as the default (no passwords; least setup for a club with university emails). Google OAuth is acceptable only if it is genuinely less setup. State the choice and why in the PR.
- Sign-in page at /sign-in: email field, "check your email" state, error states. Signed-in users are redirected home.
- Session handling in server code plus a getCurrentUser() helper. Use the current documented Next 16 session and route-protection pattern (read node_modules/next/dist/docs before choosing between middleware/proxy and per-page checks), and enforce protection server-side on pages and actions, not just in the UI.
- Roles: player vs admin from the T02 roles table. Admin assignment stays seeded in this ticket; no admin management UI.
- Helpers requireUser() and requireAdmin() used by later tickets. Anonymous users get a redirect to /sign-in; wrong role gets a clear 403-style page.
- A signed-in email with no players row sees a "you are not on the list yet, ask a captain" empty state. No auto-creation of players.

**Out of scope:** User profiles or settings, password resets beyond the magic link, EUSU or domain restriction, admin management UI, custom email templates.

**Acceptance criteria:**
- [ ] A seeded player can sign in and the session survives a reload.
- [ ] Anonymous access to a requireUser() page redirects to /sign-in.
- [ ] requireAdmin() returns a rejection for a signed-in player.
- [ ] A signed-in email with no players row gets the clear empty state, not an error.
- [ ] npm run lint and npm run build pass; .env.example updated.

**How to test:** sign in with a seeded player email, refresh, confirm session persists; sign in with the admin email and call an admin-only helper; finish with an unseeded email and check the empty state.

### T04 - Fixtures list, fixture detail and admin fixture forms
- Status: Done
- Owner: Lewis
- Type: feat
- Size: M
- Depends on: T01, T02
- Touches: app/fixtures/ (replace T01 placeholder), components/fixtures/, lib/db (fixture queries), lib/fixtures/
- Suggested owner: Lewis

**Why:** Fixtures are the spine of the weekly loop. Captains must be able to create next week's fixture, with its number of teams, before signup can open.

**Scope:**
- /fixtures: upcoming and past sections. Cards show opponent, date and time, venue, home/away badge, teams playing, availability deadline and status. Mobile-first.
- Fixture list and detail are viewable without sign-in in V1 (no sensitive data; simplest). Admin controls render only for admins.
- /fixtures/[fixtureId]: full detail plus links to availability (T05), team sheet (T08) and responses (T06) as those land. Unknown ids return 404.
- Admin-only create and edit forms using server actions with validation: opponent, date and time, venue, home or away, teams_playing (1-10), availability_deadline, status. Routes /fixtures/new and /fixtures/[fixtureId]/edit.
- Validation rules: deadline must be before match date; opponent and venue required; teams_playing integer 1-10; clear inline field errors; the action rejects non-admin callers.
- No hard deletes: setting status to cancelled hides the fixture from availability and selection.
- Add missing fixture queries to lib/db rather than calling SQL from components.

**Out of scope:** Availability responses (T05), selection or team sheets (T07, T08), rankings (T09), recurring fixtures, BUCS imports, calendar export.

**Acceptance criteria:**
- [ ] /fixtures shows upcoming and past fixtures with home/away clearly marked at 375px.
- [ ] An admin can create a fixture (next Wednesday, N=4, deadline Tuesday 20:00) and it appears in both list and detail with status open.
- [ ] A signed-in player sees no admin controls.
- [ ] Invalid input (deadline after match, teams_playing 0) is rejected with field errors; a non-admin action call is rejected.
- [ ] Unknown fixture id returns 404. npm run lint and npm run build pass.

**How to test:** as admin, create and edit a fixture with the seed database; check the list and detail pages; sign in as a player and confirm read-only; submit invalid values and check the errors.

### T05 - Weekly availability form
- Status: Done
- Owner: Daniel
- Type: feat
- Size: M
- Depends on: T01, T02, T03, T04
- Touches: app/availability/ (replace T01 placeholder), components/availability/, lib/db (availability queries)
- Suggested owner: Lewis

**Why:** This replaces the men's BUCS signup Google Form - the one screen every player touches every week. It must be obvious and fast on a phone, including home vs away.

**Scope:**
- /availability (signed-in players): every fixture currently accepting responses (status open and before deadline) shown with opponent, date, venue and a home/away badge.
- Per fixture, one control: Available or Unavailable, plus an optional note (max 140 characters). Show my current answer and when it was last updated.
- Saving is an idempotent upsert on (player_id, fixture_id) via a server action: changing an answer updates the row, never duplicates it.
- After the deadline or when status is closed or cancelled: controls are replaced by a locked state showing my final answer ("You said available, updated Tuesday 19:04").
- Inline confirmation after each save. No toast library.
- Summary line: "3 open fixtures, 1 answered".
- Empty state when nothing is open: "No open signup right now", plus the next fixture's opening info when known.
- Server action re-validates: signed in, fixture open, before deadline, status value in the enum. Reject otherwise with a readable message.
- Accessibility: real radio inputs or aria-pressed buttons, keyboard operable, labels tied to fields.

**Out of scope:** Reminders or chasing, comments between players, admin views of responses (T06), editing after the deadline, calendar integration.

**Acceptance criteria:**
- [ ] A player can answer each open fixture, reload and see the same answers.
- [ ] Answers can be changed before the deadline and only one row per player and fixture exists in the database.
- [ ] After the deadline (or once an admin closes the fixture) the control is locked and shows the saved answer.
- [ ] An anonymous user cannot submit; the action rejects and the page redirects to /sign-in.
- [ ] Usable at 375px. npm run lint and npm run build pass.

**How to test:** as a seeded player, answer one home and one away fixture, change one answer, then check the row count in the database; move a deadline into the past (or close the fixture as admin) and confirm the locked state.

### T06 - Response tracker (admin)
- Status: Todo
- Owner: unassigned
- Type: feat
- Size: S
- Depends on: T05
- Touches: app/selection/ (replace T01 placeholder), app/selection/[fixtureId]/, components/selection/
- Suggested owner: Daniel

**Why:** Captains currently rebuild the response list by hand from the sheet. This is the view that replaces it before selection, and it is where no-response players become visible.

**Scope:**
- /selection (admin only): fixtures accepting responses or recently closed, each with counts of available, unavailable and no response, linking to the tracker. Non-admins are redirected to /team-sheet (V1 decision: Selection is the captain workspace).
- /selection/[fixtureId]: table sorted by ranking_position with rank, player, available/unavailable, note and updated time. A separate section lists active players who have not responded, also rank-ordered.
- Summary header: "responded X of Y, available A, unavailable B, no response C". Inactive players are excluded from counts and lists.
- Read-only in this ticket. No messaging, chasing or editing on a player's behalf.
- Tracker must show fresh data after a player answers: use dynamic rendering or revalidatePath from the T05 action, whichever is consistent with T05.

**Out of scope:** Selection generation (T07), the live team sheet (T08), reminders or notifications, CSV export.

**Acceptance criteria:**
- [ ] After a player answers in another browser, the tracker shows it on refresh.
- [ ] Counts add up to the number of active players for that fixture.
- [ ] A non-admin is redirected and cannot reach the data by URL or by calling the action.
- [ ] Table becomes stacked cards at 375px. npm run lint and npm run build pass.

**How to test:** as admin, open the tracker for a seeded fixture, compare with /availability answers from a player session, and confirm the no-response list matches players with no rows.

### T07 - Ranked selection engine
- Status: Done
- Owner: Lewis
- Type: feat
- Size: M
- Depends on: T02
- Touches: lib/selection/, vitest.config.ts, package.json (test script and devDependency)
- Suggested owner: Daniel

**Why:** The core BUCS rule - top 4xN signed-up players by rank, filled strongest-first - must be exact and testable before any UI shows it. This can be built in parallel with all UI work.

**Scope:**
- Pure TypeScript function in lib/selection: buildSelection({ players, responses, teamsPlaying }) returning teams with team number, seed (1-4) and player id, plus an incomplete flag and a count of unfilled slots.
- Rules exactly as in the product context: only players marked available, ordered by ranking_position ascending, top 4xN taken, team 1 filled seeds 1-4 with the strongest, then team 2 seeds 1-4, and so on. If only rank 36 signs up, they are team 1 seed 1.
- Edge cases handled and tested: fewer than 4xN signed up (partial final team, flagged), zero signed up, ranking gaps, ranking ties (documented deterministic tiebreak: name, then id), N=1, N=10, unavailable and inactive players excluded, duplicate responses not double-counted.
- Pure: no database imports, no side effects, stable output regardless of input order (sort inside).
- Vitest as the runner: npm test runs vitest run. Add test files next to the source. Tests must include the exact 12-player, N=3 expected mapping and the rank-36-only case.
- No UI in this ticket.

**Out of scope:** Database wiring and adapters (T02/T08), rendering teams (T08), publishing or storing selections (team_selections stays unused in V1).

**Acceptance criteria:**
- [ ] npm test passes and covers every edge case listed above.
- [ ] buildSelection is pure and has no imports from lib/db.
- [ ] The 12-player, N=3 test asserts the full expected team and seed mapping, and the rank-36-only test returns team 1 seed 1.
- [ ] Output is identical when inputs are shuffled. npm run lint and npm run build pass.

**How to test:** npm test; inspect the expected mapping in the 12-player test against the product rules by hand; run npm run lint and npm run build.

### T08 - Live team sheet
- Status: Done
- Owner: Lewis
- Type: feat
- Size: M
- Depends on: T05, T07
- Touches: app/team-sheet/ (replace T01 placeholder), app/fixtures/[fixtureId]/team-sheet/, components/team-sheet/
- Suggested owner: Lewis

**Why:** This is the payoff for players - one current view of teams, seeds and fixtures instead of hunting through messages, and it is the view that shows if the week is short of players.

**Scope:**
- /team-sheet: resolves to the next upcoming fixture and renders its live sheet. If none is upcoming, show the most recent past fixture labelled "last played"; if neither exists, show an empty state.
- Per-fixture route /fixtures/[fixtureId]/team-sheet for any fixture; the fixture detail page (T04) links here.
- Render the T07 output: Team 1, Team 2 and so on, each with seed rows 1-4 showing player name and rank. Partial teams show explicit unfilled slots. Header shows opponent, date, venue, home/away and the signup count.
- Freshness: no websockets. Use revalidation from the T05 action or an equivalent per-request fresh render so a refresh shows a changed answer.
- Signed-in members only (names stay inside the club): anonymous users redirect to /sign-in.
- Signed-in players see a "You: Team 2, seed 3" highlight on their own row.
- Admin-only banner when a team is incomplete: "Team 3 has 2 unfilled slots - 7 of 12 signed up" with a link to the T06 tracker. Players do not see the banner.
- Never write to team_selections in V1.

**Out of scope:** Publishing or freezing a sheet, draft vs published split, editing teams by hand, notifications.

**Acceptance criteria:**
- [ ] After a player changes availability, a refresh shows the updated teams.
- [ ] With 5 signed up and N=2, team 2 shows 1 filled and 3 unfilled slots, and the incomplete banner appears for admins only.
- [ ] Zero signed up shows the empty state, not a broken table.
- [ ] Readable at 375px, own row highlighted. npm run lint and npm run build pass.

**How to test:** seed 8 available players with N=2 and compare /team-sheet against T07's expected output; change an answer in a player session and refresh; view as admin vs player to check the banner.

### T09 - Rankings page and admin ranking editor
- Status: Done
- Owner: Lewis
- Type: feat
- Size: M
- Depends on: T01, T02, T03
- Touches: app/rankings/, components/rankings/, lib/db (ranking queries), lib/rankings/ (actions)
- Suggested owner: Daniel

**Why:** Selection is only as good as the ranking list, and captains currently keep it in a spreadsheet tab. It must be visible to members and editable by captains in the app.

**Scope:**
- /rankings: one ordered list of active players (rank, name), visible to signed-in members; the current user's row is highlighted.
- Admin edit mode on the same page: move up, move down (drag-and-drop optional), add player (name, email, optional position), deactivate and reactivate, then save via server actions. Edit affordances render for admins only and every action re-checks admin server-side.
- Rank integrity: ordering is driven by ranking_position, and saving rewrites contiguous 1..n positions so gaps cannot reappear. Adding a player appends to the end unless a position is given.
- Rank changes must immediately affect selection: revalidate the team sheet and selection paths after saving.
- Deactivated players disappear from the list, availability and team sheets but keep their historical availability rows.
- Empty state before any players exist. Surface save errors; last-write-wins if two admins save at once (documented in the PR).

**Out of scope:** Automatic ranking updates from results, per-player profile pages, invite emails, ranking history.

**Acceptance criteria:**
- [ ] A member sees the list in rank order with no edit controls, and a direct action call is rejected.
- [ ] An admin can move rank 7 to 3; the list renumbers 1..n and persists after reload.
- [ ] After a rank change, the team sheet reflects the new order on next load.
- [ ] A deactivated player disappears from list and team sheet, and their availability rows remain in the database.
- [ ] npm run lint and npm run build pass.

**How to test:** as admin, move a player across a team boundary (rank 4 and 5) and check the team sheet swaps them; as a member, confirm no controls; call the action without admin rights and confirm rejection.

### T10 - Home dashboard and logged-out view
- Status: Done
- Owner: Lewis
- Type: feat
- Size: S
- Depends on: T04, T09
- Touches: app/page.tsx, components/dashboard/
- Suggested owner: Lewis

**Why:** The home page should answer a player's three weekly questions at a glance: what is next, have I answered, and where am I ranked.

**Scope:**
- Signed in, / becomes a dashboard: next fixture card (opponent, date, venue, home/away, deadline, signup open or closed), my availability status for that fixture with a link to /availability, and my current rank with a top-5 ranking preview linking to /rankings.
- Signed out, / stays a restrained marketing view: club name, one paragraph on the BUCS beta, sign-in call to action. No member data, no flash of private content.
- Read via lib/db helpers in the server component; no client-side fetch waterfall.
- The T01 nav item "Fixtures and rankings" continues to point at /fixtures; the dashboard summarises fixtures and rankings without replacing that page.

**Out of scope:** New nav items, news or announcements, personal stats beyond the rank, anything not listed above.

**Acceptance criteria:**
- [ ] Logged out shows marketing and sign-in only.
- [ ] Logged in shows next fixture, my answer state and my rank, with working links.
- [ ] No fixture, no players row and no rank each produce a sensible empty state without crashing.
- [ ] Usable at 375px. npm run lint and npm run build pass.

**How to test:** sign out and check /; sign in as a player and check the cards; change an availability answer and confirm the dashboard reflects it on refresh.

### T11 - Deployment and CI
- Status: Done
- Owner: Lewis
- Type: chore
- Size: S
- Depends on: T01
- Touches: .github/workflows/ci.yml, CONTRIBUTING.md, docs/deployment.md, Vercel project settings
- Suggested owner: either

**Why:** Two devs merging daily need main always deployable and a preview URL on every PR, or parallel work drifts and the club beta runs on someone's laptop.

**Scope:**
- Vercel project linked to SimpsonLWH/eultc-website: production deploys from main, preview deployment per PR.
- Document the project, the environment variables (DATABASE_URL and auth variables as they land) and where each value comes from in docs/deployment.md, including which environments they apply to.
- GitHub Actions workflow on pull_request and on push to main: npm ci, npm run lint, npm run build, npm test once T07 adds it (before that, either omit the step or make it conditional; do not add a failing check). Single job, no matrix, Node 20 unless .nvmrc exists.
- Add a short "Branch protection" section to CONTRIBUTING.md: main requires a PR and passing checks; recommend requiring branches to be up to date; note who can admin the repo.
- Secrets live in Vercel and GitHub settings only; .env.local is never committed.

**Out of scope:** Custom domains, analytics, monitoring or alerting, staging environments beyond Vercel previews, load testing.

**Acceptance criteria:**
- [ ] A throwaway PR shows a green CI check and a Vercel preview link.
- [ ] Merging to main deploys production without errors.
- [ ] docs/deployment.md lists every environment variable with its source.
- [ ] CONTRIBUTING.md contains the branch-protection guidance.

**How to test:** open a trivial docs PR and watch checks plus preview; close it; merge a small real change and confirm the production deployment.

### T12 - Tooling cleanups and Node version
- Status: Done
- Owner: Lewis
- Type: chore
- Size: S
- Depends on: none
- Touches: package.json, package-lock.json, .nvmrc
- Suggested owner: either

**Why:** Two known tooling issues were recorded when the repo was scaffolded. Fixing or documenting them now stops them being rediscovered in the middle of feature work.

**Scope:**
- ESLint advisories: npm audit reports 5 high-severity advisories in the dev-only chain (braces <- micromatch <- fast-glob <- @next/eslint-plugin-next <- eslint-config-next). Do not run npm audit fix --force: it downgrades eslint-config-next to 14.x and breaks the lint setup. Check whether the current eslint-config-next 16.x line or a later patch resolves the chain; if yes, bump. If not, record the audit output and the accepted-risk reason in the PR.
- Node engine warning: eslint-visitor-keys wants Node >=20.19 and the machine is on 20.12.2. Once both devs have upgraded (confirm with Daniel), add .nvmrc (20 or 22 LTS) and an engines field to package.json; until then, document the blocker in the PR instead.
- Confirm npm ci works from a clean checkout on the chosen Node version.
- Coordinate with T07, which also edits package.json (test script and devDependency). Land one first if both are open at once.

**Out of scope:** Upgrading Next, React or Tailwind; adding new tooling; fixing unrelated advisories in runtime dependencies.

**Acceptance criteria:**
- [ ] The PR states the audit result after checking the current toolchain: either fixed by a safe bump or accepted with the exact advisory IDs and a reason. No eslint-config-next downgrade.
- [ ] If Node is upgraded: .nvmrc and engines are committed and npm ci passes on that version. Otherwise the blocker is documented.
- [ ] No runtime dependency versions change.

**How to test:** rm -rf node_modules && npm ci on the chosen Node version, then npm run lint and npm run build.

### T13 - Seed real data, QA pass and beta launch checklist
- Status: Todo
- Owner: unassigned
- Type: chore
- Size: S
- Depends on: T04, T05, T06, T07, T08, T09, T10, T11, T12
- Touches: scripts/seed-real.ts (new), docs/beta-launch-checklist.md, README.md (if setup notes change)
- Suggested owner: both (joint)

**Why:** The beta only counts if it reproduces the real weekly sheet. This is the bridge from the old Google Sheet to the app, with a captain checking the output.

**Scope:**
- Load the real ranking list and the real fixture list from the existing BUCS sheet into the production database, via a one-off script or the admin UI, whichever is safer for the data.
- Walk one real fixture week with a captain: open signup, submit availability as a player, review the tracker, generate the selection, publish the team sheet. Compare the generated teams against the organiser's manual selection side by side.
- Log every discrepancy and either fix it in this ticket (one-file changes) or open a new board ticket for anything larger.
- docs/beta-launch-checklist.md: who is invited and how, sign-in instructions for members, who holds admin, how feedback is collected, the fallback to the old sheet, and go/no-go criteria for the first live week.
- Update deployment envs or README setup notes if the real data run needs it.

**Out of scope:** Inviting players for real, sending any mass communication, expanding beyond BUCS or beyond the men's squad.

**Acceptance criteria:**
- [ ] Real rankings and fixtures are visible in production for admins.
- [ ] One real week can be run end to end without touching the Google Sheet.
- [ ] Generated teams match the captain's expected selection, or every difference is explained and signed off by the captain.
- [ ] The beta launch checklist is merged with a named invite list and a feedback channel.

**How to test:** rehearsal with the captain on the real fixture: run the full loop on a phone, compare output side by side, and confirm each checklist step works.

## Suggested parallel plan

Start immediately (no dependencies):

- Lewis: T01 - every ticket depends on the shell, so it should merge within a day.
- Daniel: T02 - the schema blocks T03, T04 and T07.
- Whoever is blocked first: T12 - it blocks nothing and clears known tooling noise.

After T01 and T02 merge, four tickets are startable at the same time (the brief requires at least three), split across both devs:

- Lewis: T04 (fixtures)
- Daniel: T03 (auth), then T07 (selection engine, pure code so it runs parallel to any UI)
- Either: T11 (deploy and CI) once T01 is merged

Then follow the dependency order:

- T05 needs T03 plus T04. T06 needs T05.
- T08 needs T05 plus T07.
- T09 needs T03. T10 needs T04 plus T09.
- T13 needs everything.

Lewis lane: T01 -> T04 -> T05 -> T08 -> T10
Daniel lane: T02 -> T03 -> T07 -> T09 -> T06 -> T11

Sync points:

1. T01 and T02 merged: unblocks T03, T04, T07 and T11.
2. T03 and T04 merged: Lewis starts T05; Daniel should have T07 merged or in review before T08 starts.
3. T05 and T07 merged: unblocks T08; T06 becomes available for Daniel.
4. T04 and T09 merged: unblocks T10. Finish T11 around here if not already done.
5. All tickets merged: T13, both devs plus a captain, run the real-week rehearsal.

Two tickets collide on package.json (T07 adds the test script and Vitest; T12 may add engines). Land T07 first, then T12.

Dependency check: the graph is acyclic. Edges run T01/T02 -> T03, T04, T07, T11; T03/T04 -> T05; T03 -> T09; T05 -> T06; T05/T07 -> T08; T04/T09 -> T10; everything -> T13. No cycles, and at least three tickets (T03, T04, T07) are startable immediately after T01 and T02, split across both devs.

## Future planning issues (V2/backlog - proposed)

These are proposed work for later review, not approved V1 scope, not a delivery commitment, and not permission to start building. They are deliberately separate from the V1 execution tickets above. Proposal context: [docs/project-proposal.md](docs/project-proposal.md).

| Issue | Capability |
|-------|------------|
| [#17](https://github.com/SimpsonLWH/eultc-website/issues/17) | Match results |
| [#18](https://github.com/SimpsonLWH/eultc-website/issues/18) | Player stats and club-wide leaderboards |
| [#19](https://github.com/SimpsonLWH/eultc-website/issues/19) | Availability and selection reminders |
| [#20](https://github.com/SimpsonLWH/eultc-website/issues/20) | Travel reimbursements with treasurer approval |
| [#21](https://github.com/SimpsonLWH/eultc-website/issues/21) | Membership and payment checks for training sign-ups |
| [#22](https://github.com/SimpsonLWH/eultc-website/issues/22) | Native training sign-ups |
| [#23](https://github.com/SimpsonLWH/eultc-website/issues/23) | Club news and notifications |
| [#24](https://github.com/SimpsonLWH/eultc-website/issues/24) | Role-based calendars |
| [#25](https://github.com/SimpsonLWH/eultc-website/issues/25) | Polls |
| [#26](https://github.com/SimpsonLWH/eultc-website/issues/26) | LTA box-league integration - feasibility check |
