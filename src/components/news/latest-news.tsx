import { getLatest, getFeatured } from '@/lib/news-data'
import { NewsCard } from './news-card'
import { SectionHeader } from './section-header'
import { TrendingSidebar } from './trending-sidebar'

export function LatestNews() {
  const featuredIds = new Set(getFeatured().map((n) => n.id))
  const latest = getLatest()
    .filter((n) => !featuredIds.has(n.id))
    .slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Latest grid */}
        <div className="lg:col-span-8">
          <SectionHeader
            title="সর্বশেষ খবর"
            accentText="প্রতিটি মুহূর্তে আপডেট"
            className="mb-5"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <NewsCard key={item.id} item={item} variant="feature" />
            ))}
          </div>
        </div>

        {/* Trending sidebar */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </section>
  )
}
