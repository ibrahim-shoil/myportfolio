/**
 * Reference-counted body scroll lock, shared by every overlay
 * (inquiry modal, gallery lightbox, mobile navbar menu).
 *
 * Overlays used to each save/restore document.body styles independently,
 * and any overlap in their open/close order made one "restore" a state
 * another overlay had already locked — freezing the page until refresh.
 * With a shared counter the body unlocks only when the LAST overlay closes.
 */

let lockCount = 0
let saved = null

export function lockBodyScroll() {
  lockCount += 1

  if (lockCount === 1) {
    const scrollY = window.scrollY
    saved = {
      scrollY,
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
    }

    // Fixing the body (not just overflow:hidden) also stops iOS Safari
    // from panning the page behind the overlay.
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.width = '100%'
  }

  let released = false
  return function unlockBodyScroll() {
    if (released) return
    released = true
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount === 0 && saved) {
      document.body.style.overflow = saved.overflow
      document.body.style.position = saved.position
      document.body.style.top = saved.top
      document.body.style.left = saved.left
      document.body.style.width = saved.width
      window.scrollTo(0, saved.scrollY)
      saved = null
    }
  }
}
