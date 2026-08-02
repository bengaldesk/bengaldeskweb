import Link from 'next/link'
import { VIDEOS, categoryColor, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'
import Image from 'next/image'

export function VideoSection() {
  if (VIDEOS.length === 0) return null
  const [lead, ...rest] = VIDEOS

  return (
    <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
      {/* Section header */}
      <div className='flex items-end justify-between pb-2.5 border-b-2 border-brand mb-6'>
        <h2 className='text-[11px] font-bold uppercase tracking-[0.15em] text-foreground'>
          ভিডিও
        </h2>
      </div>

      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Lead video — full-width, no rounded corners */}
        <div className='lg:col-span-7'>
          <Link
            href={`/#${lead.id}`}
            className='group relative block overflow-hidden rounded-none bg-black'
          >
            <div className='relative aspect-video w-full'>
              <Image
                src={lead.thumbnail}
                alt={lead.title}
                fill
                sizes='(max-width: 1024px) 100vw, 60vw'
                className='object-cover opacity-90 transition-opacity group-hover:opacity-100'
              />
            </div>
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />
            {/* Play button — smaller, simpler */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='flex h-12 w-12 items-center justify-center rounded-full bg-brand/90 text-white transition-transform group-hover:scale-110'>
                <Play className='h-5 w-5 translate-x-0.5 fill-white' />
              </span>
            </div>
            <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
              <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full', categoryColor(lead.category as NewsCategory))} />
                <span className='text-white/80'>{lead.category}</span>
              </span>
              <h3 className='mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl'>
                {lead.title}
              </h3>
              <div className='mt-1.5 flex items-center gap-3 text-[11px] text-white/80'>
                <span>{toBn(lead.views.toLocaleString('en-US'))} ভিউ</span>
                <span>{relativeTimeBn(new Date(lead.publishedAt))}</span>
              </div>
            </div>
            {/* Duration badge */}
            <span className='absolute right-3 top-3 rounded-none bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white'>
              {lead.duration}
            </span>
          </Link>
        </div>

        {/* Secondary videos — horizontal layout with border-b separators */}
        <div className='flex flex-col lg:col-span-5'>
          {rest.map((v) => (
            <Link
              key={v.id}
              href={`/#${v.id}`}
              className='group flex gap-3 border-b border-border/40 py-4 first:pt-0 last:border-0'
            >
              <div className='relative aspect-video w-28 shrink-0 overflow-hidden rounded-none bg-black sm:w-32'>
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  sizes='128px'
                  className='object-cover opacity-90'
                />
                <span className='absolute inset-0 flex items-center justify-center'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-brand/90 text-white'>
                    <Play className='h-3.5 w-3.5 translate-x-0.5 fill-white' />
                  </span>
                </span>
                <span className='absolute bottom-1 right-1 rounded-none bg-black/70 px-1 text-[10px] font-semibold text-white'>
                  {v.duration}
                </span>
              </div>
              <div className='flex min-w-0 flex-col justify-center'>
                <h3 className='line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand'>
                  {v.title}
                </h3>
                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {relativeTimeBn(new Date(v.publishedAt))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
