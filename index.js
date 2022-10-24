// noinspection JSUnresolvedFunction,JSCheckFunctionSignatures

window.onload = () => {
  // Set root property
  function setRootProperty(property, value) {
    document.documentElement.style.setProperty(property, value)
  }


  // Parallax header
  const header = document.querySelector('header')
  const navbar = document.querySelector('nav')
  const scrollHint = document.querySelector('.scroll-hint')
  const headerHeight = header.clientHeight
  const headerCollapsedHeight = Number(getComputedStyle(header).getPropertyValue('--collapsed-height').replace('px', ''))
  const navbarOriginalHeight = navbar.clientHeight

  const scrollTimeline = new ScrollTimeline({
    source: document.documentElement,
    orientation: 'vertical',
    scrollOffsets: [CSS.px(0), CSS.px(headerHeight - headerCollapsedHeight)]
  })
  navbar.animate({
    height: [`${navbarOriginalHeight}px`, `${headerCollapsedHeight}px`]
  }, { timeline: scrollTimeline, fill: 'forwards' })
  for (const child of navbar.children) {
    child.animate(child.classList.contains('nav-link') ?
      { opacity: [0, 1] } :
      { transform: ['scale(1)', `scale(${headerCollapsedHeight / navbarOriginalHeight})`] }, { timeline: scrollTimeline, fill: 'forwards' })
  }
  header.animate({
    height: [CSS.px(headerHeight), CSS.px(headerCollapsedHeight)],
    paddingTop: [CSS.px(0), CSS.px(headerHeight - headerCollapsedHeight)],
  }, { timeline: scrollTimeline, fill: 'forwards' })
  header.lastElementChild.animate({
    opacity: [0, 1]
  }, { timeline: scrollTimeline, fill: 'forwards' })
  scrollHint.animate({
   opacity: [1, 0, 0]
  }, { timeline: scrollTimeline, fill: 'forwards' })
  setTimeout(() => { navbar.style.opacity = '1' }, 500)


  // Name Animation
  const name = document.querySelector('.name')
  const text = name.innerHTML
  name.innerHTML = ''
  text.split('').forEach((char) => {
    name.innerHTML += `<span class="name-letter">${char}</span>`
  })

  function animate(letter, delay = 0) {
    letter.animate({
      color: ['#ffffff', 'var(--accent)', '#ffffff'],
      transform: ['scale(1)', 'scale(1.2)', 'scale(1)']
    }, { duration: 500, delay: delay })
  }

  const nameObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      for (const [index, letter] of Object.entries(letters)) { animate(letter, index * 100) }
    }
  }, { rootMargin: '0px 0px -50% 0px' })
  nameObserver.observe(name)

  const letters = document.querySelectorAll('.name-letter')
  letters.forEach((letter) => { letter.addEventListener('mouseenter', () => { animate(letter) }) })


  // FadeIn Container
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('active') }
    })
  }, { threshold: [0, 1], rootMargin: '0px 0px -10% 0px' })
  for (let container of document.querySelectorAll('.fadeIn')) { fadeInObserver.observe(container) }


  // Color selector
  const optionActions = {
    'dark': () => { setRootProperty('--background', '#212121'); setRootProperty('--text', '#f1f1f1') },
    'light': () => { setRootProperty('--background', '#dadada'); setRootProperty('--text', '#010101') },
    'red': () => { setRootProperty('--accent', '#ff1a1a') },
    'blue': () => { setRootProperty('--accent', '#0080ff') },
    'green': () => { setRootProperty('--accent', '#00bb00') },
    'orange': () => { setRootProperty('--accent', '#ff5500') }
  }

  const optionPanels = document.getElementsByClassName('options-panel')
  for (const optionPanel of optionPanels) {
    const options = optionPanel.querySelectorAll('.option')
    for (const option of options) {
      option.addEventListener('click', () => {
        for (const option of options) { option.innerHTML = '' }
        option.innerHTML = '<i class="far fa-times"></i>'
        optionActions[option.classList[1]]()
      })
    }
  }
}
