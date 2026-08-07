import Link from 'next/link'
import { VIDEOS, categoryColor, getCategorySlug, type NewsCategory } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { SectionHeader } from './section-header'

export function VideoSection() {
  if (VIDEOS.length === 0) return null
  const [lead, ...rest] = VIDEOS

  return (
    <section className='py-6 sm:py-8' id='video'>
      <SectionHeader title='ভিডিও' />

      <div className='grid gap-5 lg:grid-cols-12 lg:gap-6'>
        {/* Lead video */}
        <div className='lg:col-span-7'>
          <Link
            href={`/category/entertainment`}
            className='group relative block overflow-hidden rounded-lg bg-black'
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
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='flex h-12 w-12 items-center justify-center rounded-full bg-brand/90 text-white transition-transform group-hover:scale-110'>
                <Play className='h-5 w-5 translate-x-0.5 fill-white' />
              </span>
            </div>
            <div className='absolute inset-x-0 bottom-0 p-4 sm:p-5'>
              <h3 className='line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl'>
                {lead.title}
              </h3>
              <div className='mt-1.5 flex items-center gap-3 text-[11px] text-white/80'>
                <span>{toBn(lead.views.toLocaleString('en-US'))} ভিউ</span>
                <span>{relativeTimeBn(new Date(lead.publishedAt))}</span>
              </div>
            </div>
            <span className='absolute right-3 top-3 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white'>
              {lead.duration}
            </span>
          </Link>
        </div>

        {/* Secondary videos */}
        <div className='flex flex-col lg:col-span-5'>
          {rest.map((v) => (
            <Link
              key={v.id}
              href={`/category/entertainment`}
              className='group flex gap-3 border-b border-border/40 py-3.5 first:pt-0 last:border-0'
            >
              <div className='relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-black sm:w-32'>
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
                <span className='absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] font-semibold text-white'>
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
