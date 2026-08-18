import Link from 'next/link'
import { OPINIONS } from '@/lib/posts'
import { relativeTimeBn } from '@/lib/bn'
import Image from 'next/image'
import { PenLine } from 'lucide-react'
import { SectionHeader } from './section-header'

export function OpinionSection() {
  if (OPINIONS.length === 0) return null

  return (
    <section className='py-6 sm:py-8'>
      <SectionHeader title='কলাম ও বিশ্লেষণ' href='/category/opinion' icon={<PenLine className='h-4 w-4 text-brand' />} />

      {/* Unified responsive layout — list mobile, 2-col grid desktop */}
      <div className='space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 lg:space-y-0'>
        {OPINIONS.map((op, i) => (
          <Link
            key={op.id}
            href={`/category/opinion`}
            className='group flex gap-3.5 border-b border-border/30 py-4 first:pt-0 lg:gap-4 lg:py-5'
          >
            {/* Column number */}
            <span className='flex h-8 w-8 shrink-0 items-center justify-center text-sm font-extrabold text-brand lg:h-9 lg:w-9 lg:text-base'>
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Content */}
            <div className='flex min-w-0 flex-1 flex-col justify-center'>
              <h3 className='line-clamp-2 text-[14px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand lg:text-[15px] lg:leading-relaxed'>
                {op.title}
              </h3>
              <div className='mt-1.5 flex items-center gap-2.5'>
                {/* Avatar */}
                <div className='relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-muted'>
                  <Image src={op.avatar} alt={op.author} fill sizes='20px' className='object-cover' />
                </div>
                <span className='text-[12px] font-semibold text-foreground'>{op.author}</span>
                <span className='text-[10px] text-muted-foreground'>{op.role}</span>
              </div>
              <span className='mt-1 text-[10px] text-muted-foreground'>
                {relativeTimeBn(new Date(op.publishedAt))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
