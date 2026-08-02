import Link from 'next/link'
import { getTrending } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'
import { TrendingUp, Flame } from 'lucide-react'

export function TrendingSidebar() {
  const items = getTrending(6)

  return (
    <aside className="rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-border/70 pb-3">
        <Flame className="h-5 w-5 text-brand" />
        <h2 className="text-lg font-extrabold tracking-tight">সর্বাধিক পঠিত</h2>
        <TrendingUp className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>
      <ol className="flex flex-col">
        {items.map((item, i) => (
          <li key={item.id}>
            <Link
              href={`/#${item.id}`}
              className="group flex gap-3 border-b border-border/50 py-3 last:border-0"
            >
              <span className="text-2xl font-extrabold leading-none text-brand/30 transition-colors group-hover:text-brand">
                {toBn(i + 1)}
              </span>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {relativeTimeBn(new Date(item.publishedAt))} •{' '}
                  {toBn(item.views.toLocaleString('en-US'))} পাঠ
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  )
}
