import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Carousel({
  orientation = 'horizontal',
  opts,
  plugins,
  className,
  children,
  setApi,
  ...props
}) {
  const [emblaRef, api] = useEmblaCarousel({ axis: orientation === 'horizontal' ? 'x' : 'y', ...opts }, plugins)
  React.useEffect(() => {
    if (setApi) setApi(api)
  }, [api, setApi])
  return (
    <div ref={emblaRef} className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  )
}

export function CarouselContent({ className, ...props }) {
  return (
    <div
      className={cn('flex', className)}
      {...props}
      style={{
        backfaceVisibility: 'hidden',
        touchAction: 'pan-y pinch-zoom',
      }}
    />
  )
}

export function CarouselItem({ className, ...props }) {
  return <div className={cn('min-w-0 shrink-0 grow-0 basis-full', className)} {...props} />
}

export function CarouselPrevious({ onClick, disabled, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded border border-white/30 px-4 py-2 text-white hover:bg-white/10 disabled:opacity-40',
        className
      )}
    >
      Prev
    </button>
  )
}

export function CarouselNext({ onClick, disabled, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded border border-white/30 px-4 py-2 text-white hover:bg-white/10 disabled:opacity-40',
        className
      )}
    >
      Next
    </button>
  )
}


