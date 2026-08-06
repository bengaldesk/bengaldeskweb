import Link from 'next/link'
import { OPINIONS } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import Image from 'next/image'
import { SectionHeader } from './section-header'

export function OpinionSection() {
  if (OPINIONS.length === 0) return null

  return (
    <section className='py-6 sm:py-8'>
      <SectionHeader title='মতামত' href='/category/opinion' />

      {/* Mobile: compact list */}
      <div className='lg:hidden'>
        {OPINIONS.map((op) => (
          <Link
            key={op.id}
            href={`/#${op.id}`}
            className='group flex gap-3 border-b border-border/40 py-4 first:pt-0 last:border-0'
          >
            <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image src={op.avatar} alt={op.author} fill sizes='44px' className='object-cover' />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <span className='text-[12px] font-bold text-foreground'>{op.author}</span>
              <h3 className='mt-0.5 line-clamp-2 text-[13px] font-medium leading-snug transition-colors group-hover:text-brand'>
                {op.title}
              </h3>
              <span className='mt-0.5 text-[10px] text-muted-foreground'>
                {relativeTimeBn(new Date(op.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: 2-column grid */}
      <div className='hidden lg:grid lg:grid-cols-2 lg:gap-5'>
        {OPINIONS.map((op) => (
          <Link
            key={op.id}
            href={`/#${op.id}`}
            className='group flex gap-4 rounded-lg bg-card p-4 news-card-hover'
          >
            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image src={op.avatar} alt={op.author} fill sizes='56px' className='object-cover' />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <div className='flex items-baseline gap-2'>
                <span className='font-bold text-sm'>{op.author}</span>
                <span className='text-[11px] text-muted-foreground'>{op.role}</span>
              </div>
              <h3 className='mt-1 line-clamp-2 text-[15px] font-medium leading-snug transition-colors group-hover:text-brand'>
                {op.title}
              </h3>
              <span className='mt-1 text-[11px] text-muted-foreground'>
                {relativeTimeBn(new Date(op.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
