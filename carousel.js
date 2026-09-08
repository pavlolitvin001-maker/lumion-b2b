(() => {
  let teardown = () => {}
  const init = () => {
    teardown()
    const carousel = document.querySelector('.case-carousel')
    if (!carousel) return
    const viewport = carousel.querySelector('.case-viewport')
    const track = carousel.querySelector('.case-track')
    const slides = [...carousel.querySelectorAll('.case-slide')]
    const prev = carousel.querySelector('.case-arrow-prev')
    const next = carousel.querySelector('.case-arrow-next')
    if (!viewport || !track || !slides.length || !prev || !next) return
    let index = 0, startX = 0, startTime = 0, base = 0, dragging = false, pointerId = null
    const gap = () => parseFloat(getComputedStyle(track).gap) || 0
    const step = () => slides[0].getBoundingClientRect().width + gap()
    const max = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
    const offset = () => Math.min(index * step(), max())
    const draw = (value = offset(), animate = true) => {
      track.style.transition = animate ? 'transform 280ms cubic-bezier(.22,.61,.36,1)' : 'none'
      track.style.transform = `translateX(${-value}px)`
      prev.disabled = index === 0
      next.disabled = offset() >= max() - 1
    }
    const move = (direction) => {
      index = Math.max(0, Math.min(Math.ceil(max() / Math.max(step(), 1)), index + direction))
      draw()
    }
    const down = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragging = true; pointerId = event.pointerId; startX = event.clientX; startTime = performance.now(); base = offset()
      viewport.setPointerCapture?.(pointerId); draw(base, false)
    }
    const drag = (event) => {
      if (!dragging || event.pointerId !== pointerId) return
      draw(Math.max(0, Math.min(max(), base - (event.clientX - startX))), false)
    }
    const release = (event) => {
      if (!dragging || event.pointerId !== pointerId) return
      const delta = event.clientX - startX
      const velocity = Math.abs(delta) / Math.max(performance.now() - startTime, 1)
      dragging = false; pointerId = null
      if (Math.abs(delta) >= 28 || velocity >= .28) move(delta < 0 ? 1 : -1)
      else draw()
    }
    const resize = () => draw()
    const previous = () => move(-1)
    const following = () => move(1)
    prev.addEventListener('click', previous); next.addEventListener('click', following)
    viewport.addEventListener('pointerdown', down); viewport.addEventListener('pointermove', drag)
    viewport.addEventListener('pointerup', release); viewport.addEventListener('pointercancel', release)
    window.addEventListener('resize', resize)
    teardown = () => {
      prev.removeEventListener('click', previous); next.removeEventListener('click', following)
      viewport.removeEventListener('pointerdown', down); viewport.removeEventListener('pointermove', drag)
      viewport.removeEventListener('pointerup', release); viewport.removeEventListener('pointercancel', release)
      window.removeEventListener('resize', resize)
    }
    draw()
  }
  init()
  window.addEventListener('lumion:cases', init)
})()
