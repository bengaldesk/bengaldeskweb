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
import {
  getCategorySlug,
  getAuthorSlug,
  getAuthorBySlug,
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
  if (!article) return { title: 'খবর পাওয়া যায়নি | বার্তা' }
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

function Breadcrumb({ category, title }: { category: NewsCategory; title: string }) {
  const categoryHref = getCategorySlug(category)
  const truncatedTitle = title.length > 45 ? title.slice(0, 45) + '...' : title
  return (
    <nav aria-label='Breadcrumb' className='mb-6'>
      <ol className='flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground'>
        <li>
          <Link href='/' className='transition-colors hover:text-brand'>হোম</Link>
        </li>
        <li aria-hidden='true'><ChevronRight className='h-3 w-3' /></li>
        <li>
          <Link href={categoryHref} className='font-medium transition-colors hover:text-brand'>{category}</Link>
        </li>
        <li aria-hidden='true'><ChevronRight className='h-3 w-3' /></li>
        <li>
          <span className='line-clamp-1 font-medium text-foreground/60' aria-current='page'>{truncatedTitle}</span>
        </li>
      </ol>
    </nav>
  )
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getNewsById(id)
  if (!article) notFound()

  const body = getNewsBody(article.id)
  const publishedDate = new Date(article.publishedAt)
  const updatedDate = article.featured
    ? new Date(publishedDate.getTime() + 60 * 60 * 1000)
    : null

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
        <p className='text-sm font-semibold'>বার্তা</p>
        <h1 className='mt-2 text-xl font-bold'>{article.title}</h1>
        <p className='mt-1 text-sm text-gray-600'>{article.excerpt}</p>
      </div>
      <TopBar />
      <Header />
      <ReadingProgressBar />
      <BackToTopButton />
      <main className='flex-1 pb-safe'>
        <div className='mx-auto max-w-3xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-0'>
          <Breadcrumb category={article.category} title={article.title} />
          <header className='mb-0'>
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
            <h1 className='article-headline font-display mt-4 text-balance sm:text-[2.1rem] sm:leading-[1.22] md:text-[2.5rem] md:leading-[1.2]'>
              {article.title}
            </h1>
            <p className='article-dek mt-5'>{article.excerpt}</p>
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
                      <Calendar className='h-3 w-3' />
                      <time dateTime={article.publishedAt}>{formatBnDate(publishedDate, { withWeekday: true })} {formatBnTime(publishedDate)}</time>
                    </span>
                    {updatedDate && (
                      <span className='inline-flex items-center gap-1 text-brand'>
                        <RefreshCw className='h-3 w-3' />
                        <time dateTime={updatedDate.toISOString()}>আপডেট: {formatBnDate(updatedDate)} {formatBnTime(updatedDate)}</time>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4 byline'>
                <span className='inline-flex items-center gap-1.5'><Eye className='h-3.5 w-3.5' />{toBn(article.views.toLocaleString('en-US'))} পাঠ</span>
                <span className='inline-flex items-center gap-1.5'><Clock className='h-3.5 w-3.5' />{toBn(article.readTime)} মিনিট পড়া</span>
              </div>
            </div>
          </header>
          <figure className='article-hero-figure mt-7'>
            <div className='relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted sm:aspect-[3/2]'>
              <NewsImage src={article.image} alt={article.title} priority sizes='(max-width: 768px) 100vw, 720px' className='object-cover' />
            </div>
            <figcaption className='article-hero-caption mt-3 flex items-start gap-2 px-1'>
              <span className='credit mt-px shrink-0 font-semibold'>ছবি:</span>
              <span>বার্তা ডেস্ক</span>
            </figcaption>
          </figure>
          <div className='article-inline-share mt-6 flex items-center justify-between border-t border-b border-border/40 py-3'>
            <div className='flex items-center gap-2 text-[13px] font-semibold text-foreground'>
              <Share2 className='h-4 w-4 text-muted-foreground' />
              শেয়ার করুন
            </div>
            <ShareButtons title={article.title} compact showPrint />
          </div>
          <div className='mt-8' id='article-content'>
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
            <div className='mt-10'><TagsFooter category={article.category} /></div>
            <div className='mt-6 flex items-center justify-between border-t border-border/40 pt-5'>
              <span className='text-[13px] font-semibold text-foreground'>এই প্রতিবেদনটি শেয়ার করুন</span>
              <ShareButtons title={article.title} showPrint />
            </div>
          </div>
          <div className='mt-8 border-t border-border/40 pt-6'>
            <ReactionBar articleId={article.id} />
          </div>
        </div>
        <div className='mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-0'>
          <AuthorBioCard author={article.author} avatarUrl={getAuthorAvatar(article.author)} role={authorProfile?.role} bio={authorProfile?.bio} />
          <div className='my-10' aria-label='বিজ্ঞাপন'>
            <span className='mb-2 block text-center text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60'>বিজ্ঞাপন</span>
            <AdBox className='mx-auto' format='horizontal' />
          </div>
          <div className='comments-section rounded-xl border border-border/30 bg-card p-5 sm:p-8'>
            <CommentsSection articleId={article.id} />
          </div>
          <RelatedArticles
            articles={relatedNews.map((item) => ({ id: item.id, title: item.title, excerpt: item.excerpt, image: item.image, category: item.category, publishedAt: item.publishedAt }))}
            heading='সম্পর্কিত খবর'
          />
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
