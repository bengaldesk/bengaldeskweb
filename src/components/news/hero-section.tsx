import { getFeatured } from '@/lib/news-data'
import { NewsCard } from './news-card'

export function HeroSection() {
  const featured = getFeatured()
  const [hero, ...rest] = featured
  const sideItems = rest.slice(0, 2)

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Big hero */}
        {hero && (
          <div className="lg:col-span-8">
            <NewsCard item={hero} variant="hero" priority />
          </div>
        )}

        {/* Stacked secondary */}
        <div className="grid gap-4 lg:col-span-4 sm:grid-cols-2 lg:grid-cols-1">
          {sideItems.map((item) => (
            <NewsCard key={item.id} item={item} variant="overlay" className="h-full" />
          ))}
        </div>
      </div>
    </section>
  )
}
