'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LOGO_URL = 'https://res.cloudinary.com/dtdmwcs4r/image/upload/v1784526258/Bengaldesklogo_vgd6pt.png'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className='flex min-h-screen items-center justify-center bg-background px-4'>
      <section className='w-full max-w-xl rounded-2xl border border-border/70 bg-card p-7 text-center sm:p-10'>
        <Link href='/' className='inline-flex items-center justify-center'>
          <Image
            src={LOGO_URL}
            alt='বার্তা লোগো'
            width={240}
            height={70}
            priority
            className='h-auto w-[170px] object-contain transition-[filter] dark:brightness-0 dark:invert sm:w-[200px]'
          />
        </Link>

        <div className='mx-auto mt-5 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand'>
          <AlertTriangle className='h-6 w-6' />
        </div>

        <h1 className='mt-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl'>
          দুঃখিত! একটি ত্রুটি ঘটেছে
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base'>
          এই পৃষ্ঠাটি লোড করতে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন, অথবা হোমপেজে ফিরে যান।
        </p>

        <div className='mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Button onClick={reset} className='w-full sm:w-auto'>
            <RefreshCw className='h-4 w-4' />
            আবার চেষ্টা করুন
          </Button>
          <Button asChild variant='outline' className='w-full sm:w-auto'>
            <Link href='/'>প্রচ্ছদে ফিরে যান</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
