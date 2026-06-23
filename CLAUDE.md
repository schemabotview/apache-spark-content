# CLAUDE.md

Guidance for working in this repo. Read alongside `README.md`, `DESIGN.md`, and
`MODULES.md` — this file is the orientation; those three are the source contracts.

## What this is

A **content repo**, not an app. It holds the **Apache Spark** topic that the
`graphl-ux` app (sibling repo) loads **at runtime**. No content logic, no render
engine, and no scenes live here — the app fetches this repo's `manifest.json` +
notebooks over the network and renders them.

There is **nothing to build, run, or test** in this repo. Changes are content and
JSON; correctness is verified by the `graphl-ux` app consuming them.

## The core contract (do not break)

1. **The notebook is the single source of truth** for a module's prose and code.
   The `manifest.json` only *wires* — it must never duplicate notebook content.
2. The app splits each notebook at every `## ` heading into **sections** (= pages).
   Sections are matched to the manifest overlay by **normalized heading text**, so
   a heading edit in a notebook must be mirrored in the manifest `heading` field.
3. A section's diagram **images (`![]()`) are stripped** by the app — a **scene**
   replaces them. Don't rely on inline notebook images surviving.
4. **Scenes live in the `graphl-ux` app** (`src/scenes`), authored with the
   engine's pattern helpers — **not** in this repo. The local `scenes/` dir is
   reserved/empty (`.gitkeep`). Here you only reference a scene **by id**.

## Layout

```
manifest.json   # wires module 01: notebook ref + per-section overlay (scene/spine/role)
DESIGN.md       # FIXED visual house style — palette, calm filled blocks, spotlight
MODULES.md      # the curated 9-module / per-section outline + spine/depth tiering
notebooks/      # the teaching .ipynb (prose + code source of truth) — 01..10
tts/            # per-section narration scripts (plain spoken prose) — not yet generated
audio/          # generated .wav narration (currently per-scene, interim)
scenes/         # reserved/empty — real scenes live in graphl-ux app
```

## manifest.json shape

- Top level: `concept`, `design` (→ DESIGN.md), `scenes[]` (id/title/status), and
  `presentations[]` (one per module).
- Each presentation: `id`, `title`, `notebook` (path), `defaultScene`, and
  `sections[]`.
- Each section overlay: `heading` (must match a notebook `## ` heading, normalized),
  `scene` (a scene id), `spine` (bool — drives feed-mode linear narration), and
  optional `role` (e.g. `"hook"`).

## Authoring rules

- **Semantic palette is fixed** (DESIGN.md): a color always means one concept
  (BLUE=driver, GREEN=executors/compute, ORANGE=storage/shuffle, PURPLE=API/abstraction,
  TEAL=transformations/flow, RED=wide-op/gotcha, GRAY=inert, AMBER=narration spotlight only).
  Never reuse a hue for an unrelated concept. Keep ≤4–5 colors live at once.
- Style is **calm filled blocks, not neon**: no glow, no blur, no dotted grid;
  AMBER + motion are reserved for the single node narration is on.
- **★ spine** in MODULES.md = essential, narrated in feed mode; plain = depth
  (kept as a page, explorable in canvas mode). Spine picks are still being tuned —
  treat them as proposals, not locked.

## How content is served

The app fetches this repo at runtime over **raw GitHub**:
`https://raw.githubusercontent.com/schemabotview/apache-spark-content/main/…`
(configurable in the app via `VITE_CONTENT_BASE_URL`). No app build bundles this
content — so a content change is live once pushed to `main`, no app rebuild needed.

## Source of notebooks

Notebooks are copied as-is from the runnable curriculum at
`~/Projects/apache-spark`. Keep them self-contained.

## Current status

- **Module 01 (Foundations & Execution Model)** is wired in `manifest.json`: 21
  sections, each mapped to `spark-cluster` or `spark-execution` with spine flags.
- Scenes `spark-cluster` and `spark-execution` are built (in graphl-ux); `aqe` and
  `spark-connect` are `todo`.
- One narration clip exists: `audio/spark-execution.wav` (audio is currently
  **per-scene**, not per-section — interim).
- **Modules 02–09** exist as notebooks but are **not yet wired** in the manifest.
- Module 10 (exam questions) and the hands-on project are **parked for phase 2**.

## When adding/wiring a module

1. Confirm the notebook is in `notebooks/` and its `## ` headings are final.
2. Add a `presentations[]` entry; list every section so no detail is lost
   (every section becomes a page — see MODULES.md goal).
3. Set `scene` ids per section, mark `spine` per the MODULES.md tiering, set the
   module-hook section's `role: "hook"`.
4. If a referenced scene doesn't exist yet, add it to `scenes[]` with
   `status: "todo"` and author the actual scene in the **graphl-ux** repo.
