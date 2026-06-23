# apache-spark-content

Content repo for the **Apache Spark** topic in graphl-ux. Designed to load at
runtime; no content logic lives in the app code. Follows the
**manifest + notebook-as-source-of-truth** contract.

## Layout

```
apache-spark-content/
  manifest.json     # wires modules: notebook ref + per-section overlay (scene/spine/audio)
  DESIGN.md         # the visual house style (calm filled blocks, palette, reel chrome)
  MODULES.md        # the curated module/section outline + spine/depth tiering
  notebooks/        # the 9 teaching .ipynb (the prose + code source of truth)
  scenes/           # SceneSpec JSON per scene (target home; see Status)
  tts/              # per-section narration scripts (plain spoken prose)
  audio/            # generated .wav narration
```

## Contract

- The **notebook is the single source of truth** for a module's prose and code.
  The manifest only *wires* — it never duplicates notebook content.
- The app splits each notebook at every `## ` heading into **sections** (= pages).
  A section's diagram **images (`![]()`) are stripped** — the scene replaces them.
- The manifest overlay attaches, per section: a `scene` id (the diagram), a
  `spine` flag (drives feed-mode flow), an optional `role` (e.g. `hook`), and
  (later) an `audio` stem. Sections are matched to the overlay by normalized heading.
- A **scene** is a reusable `SceneSpec` (portrait 800×1200) referenced by id from
  many sections. Authored with the engine's pattern helpers; styled per `DESIGN.md`.

## Source

Notebooks are copied from `~/Projects/apache-spark` (the runnable curriculum).
See `MODULES.md` for the module list, section outline, and the spine/depth tiering.

## Status

**Module 01 (Foundations & Execution Model)** is wired in `manifest.json`: 21
sections, each mapped to a scene (`spark-cluster` or `spark-execution`) with spine
flags. One narration clip exists (`audio/spark-execution.wav`).

Interim, vs the target contract:
- **Scenes live in app code** (`src/scenes/*.ts`), not yet as `scenes/*.json` here.
- **Audio is per-scene**, not per-section; `tts/` scripts not yet generated.
- The app currently **imports** the notebook + audio directly (bundled); the runtime
  content client that fetches from this repo is not built yet.
- Modules 02–09 are present as notebooks but not yet wired in the manifest.
