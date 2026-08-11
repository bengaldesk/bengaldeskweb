import Image from 'next/image'
import Link from 'next/link'
import { Home, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LOGO_URL } from '@/lib/brand'

export default function NotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-4'>
      <section className='w-full max-w-xl rounded-2xl border border-border/70 bg-card p-7 text-center sm:p-10'>
        <Link href='/' className='inline-flex items-center justify-center'>
          <Image
            src={LOGO_URL}
            alt='The Bengal Desk Logo'
            width={240}
            height={70}
            priority
            className='h-auto w-[170px] object-contain transition-[filter] dark:brightness-0 dark:invert sm:w-[200px]'
          />
        </Link>

        <div className='mx-auto mt-5 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand'>
          <SearchX className='h-6 w-6' />
        </div>

        <p className='mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand'>ত্রুটি ৪০৪</p>
        <h1 className='mt-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl'>
          পৃষ্ঠাটি পাওয়া যায়নি
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base'>
          আপনি যে লিংকটি খুলেছেন সেটি হয় পরিবর্তিত হয়েছে, নয়তো আর বিদ্যমান নেই।
        </p>

        <div className='mt-6'>
          <Button asChild className='w-full sm:w-auto'>
            <Link href='/'>
              <Home className='h-4 w-4' />
              প্রচ্ছদে ফিরে যান
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
