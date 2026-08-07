import Link from 'next/link'
import { OPINIONS } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import Image from 'next/image'
import { Quote } from 'lucide-react'
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
            href={`/category/opinion`}
            className='group flex gap-3 border-b border-border/40 py-4 first:pt-0 last:border-0 hover:border-brand/40'
          >
            <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image src={op.avatar} alt={op.author} fill sizes='44px' className='object-cover' />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <span className='font-display text-[12px] font-bold text-foreground'>{op.author}</span>
              <div className='flex items-center gap-1.5'>
                <Quote className='h-3.5 w-3.5 shrink-0 text-brand/50' />
                <h3 className='line-clamp-2 text-[13px] font-medium italic leading-snug transition-colors group-hover:text-brand'>
                  {op.title}
                </h3>
              </div>
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
            href={`/category/opinion`}
            className='group relative flex gap-4 overflow-hidden rounded-lg border border-border/20 border-l-[3px] border-l-brand/30 bg-card p-4 news-card-hover hover:border-brand/20'
          >
            {/* Decorative opening quotation mark */}
            <span className='font-display pointer-events-none absolute -right-1 -top-1 select-none text-5xl leading-none text-brand/10'>
              \u201C
            </span>
            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image src={op.avatar} alt={op.author} fill sizes='56px' className='object-cover' />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <div className='flex items-baseline gap-2'>
                <span className='font-display text-sm font-bold'>{op.author}</span>
                <span className='text-[11px] text-muted-foreground'>{op.role}</span>
              </div>
              <h3 className='mt-1 line-clamp-2 text-[15px] font-medium italic leading-snug transition-colors group-hover:text-brand'>
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
