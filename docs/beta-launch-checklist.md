# BUCS beta launch checklist

> **Status: Draft — not approved for launch.**
>
> The current organiser workbook is used for UI and workflow testing only. Its
> names, rankings and fixture opponents may be useful source material, but the
> imported preview times, venues, deadlines and attendance responses are
> synthetic. None of this is evidence that the beta is ready or that a fixture
> is factually correct.

## Launch scope

- Audience: men's BUCS squad only.
- Release surface: weekly fixture availability, response tracking, ranking-based
  selection, live team sheets, reserves and fixture visibility.
- Launch owner: **TBD — launch blocker**.
- Named invite cohort: **TBD — launch blocker**.
- Admin account holder: **TBD — launch blocker**.
- Member feedback channel: **TBD — launch blocker**.
- Fallback owner and contact route: **TBD — launch blocker**.

## Required inputs before rehearsal

- [ ] A captain-approved ranking list with verified player identities. Names
      alone are sufficient for local UI previews only.
- [ ] Member email or UUN mapping for every player expected to sign in.
- [ ] Confirmed kick-off time, venue, home/away status and availability
      deadline for every fixture in the rehearsal week.
- [ ] The captain's expected team and reserve selection for the rehearsal
      fixture.
- [ ] A named invite list and the private method used to share registration
      instructions.
- [ ] The feedback channel monitored during the first live week.
- [ ] Agreement on who may authorize a rollback.

## Technical gate

- [ ] Production `/api/health` reports a connected database.
- [ ] Admin access is verified with the real captain account.
- [ ] Preview-only records are not present in production.
- [ ] The ranked selection tests pass for per-fixture availability, ranking
      eligibility, duplicate prevention and reserve ordering.
- [ ] Five-team matchweeks show four named reserves.
- [ ] The complete flow works at 390px and on a desktop browser.

## Captain rehearsal

1. Open the target matchweek and confirm every playing team, opponent, venue,
   kick-off time and deadline.
2. As a player, answer availability separately for each eligible fixture.
3. As the captain, review responses, unavailable players and non-responders.
4. Compare the generated teams and reserves with the captain's expected
   selection side by side.
5. Record every discrepancy with the fixture, player, expected outcome and
   actual outcome.
6. Fix selection defects before inviting the cohort or require explicit
   captain sign-off for any accepted difference.
7. Repeat the full flow on a phone.

## Go/no-go criteria

Launch only when all of the following are true:

- [ ] The real rank list and player identities are verified.
- [ ] The rehearsal week has confirmed fixture logistics.
- [ ] The generated teams match the captain's expected selection, or every
      difference has written captain approval.
- [ ] Every invited player has a tested sign-in path before the deadline.
- [ ] The feedback channel is active and monitored.
- [ ] The old Google Form/Sheet remains available as the fallback.
- [ ] The launch owner explicitly records a `GO` decision.

## First live week

- Publish the fixture details and availability deadline before inviting players.
- Confirm at least one captain can access the response tracker.
- Monitor the feedback channel during the signup window.
- Check response counts and the generated team sheet before the deadline closes.
- Send no mass communication from the application; invitations and reminders
  remain manual and outside V1.

## Rollback

Rollback to the existing Google Form/Sheet if authentication, availability
saving, response counts, selection or team-sheet generation fails for the live
fixture week.

1. The launch owner announces the rollback in the agreed feedback channel.
2. The captain reopens or shares the old signup route.
3. Record answers already received in the app and reconcile them manually.
4. Do not delete production records during the incident.
5. Record the cause, impact and follow-up work before the next fixture week.

## Captain sign-off

- Captain:
- Fixture week:
- Expected selection checked:
- Differences accepted:
- Feedback channel confirmed:
- Rollback plan confirmed:
- Decision: **NO-GO until the TBD items above are completed**
- Date and notes:
