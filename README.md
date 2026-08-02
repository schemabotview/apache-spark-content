# apache-spark

The **Apache Spark** concept app for GraphL. A self-contained Vite/React app that renders
the Spark course as a progressive-reveal video and serves its own narration audio.

It depends on the shared engine — [`flow-engine`](https://github.com/schemabotview/flow-engine) —
for all the rendering, the reveal fold, and the `<RevealPlayer>`. This repo supplies only
what's specific to Apache Spark: its scenes, its course, and its audio.

## Layout

```
src/
  scenes/               this concept's SceneSpecs (authored with flow-engine helpers)
  content/courses/*.ts  the typed courses: sections → slide (Markdown body) + focus + beats
  main.tsx              mounts <RevealPlayer course=… getScene=… audioBase="" />
public/audio/           per-beat narration clips  <courseId>/<section-id>-<beatIndex>.wav
```

The first real course is **`evolution`** ("The road to Spark") on the `evolution` scene — a
top-to-bottom timeline whose per-section camera travels era by era. Each section's `slide.body` is
Markdown, and `focus` picks the band the camera frames (`focus: []` = the whole-scene overview).

## Develop

```bash
npm install     # pulls flow-engine from GitHub
npm run dev     # http://localhost:5173  — SPACE plays, ← → page beats
npm run build   # tsc (type-checks scenes + course) + vite build
```

Because scenes and beats live in the same TypeScript project, a beat that references a
scene node id which doesn't exist is caught at build (types) and at dev-load
(`validateCourse`, logged to the console).

## Look & feel

The Zed-slate theme (see the repo root's `CLAUDE.md` for the canonical tokens) is applied here via
self-hosted fonts — `@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono`, imported in
`src/main.tsx` (no CDN, so they render in headless capture) — plus `src/index.css` for the course
landing. To preview **unpublished** `flow-engine` edits locally you must rebuild + sync its `dist/`
into `node_modules`; the exact loop is in `CLAUDE.md` ("Local engine-preview loop").

## Audio

Clips are `public/audio/<section-id>-<beatIndex>.wav`, one per beat `line`. Currently macOS
`say` placeholders; regenerate with Chatterbox (one clip per line) — no app change needed.
