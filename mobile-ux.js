(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  const resetScroll = () => { if (!location.hash) window.scrollTo(0, 0) }
  resetScroll()
  window.addEventListener('pageshow', (event) => { if (event.persisted) requestAnimationFrame(resetScroll) })
  document.querySelectorAll('img:not(.hero-current-image)').forEach((image) => {
    image.loading = 'lazy'; image.decoding = 'async'
    if (!image.sizes) image.sizes = '(max-width: 760px) calc(100vw - 36px), 33vw'
  })
  const heroImage = document.querySelector('.hero-current-image')
  if (heroImage) { heroImage.fetchPriority = 'high'; heroImage.decoding = 'async'; heroImage.sizes = '(max-width: 760px) calc(100vw - 36px), 42vw' }
  const widget = document.querySelector('[data-mobile-contact]')
  if (!widget) return
  const toggle = widget.querySelector('.mobile-contact-toggle')
  const options = widget.querySelector('.mobile-contact-options')
  const setOpen = (open) => {
    widget.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Закрити контакти' : 'Відкрити контакти'); options.setAttribute('aria-hidden', String(!open))
  }
  const validUrl = (value) => { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null } catch { return null } }
  const setLink = (name, href) => {
    const link = widget.querySelector(`[data-contact-option="${name}"]`)
    if (!link) return false
    link.hidden = !href
    if (href) link.href = href; else link.removeAttribute('href')
    return Boolean(href)
  }
  toggle.addEventListener('click', () => setOpen(!widget.classList.contains('is-open')))
  widget.addEventListener('click', (event) => { if (event.target.closest('[data-contact-option]')) setOpen(false) })
  window.addEventListener('lumion:contacts', (event) => {
    const settings = event.detail || {}
    const phone = typeof settings.phone === 'string' ? settings.phone.replace(/[^+\d]/g, '') : ''
    const available = [setLink('telegram', validUrl(settings.telegramUrl)), setLink('whatsapp', validUrl(settings.whatsAppUrl)), setLink('viber', validUrl(settings.viberUrl)), setLink('phone', phone.length >= 7 ? `tel:${phone}` : null)].some(Boolean)
    widget.hidden = !available
  })
})()
