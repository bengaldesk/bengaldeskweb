import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AdBoxProps {
  className?: string
  slot?: string
  format?: 'horizontal' | 'vertical' | 'rectangle'
}

const LOGO_URL = '/logo.svg'

export function AdBox({ className, slot, format = 'horizontal' }: AdBoxProps) {
  const sizeLabel = {
    horizontal: '728 x 90',
    vertical: '300 x 600',
    rectangle: '300 x 250',
  }[format]

  return (
    <div
      className={cn(
        'mx-auto flex items-center justify-center overflow-hidden rounded-lg bg-[#1E3A5F] transition-all hover:brightness-110',
        format === 'horizontal' && 'aspect-[3/1] w-full max-w-[728px] md:aspect-[8/1]',
        format === 'vertical' && 'aspect-[1/2] w-full max-w-[300px]',
        format === 'rectangle' && 'aspect-square w-full max-w-[300px]',
        className
      )}
    >
      <div className='flex flex-col items-center gap-2 p-4 text-center'>
        <span className='text-[10px] font-bold uppercase tracking-[0.25em] text-white/40'>
          বিজ্ঞাপন
        </span>

        <Image
          src={LOGO_URL}
          alt='The Bengal Desk'
          width={120}
          height={40}
          className='h-auto w-28 brightness-0 invert'
        />

        <div className='text-[11px] font-mono tracking-tighter text-white/25 uppercase'>
          {sizeLabel}
        </div>
      </div>
    </div>
  )
}
