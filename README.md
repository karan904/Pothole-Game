# Gaddha

An illustrated vertical-scrolling game about repairing potholes before approaching vehicles reach them.

The project is intentionally small and portable: the complete game is a single HTML file with Canvas-based gameplay, CSS, and vanilla JavaScript. It has no runtime dependencies and can be opened or continued by another coding session without setup work.

## Current status

This is an **interaction and art-direction prototype**, not a finished game.

The current pass establishes:

- A vertical-scrolling three-lane road
- Cars visibly gaining on the potholes that threaten them
- Back-and-forth rubbing repairs with aggregate, bitumen, and compaction stages
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


## Mobile UX iteration — 2026-09-15

- Short rubbing strokes build repair progress; a stationary touch does not. The start screen offers a hold-to-repair alternative, and keys 1–3 remain available.
- Repairs appear within the phone play area. A shrinking approach-time indicator and light path connect each vehicle to its pothole. The circular progress ring has been removed.
- Bikes have a distinct two-wheel/rider silhouette. The encounter cycle is bike, truck, car, bike; this is a gameplay mix, not a traffic statistic.
- Safe passage produces a short musical resolution and a message. Roadside roofs and trees add a sense of place.
- A bike crash ends the round: an early-stage repair produces a fictional fatal outcome; a partially completed repair produces an injury outcome. These are simplified narrative rules, not real-world probabilities. Car impacts damage road health and interrupt journeys.
- The bike outcome screen prioritizes the person over scores and links to MoRTH's *Road Accidents in India 2023*, Table 3.5 (printed page 44, PDF page 65): 2,161 deaths in the potholes category. This figure does not identify how many were motorcyclists.
- Pause, background pause, pointer cancellation, responsive resizing, and a scrollable result sheet are supported.
- Optional vibration runs only where the API is present; iPhone/Safari must work through visual and audio feedback. No physical iPhone playtest has been completed yet.

### Verification

`npm test` checks input progression, safe passage, pause/resume, crash outcomes, restart, cancellation, and simulation without vibration support. Browser checks use mobile-sized Chrome; they are not a substitute for physical Safari testing.

Next review: play on an iPhone and assess rubbing effort, finger occlusion, urgency, and the tone of the loss screen. This remains a local prototype, not approved for publication.

## Trucks and sound — 2026-09-23

- Trucks cross unfinished potholes without damage, leave the pothole visible, and earn no rescue credit. This is a game rule, not a real-world claim that trucks are immune to road damage.
- An original procedural melody and low rhythmic pulse play during gameplay. Bike, car, and truck horns use distinct synthesized voices; the truck has a lower two-part horn phrase.
- Horns temporarily lower the music, which then returns. Repairs have filtered noise for gravel, bitumen, and smoothing. Mute, pause, backgrounding, and round end silence the audio.
- Reference supplied by Karan: [Indian Truck Horns of Different Types](https://www.youtube.com/watch?v=Yh9cAGjJsZY). Only the video page/title was inspected; these sounds were not matched by listening to the recording. No recording was copied or embedded.
- Automated tests cover truck consequences and the audio lifecycle. Subjective sound quality and physical iPhone playback still need Karan's listening test.
