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

      {/* Unified responsive layout — list mobile, 2-col grid desktop */}
      <div className='space-y-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0'>
        {OPINIONS.map((op) => (
          <Link
            key={op.id}
            href={`/category/opinion`}
            className='group relative flex gap-3 border-b border-border/40 py-4 first:pt-0 last:border-0 hover:border-brand/40
              lg:block lg:rounded-lg lg:border lg:border-border/20 lg:border-l-[3px] lg:border-l-brand/30 lg:bg-card lg:p-4 lg:py-4 lg:news-card-hover lg:hover:border-brand/20'
          >
            {/* Avatar */}
            <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted
              lg:h-14 lg:w-14'>
              <Image src={op.avatar} alt={op.author} fill sizes='56px' className='object-cover' />
            </div>

            {/* Content */}
            <div className='flex min-w-0 flex-col justify-center lg:gap-0'>
              <div className='flex items-baseline gap-2'>
                <span className='text-[12px] font-bold text-foreground lg:text-sm'>{op.author}</span>
                <span className='text-[10px] text-muted-foreground lg:text-[11px]'>{op.role}</span>
              </div>
              <div className='flex items-center gap-1.5 mt-0.5 lg:mt-1'>
                <Quote className='h-3.5 w-3.5 shrink-0 text-brand/50 lg:hidden' />
                <h3 className='line-clamp-2 text-[13px] font-medium italic leading-snug transition-colors group-hover:text-brand lg:text-[15px]'>
                  {op.title}
                </h3>
              </div>
              <span className='mt-0.5 text-[10px] text-muted-foreground lg:mt-1'>
                {relativeTimeBn(new Date(op.publishedAt))}
              </span>
            </div>

            {/* Desktop decorative quote mark */}
            <span className='pointer-events-none absolute -right-1 -top-1 hidden select-none text-5xl leading-none text-brand/10 lg:block'>
              “
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
