import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { getAuthorSlug } from '@/lib/news-data'

interface AuthorBioCardProps {
  author: string
  avatarUrl: string
  role?: string
  bio?: string
}

const getAuthorInitials = (author: string) =>
  author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

/**
 * AuthorBioCard — appears once at end of article.
 * Photo, name, bio, link to more articles.
 */
export function AuthorBioCard({ author, avatarUrl, role, bio }: AuthorBioCardProps) {
  const initials = getAuthorInitials(author)
  const slug = getAuthorSlug(author)

  return (
    <div className='flex gap-4 rounded-xl border border-border/40 bg-surface-elevated p-5 sm:gap-5 sm:p-6'>
      <Avatar className='h-16 w-16 shrink-0 ring-2 ring-border/60 sm:h-20 sm:w-20'>
        <AvatarImage src={avatarUrl} alt={author} />
        <AvatarFallback className='bg-brand/10 text-lg font-semibold text-brand'>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <Link
            href={`/authors/${slug}`}
            className='font-display text-lg font-semibold text-foreground transition-colors hover:text-brand'
          >
            {author}
          </Link>
          {role && (
            <span className='text-xs text-muted-foreground'>· {role}</span>
          )}
        </div>

        {bio && (
          <p className='mt-2 text-sm leading-relaxed text-text-secondary'>
            {bio}
          </p>
        )}

        <Link
          href={`/authors/${slug}`}
          className='mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-accent-hover'
        >
          <ArrowLeft className='h-3.5 w-3.5 rotate-180' />
          আরও প্রতিবেদন
        </Link>
      </div>
    </div>
  )
}
