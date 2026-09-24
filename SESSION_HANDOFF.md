# New Session Handoff

## Start here

Read these files in order:

1. `README.md`
2. `DESIGN.md`
3. `index.html`

Then run the local preview and play at least one full round before proposing changes.

## Copy-paste prompt

> Continue the Gaddha game in this repository. Read `README.md` and `DESIGN.md` completely before touching the code, then inspect and play `index.html`.
>
> The current version is a first interaction prototype, not an approved final design. Preserve its core loop: a simple vertical-scrolling road where the player rubs back and forth over a pothole to fill it before an approaching vehicle reaches it. The vehicle must visibly gain on the hazard so the stakes are immediately legible.
>
> The approved direction is “illustrated Indian civic realism”: a playable Indian newspaper cartoon with the warmth and moral sincerity of *Swades*. The visual balance is 70% warm cinematic observation, 20% editorial illustration, and 10% classical Indian compositional influence.
>
> Focus first on tactile repair feedback, vehicle and pothole readability, pacing, and the emotional contrast between a smooth safe passage and a collision. Spend craft on the road and repair action; keep interface chrome quiet.
>
> Do not reintroduce fluorescent yellow, neon-on-black styling, neo-brutalism, ticker tape, dashboard cards, oversized marketing typography, glassmorphism, or excessive uppercase labels. Treat `references/rejected-current-design.png` as a negative reference.
>
> Before implementing a major visual change, explain the specific art decision and how it serves the core action. Work in one coherent playable slice, validate it locally, and commit it. Do not publish or deploy unless I explicitly request it.

## Product truth

The player is not abstractly earning points. They are buying an ordinary person enough time to complete a journey safely. Humor can target bureaucracy and broken incentives, but never the people endangered by the road.

## Next useful iteration

Improve one full encounter:

1. A pothole enters the road.
2. Its threatened vehicle becomes visually associated with it.
3. The player notices and rubs the pothole.
4. Aggregate, bitumen, and compaction feel materially different.
5. The vehicle either passes smoothly or strikes the incomplete repair.
6. The result is readable without explanatory UI.

Do not add metagame systems until this encounter feels satisfying.


## Latest continuation point — 2026-09-15

The mobile rubbing pass is implemented; see README.md for the changed behavior and verification. Primary target is iPhone/Safari. Next work should be guided by Karan's physical playtest, especially gesture effort and emotional clarity. Do not assume Chrome viewport testing proves Safari, touch, sound, or haptic behavior. Continue refining the artwork after the core encounter feels right.

The next sound playtest should assess music/horn balance and whether the synthesized truck voice evokes the supplied reference. Truck passage is harmless in the game and must never award rescue credit. Use `npm test` for gameplay and audio lifecycle regressions.

## Latest continuation point — 2026-09-24

Read `ROADMAP.md` before choosing work. It contains Karan's feedback that the interface still has an "AI designed" tell, a token-level design plan to fix that within the `DESIGN.md` palette, a motion audit, and the sound, haptic, music, learning and performance plans, each with an ordered list of slices.

Before restyling anything, load `.agents/skills/frontend-design/SKILL.md`. Before changing any animation or timing, load `.agents/skills/12-principles-of-animation/SKILL.md`. Both are installed in this repository and symlinked for Claude Code under `.claude/skills/`.

Hosting: Vercel is approved and configured. `npm run build` writes `dist/` and fills in the site URL for link previews. Do not change the deployment target without asking.

Start with `ROADMAP.md` §10, slice 1 (the interface pass), and keep each slice playable, tested with `npm test`, and committed on its own.

