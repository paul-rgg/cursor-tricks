import { useEffect, useMemo, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import slide2a from '@/assets/slide-2a.png'
import slide2b from '@/assets/slide-2b.png'
import slide2c from '@/assets/slide-2c.png'
import slide3a from '@/assets/slide-3a.png'
import slide3b from '@/assets/slide-3b.png'
import slide4a from '@/assets/slide-4a.png'

const slides = [
  {
    title: 'Important Cursor Features You Should Use',
    body: [
      'Objective: Surface lesser-known Cursor features that improve productivity.',
      'Coverage:',
      'Context methods (@, #, drag-and-drop, /commands).',
      'Persistent knowledge (Memories, Notepad).',
      'Custom agent modes for repeatable workflows.',
    ],
  },
  {
    title: 'Ways to Add/Remove Context to Composer',
    link: { label: '@ Symbols Docs', href: 'https://docs.cursor.com/en/context/@-symbols/overview' },
    image: { src: slide2a, alt: '@ menu in Cursor' },
    columns: 2
  },
  {
    title: 'Ways to Add Context to Composer',
    image: { src: slide2b, alt: '# menu in Cursor' }
  },
  {
    title: 'Ways to Add Context to Composer',
    image: { src: slide2c, alt: '' }
  },
  {
    title: 'Using Memories and Notepad',
    image: { src: slide3a, alt: '' },
    body: [
      'Memories:',
      'Store project conventions, preferred libraries, style guides.',
      'Find in Settings > Rules & Memories. Applied across chats.',
    ],
  },
  {
    title: 'Using Memories and Notepad',
    image: { src: slide3b, alt: '' },
    body: [
      'Notepad:',
      'Keep prompts, snippets, and project instructions for quick reuse.',
      'Use as a personal library for repetitive tasks.',
    ],
  },
  {
    title: 'Create Custom Agent Modes',
    image: { src: slide4a, alt: '' },
    body: [
      'Define behavior, rules, and scope for specialized tasks.',
      'Example: Plan Mode — plan first, then code.',
      'Goal: Generate a high-level plan before implementation.',
      'Setup: Settings > Custom Modes. Prompt: "First write a plan… then implement…"',
    ],
  },
]

function useKeyboardNavigation(length, onChange) {
  useEffect(() => {
    function handler(e) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key.toLowerCase() === 'd') onChange(1)
      if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key.toLowerCase() === 'a') onChange(-1)
      if (e.key === 'Home') onChange(-Infinity)
      if (e.key === 'End') onChange(Infinity)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onChange, length])
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [api, setApi] = useState()
  const total = slides.length

  function move(delta) {
    if (delta === -Infinity) {
      api?.scrollTo(0)
      setIndex(0)
      return
    }
    if (delta === Infinity) {
      const last = total - 1
      api?.scrollTo(last)
      setIndex(last)
      return
    }
    setIndex((i) => {
      const next = Math.max(0, Math.min(total - 1, i + delta))
      api?.scrollTo(next)
      return next
    })
  }

  useKeyboardNavigation(total, move)
  useEffect(() => {
    if (!api) return
    setIndex(api.selectedScrollSnap())
    const onSelect = () => setIndex(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => api.off('select', onSelect)
  }, [api])


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
      <div className="w-full max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm uppercase tracking-widest text-white/70">{`Slide ${index + 1} / ${total}`}</div>
          <div className="text-xs text-white/50">Use ← → keys</div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <CarouselPrevious onClick={() => move(-1)} disabled={index === 0} />
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); api?.scrollTo(i) }}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-6 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
          <CarouselNext onClick={() => move(1)} disabled={index === total - 1} />
        </div>

        <Carousel className="w-full" orientation="horizontal" setApi={setApi}>
          <CarouselContent>
            {slides.map((s, i) => (
              <CarouselItem key={i} className="basis-full">
                <SlideView slide={s} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

function SlideView({ slide }) {
  const { intro, sections } = useMemo(() => structureSlideBody(slide.body ?? []), [slide.body])

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl md:text-6xl font-bold tracking-tight text-balance text-center">{slide.title}</h1>
      </header>


      {slide.image ? (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
          <img src={slide.image.src} alt={slide.image.alt || ''} className="w-full h-auto" />
        </div>
      ) : null}

      {slide.body ? (
      <TextBlock>
        {intro.length > 0 && !slide.columns && (
          <div className="space-y-3">
            {intro.map((line, idx) => (
              <p key={idx} className="text-lg md:text-xl leading-relaxed text-white/90">
                {line}
              </p>
            ))}
          </div>
        )}

        {intro.length > 0 && slide.columns && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {intro.map((item, idx) => (
              <li key={idx} className="text-base md:text-lg leading-relaxed text-white/90 flex">
                <span className="mr-3 mt-2 h-[6px] w-[6px] rounded-full bg-white/50" />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {sections.length > 0 && (
          <div className={intro.length > 0 ? 'mt-6' : ''}>
            <div className="grid gap-6 md:gap-8">
              {sections.map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                    {sec.heading}
                  </h3>
                  <ul className="space-y-2">
                    {sec.items.map((item, i) => (
                      <li key={i} className="text-base md:text-lg leading-relaxed text-white/90 flex">
                        <span className="mr-3 mt-1 h-[6px] w-[6px] rounded-full bg-white/50" />
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
          )}
        </TextBlock>
      ) : null}
    </div>
  )
}

function TextBlock({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
      {children}
    </div>
  )
}

function structureSlideBody(lines) {
  const intro = []
  const sections = []
  let current = null
  for (const raw of lines) {
    const line = String(raw)
    if (line.trim().endsWith(':')) {
      current = { heading: line.replace(/:\s*$/, ''), items: [] }
      sections.push(current)
      continue
    }
    if (current) {
      current.items.push(line)
    } else {
      intro.push(line)
    }
  }
  return { intro, sections }
}
