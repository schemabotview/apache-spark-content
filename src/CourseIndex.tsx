import type { Course } from 'flow-engine'

// The concept's landing page: lists its courses, each linking to #/<courseId>. Plain CSS
// (index.css) — the concept app carries no Tailwind. A concept can grow to many courses.
export function CourseIndex({ concept, courses }: { concept: string; courses: Course[] }) {
  return (
    <div className="idx">
      <div className="idx__inner">
        <div className="idx__kicker">GraphL</div>
        <h1 className="idx__title">{concept}</h1>
        <ul className="idx__list">
          {courses.map((c) => (
            <li key={c.id}>
              <a className="idx__link" href={`#/${c.id}`}>
                <span className="idx__course">{c.title}</span>
                <span className="idx__meta">
                  {c.sections.length} section{c.sections.length === 1 ? '' : 's'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
