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
    scenes/         this concept's SceneSpecs (demo, executor) — the diagram STRUCTURE
      index.ts      the scene registry: getScene(id)
    content/course.ts   the typed Course: sections → slide + beats (references scene node ids)
    main.tsx        mounts <RevealPlayer course getScene audioBase="" />
  public/audio/     per-beat narration clips: <section-id>-<beatIndex>.wav
  .github/workflows/build.yml   CI = npm ci + npm run build (tsc + vite)
```

## The content model (this is what gets authored)

- **Scenes** (`src/scenes`) = structure. Authored with the engine's helpers:
  `import { type SceneSpec, container, wgrid, BLUE, … } from 'flow-engine'`. Register in `scenes/index.ts`.
- **Course** (`src/content/course.ts`) = the script. A list of sections; each has a `slide`
  (title + bullets) and ordered `beats`. A **beat** = `{ line, delta }`:
  - `line` — the narration (tts) text, spoken not shown.
  - `delta` — reveal verbs referencing **raw scene node ids**: `{ kind: 'solidify', ids: […] }`,
    `{ kind: 'draw', edges: [[from,to]] }`, plus `pulse` / `annotate` / `pan` (folded, not yet drawn).
  - Map section = 1 beat; Trace section = N beats (assemble a process step-by-step).
- **Audio** (`public/audio`) = one wav per beat, named `<section-id>-<beatIndex>.wav` (0-based),
  matching the beat's `line`. `audioBase=""` → served same-origin (robust for capture: no live fetch).

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

To pick up an engine change: `npm install github:schemabotview/flow-engine`.

## Audio generation

Clips are currently macOS `say` placeholders. Regenerate with **Chatterbox** (one clip per beat
`line`) into `public/audio/<section-id>-<beatIndex>.wav` — no app change needed.

## Status

Currently a 3-section demo across two toy scenes (`demo`, `executor`) proving the pipeline. Real
Spark modules (spark-architecture etc.) replace this content next.
