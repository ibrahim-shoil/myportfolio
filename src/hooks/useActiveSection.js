import { useState, useEffect } from 'react'

/**
 * Returns the id of the section currently in view.
 * Pass the list of section ids to observe.
 */
export default function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState(ids[0] || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting entry
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    const els = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)

    els.forEach(el => observer.observe(el))

    return () => els.forEach(el => observer.unobserve(el))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), offset])

  return active
}
