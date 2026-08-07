import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, Eye, Calendar, RefreshCw, Bookmark, Share2 } from 'lucide-react'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { BottomNav } from '@/components/news/bottom-nav'
import { NewsImage } from '@/components/news/news-image'
import { CommentsSection } from '@/components/news/comments-section'
import { ShareButtons } from '@/components/news/share-buttons'
import { ReactionBar } from '@/components/news/reaction-bar'
import { AdBox } from '@/components/news/ad-box'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  categoryColor,
  getCategorySlug,
  getAuthorSlug,
  getLatest,
  getNewsBody,
  getNewsById,
  type NewsCategory,
} from '@/lib/news-data'
import { formatBnDate, formatBnTime, relativeTimeBn, toBn } from '@/lib/bn'
import { cn } from '@/lib/utils'

const getAuthorAvatar = (author: string) =>
  `https://picsum.photos/seed/author-${encodeURIComponent(author)}/120/120`

const getAuthorInitials = (author: string) =>
  author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

export function generateStaticParams() {
  return getLatest().map((item) => ({ id: item.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = getNewsById(id)

  if (!article) {
    return {
      title: 'খবর পাওয়া যায়নি | বার্তা',
    }
  }

  return {
    title: `${article.title} | বার্তা`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
      type: 'article',
      publishedTime: article.publishedAt,
    },
  }
}

/* ─── Related News Card (compact) ─── */
function RelatedCard({ item }: { item: ReturnType<typeof getLatest>[0] }) {
  const catColor = categoryColor(item.category)
  return (
    <Link
      href={`/news/${item.id}`}
      className='group flex gap-3.5 rounded-lg border border-border/40 bg-card p-3 transition-all duration-200 hover:border-brand/30 hover:shadow-sm news-card-hover'
    >
      <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted'>
        <NewsImage
          src={item.image}
          alt={item.title}
          sizes='80px'
          className='img-zoom'
        />
      </div>
      <div className='flex min-w-0 flex-1 flex-col justify-center'>
        <span className='flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider'>
          <span className={cn('inline-block h-1.5 w-1.5 rounded-full', catColor)} />
          <span className='text-muted-foreground'>{item.category}</span>
        </span>
        <h4 className='mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand'>
          {item.title}
        </h4>
        <span className='mt-1 text-[10px] text-muted-foreground'>
          {relativeTimeBn(new Date(item.publishedAt))}
        </span>
      </div>
    </Link>
  )
}

/* ─── Professional Breadcrumb ─── */
function Breadcrumb({
  category,
  title,
}: {
  category: NewsCategory
  title: string
}) {
  const categoryHref = getCategorySlug(category)
  const truncatedTitle = title.length > 45 ? title.slice(0, 45) + '...' : title

  return (
    <nav aria-label='Breadcrumb' className='mb-5'>
      <ol className='flex flex-wrap items-center gap-1 text-[12px] text-muted-foreground'>
        <li>
          <Link href='/' className='transition-colors hover:text-brand'>
            হোম
          </Link>
        </li>
        <li>
          <ChevronRight className='h-3 w-3' />
        </li>
        <li>
          <Link href={categoryHref} className='font-medium transition-colors hover:text-brand'>
            {category}
          </Link>
        </li>
        <li>
          <ChevronRight className='h-3 w-3' />
        </li>
        <li>
          <span className='line-clamp-1 font-medium text-foreground/70'>
            {truncatedTitle}
          </span>
        </li>
      </ol>
    </nav>
  )
}

/* ═══════════════════════════════════════════════ */
export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getNewsById(id)
  if (!article) notFound()

  const body = getNewsBody(article.id)
  const publishedDate = new Date(article.publishedAt)

  // Featured articles get a simulated update time (1 hour later)
  const updatedDate = article.featured
    ? new Date(publishedDate.getTime() + 60 * 60 * 1000)
    : null

  const relatedNews = getLatest()
    .filter((item) => item.id !== article.id)
    .slice(0, 6)

  return (
    <div className='min-h-screen flex flex-col bg-page-bg text-foreground'>
      <TopBar />
      <Header />
      {/* BreakingNewsTicker intentionally hidden on article pages for clean reading */}

      <main className='flex-1 pb-safe'>
        <div className='mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-7'>
          {/* ── Breadcrumb ── */}
          <Breadcrumb category={article.category} title={article.title} />

          {/* ── Two-column layout: sidebar share + article ── */}
          <div className='flex gap-8'>
            {/* Sticky share sidebar — desktop only */}
            <aside className='article-share-sidebar hidden lg:flex lg:flex-col lg:items-center lg:pt-8 lg:w-16 shrink-0'>
              <ShareButtons title={article.title} vertical compact />
              <Separator className='my-4 w-8 bg-border/40' />
              <button
                className='flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground shadow-sm transition-all duration-200 hover:text-brand hover:border-brand/40 hover:shadow-md'
                aria-label='বুকমার্ক'
                title='সংরক্ষণ করুন'
              >
                <Bookmark className='h-[18px] w-[18px]' />
              </button>
            </aside>

            {/* ── Article Content ── */}
            <div className='min-w-0 flex-1 max-w-3xl'>
              <article className='article-card rounded-xl overflow-hidden'>
                {/* ── Category + Trending ── */}
                <div className='px-5 pt-5 sm:px-8 sm:pt-7'>
                  <div className='flex flex-wrap items-center gap-2.5'>
                    <Link
                      href={getCategorySlug(article.category)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm',
                        categoryColor(article.category)
                      )}
                    >
                      {article.category}
                    </Link>
                    {article.trending && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand'>
                        <span className='relative flex h-2 w-2'>
                          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40' />
                          <span className='relative inline-flex h-2 w-2 rounded-full bg-brand' />
                        </span>
                        ট্রেন্ডিং
                      </span>
                    )}
                    {article.featured && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700'>
                        ফিচার্ড
                      </span>
                    )}
                  </div>

                  {/* ── Headline ── */}
                  <h1 className='font-display mt-4 text-balance text-[1.65rem] leading-[1.35] font-bold sm:text-[1.95rem] sm:leading-[1.3] md:text-[2.15rem]'>
                    {article.title}
                  </h1>

                  {/* ── Excerpt ── */}
                  <p className='mt-3 text-[15px] leading-relaxed text-muted-foreground'>
                    {article.excerpt}
                  </p>

                  {/* ── Author + Meta Info ── */}
                  <div className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-11 ring-2 ring-brand/10'>
                        <AvatarImage src={getAuthorAvatar(article.author)} alt={article.author} />
                        <AvatarFallback className='bg-brand/10 text-sm font-semibold text-brand'>
                          {getAuthorInitials(article.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/authors/${getAuthorSlug(article.author)}`}
                          className='text-sm font-semibold text-foreground transition-colors hover:text-brand'
                        >
                          {article.author}
                        </Link>
                        <div className='mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground'>
                          <span className='inline-flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            প্রকাশ: {formatBnDate(publishedDate, { withWeekday: true })} {formatBnTime(publishedDate)}
                          </span>
                          {updatedDate && (
                            <span className='inline-flex items-center gap-1'>
                              <RefreshCw className='h-3 w-3' />
                              আপডেট: {formatBnDate(updatedDate)} {formatBnTime(updatedDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 text-[11px] text-muted-foreground sm:flex-col sm:items-end sm:gap-1.5'>
                      <span className='inline-flex items-center gap-1'>
                        <Eye className='h-3.5 w-3.5' />
                        {toBn(article.views.toLocaleString('en-US'))} পাঠ
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <Clock className='h-3.5 w-3.5' />
                        {toBn(article.readTime)} মিনিট পড়া
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Hero Image ── */}
                <div className='relative mt-6 aspect-[16/9] w-full overflow-hidden bg-muted'>
                  <NewsImage
                    src={article.image}
                    alt={article.title}
                    priority
                    sizes='(max-width: 1024px) 100vw, 780px'
                    className='object-cover'
                  />\n                  <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-5 pb-3 pt-10 sm:px-8'>
                    <p className='text-[11px] text-white/70'>ছবি: বার্তা ডেস্ক</p>
                  </div>
                </div>

                {/* ── Mobile share bar ── */}
                <div className='flex items-center justify-between border-b border-border/40 px-5 py-3 sm:px-8 lg:hidden'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                    <Share2 className='h-4 w-4 text-muted-foreground' />
                    শেয়ার করুন
                  </div>
                  <ShareButtons title={article.title} compact showPrint />
                </div>

                {/* ── Article Body ── */}
                <div className='px-5 py-6 sm:px-8 sm:py-8'>
                  <div className='article-body'>
                    {body.map((paragraph, idx) => (
                      <div key={idx}>
                        <p className={idx === 0 ? 'drop-cap' : ''}>
                          {paragraph}
                        </p>
                        {idx === 1 && body.length > 3 && (
                          <div className='my-8'>
                            <AdBox className='mx-auto' format='horizontal' />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ── Tags ── */}
                  <div className='mt-8 flex flex-wrap items-center gap-2 border-t border-border/40 pt-5'>
                    <span className='text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground'>
                      সম্পর্কিত ট্যাগ
                    </span>
                    <Link
                      href={getCategorySlug(article.category)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-sm',
                        categoryColor(article.category)
                      )}
                    >
                      {article.category}
                    </Link>
                  </div>

                  {/* ── Desktop share bar ── */}
                  <div className='mt-6 hidden items-center justify-between border-t border-border/40 pt-5 lg:flex'>
                    <span className='text-sm font-semibold text-foreground'>এই প্রতিবেদনটি শেয়ার করুন</span>
                    <ShareButtons title={article.title} showPrint />
                  </div>
                </div>

                {/* ── Reactions ── */}
                <div className='border-t border-border/40 px-5 py-4 sm:px-8'>
                  <ReactionBar articleId={article.id} />
                </div>
              </article>

              {/* ── Ad between article and comments ── */}
              <AdBox className='my-8' format='horizontal' />

              {/* ── Comments ── */}
              <div className='article-card rounded-xl p-5 sm:p-8'>
                <CommentsSection articleId={article.id} />
              </div>

              {/* ── Related News ── */}
              <section className='mt-10'>
                <div className='section-header mb-6'>
                  <h2>আরও পড়ুন</h2>
                </div>
                <div className='grid gap-3 sm:grid-cols-2'>
                  {relatedNews.map((item) => (
                    <RelatedCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
