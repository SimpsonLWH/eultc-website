# Contributing

Two developers (Lewis and Daniel) work on this repo in parallel. The ticket board is TASKS.md.

## The loop

1. Pick a ticket in TASKS.md with Status Todo and all Depends on tickets Done. Put your name in Owner and set Status to In progress in a tiny commit on your branch (or tell the other dev) so nobody double-picks.
2. Create a branch: `feat/<ticket-id>-<short-slug>`, for example `feat/T03-availability-form`. Use `fix/` or `chore/` for those types.
3. Build only what the ticket's Scope says, and keep main deployable after every merge.
4. Before opening a PR: `npm run lint` and `npm run build` must pass.
5. Open a PR into main. The title starts with the ticket id. Description: what changed, how to test, screenshots for UI.
6. The other dev reviews, then squash-merges into main and deletes the branch. Set the ticket to Done in the same PR.

## Avoiding collisions

- Each ticket lists the files and folders it will create or edit in Touches. If two open tickets share a path, decide the order before starting both at once.
- Keep PRs small and scoped to one ticket.

## Secrets

- Never commit secrets. Use `.env.local`; keep `.env.example` up to date.
