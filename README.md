# Gaddha

An illustrated vertical-scrolling game about repairing potholes before approaching vehicles reach them.

The project is intentionally small and portable: the complete game is a single HTML file with Canvas-based gameplay, CSS, and vanilla JavaScript. It has no runtime dependencies and can be opened or continued by another coding session without setup work.

## Current status

This is an **interaction and art-direction prototype**, not a finished game.

The current pass establishes:

- A vertical-scrolling three-lane road
- Cars visibly gaining on the potholes that threaten them
- Press-and-hold repairs with aggregate, bitumen, and compaction stages
- Safe-passage and collision feedback
- Traffic, road-health, and monsoon escalation
- The “illustrated Indian civic realism” direction documented in `DESIGN.md`

Future sessions should improve the feel and readability of this core loop before adding more systems.

## Run locally

```bash
npm run preview
```

Then open [http://localhost:4173](http://localhost:4173).

To only prepare the static build:

```bash
npm run build
```

## Project map

```text
.
├── index.html                         Current editable game source
├── DESIGN.md                          Approved art direction and product hierarchy
├── SESSION_HANDOFF.md                 Instructions for a fresh AI/coding session
├── package.json                       Local build and preview commands
├── dist/index.html                    Static build output
├── references/                        Visual references supplied by the creator
├── archive/pre-art-direction/         Preserved earlier implementation
└── .openai/hosting.json               Existing private Sites registration
```

## Working rules

1. Read `DESIGN.md` before changing the interface or artwork.
2. Preserve the vertical-scroll pothole-filling loop unless the creator explicitly changes it.
3. Treat `references/rejected-current-design.png` as a negative reference.
4. Keep the game local unless the creator explicitly asks to publish or deploy it.
5. Make a Git commit at each coherent playable milestone.

## History

- `91df39a` — Initial civic arcade redesign
- `c0a6e1c` — Illustrated pothole-repair gameplay pass

