'use client'

import * as React from 'react'
import { Mail, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export function Newsletter() {
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [done, setDone] = React.useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: 'destructive',
        title: 'ভুল ইমেল',
        description: 'অনুগ্রহ করে একটি সঠিক ইমেল ঠিকানা দিন।',
      })
      return
    }
    setDone(true)
    toast({
      title: 'সফল!',
      description: 'আপনি আমাদের নিউজলেটার তালিকায় যুক্ত হয়েছেন।',
    })
    setEmail('')
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <section className='py-6 sm:py-8'>
      {/* Outer glow border */}
      <div className='relative'>
        <div className='absolute -inset-[1px] rounded-xl border border-white/20 -z-10' />

        <div
          className='relative overflow-hidden rounded-xl bg-brand px-5 py-8 text-white sm:px-10 sm:py-10'
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)',
          }}
        >
          {/* Decorative SVG pattern overlay (visible on md+) */}
          <svg
            className='pointer-events-none absolute bottom-0 left-0 hidden h-full w-1/2 md:block'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <circle cx='40' cy='60' r='50' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='1.5' />
            <circle cx='120' cy='130' r='30' fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth='1' />
            <circle cx='80' cy='200' r='20' fill='rgba(255,255,255,0.04)' />
            <circle cx='180' cy='90' r='8' fill='rgba(255,255,255,0.06)' />
            <circle cx='160' cy='180' r='5' fill='rgba(255,255,255,0.05)' />
            <circle cx='30' cy='150' r='4' fill='rgba(255,255,255,0.06)' />
            <circle cx='200' cy='250' r='35' fill='none' stroke='rgba(255,255,255,0.04)' strokeWidth='1' />
            <circle cx='100' cy='280' r='12' fill='rgba(255,255,255,0.05)' />
            <circle cx='50' cy='300' r='3' fill='rgba(255,255,255,0.07)' />
            <circle cx='220' cy='40' r='15' fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth='1' />
          </svg>

          <div className='relative z-10 grid items-center gap-6 md:grid-cols-2'>
            <div>
              <div className='inline-flex items-center gap-2 text-xs font-semibold'>
                <Mail className='h-3.5 w-3.5' />
                দৈনিক নিউজলেটার
              </div>
              <div className='mt-3 flex items-center gap-3'>
                <h2 className='font-display text-xl leading-tight sm:text-2xl'>
                  প্রতিদিনের গুরুত্বপূর্ণ খবর পান সরাসরি আপনার ইনবক্সে
                </h2>
              </div>
              {/* Small decorative dots near headline */}
              <div className='mt-2 flex items-center gap-1'>
                <span className='h-1 w-1 rounded-full bg-white/30' />
                <span className='h-1 w-1 rounded-full bg-white/20' />
                <span className='h-1 w-1 rounded-full bg-white/10' />
              </div>
              <p className='mt-2 max-w-md text-sm text-white/90'>
                দেশ ও বিশ্বের শীর্ষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদনের
                নির্বাচিত সারসংক্ষেপ পান প্রতি সকালে।
              </p>
            </div>
            <form onSubmit={onSubmit} className='w-full'>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Input
                  type='email'
                  inputMode='email'
                  placeholder='আপনার ইমেল ঠিকানা'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-11 rounded-lg border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/50'
                  aria-label='ইমেল ঠিকানা'
                />
                <Button
                  type='submit'
                  size='lg'
                  className='h-11 shrink-0 rounded-lg bg-foreground text-background transition-all duration-300 hover:bg-foreground/90'
                >
                  {done ? (
                    <>
                      <CheckCircle2 className='h-4 w-4' />
                      সাবস্ক্রাইব হয়েছে
                    </>
                  ) : (
                    <>
                      <Send className='h-4 w-4' />
                      সাবস্ক্রাইব
                    </>
                  )}
                </Button>
              </div>
              <p className='mt-2 text-[11px] text-white/70'>
                সাবস্ক্রাইব করে আপনি আমাদের গোপনীয়তা নীতিতে সম্মত হচ্ছেন।
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
