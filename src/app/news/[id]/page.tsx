import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, Eye, Calendar, RefreshCw, Share2 } from 'lucide-react'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { BottomNav } from '@/components/news/bottom-nav'
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
import { Separator } from '@/components/ui/separator'
import {
  categoryColor,
  getCategorySlug,
  getAuthorSlug,
  getAuthorBySlug,
  getLatest,
  getNewsBody,
  getNewsById,
  type NewsCategory,
} from '@/lib/news-data'
import { formatBnDate, formatBnTime, relativeTimeBn, toBn } from '@/lib/bn'
import { cn } from '@/lib/utils'

/* ─── Helpers ─── */

const getAuthorAvatar = (author: string) =>
  `https://picsum.photos/seed/author-${encodeURIComponent(author)}/200/200`

const getAuthorInitials = (author: string) =>
  author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

/* ─── Static params & metadata ─── */

export function generateStaticParams() {
  return getLatest().map((item) => ({ id: item.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = getNewsById(id)

  if (!article) {
    return { title: 'খবর পাওয়া যায়নি | বার্তা' }
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

/* ─── Breadcrumb ─── */

function Breadcrumb({ category, title }: { category: NewsCategory; title: string }) {
  const categoryHref = getCategorySlug(category)
  const truncatedTitle = title.length > 45 ? title.slice(0, 45) + '...' : title

  return (
    <nav aria-label='Breadcrumb' className='mb-6'>
      <ol className='flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground'>
        <li>
          <Link href='/' className='transition-colors hover:text-brand'>
            হোম
          </Link>
        </li>
        <li aria-hidden='true'>
          <ChevronRight className='h-3 w-3' />
        </li>
        <li>
          <Link href={categoryHref} className='font-medium transition-colors hover:text-brand'>
            {category}
          </Link>
        </li>
        <li aria-hidden='true'>
          <ChevronRight className='h-3 w-3' />
        </li>
        <li>
          <span className='line-clamp-1 font-medium text-foreground/60' aria-current='page'>
            {truncatedTitle}
          </span>
        </li>
      </ol>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Article Page — NYT/Guardian-level editorial design
   ═══════════════════════════════════════════════════════════════════════════ */
export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getNewsById(id)
  if (!article) notFound()

  const body = getNewsBody(article.id)
  const publishedDate = new Date(article.publishedAt)

  // Featured articles get a simulated update time
  const updatedDate = article.featured
    ? new Date(publishedDate.getTime() + 60 * 60 * 1000)
    : null

  // Related: same category first, then other categories
  const sameCategory = getLatest()
    .filter((item) => item.category === article.category && item.id !== article.id)
    .slice(0, 3)
  const otherCategory = getLatest()
    .filter((item) => item.category !== article.category && item.id !== article.id)
    .slice(0, 1)
  const relatedNews = [...sameCategory, ...otherCategory]

  // Author data for bio card
  const authorProfile = getAuthorBySlug(getAuthorSlug(article.author))

  return (
    <div className='min-h-screen flex flex-col bg-page-bg text-foreground'>
      {/* Accessibility: Skip to content */}
      <a href='#article-content' className='skip-to-content'>
        প্রধান বিষয়বস্তুতে যান
      </a>

      {/* Print header (visible only when printing) */}
      <div className='print-header'>
        <p className='text-sm font-semibold'>বার্তা</p>
        <h1 className='mt-2 text-xl font-bold'>{article.title}</h1>
        <p className='mt-1 text-sm text-gray-600'>{article.excerpt}</p>
      </div>

      <TopBar />
      <Header />

      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Back to top */}
      <BackToTopButton />

      <main className='flex-1 pb-safe'>
        <div className='mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8'>
          {/* ── Breadcrumb ── */}
          <Breadcrumb category={article.category} title={article.title} />

          {/* ── Two-column layout: sidebar share + article ── */}
          <div className='flex gap-8 lg:gap-12'>
            {/* Sticky share sidebar — desktop only */}
            <aside className='article-share-sidebar hidden lg:flex lg:flex-col lg:items-center lg:pt-32 lg:w-14 shrink-0'>
              <ShareButtons title={article.title} vertical compact />
              <Separator className='my-4 w-8 bg-border/40' />
            </aside>

            {/* ── Article Column ── */}
            <div className='min-w-0 flex-1'>
              <article className='article-card overflow-hidden rounded-xl'>
                {/* ══════════ ARTICLE HEADER / MASTHEAD BLOCK ══════════ */}
                <header className='px-5 pt-6 pb-0 sm:px-8 sm:pt-8 lg:px-10'>
                  {/* Category Eyebrow Tag */}
                  <div className='flex flex-wrap items-center gap-2.5'>
                    <Link
                      href={getCategorySlug(article.category)}
                      className='category-eyebrow'
                    >
                      {article.category}
                    </Link>
                    {article.trending && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand'>
                        <span className='relative flex h-2 w-2'>
                          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40' />
                          <span className='relative inline-flex h-2 w-2 rounded-full bg-brand' />
                        </span>
                        ট্রেন্ডিং
                      </span>
                    )}
                  </div>

                  {/* Headline — largest type scale, Tiro Bangla, text-wrap: balance */}
                  <h1 className='font-display mt-4 text-balance text-[1.6rem] leading-[1.28] sm:text-[2rem] sm:leading-[1.25] md:text-[2.35rem] md:leading-[1.22] lg:text-[2.65rem]'>
                    {article.title}
                  </h1>

                  {/* Subheadline / Dek — provides context before reader commits */}
                  <p className='mt-4 text-[1.0625rem] leading-[1.6] text-text-secondary sm:text-lg sm:leading-[1.55]'>
                    {article.excerpt}
                  </p>

                  {/* Byline Block — horizontal on desktop, wrapping on mobile */}
                  <div className='mt-6 flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pb-6'>
                    {/* Author info */}
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-11 ring-2 ring-border/40'>
                        <AvatarImage src={getAuthorAvatar(article.author)} alt={article.author} />
                        <AvatarFallback className='bg-brand/10 text-sm font-semibold text-brand'>
                          {getAuthorInitials(article.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/authors/${getAuthorSlug(article.author)}`}
                          className='byline-author text-[15px] font-semibold text-foreground transition-colors hover:text-brand'
                        >
                          {article.author}
                        </Link>
                        <div className='mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 byline'>
                          <span className='inline-flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            <time dateTime={article.publishedAt}>
                              {formatBnDate(publishedDate, { withWeekday: true })} {formatBnTime(publishedDate)}
                            </time>
                          </span>
                          {updatedDate && (
                            <span className='inline-flex items-center gap-1'>
                              <RefreshCw className='h-3 w-3' />
                              <time dateTime={updatedDate.toISOString()}>
                                আপডেট: {formatBnDate(updatedDate)} {formatBnTime(updatedDate)}
                              </time>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Views + Read time — right aligned on desktop */}
                    <div className='flex items-center gap-4 byline'>
                      <span className='inline-flex items-center gap-1.5'>
                        <Eye className='h-3.5 w-3.5' />
                        {toBn(article.views.toLocaleString('en-US'))} পাঠ
                      </span>
                      <span className='inline-flex items-center gap-1.5'>
                        <Clock className='h-3.5 w-3.5' />
                        {toBn(article.readTime)} মিনিট পড়া
                      </span>
                    </div>
                  </div>
                </header>

                {/* ══════════ HERO IMAGE / MEDIA ══════════ */}
                <figure className='mt-0'>
                  <div className='relative aspect-[16/9] w-full overflow-hidden bg-muted sm:aspect-[3/2]'>
                    <NewsImage
                      src={article.image}
                      alt={article.title}
                      priority
                      sizes='(max-width: 1024px) 100vw, 780px'
                      className='object-cover'
                    />
                  </div>
                  <figcaption className='px-5 py-2 sm:px-8 lg:px-10'>
                    <span className='credit'>ছবি:</span> বার্তা ডেস্ক
                  </figcaption>
                </figure>

                {/* ── Mobile share bar (inline, above article body) ── */}
                <div className='mobile-share-bar flex items-center justify-between border-b border-border/40 px-5 py-3 sm:px-8 lg:hidden'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                    <Share2 className='h-4 w-4 text-muted-foreground' />
                    শেয়ার করুন
                  </div>
                  <ShareButtons title={article.title} compact showPrint />
                </div>

                {/* ══════════ ARTICLE BODY ══════════ */}
                <div className='px-5 py-8 sm:px-8 sm:py-10 lg:px-10' id='article-content'>
                  <div className='article-body'>
                    {body.map((paragraph, idx) => (
                      <div key={idx}>
                        <p
                          className={cn(
                            idx === 0 && 'drop-cap lead-paragraph',
                          )}
                        >
                          {paragraph}
                        </p>
                        {/* In-article ad — well separated from editorial content */}
                        {idx === 1 && body.length > 3 && (
                          <div className='my-10' aria-label='বিজ্ঞাপন'>
                            <span className='mb-2 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
                              বিজ্ঞাপন
                            </span>
                            <AdBox className='mx-auto' format='horizontal' />
                          </div>
                        )}
                        {/* Second ad placement for longer articles */}
                        {idx === Math.floor(body.length / 2) && body.length > 5 && (
                          <div className='my-10' aria-label='বিজ্ঞাপন'>
                            <span className='mb-2 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
                              বিজ্ঞাপন
                            </span>
                            <AdBox className='mx-auto' format='horizontal' />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ══════════ TAGS & METADATA FOOTER ══════════ */}
                  <div className='mt-10'>
                    <TagsFooter category={article.category} />
                  </div>

                  {/* ── Desktop share bar (end of article) ── */}
                  <div className='desktop-share-bar mt-6 hidden items-center justify-between border-t border-border/40 pt-5 lg:flex'>
                    <span className='text-sm font-semibold text-foreground'>এই প্রতিবেদনটি শেয়ার করুন</span>
                    <ShareButtons title={article.title} showPrint />
                  </div>
                </div>

                {/* ══════════ REACTIONS ══════════ */}
                <div className='reaction-bar border-t border-border/40 px-5 py-5 sm:px-8 lg:px-10'>
                  <ReactionBar articleId={article.id} />
                </div>
              </article>

              {/* ══════════ AUTHOR BIO CARD ══════════ */}
              <div className='mt-8'>
                <AuthorBioCard
                  author={article.author}
                  avatarUrl={getAuthorAvatar(article.author)}
                  role={authorProfile?.role}
                  bio={authorProfile?.bio}
                />
              </div>

              {/* ── Ad between article and comments ── */}
              <div className='my-8' aria-label='বিজ্ঞাপন'>
                <AdBox className='mx-auto' format='horizontal' />
              </div>

              {/* ══════════ COMMENTS ══════════ */}
              <div className='comments-section article-card rounded-xl p-5 sm:p-8'>
                <CommentsSection articleId={article.id} />
              </div>

              {/* ══════════ RELATED CONTENT ══════════ */}
              <RelatedArticles
                articles={relatedNews.map((item) => ({
                  id: item.id,
                  title: item.title,
                  excerpt: item.excerpt,
                  image: item.image,
                  category: item.category,
                  publishedAt: item.publishedAt,
                }))}
                heading='সম্পর্কিত খবর'
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
