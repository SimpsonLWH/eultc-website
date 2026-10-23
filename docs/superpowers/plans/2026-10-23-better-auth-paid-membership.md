# Better Auth Email/Password and Paid-Member Registration

## Summary

Replace NextAuth with Better Auth 1.7.x using email/password accounts,
MongoDB-backed sessions, invite-gated self-registration, and a temporary
paid-membership allowlist. Registration creates a login account only;
captains continue managing the separate BUCS player roster and rankings.

Captains get a new Members page for the paid list, shared invite link,
account overview, and one-time password-reset links. No outbound email,
Google OAuth, passkeys, or QR generation are included.

## Global constraints

- Use Next.js 16.4.2 conventions and Node 24.
- Keep the existing roster, ranking, selection and availability behavior.
- Registration and sign-in requirements must be enforced server-side inside
  Better Auth; UI checks alone are not acceptable.
- Passwords are 12-128 characters. Better Auth handles hashing.
- Admin accounts bypass paid-membership checks.
- No outbound email provider, OAuth, passkey or QR code in this pass.
- Existing Auth.js sessions become invalid at cutover.
- Do not auto-create player roster rows during registration.

## Task 1 - Membership, invite and account policy

Add pure policy helpers and tests for email normalization, invite validation,
paid/admin eligibility, password validation and reset-link state. Add
server-only temporary membership, invite and pending-reset models behind a
replaceable membership-status interface. Tests must cover paid, unpaid, admin
bypass, invalid invite and rotating invite behavior.

## Task 2 - Better Auth configuration and session boundary

Install Better Auth, MongoDB adapter and MongoDB driver; remove NextAuth.
Configure email/password, Admin plugin, rate limiting, `nextCookies`,
12-character passwords, one-hour reset tokens and session revocation after
password reset. Add the Better Auth route handler and client. Replace the
session DAL and current-user type with Better Auth session reads while
preserving `requireUser` and `requireAdmin`. Test the role/player projection
and unpaid-access decision with pure helpers.

## Task 3 - Registration, sign-in and reset flows

Add invite-gated `/sign-up`, email/password `/sign-in`, and token-based
`/reset-password`. Enforce invite, paid eligibility and admin-role assignment
in Better Auth hooks so direct API calls cannot bypass them. Keep local and
preview quick sign-in by authenticating seeded Better Auth accounts with a
server-only development password. Public password-reset requests are rejected;
reset links are generated only by admin actions.

## Task 4 - Members administration

Add the admin-only `/members` page and server actions for invite display and
rotation, paid-email add/remove, account listing, role/player status, and
one-time reset-link generation. Removing a paid email rejects the change for
admins, revokes any active Better Auth sessions for non-admin accounts, and
revalidates affected views. The generated reset link is shown once, expires
after one hour, is single-use, and supersedes earlier links.

## Task 5 - Seed, environment and documentation

Remove NextAuth environment and route remnants. Update `package.json`,
`.env.example`, deployment documentation, task/issue notes and `scripts/seed.ts`
so seeded users exist in Better Auth with the development password and correct
roles. Document invite registration, admin-email provisioning, allowlist
management and recovery-link operation. Ensure seeding remains idempotent.

## Task 6 - End-to-end verification

Verify paid registration, unpaid rejection, admin bypass, invalid and rotated
invites, direct Better Auth endpoint rejection, sign-in/out, reset-link
single-use and session revocation, player/no-player routing, and Members-page
authorization. Run lint, the complete test suite, the production build and
`npm audit --omit=dev`. Check sign-in, sign-up, reset and Members pages at
desktop and 390px.
