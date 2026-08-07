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
 * AuthorBioCard — NYT-style author section at end of article.
 * Clean horizontal layout with accent left border.
 */
export function AuthorBioCard({ author, avatarUrl, role, bio }: AuthorBioCardProps) {
  const initials = getAuthorInitials(author)
  const slug = getAuthorSlug(author)

  return (
    <div className='border-l-4 border-brand/70 py-1 pl-5'>
      <div className='flex gap-4 sm:gap-5'>
        <Avatar className='h-16 w-16 shrink-0 ring-1 ring-border/50 sm:h-20 sm:w-20'>
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback className='bg-brand/10 text-lg font-semibold text-brand'>
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <span className='text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground'>
            প্রতিবেদক
          </span>
          <Link
            href={`/authors/${slug}`}
            className='font-display mt-1 block text-lg text-foreground transition-colors hover:text-brand'
          >
            {author}
          </Link>
          {role && (
            <p className='mt-0.5 text-xs text-muted-foreground'>{role}</p>
          )}
          {bio && (
            <p className='mt-2 text-[15px] leading-relaxed text-text-secondary'>
              {bio}
            </p>
          )}
          <Link
            href={`/authors/${slug}`}
            className='mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-accent-hover'
          >
            <ArrowLeft className='h-3.5 w-3.5 rotate-180' />
            এই প্রতিবেদকের আরও সংবাদ
          </Link>
        </div>
      </div>
    </div>
  )
}
