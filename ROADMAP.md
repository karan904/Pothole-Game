# Gaddha — Review and roadmap (2026-09-24)

A review of the prototype after reading every file, running `npm test`, and playing the game headlessly in Chromium at 390×844 (touch) and 1280×800. Frame cost was measured with an instrumented `requestAnimationFrame`. Karan's brief for this pass: distinct sound, haptic feedback, better UX, smoother and more intentional design (the interface "still has the AI-designed tell"), and players should learn something real while playing. Two skills were installed for future sessions and used for this review: `frontend-design` and `12-principles-of-animation` (both under `.agents/skills/`).

Everything below is a plan unless marked **done**. Line numbers refer to `index.html` at this commit.

## What is already right

- The core loop is legible: pothole enters, a vehicle visibly gains on it, rubbing fills three materially different stages, a safe pass or a strike follows. Keep it.
- Human consequence is handled with care: fictional encounter, sourced statistic (MoRTH 2023, Table 3.5), no invented victim, content note on the start screen.
- Accessibility floor exists: keyboard lanes, hold-to-repair alternative, reduced-motion, visible focus, `aria-live` messages, pause on background.
- Audio lifecycle is disciplined (mute, pause, background, round end) and tested.
- It is one dependency-free HTML file, which makes every change cheap to review.

## 1. The "AI-designed" tell, and a plan to remove it

The `frontend-design` skill lists the traits that make a page read as generated. The current interface hits most of them, and several also break `DESIGN.md` ("no dashboard cards, no excessive uppercase labels, no pasted ornamental borders").

| Tell | Where |
|---|---|
| Cream paper card, high-contrast serif display (Georgia, tight negative tracking), terracotta accent | `.paper` line 38, `h1` line 39 |
| Tracked, all-caps eyebrow above every heading ("AN ILLUSTRATED ROAD GAME", "THE RAIN HAS PASSED") | `.kicker` line 39 |
| All-caps small labels with big numbers underneath (SAVED / ROAD, the 2×2 report grid) | `.score` line 33, `.report` line 41 |
| Middle-dot meta strings ("Rider · 7.3s", "Truck · sturdy", "MoRTH, 2023 · Table 3.5") | canvas label line 89, end sheet line 57 |
| Hairline broadsheet grid, zero radius, decorative red/indigo "washi" stripes, tilted paper (-0.35°, -1°) | `.paper:before/:after` line 38, `.message` line 35 |
| One phrase of the lead in a different colour; italic sub-line under the title in the accent colour | `.lead strong`, `h1 em` line 39 |
| Hard offset button shadow (the same device as the rejected neon design) | `.begin` line 40 |
| Default families (Georgia, Arial) doing all the work | throughout |

**Done in this pass (minor tweaks):** sentence-case labels, no tracking, no stripes, no tilt, no accent-coloured phrase, flat buttons with a pressed state, system UI font for labels, canvas labels rewritten as phrases ("Rider in 7.3s", "Truck, rolls through").

**Design plan for the interface pass (not yet built).** The palette is fixed by `DESIGN.md`; the freedom is in type, layout and what the interface is made of.

- Colour tokens (kept): monsoon indigo `#234c6b`, bitumen `#34332f`, road dust `#b9683e`, cotton white `#f4ead7`, neem `#4f7153`, rust `#a83e32`. Change how they are used: cotton white becomes road-marking paint and text painted on the world, not a paper card.
- Type: one bold thing, the wordmark. Draw "Gaddha" (with its Devanagari form गड्ढा) as an inline SVG in a sign-painter's hand, the lettering of Indian truck and roadside signage. Zero network cost, impossible to mistake for a template. Quick path while that is commissioned: Google Fonts "Yatra One" for the title only. Everything else in a quiet humanist sans made for Indian scripts ("Mukta" or "Hind", both free) or the phone's `system-ui`. No uppercase, no tracking, 16–17px body, 1.5 line height.
- Layout: the road is the page. The start screen is the first encounter itself: the pothole is already on the road, the rider waits up-road, one line of copy sits beside the pothole ("Rub the pothole before he reaches it"), and the first rub starts the round. No modal, no button, no paragraph of rules. Settings (sound, vibration, hold-to-repair) live in one quiet row at the top.
- End screen: sentences, not a dashboard. "Seven people got home. One did not." then one field note (see §7), then *Again* and *Share*. Left-aligned, single column.
- HUD: replace "Saved 7 / Road 100" with a row of small vehicle silhouettes that fill in as people get through; let road health show in the road surface (more cracks), not a number.
- Motion: one orchestrated moment only (the start), everything else answers the player's hand.

```
phone, start                         phone, end
┌────────────────────────┐           ┌────────────────────────┐
│ Gaddha       ♪  ⏸  ⋯   │           │                        │
│    ┊    🏍    ┊        │           │  Seven people got home.│
│    ┊    │     ┊        │           │  One did not.          │
│    ┊    ▼     ┊        │           │                        │
│    ┊   ●●●    ┊  Rub   │           │  Skip compaction and   │
│    ┊          ┊  the   │           │  the patch pops out    │
│    ┊          ┊ pothole│           │  with the first rain.  │
│                        │           │                        │
│                        │           │  [ Again ]  [ Share ]  │
└────────────────────────┘           └────────────────────────┘
```

## 2. Motion audit (12 principles)

```
index.html:34  - [timing-under-300ms]      .instruction fades over 400ms  (fixed: 240ms ease-in)
index.html:35  - [easing-entrance-ease-out] .message slides in with default `ease` (fixed: ease-out curve, no tilt)
index.html:37  - [staging]                  sheets pop in/out with no transition; end sheet appears 900ms after a crash with a hard cut
index.html:40  - [physics-active-state]     .share, .sound, .pause, .haptic had no pressed state (fixed)
index.html:112 - [easing-natural-decay]     hit vehicle wobble `sin(time*24)*5` never decays (fixed: exponential decay)
index.html:112 - [staging-one-focal-point]  every vehicle bobs continuously; secondary motion competes with the action
index.html:219 - [timing-consistent]        `shake*=.84` per frame decays twice as fast on 120Hz iPhones (fixed: dt-based)
index.html:97  - [easing-natural-decay]     truck bounce amplitude decays linearly
index.html:76  - [follow-through]           a completed patch is final instantly; no settle
index.html:219 - [anticipation]             potholes appear fully formed; no crack that grows first
index.html:79  - [anticipation]             a struck car snaps to its crash angle; no brake dive
index.html:110 - [staging]                  safe passage is a message at the top of the screen, not something the vehicle does
```

| Rule | Count | Severity |
|---|---|---|
| staging | 4 | HIGH |
| easing-natural-decay | 2 | MEDIUM (1 fixed) |
| anticipation / follow-through | 3 | MEDIUM |
| timing-consistent | 1 | MEDIUM (fixed) |
| timing-under-300ms | 1 | LOW (fixed) |
| physics-active-state | 1 | LOW (fixed) |

Plan for the motion pass: crack lines grow over 300ms before the cavity opens; a finished patch settles (scale 1.04→1.00, 220ms, slight overshoot); the vehicle lifts 2px and settles as it crosses a finished patch; a struck vehicle dips its nose for 120ms, then rotates with ease-out and skids to rest; bob only on bikes (rider sway) and only when idle; sheets enter with a 200ms ease-out fade and 8px rise, exit 160ms ease-in.

## 3. Sound: from one voice to four families

Every sound today is built by the same `note()` (line 159): 15ms attack, exponential decay, one low-pass. That is why horns, stage tones, relief and crash all read as "beeps" from one instrument. Distinctness comes from giving each family its own timbre, envelope and register.

| Family | Events | Design |
|---|---|---|
| Material (the hand) | rubbing, stage change | One continuous noise source per repair whose filter and level follow stroke speed, instead of a 60ms burst every 85ms (line 170). Gravel: band-pass 1.5–3kHz with random clicks. Bitumen: low-pass 250–500Hz with a slow amplitude wobble (viscous). Compaction: a 60–90Hz thump on every stroke reversal, synchronised with the haptic. |
| Vehicles | approach, pass | A quiet engine bed while a vehicle is within ~200px, pitch dropping as it passes. Bike: pulse wave ~90Hz with fast LFO (two-stroke buzz). Car: sawtooth ~55Hz. Truck: 40Hz rumble plus diesel knock noise. Horns stay as designed but become rare: one warning when the gap is under 2s and the pothole is unfinished; trucks honk once on entry, not every 3.5s (line 101). |
| Outcomes | complete, safe, strike | Complete: a short dry wooden knock (confirmation, not a chime). Safe: two soft notes on the music bus and the engine simply continues; relief, not confetti. Strike: metallic band-pass ping + low thud + engine cut, then 600ms of nothing but rain. Silence is the loudest cue in the game. |
| Weather | monsoon | Pink-noise rain bed scaled with strength; the first thing a muted-then-unmuted player hears. |

Also fix: `tick()` calls `setTargetAtTime` on the music gain every frame (line 184; **done**, now only on change); the first notes after `unlock()` are dropped while the context is still `suspended` (line 159 checks `state==='running'` synchronously); on iPhone, Web Audio is silenced by the ringer switch unless a muted `<audio>` element is played once on first touch (known workaround; test on device).

## 4. Haptics: a vocabulary, not a buzz

Current patterns (lines 75, 76, 79, 110, 245) are all short pulses of similar length. Make them a small vocabulary where each signature means one thing, and make the rubbing texture change per stage so the player *feels* the stage under a thumb that hides the pothole.

| Signature | When | Pattern (ms) |
|---|---|---|
| Gravel texture | rubbing, stage 1 | 5 every 60 |
| Bitumen texture | rubbing, stage 2 | 15 every 150 |
| Compaction texture | rubbing, stage 3 | 25 every 220 |
| Confirm | patch complete | 40 |
| Relief | safe pass | 10, 60, 10 (deliberately lighter than confirm) |
| Impact | strike | 70, 40, 120 (the only long pattern) |

Reality check: Safari on iPhone has no vibration API, so the primary target gets none of this. Two options. (a) Accept it: audio and visual carry the stage change on iOS. (b) Experiment: iOS 18 Safari fires the system haptic when an `<input type="checkbox" switch>` toggles inside a user gesture; toggling a hidden switch from `pointermove` is an unofficial trick that may work and may stop working. Try it on a real phone, fall back silently. Android Chrome gets the full table.

## 5. Music: what saloon.wtf does, and what to do here

saloon.wtf (from Karan's screenshot; the site is not reachable from this sandbox) plays a YouTube-hosted Bollywood track with its own transport. That is the YouTube IFrame Player API. Three routes, honestly compared:

1. **YouTube embed.** Legal only as a visible, unmodified player (YouTube's API terms forbid hiding the player or separating audio). On iPhone it will not autoplay, `setVolume()` is ignored, and playback pauses when the tab loses focus, so horn-ducking and looping under gameplay cannot work there. Downloading the audio ("pulling it off YouTube") is copyright infringement of the label's recording; not an option for a public link.
2. **Suno.** Generate an original instrumental in the style wanted (for example "slow Marathi folk, dholki, harmonium, tuntune, monsoon, 88 bpm, instrumental, seamless loop"). Use a paid plan: under Suno's terms as I know them, paid-plan output is owned by the subscriber; free-tier output is non-commercial and Suno retains ownership. Confirm on suno.com/terms before shipping. Export WAV, encode to ~112kbps MP3 and OGG (about 1.5MB per 90s loop), commit under `audio/`, decode with Web Audio and loop through the existing `music` gain so ducking, mute, pause and iOS all keep working.
3. **A licensed or commissioned recording.** The authentic option: a 90-second loop from a musician (dholki + harmonium + tuntune is cheap to commission), or a CC-licensed Indian instrumental (Free Music Archive, Pixabay Music; check each licence). A credit line on the end screen adds to the sincerity the brief asks for.

Recommendation: route 3 if there is budget, route 2 otherwise, both integrated the same way (hosted file, Web Audio). Skip YouTube for in-game music; if the "dhaba radio" idea from saloon.wtf is wanted, keep it as a visible, optional player on the desktop start screen only.

## 6. UX findings, in priority order

1. **Bottom chrome covers the danger zone.** The instruction bar, pause, vibration and sound buttons sit where encounters resolve. **Done:** the instruction fades after the first finished repair. Still to do: move pause and sound to the top row; turn "Vibration on" into a setting, not a toolbar button.
2. **The countdown label sits where the vehicle drives.** At the critical moment the vehicle covers it ("Tru…dy" in the desktop screenshot). Put the countdown on the vehicle, or let the light path's colour and width be the timer.
3. **Finger occlusion.** On a phone the thumb hides the pothole while rubbing, so stage feedback must be peripheral: haptic texture per stage (§4), sound per stage (exists), and a visual outside the thumb (the lane edge fills with the patch colour, or the light path turns green).
4. **Lives are invisible.** `#lives` is hidden (line 54), so three car strikes end the round with no warning. Show them as people, or drop lives and use road health alone.
5. **Trucks confuse first-timers.** "Truck, rolls through" is now a phrase, but a truck still gets a light path and a bar as if it needed protecting, and honks every 3.5s. Give trucks no path and no bar, one horn on entry.
6. **The round is a 42s timer** (line 219) with no signal it is ending. Let the sky tell the story: afternoon, evening, rain, and the round ends when the rain stops.
7. **First play often ends at ~10s with "did not survive".** The tone is the brief's; the pacing is not. Make the first encounter a tutorial (slow rider, worst case "injured"), and reserve the fatal outcome for a full-speed rider on an untouched pothole.
8. **Start sheet is three paragraphs.** Replace with learn-by-doing (§1 layout).
9. **Messages appear at the top while the action is at the bottom.** Put words next to the event.
10. **Nothing persists.** Keep best run and field notes seen in `localStorage` so a second play shows something new.
11. **Share had no URL.** **Done.**
12. **iPhone unknowns to test first:** silent switch muting Web Audio; back-swipe from the left screen edge when rubbing lane 1; Safari's bottom bar stealing the lowest 10% (an "Add to Home Screen" manifest with `display: standalone` fixes this and is the next hosting step).

## 7. Learning while playing

Principle: teach through the thing the player just did, at natural pauses, never blocking play, and check it once at the end. Three layers.

**Mechanics that teach (strongest).** A patch finished without the compaction stage should *reopen* 10–15s later as a new pothole. The player learns "compaction is what makes a patch last" through consequence, not text. Wet-weather repairs already take longer; keep that and say why once.

**Field notes.** One line (under 90 characters) shown once, when it is relevant; collected on the end screen; new ones on later plays. Keep them in one array with a `source` field and ship only rows whose source Karan has checked.

| Note | Trigger | Source status |
|---|---|---|
| Potholes start as cracks: water gets in, traffic pumps the wet base out, the surface collapses. | first pothole | engineering consensus; cite IRC:82 (Code of Practice for Maintenance of Bituminous Road Surfaces) after checking |
| A real patch has the steps you just did: clean and square the hole, fill, compact. | first repair | IRC:82; verify clause |
| Skip compaction and the patch pops out with the first rain. | first rushed patch reopens | consensus |
| Hot bitumen cannot be laid in rain. Monsoon patches are cold-mix stop-gaps. | first rain | consensus; verify wording |
| Road damage grows with the fourth power of axle load: twice the weight, about sixteen times the damage. | first truck | AASHO Road Test (1958–60); well established. Pairs with the game's irony that trucks "roll through" |
| 2,161 people were killed in accidents attributed to potholes in India in 2023. | end screen | MoRTH 2023, Table 3.5 (already cited in-game) |
| Two-wheeler riders are the largest group of road deaths in India. | first bike strike | MoRTH 2023; verify the share before quoting a number |
| A puddle hides depth. Slow for water you cannot see the bottom of. | first wet pothole | rider-safety consensus |
| Most municipal corporations take pothole complaints with a geotagged photo. | end screen | verify current channels per city (BMC, BBMP Sahaaya, PMC Care); these change |
| National highway helpline: 1033. | end screen | NHAI; verify |

**One retrieval question on the end screen**, tied to the round: "Why did the patch in lane 2 come back?" with three answers. Retrieval after doing is what makes it stick. The share text should carry one note, so the fact travels with the link.

## 8. Performance

Measured in headless Chromium, 390×844 at 2× DPR, three hazards and rain:

| Metric | Value |
|---|---|
| frame cost p50 | 0.4 ms |
| frame cost p95 | 0.7 ms |
| frame cost max | 3.1 ms |
| frame gap p95 | 16.7 ms |

Desktop has plenty of headroom. The audience's likeliest device is a mid-range Android, so the wins below still matter, and a real-device test is the only proof.

- **Done:** HUD text written only when it changes (line 218 wrote four DOM nodes every frame); rendering stops while a sheet covers a static scene (the loop drew the full scene under a `backdrop-filter` blur while idle); road gradient cached at resize instead of rebuilt per frame (line 215); aggregate specks no longer resized by `rand()` every frame (line 88; it also caused a visible shimmer); music-gain automation only on change (line 184); `.wash` soft-light blend layer removed (line 31).
- Next: render ground and roadside (about 170 stroked paths per frame, lines 202–203) to an offscreen tile once per resize and scroll it; allocate one noise buffer for `grit()` instead of a new `AudioBuffer` every 85ms of rubbing (line 170); set `ctx.font` once per frame, not per hazard; drop DPR to 1.5 when `navigator.deviceMemory <= 3`.

## 9. Hosting (done) and sharing

- Live at <https://gaddha-game.vercel.app>.

- `vercel.json` + `scripts/build.mjs` build `dist/` and fill in the absolute site URL for `og:url` and `og:image` from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (or `SITE_URL`). `og.jpg` is a 1200×630 frame of the game.
- Share button includes the game URL.
- Next: a web-app manifest with icons and `display: standalone` so "Add to Home Screen" removes Safari's bottom bar; test the link preview in WhatsApp.

## 10. Suggested order of work

1. Interface pass (§1 plan): in-world start, sentence end screen, chrome to the top, wordmark. Verify with 390×844 screenshots.
2. Motion pass (§2): anticipation, settle, decays, sheet transitions.
3. Feel pass (§3, §4): sound families, haptic vocabulary, rushed-patch-reopens mechanic.
4. Learning pass (§7): notes deck, end-screen question, persistence.
5. Music (§5): choose the source, integrate the loop.
6. Performance follow-ups (§8) and the iPhone checklist (§6.12).

Each slice: playable on its own, `npm test` green, committed separately, and screenshot-reviewed before moving on.
