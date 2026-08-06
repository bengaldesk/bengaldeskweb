'use client'

import * as React from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toBn } from '@/lib/bn'

// Mock initial comments to make the section look populated
type CommentItem = {
  id: string
  name: string
  message: string
  createdAt: string
  isMock?: boolean
}

const MOCK_COMMENTS: Omit<CommentItem, 'id'>[] = [
  {
    name: 'রাসেল আহমেদ',
    message: 'খুব সুন্দর প্রতিবেদন। এই ধরনের সংবাদ আরও প্রকাশ করলে ভালো হয়।',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isMock: true,
  },
  {
    name: 'ফারহানা ইয়াসমিন',
    message: 'বিষয়টি নিয়ে বিস্তারিত জানতে পেরেছি, ধন্যবাদ বার্তা ডেস্ক।',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isMock: true,
  },
  {
    name: 'মো. ইমতিয়াজ',
    message: 'আশা করি এই উদ্যোগ সফল হবে। সবাইকে সচেতন থাকতে হবে।',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isMock: true,
  },
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

function formatCommentTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 60) return `${toBn(min)} মিনিট আগে`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${toBn(hr)} ঘণ্টা আগে`
  const day = Math.floor(hr / 24)
  return `${toBn(day)} দিন আগে`
}

export function CommentsSection({ articleId }: { articleId: string }) {
  const storageKey = `barta-comments-${articleId}`

  const [comments, setComments] = React.useState<CommentItem[]>([])
  const [name, setName] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) {
        // Load mock comments on first visit
        const mocks = MOCK_COMMENTS.map((c, i) => ({
          ...c,
          id: `mock-${articleId}-${i}`,
        }))
        setComments(mocks)
        return
      }
      const parsed = JSON.parse(raw) as CommentItem[]
      if (Array.isArray(parsed)) setComments(parsed)
    } catch {
      // ignore
    }
  }, [storageKey, articleId])

  const saveComments = (next: CommentItem[]) => {
    setComments(next)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanName = name.trim()
    const cleanMessage = message.trim()

    if (!cleanName || !cleanMessage) {
      setError('নাম ও মন্তব্য লিখুন')
      return
    }

    setIsSubmitting(true)
    // Simulate network delay
    setTimeout(() => {
      const next: CommentItem[] = [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: cleanName,
          message: cleanMessage,
          createdAt: new Date().toISOString(),
        },
        ...comments,
      ]
      saveComments(next)
      setMessage('')
      setIsSubmitting(false)
    }, 500)
  }

  const userCommentCount = comments.filter((c) => !c.isMock).length

  return (
    <section className='mt-12 border-t border-border/40 pt-8' id='comments'>
      {/* Section header */}
      <div className='section-header mb-6'>
        <h2 className='flex items-center gap-2'>
          <MessageSquare className='h-4 w-4 text-brand' />
          মন্তব্য
          <span className='ml-1 text-sm font-normal text-muted-foreground'>({toBn(comments.length)})</span>
        </h2>
      </div>

      {/* Comment form */}
      <form onSubmit={onSubmit} className='mb-8 rounded-xl border border-border/50 bg-card p-4 sm:p-5'>
        <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-foreground'>
          <User className='h-4 w-4 text-brand' />
          আপনার মন্তব্য লিখুন
        </div>
        <div className='space-y-3'>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='আপনার নাম'
            aria-label='আপনার নাম'
            maxLength={80}
            required
            className='bg-muted/50'
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='আপনার মন্তব্য লিখুন...'
            aria-label='মন্তব্য'
            className='min-h-28 bg-muted/50'
            maxLength={1200}
            required
          />
          <div className='flex items-center justify-between'>
            {error ? <p className='text-xs text-destructive'>{error}</p> : <div />}
            <Button type='submit' disabled={isSubmitting} className='gap-2'>
              <Send className='h-3.5 w-3.5' />
              {isSubmitting ? 'পাঠানো হচ্ছে...' : 'মন্তব্য পাঠান'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className='space-y-3'>
        {comments.length === 0 ? (
          <div className='rounded-xl border border-dashed border-border/60 px-5 py-10 text-center'>
            <MessageSquare className='mx-auto mb-2 h-8 w-8 text-muted-foreground/40' />
            <p className='text-sm text-muted-foreground'>এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন।</p>
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                comment.isMock
                  ? 'border-border/40 bg-card'
                  : 'border-brand/20 bg-brand/5'
              )}
            >
              <div className='flex items-start gap-3'>
                <Avatar className='size-9 shrink-0'>
                  <AvatarFallback
                    className={cn(
                      'text-xs font-semibold',
                      comment.isMock
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-brand/10 text-brand'
                    )}
                  >
                    {getInitials(comment.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                    <p className='text-sm font-semibold text-foreground'>{comment.name}</p>
                    <span className='text-[11px] text-muted-foreground'>{formatCommentTime(comment.createdAt)}</span>
                  </div>
                  <p className='mt-1.5 text-sm leading-relaxed text-foreground/90'>{comment.message}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
