import Link from 'next/link'
import { OPINIONS } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import Image from 'next/image'

export function OpinionSection() {
  if (OPINIONS.length === 0) return null

  return (
    <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
      {/* Section header */}
      <div className='flex items-end justify-between pb-2.5 border-b-2 border-brand mb-6'>
        <h2 className='text-[11px] font-bold uppercase tracking-[0.15em] text-foreground'>
          মতামত
        </h2>
      </div>

      <div className='flex flex-col'>
        {OPINIONS.map((op) => (
          <Link
            key={op.id}
            href={`/#${op.id}`}
            className='group flex gap-4 border-b border-border/40 py-5 first:pt-0 last:border-0'
          >
            {/* Avatar */}
            <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted'>
              <Image
                src={op.avatar}
                alt={op.author}
                fill
                sizes='48px'
                className='object-cover'
              />
            </div>
            <div className='flex min-w-0 flex-col justify-center'>
              <div className='flex items-baseline gap-2'>
                <span className='font-bold text-sm'>{op.author}</span>
                <span className='text-[11px] text-muted-foreground'>{op.role}</span>
              </div>
              <h3 className='font-display mt-1 line-clamp-2 text-base leading-snug transition-colors group-hover:text-brand'>
                {op.title}
              </h3>
              <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                {op.excerpt}
              </p>
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
