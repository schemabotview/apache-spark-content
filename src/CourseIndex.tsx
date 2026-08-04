import type { Course } from 'flow-engine'
import { BLURBS } from './content/courses/index.ts'

// The concept's landing page: a centered GraphL brand + concept title + an ORDERED LIST of
// courses, each linking to #/<courseId>. A numbered list (not a card grid) because the courses
// are a *sequence* meant to be taken in order — it reads as a syllabus, and each row carries a
// blurb + section count. (The top-level catalog at graphl.in stays a card gallery, since concepts
// there are peers you pick among; courses within a concept are an ordered track.) Plain CSS
// (index.css); the concept app carries no Tailwind.
export function CourseIndex({ concept, courses }: { concept: string; courses: Course[] }) {
  return (
    <div className="idx">
      <div className="idx__inner">
        <a className="idx__brand" href="/" title="Back to GraphL">
          <img className="idx__logo" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="30" height="30" />
          <span className="idx__kicker">GraphL</span>
        </a>
        <h1 className="idx__title">{concept}</h1>
        <ol className="idx__list">
          {courses.map((c, i) => (
            <li key={c.id} className="idx__item">
              <a className="idx__row" href={`#/${c.id}`}>
                <span className="idx__num">{i + 1}</span>
                <span className="idx__text">
                  <span className="idx__course">{c.title}</span>
                  {BLURBS[c.id] && <span className="idx__blurb">{BLURBS[c.id]}</span>}
                </span>
                <span className="idx__meta">{c.sections.length} sections</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
