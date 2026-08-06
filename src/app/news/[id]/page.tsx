import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Eye } from 'lucide-react'
import { TopBar } from '@/components/news/top-bar'
import { Header } from '@/components/news/header'
import { BreakingNewsTicker } from '@/components/news/breaking-ticker'
import { Footer } from '@/components/news/footer'
import { BottomNav } from '@/components/news/bottom-nav'
import { NewsImage } from '@/components/news/news-image'
import { CommentsSection } from '@/components/news/comments-section'
import { AdBox } from '@/components/news/ad-box'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { categoryColor, getAuthorSlug, getLatest, getNewsBody, getNewsById } from '@/lib/news-data'
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
    },
  }
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = getNewsById(id)
  if (!article) notFound()

  const body = getNewsBody(article.id)
  const publishedDate = new Date(article.publishedAt)

  const continuousFeed = getLatest()
    .filter((item) => item.id !== article.id)
    .slice(0, 4)

  return (
    <div className='min-h-screen flex flex-col bg-page-bg text-foreground'>
      <TopBar />
      <Header />
      <BreakingNewsTicker />

      <main className='flex-1 pb-safe mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10'>
        <Link
          href='/'
          className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand'
        >
          <ArrowLeft className='h-4 w-4' />
          প্রচ্ছদে ফিরে যান
        </Link>

        <article>
          <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand'>
            <span className={cn('inline-block h-2 w-2 rounded-full', categoryColor(article.category))} />
            {article.category}
          </span>

          <h1 className='font-display mt-3 text-balance text-2xl leading-tight sm:text-3xl md:text-4xl'>
            {article.title}
          </h1>

          <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
            {article.excerpt}
          </p>

          <div className='mt-5 flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3'>
            <Avatar className='size-11 ring-2 ring-brand/15'>
              <AvatarImage src={getAuthorAvatar(article.author)} alt={`${article.author} প্রোফাইল`} />
              <AvatarFallback className='bg-brand/10 font-semibold text-brand'>
                {getAuthorInitials(article.author)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/authors/${getAuthorSlug(article.author)}`} className='text-sm font-semibold text-foreground transition-colors hover:text-brand'>
                {article.author}
              </Link>
              <p className='text-xs text-muted-foreground'>স্টাফ রিপোর্টার</p>
            </div>
          </div>

          <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {relativeTimeBn(publishedDate)}
            </span>
            <span>
              {formatBnDate(publishedDate, { withWeekday: true })} · {formatBnTime(publishedDate)}
            </span>
            <span className='inline-flex items-center gap-1'>
              <Eye className='h-3 w-3' />
              {toBn(article.views.toLocaleString('en-US'))} পাঠ
            </span>
            <span>{toBn(article.readTime)} মিনিট পড়ুন</span>
          </div>

          <div className='relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted'>
            <NewsImage
              src={article.image}
              alt={article.title}
              priority
              sizes='(max-width: 1024px) 100vw, 1024px'
              className='object-cover'
            />
          </div>

          <div className='prose prose-neutral mt-8 max-w-none dark:prose-invert'>
            {body.map((paragraph, idx) => (
              <div key={idx}>
                <p className='text-[1.04rem] leading-8 text-foreground/95'>
                  {paragraph}
                </p>
                {idx === 1 && body.length > 3 && <AdBox className="my-8" />}
              </div>
            ))}
          </div>
        </article>

        <AdBox className="my-12" />

        <CommentsSection articleId={article.id} />

        <section className='mt-12 border-t border-border/50 pt-8'>
          <h2 className='text-xl font-bold text-foreground'>
            ধারাবাহিক প্রতিবেদন
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            এই প্রতিবেদন শেষ হলে নিচে আরও খবরের পূর্ণাঙ্গ কনটেন্ট পড়তে পারবেন।
          </p>

          <div className='mt-6 space-y-10'>
            {continuousFeed.map((item) => {
              const feedDate = new Date(item.publishedAt)
              const feedBody = getNewsBody(item.id)

              return (
                <article key={item.id} className='border-t border-border/40 pt-8 first:border-t-0 first:pt-0'>
                  <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand'>
                    <span className={cn('inline-block h-2 w-2 rounded-full', categoryColor(item.category))} />
                    {item.category}
                  </span>

                  <h3 className='font-display mt-2 text-balance text-xl leading-tight sm:text-2xl'>
                    <Link href={`/news/${item.id}`} className='transition-colors hover:text-brand'>
                      {item.title}
                    </Link>
                  </h3>

                  <div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                    <Link href={`/authors/${getAuthorSlug(item.author)}`} className='font-semibold text-foreground/85 transition-colors hover:text-brand'>
                      {item.author}
                    </Link>
                    <span className='inline-flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {relativeTimeBn(feedDate)}
                    </span>
                    <span>{toBn(item.readTime)} মিনিট পড়ুন</span>
                    <span className='inline-flex items-center gap-1'>
                      <Eye className='h-3 w-3' />
                      {toBn(item.views.toLocaleString('en-US'))} পাঠ
                    </span>
                  </div>

                  <div className='relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted'>
                    <NewsImage
                      src={item.image}
                      alt={item.title}
                      sizes='(max-width: 1024px) 100vw, 1024px'
                      className='object-cover'
                    />
                  </div>

                  <div className='prose prose-neutral mt-6 max-w-none dark:prose-invert'>
                    {feedBody.map((paragraph, idx) => (
                      <p key={idx} className='text-[1.04rem] leading-8 text-foreground/95'>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className='mt-4'>
                    <Link
                      href={`/news/${item.id}`}
                      className='text-sm font-semibold text-brand transition-colors hover:text-brand/80'
                    >
                      এই খবরের আলাদা পাতায় যান →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
