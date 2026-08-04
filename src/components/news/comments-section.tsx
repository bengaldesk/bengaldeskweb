'use client'

import * as React from 'react'
import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toBn } from '@/lib/bn'

type CommentItem = {
  id: string
  name: string
  message: string
  createdAt: string
}

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
  const d = new Date(iso)
  return `${toBn(d.getDate())}/${toBn(d.getMonth() + 1)}/${toBn(d.getFullYear())} ${toBn(
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  )}`
}

export function CommentsSection({ articleId }: { articleId: string }) {
  const storageKey = `barta-comments-${articleId}`

  const [comments, setComments] = React.useState<CommentItem[]>([])
  const [name, setName] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as CommentItem[]
      if (Array.isArray(parsed)) setComments(parsed)
    } catch {
      // ignore bad local data
    }
  }, [storageKey])

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
  }

  return (
    <section className='mt-12 border-t border-border/50 pt-8'>
      <div className='mb-4 flex items-center gap-2'>
        <MessageSquare className='h-4 w-4 text-brand' />
        <h2 className='text-sm font-bold uppercase tracking-[0.14em] text-foreground'>
          মন্তব্য ({toBn(comments.length)})
        </h2>
      </div>

      <form onSubmit={onSubmit} className='rounded-lg border border-border/60 bg-secondary/30 p-4'>
        <div className='grid gap-3'>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='আপনার নাম'
            aria-label='আপনার নাম'
            maxLength={80}
            required
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='আপনার মন্তব্য লিখুন...'
            aria-label='মন্তব্য'
            className='min-h-24'
            maxLength={1200}
            required
          />
          {error ? <p className='text-xs text-destructive'>{error}</p> : null}
          <div className='flex justify-end'>
            <Button type='submit'>মন্তব্য পাঠান</Button>
          </div>
        </div>
      </form>

      <div className='mt-5 space-y-3'>
        {comments.length === 0 ? (
          <p className='rounded-md border border-dashed border-border px-4 py-5 text-sm text-muted-foreground'>
            এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন।
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className='rounded-lg border border-border/60 p-4'>
              <div className='flex items-start gap-3'>
                <Avatar className='size-9'>
                  <AvatarFallback className='bg-brand/10 text-xs font-semibold text-brand'>
                    {getInitials(comment.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                    <p className='text-sm font-semibold text-foreground'>{comment.name}</p>
                    <span className='text-xs text-muted-foreground'>• {formatCommentTime(comment.createdAt)}</span>
                  </div>
                  <p className='mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/95'>
                    {comment.message}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
