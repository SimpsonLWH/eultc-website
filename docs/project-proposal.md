# Wider EULTC project proposal (proposed planning context)

## Source and status

- This page records a supplied summary of **Daniel Hornung's EULTC Project Proposal**. It is **proposed planning context**, not an approved specification and not a verbatim quotation. No original document or page link was supplied, so none is given here.
- It does not change the approved V1 build scope. V1 remains the BUCS-only plan in [TASKS.md](../TASKS.md).
- Anything labelled V2/backlog below is proposed work for later review. It is not a committed release scope, order, or date, and it is not permission to start building.
- No delivery dates, policies, integrations, data-access arrangements or technical designs are approved by this page.

## Problem and intended benefits

The wider vision is one club website replacing fragmented club workflows spread across chats, email, spreadsheets and SignUpGenius. The intended benefits are less admin work, fewer missed deadlines, less payment confusion, and better participation.

## Proposed capabilities

As supplied (unaudited):

- BUCS match sign-ups, eligibility and ranking rules, and reminders.
- Match results, player stats, and leaderboards.
- Travel reimbursements with treasurer approval.
- Membership payment checks tied to training sign-ups.
- Club news and notifications.
- Role-based calendars.
- Polls.
- Native training sign-ups.
- Possible LTA box-league integration, subject to feasibility checks.

## The V1 boundary

V1 (T01-T13) stays exactly as defined in [TASKS.md](../TASKS.md): the weekly BUCS loop of availability, ranking-based selection, fixtures and the live team sheet, plus the captain tooling and the app shell around them. It replaces the men's BUCS weekly signup sheet/form.

Not in V1: match results, player stats, leaderboards, reminders, travel reimbursements, membership or payment checks, native training sign-ups, club-wide news and notifications, role-based calendars, polls, and LTA box-league integration. Where the V1 plan already lists an item as out of scope (news, newsletters, forum/Q&A, travel reimbursements, membership validation, game finder, box leagues, other sports, multi-university support), this proposal does not bring it back into scope.

## Feature-to-phase mapping

| Capability | Phase / status | Existing reference | Notes |
|---|---|---|---|
| Weekly BUCS availability sign-up | V1 | T05 in [TASKS.md](../TASKS.md) | Replaces the men's weekly signup form |
| Ranking list and ranked selection | V1 | T07, T09 in [TASKS.md](../TASKS.md) | Teams of 4, top 4xN signed-up players, strongest first |
| Fixtures and the live team sheet | V1 | T04, T08 in [TASKS.md](../TASKS.md) | Members see the current sheet without chasing messages |
| Captain response tracking | V1 | T06 in [TASKS.md](../TASKS.md) | Admin view of who has responded; no chasing features |
| Player and captain roles | V1 | T03 in [TASKS.md](../TASKS.md) | Rankings are edited by admins only |
| Reminders for sign-ups or selection | Future backlog | T05 and T06 list reminders as out of scope | Not yet specified |
| Match results | Future backlog | Not yet specified | No results workstream exists in T01-T13; see the discrepancy note |
| Player stats | Future backlog | Not yet specified | Broader analytics, separate from the ranking list |
| Club-wide leaderboards | Future backlog | Not yet specified | Distinct from the single ordered ranking list that drives selection |
| Travel reimbursements with treasurer approval | Future backlog | Not yet specified | Receipts, approval and payment tracking are undefined |
| Membership and payment checks for training sign-ups | Future backlog | Not yet specified | Verification and payment are separate concerns; no provider, API or data access is assumed |
| Club news and notifications | Future backlog | Not yet specified | V1 has no news or notification channel |
| Role-based calendars | Future backlog | Not yet specified | |
| Polls | Future backlog | Not yet specified | |
| Native training sign-ups | Future backlog | Not yet specified | |
| LTA box-league integration | Future feasibility check | Not yet specified | Optional and unverified; not a prerequisite for V1 |

## Scope discrepancy to resolve

The supplied summary describes V1 as covering "sign-ups, eligibility, results, and rankings". The approved T01-T13 plan has no match-results workstream, and T09 explicitly excludes automatic ranking updates from results. This page therefore maps match results to the future backlog as "not yet specified" instead of assuming results are approved for V1. Confirm with the captains which reading is intended before any results work is planned.

## Unresolved questions for later planning

- Match results: what would be recorded, by whom, and would it ever feed the ranking list?
- Reminders and notifications: which channels would members actually accept, and who controls frequency?
- Membership checks: how would membership status be established, by whom, and is any payment taken in-app?
- Travel reimbursements: what policy, evidence and approval process would apply?
- Training sign-ups: are capacity limits, eligibility and payment state part of that flow?
- Calendars: which roles need which views, and which events should appear?
- Polls: who creates them, and are responses anonymous?
- LTA box leagues: is there a supported way to exchange data, and does it meet privacy expectations? Nothing here is verified.
- Which parts of this proposal, if any, will be approved to plan in detail next?
