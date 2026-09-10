(() => {
  const allowedTarget = (target) => target instanceof Element && target.closest('input, textarea, select, [contenteditable], .access-notice a')
  document.addEventListener('contextmenu', (event) => { if (!allowedTarget(event.target)) event.preventDefault() })
  document.addEventListener('dragstart', (event) => { if (!allowedTarget(event.target)) event.preventDefault() })
  document.addEventListener('selectstart', (event) => { if (!allowedTarget(event.target)) event.preventDefault() })
  document.addEventListener('copy', (event) => { if (!allowedTarget(event.target)) event.preventDefault() })
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && ['c', 'x', 's', 'u'].includes(event.key.toLowerCase()) && !allowedTarget(event.target)) event.preventDefault()
  })
})()
