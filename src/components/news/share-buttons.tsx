'use client'

import * as React from 'react'
import { Check, Copy, Facebook, Linkedin, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/* ── Custom brand SVG icons ── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface ShareButtonsProps {
  url?: string
  title?: string
  className?: string
  /** Vertical layout for sticky sidebar */
  vertical?: boolean
  /** Compact mode — icons only, no labels */
  compact?: boolean
  /** Show print button */
  showPrint?: boolean
}

const SHARE_ITEMS = [
  {
    label: 'ফেসবুক',
    buildHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    Icon: Facebook,
    color: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    defaultColor: 'text-[#1877F2]',
  },
  {
    label: 'এক্স (X)',
    buildHref: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    Icon: XIcon,
    color: '#000000',
    hoverBg: 'hover:bg-foreground hover:text-background hover:border-foreground',
    defaultColor: 'text-foreground',
  },
  {
    label: 'লিংকডইন',
    buildHref: (url: string, _title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    Icon: Linkedin,
    color: '#0A66C2',
    hoverBg: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
    defaultColor: 'text-[#0A66C2]',
  },
  {
    label: 'হোয়াটসঅ্যাপ',
    buildHref: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    Icon: WhatsAppIcon,
    color: '#25D366',
    hoverBg: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
    defaultColor: 'text-[#25D366]',
  },
]

export function ShareButtons({ url, title, className, vertical, compact, showPrint }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)
  const [currentUrl, setCurrentUrl] = React.useState('')

  React.useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const shareUrl = url || currentUrl
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  const iconSize = compact ? 'h-[15px] w-[15px]' : 'h-[18px] w-[18px]'
  const btnSize = compact
    ? 'h-9 w-9 border border-border/60 bg-card'
    : 'h-10 w-10 border border-border/50 bg-card shadow-sm'

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'flex items-center gap-1.5',
          vertical && 'flex-col',
          className
        )}
      >
        {!compact && (
          <span className='text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground'>
            শেয়ার
          </span>
        )}

        <div className={cn('flex items-center gap-1.5', vertical && 'flex-col', compact && 'gap-1')}>
          {SHARE_ITEMS.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <a
                  href={item.buildHref(shareUrl, shareTitle)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'share-btn inline-flex items-center justify-center rounded-full transition-all duration-200',
                    btnSize,
                    item.hoverBg,
                    item.defaultColor
                  )}
                  aria-label={`${item.label}-এ শেয়ার`}
                >
                  <item.Icon className={iconSize} />
                </a>
              </TooltipTrigger>
              <TooltipContent side={vertical ? 'right' : 'bottom'}>
                <p className='text-xs'>{item.label}-এ শেয়ার করুন</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Copy link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className={cn(
                  'share-btn inline-flex items-center justify-center rounded-full transition-all duration-200',
                  btnSize,
                  copied
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'hover:bg-brand hover:text-white hover:border-brand text-muted-foreground'
                )}
                aria-label={copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}
              >
                {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side={vertical ? 'right' : 'bottom'}>
              <p className='text-xs'>{copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Print button */}
          {showPrint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePrint}
                  className={cn(
                    'share-btn inline-flex items-center justify-center rounded-full transition-all duration-200',
                    btnSize,
                    'hover:bg-muted-foreground hover:text-background hover:border-muted-foreground text-muted-foreground'
                  )}
                  aria-label='প্রিন্ট করুন'
                >
                  <Printer className={iconSize} />
                </button>
              </TooltipTrigger>
              <TooltipContent side={vertical ? 'right' : 'bottom'}>
                <p className='text-xs'>প্রিন্ট করুন</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
