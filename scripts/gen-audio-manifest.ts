import { writeFileSync } from 'node:fs'
import { courses } from '../src/content/courses/index.ts'

// Emit scripts/audio-manifest.json — the bridge from TS beats to the Colab TTS notebook.
//
// The narration for every beat lives inside the typed course files (each beat's `line`),
// and the audio contract is one wav per beat named:
//     public/audio/<courseId>/<section-id>-<beatIndex>.wav   (beatIndex 0-based)
// The Colab generator is Python and shouldn't have to parse TS, so we flatten every beat
// here — under Node 22's --experimental-strip-types, exactly like gen-courses-json.ts —
// into a plain JSON list the notebook reads verbatim.
//
// Run `npm run gen:audio` and commit the result before generating audio on Colab.

type Entry = {
  course: string // courseId
  section: string // section id
  beat: number // 0-based index within the section
  file: string // wav path relative to public/audio: "<course>/<section>-<beat>.wav"
  line: string // the narration text spoken in this beat
}

const entries: Entry[] = []
for (const course of courses) {
  for (const section of course.sections) {
    section.beats.forEach((beat, beat_i) => {
      entries.push({
        course: course.id,
        section: section.id,
        beat: beat_i,
        file: `${course.id}/${section.id}-${beat_i}.wav`,
        line: beat.line,
      })
    })
  }
}

const manifest = { concept: 'apache-spark', count: entries.length, entries }

writeFileSync(
  new URL('./audio-manifest.json', import.meta.url),
  JSON.stringify(manifest, null, 2) + '\n',
)
console.log(`wrote audio-manifest.json — ${entries.length} beats across ${courses.length} courses`)
