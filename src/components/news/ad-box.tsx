import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AdBoxProps {
  className?: string
  slot?: string
  format?: 'horizontal' | 'vertical' | 'rectangle'
}

const LOGO_URL = 'https://res.cloudinary.com/dtdmwcs4r/image/upload/v1784526258/Bengaldesklogo_vgd6pt.png'

export function AdBox({ className, slot, format = 'horizontal' }: AdBoxProps) {
  const sizeLabel = {
    horizontal: '728 x 90',
    vertical: '300 x 600',
    rectangle: '300 x 250',
  }[format]

  return (
    <div
      className={cn(
        'mx-auto my-8 flex items-center justify-center overflow-hidden rounded-sm bg-muted/50 border border-border/60 transition-colors hover:bg-muted/80',
        format === 'horizontal' && 'aspect-[3/1] w-full max-w-[728px] md:aspect-[8/1]',
        format === 'vertical' && 'aspect-[1/2] w-full max-w-[300px]',
        format === 'rectangle' && 'aspect-square w-full max-w-[300px]',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 p-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">
          বিজ্ঞাপন
        </span>
        
        <Image
          src={LOGO_URL}
          alt="বার্তা"
          width={120}
          height={40}
          className="h-auto w-24 opacity-20 grayscale brightness-0 dark:invert"
        />
        
        <div className="text-[11px] font-mono tracking-tighter text-muted-foreground/30 uppercase">
          {sizeLabel}
        </div>
      </div>
    </div>
  )
}
