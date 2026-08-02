import Link from 'next/link'
import { VIDEOS } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { SectionHeader } from './section-header'
import { CategoryBadge } from './category-badge'
import { Play, Eye } from 'lucide-react'
import Image from 'next/image'

export function VideoSection() {
  if (VIDEOS.length === 0) return null
  const [lead, ...rest] = VIDEOS

  return (
    <section className="bg-secondary/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          title="ভিডিও"
          accentText="দেখুন ও শুনুন"
          actionLabel="সব ভিডিও"
          className="mb-5"
        />
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Lead video */}
          <div className="lg:col-span-7">
            <Link
              href={`/#${lead.id}`}
              className="group relative block overflow-hidden rounded-xl bg-black"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={lead.thumbnail}
                  alt={lead.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/90 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 translate-x-0.5 fill-white" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <CategoryBadge category={lead.category} />
                <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  {lead.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/80">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {toBn(lead.views.toLocaleString('en-US'))}
                  </span>
                  <span>{relativeTimeBn(new Date(lead.publishedAt))}</span>
                </div>
              </div>
              <span className="absolute right-3 top-3 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">
                {lead.duration}
              </span>
            </Link>
          </div>

          {/* Secondary videos */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
            {rest.map((v) => (
              <Link
                key={v.id}
                href={`/#${v.id}`}
                className="group flex gap-3"
              >
                <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-black sm:w-32">
                  <Image
                    src={v.thumbnail}
                    alt={v.title}
                    fill
                    sizes="128px"
                    className="object-cover opacity-90"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/90 text-white">
                      <Play className="h-4 w-4 translate-x-0.5 fill-white" />
                    </span>
                  </span>
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] font-semibold text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <CategoryBadge category={v.category} size="xs" />
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {relativeTimeBn(new Date(v.publishedAt))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
