'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface PublicCard {
  id: string
  title: string
  description: string
  sourceName: string
  sourceUrl: string
  category: string
  type: 'solid' | 'gradient' | 'image'
  backgroundUrl?: string
  backgroundBlur?: string
}

interface SpotlightFeedProps { cards: PublicCard[] }

export function SpotlightFeed({ cards }: SpotlightFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [settling, setSettling] = useState(false)
  const rafRef = useRef<number | null>(null)
  const settleTimer = useRef<number | null>(null)

  const settings = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    return {
      cardHeightVh: isMobile ? 75 : 70,
      cardAspectRatio: 0.53,
      spotlightLeftVh: isMobile ? 8 : 19,
      stackMarginVh: isMobile ? 2 : 4,
      stackOffsetVh: isMobile ? 8 : 15,
      settleTimeoutMs: 150,
      scrollPerCard: isMobile ? 300 : 400,
      settleMs: 800,
      virtualization: 5
    }
  }, [])

  function vh(v: number) { return (v / 100) * window.innerHeight }
  function dims() {
    const h = vh(settings.cardHeightVh)
    return { h, w: h * settings.cardAspectRatio }
  }
  const stackOffsetsRef = useRef<number[]>([])
  function ensureOffsets() {
    const base = vh(settings.stackOffsetVh)
    const arr = stackOffsetsRef.current
    while (arr.length < cards.length) arr.push(base * (1 + (Math.random() - 0.5) * 0.2))
  }

  function targetPositions(targetSpotlightIndex: number) {
    const { w } = dims()
    const spotlightLeft = vh(settings.spotlightLeftVh)
    const stackStartLeft = spotlightLeft + w + vh(settings.stackMarginVh)
    ensureOffsets()
    return cards.map((_, i) => {
      const state = { x: 0, rot: 0, opacity: 1, spot: 0, stackOpacity: 1, z: i }
      if (i < targetSpotlightIndex) { state.x = -window.innerWidth * 0.75; state.rot = -20; state.opacity = 0 }
      else if (i === targetSpotlightIndex) { state.x = spotlightLeft; state.spot = 1; state.z = cards.length + 1 }
      else {
        const stackIndex = i - targetSpotlightIndex - 1
        const totalInStack = cards.length - (targetSpotlightIndex + 1)
        const progress = totalInStack > 1 ? stackIndex / (totalInStack - 1) : 0
        state.stackOpacity = (1 - progress) * (1 - 0.3) + 0.3
        let left = stackStartLeft
        for (let j = 0; j < stackIndex; j++) {
          const idx = targetSpotlightIndex + 1 + j
          if (stackOffsetsRef.current[idx]) left += stackOffsetsRef.current[idx]
        }
        state.x = left
      }
      return state
    })
  }

  function lerp(a: number, b: number, t: number) { return (1 - t) * a + t * b }

  function render() {
    if (!containerRef.current) return
    const total = progressRef.current / settings.scrollPerCard
    const current = Math.floor(total)
    const t = total - current
    const start = targetPositions(current)
    const end = targetPositions(current + 1)
    const spotlightIndex = Math.round(total)

    const startIndex = Math.max(0, current - settings.virtualization)
    const endIndex = Math.min(cards.length - 1, current + 1 + settings.virtualization)

    const children = containerRef.current.children as unknown as HTMLElement[]

    let k = 0
    for (let i = startIndex; i <= endIndex; i++) {
      const s = start[i]; const e = end[i]
      if (!s || !e) continue
      let el = children[k] as HTMLElement
      if (!el) {
        el = document.createElement('div')
        el.className = 'card-el'
        el.style.position = 'absolute'
        el.style.height = `calc(${settings.cardHeightVh}vh)`
        el.style.width = `calc(${settings.cardHeightVh}vh * ${settings.cardAspectRatio})`
        el.style.top = `calc((100vh - ${settings.cardHeightVh}vh) / 2)`
        el.style.borderRadius = '20px'
        el.style.willChange = 'transform, opacity'
        el.style.background = 'white'
        el.style.boxShadow = 'var(--stacked-shadow)'
        el.style.cursor = 'pointer'
        const inner = document.createElement('div')
        inner.className = 'inner'
        el.appendChild(inner)
        containerRef.current!.appendChild(el)
      }
      el.style.display = ''
      const x = lerp(s.x, e.x, t)
      const rot = lerp(s.rot, e.rot, t)
      // Fade-in for newly inserted right-most card: when moving to a new spotlight,
      // the last stack card appears; approximate by easing opacity for large x values.
      let op = lerp(s.opacity, e.opacity, t)
      const farRightThreshold = window.innerWidth * 0.95
      if (s.x > farRightThreshold || e.x > farRightThreshold) {
        const dist = Math.min(1, Math.max(0, (Math.max(s.x, e.x) - farRightThreshold) / (window.innerWidth * 0.2)))
        op = Math.max(op, 0.2 + (1 - dist) * 0.8)
      }
      const spot = lerp(s.spot, e.spot, t)
      const stackOp = lerp(s.stackOpacity, e.stackOpacity, t)
      el.style.transform = `translateX(${x}px) rotate(${rot}deg)`
      el.style.opacity = String(op)
      // Z layering:
      // - Spotlighted card (nearest to snap) must always be highest z.
      // - Stack to the right: left-most (nearest to spotlight) is above deeper ones.
      let z: number
      if (i === spotlightIndex) {
        z = cards.length + 10000
      } else if (i > spotlightIndex) {
        const stackIndex = i - (spotlightIndex + 1) // 0 for left-most in stack
        z = cards.length - stackIndex
      } else {
        // Cards to the left (already gone) sit below everything
        z = 0
      }
      el.style.zIndex = String(z)
      // Smooth cross-fade by driving CSS variables used by ::before/::after
      el.style.setProperty('--spotlight-progress', String(spot))
      el.style.setProperty('--stack-depth-opacity', String(stackOp))
      const inner = el.querySelector('.inner') as HTMLElement
      inner.style.position = 'absolute'
      inner.style.inset = '0'
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      inner.style.padding = isMobile ? '16px' : '24px'
      inner.style.display = 'flex'
      inner.style.flexDirection = 'column'
      inner.style.justifyContent = 'space-between'
      inner.style.color = '#111'
      inner.style.opacity = String(stackOp)
      
      // Check if this is an image card by presence of background image
      const hasBackground = Boolean(cards[i].backgroundUrl)
      
      if (hasBackground) {
        // Add data attribute for CSS targeting
        el.setAttribute('data-card-type', 'image')
        
        // Set background image on the card element
        el.style.backgroundImage = `url('${cards[i].backgroundUrl}')`
        el.style.backgroundSize = 'cover'
        el.style.backgroundPosition = 'center'
        el.style.backgroundRepeat = 'no-repeat'
        
        // Add gradient overlay for image cards with multiply blend mode
        const categorySize = isMobile ? '10px' : '12px'
        const categoryPadding = isMobile ? '8px' : '10px'
        const sourceSize = isMobile ? '10px' : '12px'
        const titleSize = isMobile ? '28px' : '40px'
        const descriptionSize = isMobile ? '14px' : '18px'
        
        inner.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);border-radius:20px;pointer-events:none;mix-blend-mode:multiply;"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;">
            <span style="backdrop-filter:blur(2px);border:1px solid #e6e3e1;border-radius:20px;padding:${categoryPadding};font-size:${categorySize};color:white;font-family:'Geist',sans-serif;font-weight:400;letter-spacing:-0.12px">${cards[i].category}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;position:relative;z-index:2;">
            <div style="font-size:${sourceSize};color:white;font-family:'Geist Mono',monospace;font-weight:400">${cards[i].sourceName}</div>
            <div style="font-size:${titleSize};color:white;font-family:'Geist',sans-serif;font-weight:500;line-height:1.1;text-shadow:rgba(0,0,0,0.25) 0px 1px 1px">${cards[i].title}</div>
            <div style="font-size:${descriptionSize};color:rgba(255,255,255,0.5);font-family:'Geist',sans-serif;font-weight:400;line-height:1.5;letter-spacing:-0.18px">${cards[i].description}</div>
          </div>`
      } else {
        // Remove data attribute for non-image cards
        el.removeAttribute('data-card-type')
        
        // Regular solid card styling
        el.style.backgroundImage = ''
        el.style.backgroundSize = ''
        el.style.backgroundPosition = ''
        el.style.backgroundRepeat = ''
        
        const categorySize = isMobile ? '10px' : '12px'
        const categoryPadding = isMobile ? '8px' : '10px'
        const sourceSize = isMobile ? '10px' : '12px'
        const titleSize = isMobile ? '28px' : '40px'
        const descriptionSize = isMobile ? '14px' : '18px'
        
        inner.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;position:relative;">
            <span style="border:1px solid #d4d0cd;border-radius:20px;padding:${categoryPadding};font-size:${categorySize};color:#a09892;font-family:'Geist',sans-serif;font-weight:400;letter-spacing:-0.12px">${cards[i].category}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-size:${sourceSize};color:#716964;font-family:'Geist Mono',monospace;font-weight:400">${cards[i].sourceName}</div>
            <div style="font-size:${titleSize};color:#000000;font-family:'Geist',sans-serif;font-weight:500;line-height:1.1">${cards[i].title}</div>
            <div style="font-size:${descriptionSize};color:#888079;font-family:'Geist',sans-serif;font-weight:400;line-height:1.5;letter-spacing:-0.18px">${cards[i].description}</div>
          </div>`
      }
      // Add click handler to open card link in new window
      el.onclick = () => {
        // Open the source URL in a new window
        window.open(cards[i].sourceUrl, '_blank', 'noopener,noreferrer')
      }
      
      k++
    }

    for (let j = k; j < (containerRef.current.children.length || 0); j++) {
      const el = containerRef.current.children[j] as HTMLElement
      if (el) el.style.display = 'none'
    }
  }

  function clampProgress(v: number) {
    const max = (cards.length - 1) * settings.scrollPerCard
    return Math.max(0, Math.min(v, max))
  }
  function setProgressImmediate(v: number) {
    progressRef.current = clampProgress(v)
    render()
  }

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (settling) return
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      setProgressImmediate(progressRef.current + e.deltaY)
      settleTimer.current = window.setTimeout(() => startSettle(), settings.settleTimeoutMs)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [settling])

  function startSettle() {
    setSettling(true)
    const start = progressRef.current
    const targetIndex = Math.round(progressRef.current / settings.scrollPerCard)
    const target = targetIndex * settings.scrollPerCard
    const startTime = performance.now()
    const dur = settings.settleMs
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / dur)
      setProgressImmediate(lerp(start, target, ease(t)))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else setSettling(false)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    render()
  }, [cards.length])

  useEffect(() => { return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) } }, [])

  return <div ref={containerRef} className="relative h-full w-full overflow-hidden" />
}


