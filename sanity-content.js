(() => {
  const config = {
    projectId: 'pkp5ah6s',
    dataset: 'production',
    apiVersion: '2025-02-19',
  }

  const isText = (value) => typeof value === 'string' && value.trim().length > 0
  const setText = (element, value) => {
    if (element && isText(value)) element.textContent = value.trim()
  }
  const validUrl = (value) => {
    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null
    } catch {
      return null
    }
  }
  const imageUrl = (image) => {
    const url = validUrl(image?.asset?.url)
    return url ? `${url}${url.includes('?') ? '&' : '?'}fm=webp&q=82` : null
  }
  const imagePosition = (image) => {
    const hotspot = image?.hotspot
    return hotspot && Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y)
      ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
      : null
  }
  const updateImage = (image, source) => {
    const url = imageUrl(source?.image)
    if (!image || !url) return false
    image.src = url
    if (isText(source.alt)) image.alt = source.alt.trim()
    const position = imagePosition(source.image)
    if (position) image.style.objectPosition = position
    return true
  }
  const query = `{
    "generalSettings": *[_id == "generalSettings"][0]{phone,email,telegramUrl,viberUrl,whatsAppUrl,otherMessengerUrl,warehouseAddress,workingHours,privacyPolicyUrl},
    "b2bConditions": *[_id == "b2bConditions"][0],
    "hero": *[_id == "hero"][0]{eyebrow,heading,description,primaryCtaLabel,secondaryCtaLabel,imageOne{alt,image{asset->{url},hotspot}},imageTwo{alt,image{asset->{url},hotspot}},imageThree{alt,image{asset->{url},hotspot}}},
    "trustBar": *[_id == "trustBar"][0],
    "productTypes": *[_id == "productTypes"][0]{fringe,stringLight,curtain,retro,contour,motifs},
    "benefits": *[_id == "benefits"][0],
    "workProcess": *[_id == "workProcess"][0],
    "priorityDelivery": *[_id == "priorityDelivery"][0],
    "faqItems": *[_type == "faqItem" && enabled == true && !(_id in path("drafts.**"))] | order(displayOrder asc){question,answer},
    "formTexts": *[_id == "formTexts"][0],
    "seoSettings": *[_id == "seoSettings"][0]{metaTitle,metaDescription,openGraphImage{alt,image{asset->{url}}},favicon{alt,image{asset->{url}}}},
    "analyticsSettings": *[_id == "analyticsSettings"][0],
    "cases": *[_type == "case" && !(_id in path("drafts.**"))] | order(displayOrder asc){title,city,year,objectType,images[]{alt,image{asset->{url},hotspot}}}
  }`

  const applyGeneralSettings = (settings) => {
    if (!settings) return
    if (isText(settings.phone)) setText(document.querySelector('.header .phone span'), settings.phone)
    const footer = document.querySelector('footer div')
    if (!footer) return
    const contactValues = [settings.phone, settings.email].filter(isText)
    const messenger = [settings.telegramUrl, settings.viberUrl, settings.otherMessengerUrl]
      .map(validUrl)
      .find(Boolean)
    if (messenger) contactValues.push(messenger)
    if (contactValues.length) setText(footer.querySelector('p'), contactValues.join(' · '))
    const locationValues = [settings.warehouseAddress, settings.workingHours].filter(isText)
    if (locationValues.length) setText(footer.querySelectorAll('p')[1], locationValues.join(' · '))
    const privacyUrl = validUrl(settings.privacyPolicyUrl)
    if (privacyUrl) {
      document.querySelectorAll('.consent a, footer > a').forEach((link) => { link.href = privacyUrl })
    }
    window.dispatchEvent(new CustomEvent('lumion:contacts', { detail: settings }))
  }

  const applyHero = (hero) => {
    if (!hero) return
    setText(document.querySelector('.hero .eyebrow'), hero.eyebrow)
    setText(document.querySelector('.hero h1'), hero.heading)
    setText(document.querySelector('.hero .lead'), hero.description)
    setText(document.querySelector('[data-lead="catalog_request"][data-location="hero"]'), hero.primaryCtaLabel)
    setText(document.querySelector('[data-lead="object_estimate"][data-location="hero"]'), hero.secondaryCtaLabel)
    const photos = [hero.imageOne, hero.imageTwo, hero.imageThree]
      .map((entry) => {
        const url = imageUrl(entry?.image)
        return url && isText(entry?.alt) ? { src: url, alt: entry.alt.trim(), position: imagePosition(entry.image) } : null
      })
      .filter(Boolean)
    if (photos.length === 3) window.dispatchEvent(new CustomEvent('lumion:heroPhotos', { detail: photos }))
  }

  const applyTrustBar = (trustBar) => {
    if (!trustBar) return
    document.querySelectorAll('.trust > div').forEach((item, index) => setText(item.querySelector('span'), trustBar[`item${index + 1}`]?.title))
  }

  const applyProductTitle = (heading, value) => {
    if (!heading || !isText(value)) return
    const suffix = ['Icicle Light', 'String Light', 'Curtain Light'].find((item) => value.trim().endsWith(item))
    if (!suffix) {
      heading.textContent = value.trim()
      return
    }
    heading.textContent = `${value.trim().slice(0, -suffix.length).trim()} `
    const small = document.createElement('small')
    small.textContent = suffix
    heading.append(small)
  }

  const applyProductTypes = (productTypes) => {
    if (!productTypes) return
    const slots = ['fringe', 'stringLight', 'curtain', 'retro', 'contour', 'motifs']
    document.querySelectorAll('.product-card').forEach((card, index) => {
      const product = productTypes[slots[index]]
      if (!product) return
      applyProductTitle(card.querySelector('h3'), product.title)
      setText(card.querySelector('p'), product.description)
      if (Array.isArray(product.parameters) && product.parameters.length >= 2 && product.parameters.length <= 3 && product.parameters.every(isText)) {
        const list = card.querySelector('ul')
        list.replaceChildren(...product.parameters.map((parameter) => {
          const item = document.createElement('li')
          item.textContent = parameter.trim()
          return item
        }))
      }
      setText(card.querySelector('.text-btn'), product.ctaLabel)
      updateImage(card.querySelector('.product-visual img'), product.image)
    })
  }

  const applyBenefits = (benefits) => {
    if (!benefits) return
    document.querySelectorAll('.benefit-list > div').forEach((item, index) => setText(item.querySelector('span'), benefits[`item${index + 1}`]?.title))
  }

  const applyWorkProcess = (workProcess) => {
    if (!workProcess) return
    document.querySelectorAll('.steps article').forEach((item, index) => {
      const step = workProcess[`step${index + 1}`]
      setText(item.querySelector('h3'), step?.title)
      setText(item.querySelector('p'), step?.description)
    })
  }

  const applyPriorityDelivery = (priority) => {
    if (!priority) return
    const section = document.querySelector('.priority')
    setText(section?.querySelector('h2'), priority.title)
    setText(section?.querySelector('.btn'), priority.ctaLabel)
    const parts = isText(priority.text) ? priority.text.split(/\n\s*\n/) : []
    if (parts.length) {
      const deadline = isText(priority.deadline) ? priority.deadline.split('-').reverse().join('.') : ''
      const text = deadline ? parts[0].replace('[дата]', deadline) : parts[0].replace(/\s*до\s*\[дата\]/, '')
      setText(section?.querySelector('.priority-copy > p:not(.eyebrow):not(.fine)'), text)
      if (isText(parts[1])) setText(section?.querySelector('.fine'), parts[1])
      const deadlineElement = section?.querySelector('[data-priority-deadline]')
      if (deadlineElement) deadlineElement.hidden = true
    }
  }

  const applyFaq = (items) => {
    if (!Array.isArray(items)) return
    const accordion = document.querySelector('.accordion')
    if (!accordion) return
    accordion.replaceChildren(...items.filter((item) => isText(item.question) && isText(item.answer)).map((item, index) => {
      const details = document.createElement('details')
      details.open = index === 0
      const summary = document.createElement('summary')
      summary.append(document.createTextNode(item.question.trim()))
      const icon = document.createElement('i')
      icon.textContent = '+'
      summary.append(icon)
      const answer = document.createElement('p')
      answer.textContent = item.answer.trim()
      details.append(summary, answer)
      return details
    }))
  }

  const applyCases = (cases) => {
    if (!Array.isArray(cases)) return
    const section = document.querySelector('#cases')
    const usable = cases.filter((item) => isText(item.title) && Array.isArray(item.images) && item.images.length >= 2)
    if (!usable.length) {
      if (section) section.hidden = true
      return
    }
    const track = section?.querySelector('.case-track')
    if (!track) return
    track.replaceChildren(...usable.map((item) => {
      const slide = document.createElement('article')
      slide.className = 'case-slide'
      const image = document.createElement('img')
      updateImage(image, item.images[0])
      const copy = document.createElement('div')
      copy.className = 'case-copy'
      const title = document.createElement('span')
      title.textContent = item.title.trim()
      if (isText(item.objectType)) {
        const type = document.createElement('small')
        type.textContent = item.objectType.trim()
        title.append(document.createElement('br'), type)
      }
      const meta = document.createElement('p')
      meta.textContent = [item.city, item.year].filter((value) => isText(value) || Number.isInteger(value)).join(' · ')
      copy.append(title, meta)
      slide.append(image, copy)
      return slide
    }))
    section.hidden = false
    window.dispatchEvent(new Event('lumion:cases'))
  }

  const applySeo = (seo) => {
    if (!seo) return
    if (isText(seo.metaTitle)) document.title = seo.metaTitle.trim()
    const description = document.querySelector('meta[name="description"]')
    if (description && isText(seo.metaDescription)) description.content = seo.metaDescription.trim()
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && isText(seo.metaTitle)) ogTitle.content = seo.metaTitle.trim()
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription && isText(seo.metaDescription)) ogDescription.content = seo.metaDescription.trim()
    const ogImage = imageUrl(seo.openGraphImage?.image)
    if (ogImage) {
      const tag = document.querySelector('meta[property="og:image"]')
      if (tag) tag.content = ogImage
    }
    const favicon = imageUrl(seo.favicon?.image)
    if (favicon) {
      const icon = document.querySelector('link[rel="icon"]')
      if (icon) icon.href = favicon
    }
  }

  const loadScriptOnce = (id, source) => {
    if (document.getElementById(id)) return
    const script = document.createElement('script')
    script.id = id
    script.async = true
    script.src = source
    document.head.append(script)
  }

  const applyAnalytics = (analytics) => {
    if (!analytics?.analyticsEnabled) return
    if (isText(analytics.gtmId)) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      loadScriptOnce('lumion-gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(analytics.gtmId.trim())}`)
    } else if (isText(analytics.ga4Id)) {
      loadScriptOnce('lumion-ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.ga4Id.trim())}`)
      window.dataLayer = window.dataLayer || []
      window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', analytics.ga4Id.trim())
    }
    if (isText(analytics.metaPixelId)) {
      window.fbq = window.fbq || function fbq() { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments) }
      window.fbq.queue = window.fbq.queue || []
      window.fbq.loaded = true
      window.fbq.version = '2.0'
      loadScriptOnce('lumion-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
      window.fbq('init', analytics.metaPixelId.trim())
      window.fbq('track', 'PageView')
    }
  }

  const applyContent = (content) => {
    applyGeneralSettings(content.generalSettings)
    applyHero(content.hero)
    applyTrustBar(content.trustBar)
    applyProductTypes(content.productTypes)
    applyBenefits(content.benefits)
    applyWorkProcess(content.workProcess)
    applyPriorityDelivery(content.priorityDelivery)
    applyFaq(content.faqItems)
    window.dispatchEvent(new CustomEvent('lumion:formTexts', { detail: content.formTexts }))
    applySeo(content.seoSettings)
    applyAnalytics(content.analyticsSettings)
    applyCases(content.cases)
  }

  const endpoint = `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}?perspective=published&query=${encodeURIComponent(query)}`
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), 5000)
  fetch(endpoint, { signal: controller.signal, credentials: 'omit' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Sanity response failed'))))
    .then((payload) => { if (payload?.result) applyContent(payload.result) })
    .catch(() => {})
})()
