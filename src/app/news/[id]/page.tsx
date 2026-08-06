import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, Eye, Calendar, RefreshCw } from 'lucide-react'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { Footer } from '@/components/news/footer'
import { BottomNav } from '@/components/news/bottom-nav'
import { NewsImage } from '@/components/news/news-image'
import { CommentsSection } from '@/components/news/comments-section'
import { ShareButtons } from '@/components/news/share-buttons'
import { ReactionBar } from '@/components/news/reaction-bar'
import { AdBox } from '@/components/news/ad-box'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
      className='group flex gap-3.5 rounded-lg border border-border/40 bg-card p-3 transition-all duration-200 hover:border-brand/30 hover:shadow-sm'
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
  const truncatedTitle = title.length > 40 ? title.slice(0, 40) + '...' : title

  return (
    <nav aria-label='Breadcrumb' className='mb-5'>
      <ol className='flex flex-wrap items-center gap-1 text-[12px] text-muted-foreground'>
        <li>
          <Link href='/' className='transition-colors hover:text-brand'>
            প্রচ্ছদ
          </Link>
        </li>
        <li>
          <ChevronRight className='h-3 w-3 text-border' />
        </li>
        <li>
          <Link href={categoryHref} className='font-medium transition-colors hover:text-brand'>
            {category}
          </Link>
        </li>
        <li>
          <ChevronRight className='h-3 w-3 text-border' />
        </li>
        <li>
          <span className='font-medium text-foreground/80 line-clamp-1'>
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

  // Simulate update time: 30min after publish for featured, else same as publish
  const updatedDate = article.featured
    ? new Date(article.publishedAt)
    : null

  const relatedNews = getLatest()
    .filter((item) => item.id !== article.id)
    .slice(0, 6)

  return (
    <div className='min-h-screen flex flex-col bg-page-bg text-foreground'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <main className='flex-1 pb-safe'>
        <div className='mx-auto max-w-4xl px-4 pt-6 sm:px-6 sm:pt-8'>

          {/* ── Breadcrumb ── */}
          <Breadcrumb category={article.category} title={article.title} />

          {/* ── Article Header ── */}
          <header className='mb-6'>
            {/* Category badge */}
            <div className='flex items-center gap-3'>
              <Link
                href={getCategorySlug(article.category)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90',
                  categoryColor(article.category)
                )}
              >
                {article.category}
              </Link>
              {article.trending && (
                <span className='inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand'>
                  ট্রেন্ডিং
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className='font-display mt-3 text-balance text-2xl leading-tight font-bold sm:text-3xl md:text-[2.1rem] md:leading-[1.3]'>
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
              {article.excerpt}
            </p>
          </header>

          {/* ── Meta bar: Author + Time + Views + Share ── */}
          <div className='mb-6 flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
            {/* Left: Author + Meta */}
            <div className='flex items-center gap-3'>
              <Avatar className='size-11 ring-2 ring-brand/10'>
                <AvatarImage src={getAuthorAvatar(article.author)} alt={article.author} />
                <AvatarFallback className='bg-brand/10 font-semibold text-brand'>
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
                  <span className='inline-flex items-center gap-1'>
                    <RefreshCw className='h-3 w-3' />
                    আপডেট: {formatBnDate(publishedDate)} {formatBnTime(publishedDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Views + Read time + Share */}
            <div className='flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3'>
              <div className='flex items-center gap-3 text-[11px] text-muted-foreground'>
                <span className='inline-flex items-center gap-1'>
                  <Eye className='h-3.5 w-3.5' />
                  {toBn(article.views.toLocaleString('en-US'))} পাঠ
                </span>
                <span className='inline-flex items-center gap-1'>
                  <Clock className='h-3.5 w-3.5' />
                  {toBn(article.readTime)} মিনিট
                </span>
              </div>
              <ShareButtons title={article.title} />
            </div>
          </div>

          {/* ── Hero Image ── */}
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted'>
            <NewsImage
              src={article.image}
              alt={article.title}
              priority
              sizes='(max-width: 1024px) 100vw, 900px'
              className='object-cover'
            />
            {/* Image caption / credit */}
            <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-8'>
              <p className='text-[11px] text-white/70'>ছবি: বার্তা ডেস্ক</p>
            </div>
          </div>

          {/* ── Reaction Bar ── */}
          <div className='my-5 flex items-center justify-between border-b border-t border-border/40 py-3'>
            <ReactionBar articleId={article.id} />
            <div className='text-[11px] text-muted-foreground hidden sm:block'>
              {relativeTimeBn(publishedDate)} প্রকাশিত
            </div>
          </div>

          {/* ── Article Body ── */}
          <article className='max-w-none'>
            {body.map((paragraph, idx) => (
              <div key={idx}>
                <p className='text-[1.05rem] leading-[1.9] text-foreground/90 first:text-lg first:leading-[2]'>
                  {paragraph}
                </p>
                {idx === 1 && body.length > 3 && <AdBox className='my-8' />}
              </div>
            ))}
          </article>

          {/* ── Tags / Category link ── */}
          <div className='mt-8 flex flex-wrap items-center gap-2 border-t border-border/40 pt-5'>
            <span className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
              ট্যাগ:
            </span>
            <Link
              href={getCategorySlug(article.category)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90',
                categoryColor(article.category)
              )}
            >
              {article.category}
            </Link>
          </div>

          {/* ── Bottom Share ── */}
          <div className='mt-6 flex items-center justify-between border-t border-border/40 pt-4'>
            <span className='text-sm font-semibold text-foreground'>এই প্রতিবেদনটি শেয়ার করুন</span>
            <ShareButtons title={article.title} />
          </div>

          <AdBox className='my-10' />

          {/* ── Comments ── */}
          <CommentsSection articleId={article.id} />

          {/* ── Related News ── */}
          <section className='mt-12 border-t border-border/40 pt-8'>
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
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
