# CLAUDE.md — apache-spark (concept app)

The **Apache Spark** concept app for GraphL: a self-contained Vite/React app that renders the Spark
course as a progressive-reveal video and serves its own narration audio. All rendering/reveal/player
machinery comes from the shared engine — [`flow-engine`](https://github.com/schemabotview/flow-engine)
— installed via GitHub. This repo supplies only what's specific to Apache Spark.

> Parent context: `../CLAUDE.md` (workspace + domain model + locked principles) and
> `../flow-engine/CLAUDE.md` (the engine API). Don't relitigate the locked reveal decisions here.

## Layout

```
apache-spark/
  package.json      depends on github:schemabotview/flow-engine (+ react, @xyflow/react, lucide-react)
  src/
    scenes/         this concept's SceneSpecs (evolution) — the diagram STRUCTURE
      index.ts      the scene registry: getScene(id)
    content/course.ts   the typed Course: sections → slide + beats (references scene node ids)
    main.tsx        mounts <RevealPlayer course getScene audioBase="" />
  public/audio/     per-beat narration clips: <courseId>/<section-id>-<beatIndex>.wav
  scripts/
    gen-audio-manifest.ts   `npm run gen:audio` → scripts/audio-manifest.json (one entry per beat)
    colab_generate_audio.ipynb   Colab/Chatterbox TTS: reads the manifest, generates + pushes each wav
  .github/workflows/build.yml   CI = npm ci + npm run build (tsc + vite)
```

## The content model (this is what gets authored)

- **Scenes** (`src/scenes`) = structure. Authored with the engine's helpers:
  `import { type SceneSpec, container, wgrid, BLUE, … } from 'flow-engine'`. Register in `scenes/index.ts`.
- **Courses** (`src/content/courses/*.ts`, registered in `courses/index.ts`) = the script. Each is a
  list of sections; each section has a `slide`, an optional `focus`, and ordered `beats`:
  - `slide` = `{ title, body }` — `body` is a **Markdown** string (headings, lists, tables, bold),
    rendered by the engine's `SlidePane`. Fill the pane with that section's content; don't echo the
    narration verbatim (eye vs ear).
  - `focus` (optional) — node ids the per-section camera frames; **default = the nodes the section
    solidifies**. `focus: []` frames the whole scene (the ghosted "overview" opener).
  - A **beat** = `{ line, delta }`. `line` = the narration (tts) text; `delta` = reveal verbs on
    **raw scene node ids**: `{ kind: 'solidify', ids: […] }`, `{ kind: 'draw', edges: [[from,to]] }`,
    plus `pulse` / `annotate` / `pan` (folded, not yet drawn).
  - Map section = 1 beat; Trace section = N beats. A timeline of eras is **Map-per-era**: one beat
    lights each whole band while the camera travels (see `evolution`). Revealed nodes read as **lit**
    (in the focus band) or **dimmed** (a past band); unrevealed stay **ghost**.
- **Audio** (`public/audio`) = one wav per beat, named `<section-id>-<beatIndex>.wav` (0-based),
  matching the beat's `line`. `audioBase=""` → served same-origin (robust for capture: no live fetch).

## Slide & narration density (the benchmark — locked)

The `evolution` course's band ① section (`the-problem` in `content/courses/evolution.ts`) is the
**reference density** — every slide should fill the pane at *about* this level, no thinner, no denser:

- **Shape** — one **head** sentence · **2–3** `###` sub-sections of **2–3 bullets** each · one **tail**
  sentence (~**8–9 bullets** total). The tail is a one-line take-away that hands off to the next section.
- **Bullets** — a **bold** term/name + a short gloss (`— …` or `·`-joined pieces). Nest **at most one**
  sub-line under a bullet. Keep each bullet to one line at capture width.
- **Fill the pane, don't pad it.** Match this density even for "simple" sections — a sparse slide reads
  as empty on a 4K capture. If a section genuinely has less to say, deepen the *why*, not filler.

**Narration covers the whole slide, in a natural spoken tone.** The beat `line`(s) must touch **every**
point on the slide — but as connected speech (eye vs ear), never the bullet text read aloud. Slide =
scannable skeleton; narration = the same content spoken as flowing prose. For a 1-beat Map section that
means one paragraph walking head → each sub-section → tail; for an N-beat Trace, the beats collectively
cover the slide.

## Authoring by AI + the safety net

Manifest/scenes/slides/tts are **authored by an AI model** from source material. Because scenes and
beats are in **one TS project**, drift is caught:
- `tsc` type-checks scenes + course.
- `validateCourse` (runs at dev-load; see `main.tsx`) fails loud if a beat names a node id that isn't
  in its scene, or draws a non-existent edge.

*(A CI-level build-gate on id drift is deferred until the engine ships a `flow-engine/pure` export —
today CI catches type errors, dev-load catches id drift.)*

## Commands

```bash
npm install     # pulls flow-engine from GitHub
npm run dev     # http://localhost:5173 — SPACE plays, ← → page beats
npm run build   # tsc + vite build
```

To pick up a **published** engine change: `npm install github:schemabotview/flow-engine`, then
**commit the updated `package-lock.json`**. CI builds with `npm ci`, which installs the engine
commit *pinned in the lockfile* — if you push engine changes but not a re-resolved lockfile, the
deployed **scene/player** keeps the old engine CSS (the app's own landing CSS updates regardless,
so the symptom is "landing themed, scenes stale"). Always bump + commit the lockfile after an
engine change.

## Theme & fonts (implements the canonical theme in `../CLAUDE.md`)

- **Fonts self-hosted** (safe for headless capture — no CDN): `@fontsource/ibm-plex-sans` +
  `@fontsource/ibm-plex-mono`, imported by weight in `src/main.tsx`; `src/index.css` sets `body`
  font-family to Plex Sans (Plex Mono for kickers/meta). Engine CSS inherits these.
- `src/index.css` also themes the **course-index landing** with the Zed-slate tokens.
- Palette/typography values are the canonical ones in `../CLAUDE.md`; engine-side details (label
  sizing, behind-nodes edge labels) in `../flow-engine/CLAUDE.md`.

## Local engine-preview loop (previewing UNPUBLISHED engine edits)

`npm i github:…flow-engine` installs a **copy** of the engine's committed `dist/` into
`node_modules/flow-engine` (not a symlink) — so local edits to `../flow-engine/src` aren't seen until
its `dist/` is rebuilt **and** synced. To preview an engine change before committing/pushing it:

```bash
(cd ../flow-engine && npm run build)                 # rebuild dist/ from src
rm -rf node_modules/flow-engine/dist \
  && cp -R ../flow-engine/dist node_modules/flow-engine/dist   # sync into this app
rm -rf node_modules/.vite                             # Vite pre-bundles deps → force re-optimize
npm run dev                                            # restart; hard-refresh the browser
```

Once approved, the real release path is: commit `../flow-engine/dist` + push, then
`npm i github:schemabotview/flow-engine` here.

## Audio generation

One wav per beat `line`, at `public/audio/<courseId>/<section-id>-<beatIndex>.wav`. Because the
narration lives in the typed course files (not per-section `.tts`), the pipeline is:

1. `npm run gen:audio` → `scripts/audio-manifest.json` (a flat `{ course, section, beat, file, line }`
   list of every beat; run + **commit** it whenever beats change — the notebook only sees committed lines).
2. `scripts/colab_generate_audio.ipynb` on Colab (Chatterbox, CUDA) reads that manifest and generates
   each wav to its contract path, committing + pushing one at a time. `audioBase=""` → served
   same-origin (no live fetch at capture).

## Status

- **`evolution`** — the first (and currently only) real course + scene: "The road to Spark", a
  top-to-bottom timeline (Hadoop 1 → Hadoop 2/YARN → Spark 1 → Spark 2) on the `evolution` scene.
  Opens with a whole-scene ghosted **overview** (a section with `focus: []`), then the camera
  Ken-Burns down era by era; each era is a **1-beat Map section** lighting its whole band. Markdown
  slides list each era's features. 6 beats; audio generated via the pipeline above.
- The original toy demos (`cluster-basics` / `executor-internals` on the `demo` / `executor` scenes)
  were **removed** — they only existed as pipeline proofs and would generate throwaway wavs.

Next: TTS for `evolution`, then the **spark-architecture** course (driver / cluster-manager / workers).
