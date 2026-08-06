'use client'

import * as React from 'react'
import { Check, Copy, Facebook, MessageCircle, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ShareButtonsProps {
  url?: string
  title?: string
  className?: string
  vertical?: boolean
}

const SHARE_ITEMS = [
  {
    label: 'ফেসবুকে শেয়ার',
    buildHref: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    Icon: Facebook,
    hoverColor: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] text-[#1877F2]',
  },
  {
    label: 'X-এ শেয়ার',
    buildHref: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    Icon: Share2,
    hoverColor: 'hover:bg-foreground hover:text-background hover:border-foreground text-foreground',
  },
  {
    label: 'WhatsApp-এ শেয়ার',
    buildHref: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
    Icon: MessageCircle,
    hoverColor: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-[#25D366]',
  },
]

export function ShareButtons({ url, title, className, vertical }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn('flex items-center gap-1.5', vertical && 'flex-col', className)}>
        <span className='text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
          শেয়ার
        </span>

        <div className={cn('flex items-center gap-1', vertical && 'flex-col')}>
          {SHARE_ITEMS.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <a
                  href={item.buildHref(shareUrl, shareTitle)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'inline-flex items-center justify-center rounded-full transition-all duration-200',
                    'h-9 w-9 border border-border/60 bg-card',
                    item.hoverColor
                  )}
                  aria-label={item.label}
                >
                  <item.Icon className='h-4 w-4' />
                </a>
              </TooltipTrigger>
              <TooltipContent side={vertical ? 'left' : 'bottom'}>
                <p className='text-xs'>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className={cn(
                  'inline-flex items-center justify-center rounded-full transition-all duration-200',
                  'h-9 w-9 border border-border/60 bg-card',
                  copied
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'hover:bg-brand hover:text-white hover:border-brand text-muted-foreground'
                )}
                aria-label={copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}
              >
                {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
              </button>
            </TooltipTrigger>
            <TooltipContent side={vertical ? 'left' : 'bottom'}>
              <p className='text-xs'>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
