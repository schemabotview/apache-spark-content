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
  scenes/           # reserved — scenes live in the graphl-ux app (src/scenes), not here
  tts/              # per-section narration scripts (plain spoken prose)
  audio/            # generated .wav narration
  scripts/          # colab_generate_audio.ipynb — TTS .tts -> .wav on a Colab GPU
```

## Generating audio

Narration `.wav`s are produced from the `tts/*.tts` scripts by
`scripts/colab_generate_audio.ipynb` (ChatterboxTTS on a Colab T4 GPU). It clones
this repo, generates one `audio/<stem>.wav` per `tts/<stem>.tts`, and commits +
pushes each clip straight from the Colab VM. Needs a Colab secret `GITHUB_TOKEN`
(a PAT with **Contents: Read/Write** on `schemabotview/apache-spark-content`).
Set `FORCE=True` to regenerate existing clips, or `ONLY_STEM="01-02-the-cluster"`
to do a single section. This is a convenience tool — there is otherwise nothing to
build or run in this repo.

## Contract

- The **notebook is the single source of truth** for a module's prose and code.
  The manifest only *wires* — it never duplicates notebook content.
- The app splits each notebook at every `## ` heading into **sections** (= pages).
  A section's diagram **images (`![]()`) are stripped** — the scene replaces them.
- The manifest overlay attaches, per section: a `scene` id (the diagram), a
  `spine` flag (drives feed-mode flow), an optional `role` (e.g. `hook`), and
  (later) an `audio` stem. Sections are matched to the overlay by normalized heading.
- A **scene** is a reusable `SceneSpec` (portrait 800×1200) referenced by id from
  many sections. Scenes are authored and bundled in the **graphl-ux app**
  (`src/scenes`, with the engine's pattern helpers) — they are **not** served from
  this repo. Styled per `DESIGN.md`.

## Source

Notebooks are copied from `~/Projects/apache-spark` (the runnable curriculum).
See `MODULES.md` for the module list, section outline, and the spine/depth tiering.

## Status

**Module 01 (Foundations & Execution Model)** is wired in `manifest.json`: 15
sections, each mapped to a scene (`spark-cluster` or `spark-execution`) with spine
flags and a **per-section** `audio` stem. All 15 `tts/01-NN-*.tts` narration
scripts are written; their `.wav`s are generated via `scripts/colab_generate_audio.ipynb`
(the legacy per-scene `audio/spark-execution.wav` stays as a fallback until every
clip is generated and verified).

**Serving.** graphl-ux fetches this repo at runtime over raw GitHub
(`https://raw.githubusercontent.com/schemabotview/apache-spark-content/main/…`,
configurable via the app's `VITE_CONTENT_BASE_URL`). No app build bundles this
content; the app ships only the render engine + scenes.

Still interim:
- Module 01 `.wav`s need a Colab generation pass; until then the app falls back to
  the per-scene `audio/spark-execution.wav`.
- Modules 02–09 are present as notebooks but not yet wired in the manifest (no
  `tts/`/`audio/` for them yet).
