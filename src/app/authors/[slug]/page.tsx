import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Eye } from 'lucide-react'
import { Header } from '@/components/news/header'
import { Footer } from '@/components/news/footer'
import { NewsImage } from '@/components/news/news-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAuthorBySlug, getAuthors, getNewsByAuthorSlug } from '@/lib/news-data'
import { relativeTimeBn, toBn } from '@/lib/bn'

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = getAuthorBySlug(params.slug)

  if (!author) {
    return { title: 'লেখক পাওয়া যায়নি | বার্তা' }
  }

  return {
    title: `${author.name} | লেখক প্রোফাইল | বার্তা`,
    description: `${author.name} এর প্রোফাইল ও প্রকাশিত সংবাদসমূহ`,
    openGraph: {
      title: `${author.name} | বার্তা`,
      description: `${author.name} এর প্রকাশিত সংবাদসমূহ`,
      images: [{ url: author.avatar }],
    },
  }
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug)
  if (!author) notFound()

  const newsItems = getNewsByAuthorSlug(params.slug)

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Header />

      <main className='mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
        <section className='rounded-xl border border-border/60 bg-secondary/25 p-5 sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Avatar className='size-20 ring-2 ring-brand/20 sm:size-24'>
              <AvatarImage src={author.avatar} alt={`${author.name} প্রোফাইল ছবি`} />
              <AvatarFallback className='bg-brand/10 text-lg font-semibold text-brand'>
                {initials(author.name)}
              </AvatarFallback>
            </Avatar>

            <div className='min-w-0'>
              <h1 className='font-display text-2xl leading-tight sm:text-3xl'>{author.name}</h1>
              <p className='mt-1 text-sm font-medium text-brand'>{author.role}</p>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{author.bio}</p>
              <p className='mt-2 text-xs text-muted-foreground'>
                মোট প্রকাশিত সংবাদ: {toBn(author.articleCount)}
              </p>
            </div>
          </div>
        </section>

        <section className='mt-10'>
          <h2 className='border-b-2 border-brand pb-2 text-xl font-bold'>
            {author.name} এর সংবাদসমূহ
          </h2>

          <div className='mt-5 grid gap-6 md:grid-cols-2'>
            {newsItems.map((item) => (
              <article key={item.id} className='overflow-hidden rounded-lg border border-border/60'>
                <Link href={`/news/${item.id}`} className='group block'>
                  <div className='relative aspect-[16/10] w-full bg-muted'>
                    <NewsImage
                      src={item.image}
                      alt={item.title}
                      sizes='(max-width: 1024px) 100vw, 50vw'
                      className='img-zoom'
                    />
                  </div>
                  <div className='p-4'>
                    <p className='text-[11px] font-semibold text-muted-foreground'>{item.category}</p>
                    <h3 className='mt-1 line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-brand'>
                      {item.title}
                    </h3>
                    <p className='mt-2 line-clamp-2 text-sm text-muted-foreground'>{item.excerpt}</p>

                    <div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                      <span className='inline-flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {relativeTimeBn(new Date(item.publishedAt))}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <Eye className='h-3 w-3' />
                        {toBn(item.views.toLocaleString('en-US'))}
                      </span>
                      <span>{toBn(item.readTime)} মিনিট পড়ুন</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
