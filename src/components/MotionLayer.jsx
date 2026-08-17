import { useEffect, useRef } from 'react'
import './MotionLayer.scss'

export default function MotionLayer() {
  const auraRef = useRef(null)

  useEffect(() => {
    // Pointer-driven motion is skipped for touch devices and for users who
    // opt out of motion (prefers-reduced-motion).
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return undefined

    const aura = auraRef.current
    let frame = 0
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    const render = () => {
      currentX += (targetX - currentX) * 0.16
      currentY += (targetY - currentY) * 0.16
      if (aura) aura.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = window.requestAnimationFrame(render)
      } else {
        frame = 0
      }
    }

    const handlePointerMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      aura?.classList.add('is-visible')
      if (!frame) frame = window.requestAnimationFrame(render)

      const surface = event.target.closest?.('.motion-surface')
      if (!surface) return
      const bounds = surface.getBoundingClientRect()
      surface.style.setProperty('--motion-x', `${event.clientX - bounds.left}px`)
      surface.style.setProperty('--motion-y', `${event.clientY - bounds.top}px`)
    }

    const hideAura = () => aura?.classList.remove('is-visible')
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', hideAura)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('mouseleave', hideAura)
    }
  }, [])

  return <div ref={auraRef} className="motion-pointer-aura" aria-hidden="true" />
}
