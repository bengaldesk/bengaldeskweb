import Link from 'next/link'
import { getTrending } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'

export function TrendingSidebar() {
  const items = getTrending(6)

  return (
    <div>
      <div className='mb-3 pb-2.5 border-b-2 border-brand'>
        <h2 className='text-[11px] font-bold uppercase tracking-[0.15em] text-foreground'>
          সর্বাধিক পঠিত
        </h2>
      </div>
      <ol className='flex flex-col'>
        {items.map((item, i) => (
          <li key={item.id}>
            <Link
              href={`/#${item.id}`}
              className='group flex gap-3 border-b border-border/40 py-3 last:border-0'
            >
              <span className='text-2xl font-extrabold leading-none text-brand/25 transition-colors group-hover:text-brand'>
                {toBn(i + 1)}
              </span>
              <div className='min-w-0'>
                <h3 className='line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand'>
                  {item.title}
                </h3>
                <p className='mt-1 text-[11px] text-muted-foreground'>
                  {relativeTimeBn(new Date(item.publishedAt))} •{' '}
                  {toBn(item.views.toLocaleString('en-US'))} পাঠ
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
