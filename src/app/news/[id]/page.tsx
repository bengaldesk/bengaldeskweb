import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Eye, Calendar, RefreshCw, Share2, MapPin } from 'lucide-react'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { NewsImage } from '@/components/news/news-image'
import { CommentsSection } from '@/components/news/comments-section'
import { ShareButtons } from '@/components/news/share-buttons'
import { ReactionBar } from '@/components/news/reaction-bar'
import { AdBox } from '@/components/news/ad-box'
import { ReadingProgressBar } from '@/components/news/reading-progress-bar'
import { BackToTopButton } from '@/components/news/back-to-top-button'
import { AuthorBioCard } from '@/components/news/author-bio-card'
import { TagsFooter } from '@/components/news/tags-footer'
import { RelatedArticles } from '@/components/news/related-articles'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  getCategorySlug,
  getAuthorSlug,
  getAuthorBySlug,
  getAreaByNewsId,
  getLatest,
  getNewsBody,
  getNewsById,
  type NewsCategory,
} from '@/lib/news-data'
import { formatBnDate, formatBnTime, toBn } from '@/lib/bn'

const getAuthorAvatar = (author: string) =>
  `https://picsum.photos/seed/author-${encodeURIComponent(author)}/200/200`

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
  if (!article) return { title: 'খবর পাওয়া যায়নি | The Bengal Desk' }
  return {
    title: `${article.title} | The Bengal Desk`,
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

/* ─── Breadcrumb ─── */
function Breadcrumb({ category, title }: { category: NewsCategory; title: string }) {
  const categoryHref = getCategorySlug(category)
  const truncatedTitle = title.length > 45 ? title.slice(0, 45) + '...' : title
  return (
    <nav aria-label='Breadcrumb' className='mb-5'>
      <ol className='breadcrumb flex flex-wrap items-center gap-1'>
        <li className='flex items-center gap-1'>
          <Link href='/' className='transition-colors hover:text-brand'>হোম</Link>
          <span aria-hidden='true' className='text-foreground/30'>/</span>
        </li>
        <li className='flex items-center gap-1'>
          <Link href={categoryHref} className='font-medium transition-colors hover:text-brand'>{category}</Link>
          <span aria-hidden='true' className='text-foreground/30'>/</span>
        </li>
        <li>
          <span className='line-clamp-1 font-medium text-foreground/50' aria-current='page'>{truncatedTitle}</span>
        </li>
      </ol>
    </nav>
  )
}

/* ─── Editorial Rule Divider ─── */
function EditorialRule({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div className={`editorial-rule${accent ? ' editorial-rule--accent' : ''}`}>
      <span className='editorial-rule-label'>{label}</span>
    </div>
  )
}

/* ─── Main Article Page ─── */
export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getNewsById(id)
  if (!article) notFound()

  const body = getNewsBody(article.id)
  const publishedDate = new Date(article.publishedAt)
  const updatedDate = article.featured
    ? new Date(publishedDate.getTime() + 60 * 60 * 1000)
    : null
  const area = getAreaByNewsId(article.id)

  const sameCategory = getLatest()
    .filter((item) => item.category === article.category && item.id !== article.id)
    .slice(0, 3)
  const otherCategory = getLatest()
    .filter((item) => item.category !== article.category && item.id !== article.id)
    .slice(0, 1)
  const relatedNews = [...sameCategory, ...otherCategory]
  const authorProfile = getAuthorBySlug(getAuthorSlug(article.author))

  return (
    <div className='min-h-screen flex flex-col bg-page-bg text-foreground'>
      <a href='#article-content' className='skip-to-content'>প্রধান বিষয়বস্তুতে যান</a>
      <div className='print-header'>
        <p className='text-sm font-semibold'>The Bengal Desk</p>
        <h1 className='mt-2 text-xl font-bold'>{article.title}</h1>
        <p className='mt-1 text-sm text-gray-600'>{article.excerpt}</p>
      </div>

      <TopBar />
      <Header />
      <ReadingProgressBar />
      <BackToTopButton />

      <main className='flex-1 '>
        {/* ═══ ARTICLE CONTAINER ═══ */}
        <div className='mx-auto max-w-3xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-0'>

          {/* ── Breadcrumb ── */}
          <Breadcrumb category={article.category} title={article.title} />

          {/* ── Article Header Zone ── */}
          <header className='mb-0'>
            {/* Category eyebrow + badges */}
            <div className='flex flex-wrap items-center gap-3'>
              <Link href={getCategorySlug(article.category)} className='category-eyebrow article-eyebrow-link'>
                {article.category}
              </Link>
              {article.trending && (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold tracking-wide text-brand uppercase'>
                  <span className='relative flex h-2 w-2'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40' />
                    <span className='relative inline-flex h-2 w-2 rounded-full bg-brand' />
                  </span>
                  ট্রেন্ডিং
                </span>
              )}
              {article.featured && (
                <span className='inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold tracking-wide text-amber-600 uppercase'>
                  ফিচার্ড
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className='article-headline mt-4 text-balance'>
              {article.title}
            </h1>

            {/* Dek (subheadline) */}
            <p className='article-dek mt-5'>{article.excerpt}</p>

            {/* ── Byline — refined professional hierarchy ── */}
            <div className='article-byline-block mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
              <div className='flex items-center gap-3'>
                <Avatar className='size-11 ring-2 ring-border/30'>
                  <AvatarImage src={getAuthorAvatar(article.author)} alt={article.author} />
                  <AvatarFallback className='bg-brand/10 text-sm font-semibold text-brand'>{getAuthorInitials(article.author)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/authors/${getAuthorSlug(article.author)}`} className='byline-author text-[15px] font-semibold text-foreground transition-colors hover:text-brand'>
                    {article.author}
                  </Link>
                  <div className='mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 byline'>
                    <span className='inline-flex items-center gap-1'>
                      <Calendar className='h-3 w-3' />\n                      <time dateTime={article.publishedAt}>{formatBnDate(publishedDate, { withWeekday: true })}</time>
                    </span>
                    {updatedDate && (
                      <span className='inline-flex items-center gap-1 text-brand'>
                        <RefreshCw className='h-3 w-3' />
                        <time dateTime={updatedDate.toISOString()}>আপডেট: {formatBnDate(updatedDate)}</time>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle meta stats row */}
            <div className='article-meta-stats mt-3 flex items-center gap-1 pb-6 border-b border-border/30'>
              <span className='inline-flex items-center gap-1'><Eye className='h-3 w-3' />{toBn(article.views.toLocaleString('en-US'))} পাঠ</span>
              <span className='stat-separator' />
              <span className='inline-flex items-center gap-1'><Clock className='h-3 w-3' />{toBn(article.readTime)} মিনিট পড়া</span>
              <span className='stat-separator' />
              <span className='inline-flex items-center gap-1'><MapPin className='h-3 w-3' />{area}</span>
            </div>
          </header>

          {/* ── Hero Figure — subtle shadow, professional treatment ── */}
          <figure className='article-hero-figure mt-7'>
            <div className='relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted shadow-sm sm:aspect-[3/2]'>
              <NewsImage src={article.image} alt={article.title} priority sizes='(max-width: 768px) 100vw, 720px' className='object-cover' />
            </div>
            <figcaption className='article-hero-caption mt-3 flex items-start gap-2 px-1'>
              <span className='credit mt-px shrink-0 font-semibold'>ছবি:</span>
              <span>The Bengal Desk</span>
            </figcaption>
          </figure>

          {/* ── Key Takeaway Box (মূল কথা) ── */}
          <div className='article-key-takeaway mt-7'>
            <span className='takeaway-label'>মূল কথা</span>
            <p className='takeaway-text'>{article.excerpt}</p>
          </div>

          {/* ── Inline Share Bar ── */}
          <div className='article-inline-share mt-7 flex items-center justify-between border-t border-b py-3'>
            <div className='flex items-center gap-2 text-[13px] font-semibold text-foreground'>
              <Share2 className='h-4 w-4 text-muted-foreground' />
              শেয়ার করুন
            </div>
            <ShareButtons title={article.title} compact showPrint />
          </div>

          {/* ── Dateline ── */}
          <div className='article-dateline mt-7'>
            {area}
            <span className='dateline-separator' />
            {formatBnDate(publishedDate)}
            <span className='dateline-separator' />\n            {formatBnTime(publishedDate)}
          </div>

          {/* ── Article Body ── */}
          <div className='mt-6' id='article-content'>
            <div className='article-body'>
              {body.map((paragraph, idx) => (
                <div key={idx}>
                  <p className={idx === 0 ? 'drop-cap lead-paragraph' : undefined}>{paragraph}</p>
                  {idx === 2 && body.length > 5 && (
                    <div className='ad-break my-10' aria-label='বিজ্ঞাপন'>
                      <span className='mb-2 block text-center text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60'>বিজ্ঞাপন</span>
                      <AdBox className='mx-auto' format='horizontal' />
                    </div>
                  )}
                  {idx === Math.floor(body.length * 0.65) && body.length > 7 && (
                    <div className='ad-break my-10' aria-label='বিজ্ঞাপন'>
                      <span className='mb-2 block text-center text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60'>বিজ্ঞাপন</span>
                      <AdBox className='mx-auto' format='horizontal' />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* End of article marker */}
            <div className='article-end-marker' aria-hidden='true' />

            {/* ── Tags ── */}
            <div className='mt-10'>
              <TagsFooter category={article.category} />
            </div>

            {/* ── Bottom Share ── */}
            <div className='mt-6 flex items-center justify-between border-t border-border/30 pt-5'>
              <span className='text-[13px] font-semibold text-foreground'>এই প্রতিবেদনটি শেয়ার করুন</span>
              <ShareButtons title={article.title} showPrint />
            </div>
          </div>

          {/* ── Reaction Bar ── */}
          <div className='mt-6'>
            <EditorialRule label='প্রতিক্রিয়া' />
            <ReactionBar articleId={article.id} />
          </div>
        </div>

        {/* ═══ BELOW-FOLD SECTIONS ═══ */}
        <div className='mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-0'>

          {/* ── Author Bio ── */}
          <div className='mt-2'>
            <EditorialRule label='প্রতিবেদক' />
            <AuthorBioCard
              author={article.author}
              avatarUrl={getAuthorAvatar(article.author)}
              role={authorProfile?.role}
              bio={authorProfile?.bio}
            />
          </div>

          {/* ── Ad ── */}
          <div className='my-10' aria-label='বিজ্ঞাপন'>
            <span className='mb-2 block text-center text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60'>বিজ্ঞাপন</span>
            <AdBox className='mx-auto' format='horizontal' />
          </div>

          {/* ── Comments ── */}
          <div className='mt-2'>
            <EditorialRule label='মন্তব্য' />
            <div className='comments-card mt-6'>
              <div className='comments-card-header'>
                <p className='text-sm font-semibold text-foreground'>পাঠকদের মন্তব্য</p>
              </div>
              <div className='p-5 sm:p-6'>
                <CommentsSection articleId={article.id} />
              </div>
            </div>
          </div>

          {/* ── Related Articles ── */}
          <div className='mt-10'>
            <EditorialRule label='সম্পর্কিত খবর' accent />
            <RelatedArticles
              articles={relatedNews.map((item) => ({ id: item.id, title: item.title, excerpt: item.excerpt, image: item.image, category: item.category, publishedAt: item.publishedAt }))}
              heading=''
              className='mt-6'
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
