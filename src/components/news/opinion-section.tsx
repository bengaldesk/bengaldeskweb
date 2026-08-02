import Link from 'next/link'
import { OPINIONS } from '@/lib/news-data'
import { relativeTimeBn } from '@/lib/bn'
import { SectionHeader } from './section-header'
import Image from 'next/image'
import { Quote } from 'lucide-react'

export function OpinionSection() {
  if (OPINIONS.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        title="মতামত"
        accentText="চিন্তা ও বিশ্লেষণ"
        actionLabel="সব মতামত"
        className="mb-5"
      />
      <div className="grid gap-5 md:grid-cols-3">
        {OPINIONS.map((op) => (
          <Link
            key={op.id}
            href={`/#${op.id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-brand/40"
          >
            <Quote className="absolute right-4 top-4 h-8 w-8 text-brand/15" />
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  src={op.avatar}
                  alt={op.author}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold leading-tight">{op.author}</p>
                <p className="text-xs text-muted-foreground">{op.role}</p>
              </div>
            </div>
            <h3 className="mt-4 text-balance text-lg font-bold leading-snug transition-colors group-hover:text-brand">
              {op.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {op.excerpt}
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {relativeTimeBn(new Date(op.publishedAt))}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
