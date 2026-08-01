# apache-spark-content

Course content for the **Apache Spark** concept, consumed at runtime by the GraphL
progressive-reveal app ([graphl-flow](https://github.com/schemabotview/graphl-flow)).
This repo holds **content only** — the render engine and the scene definitions live in
the app; here we carry what's authored per concept.

## Layout

```
manifest.json        the whole course: concept + sections[]
audio/<id>-<n>.wav   per-beat narration clips (one per beat line)
```

### `manifest.json`

```jsonc
{
  "concept": "Apache Spark",
  "sections": [
    {
      "id": "the-cluster",          // slug; also the audio path stem
      "heading": "The cluster",
      "scene": "demo",              // scene id, resolved in the app's scene registry
      "slide": { "title": "...", "bullets": ["...", "..."] },
      "beats": [                     // ordered [(line, delta)] — a Map section has 1 beat
        {
          "line": "...",            // the narration (tts) text for this beat
          "delta": [                 // reveal deltas — additive verbs
            { "kind": "solidify", "ids": ["master"] },
            { "kind": "draw", "edges": [["session", "cluster-mgr"]] }
          ]
        }
      ]
    }
  ]
}
```

Reveal delta verbs: `solidify` (node ids) · `draw` (edges as `[from,to]`) · `pulse`
(ids) · `annotate` (`id`, `value`) · `pan` (`to`). Beats reference the scene's **raw node
ids**; a validator (in the app / CI) checks every id exists in its scene.

### `audio/`

One short clip per beat, named `<section-id>-<beatIndex>.wav` (0-based), e.g.
`the-cluster-0.wav`. Generated from each beat's `line` (currently macOS `say`
placeholders; swap in Chatterbox with no app change).

## How it's served

The app fetches `manifest.json` (and the clips) over raw GitHub, so this repo needs no
build — just push. This is the demo bundle; real Spark content replaces it.
