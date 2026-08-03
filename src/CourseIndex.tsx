import type { Course } from 'flow-engine'

// The concept's landing page: a centered GraphL brand + concept title + a grid of course
// cards, each linking to #/<courseId>. Layout mirrors the catalog index (graphl.in) so the
// two pages read as one system. Plain CSS (index.css) — the concept app carries no Tailwind.
export function CourseIndex({ concept, courses }: { concept: string; courses: Course[] }) {
  return (
    <div className="idx">
      <div className="idx__inner">
        <a className="idx__brand" href="/" title="Back to GraphL">
          <img className="idx__logo" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="30" height="30" />
          <span className="idx__kicker">GraphL</span>
        </a>
        <h1 className="idx__title">{concept}</h1>
        <div className="idx__grid">
          {courses.map((c) => (
            <a key={c.id} className="idx__card" href={`#/${c.id}`}>
              <span className="idx__course">{c.title}</span>
              {/* Meta line intentionally omitted for now — reserved for a future "time to read" cue. */}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
