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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-10 text-white sm:px-12">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 h-44 w-44 rounded-full bg-black/10" />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Mail className="h-3.5 w-3.5" />
              দৈনিক নিউজলেটার
            </div>
            <h2 className="font-display mt-3 text-2xl leading-tight sm:text-3xl">
              প্রতিদিনের গুরুত্বপূর্ণ খবর পান সরাসরি আপনার ইনবক্সে
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/85">
              দেশ ও বিশ্বের শীর্ষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদনের নির্বাচিত
              সারসংক্ষেপ পান প্রতি সকালে।
            </p>
          </div>
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                inputMode="email"
                placeholder="আপনার ইমেল ঠিকানা"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground"
                aria-label="ইমেল ঠিকানা"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 shrink-0 bg-foreground text-background hover:bg-foreground/90"
              >
                {done ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    সাবস্ক্রাইব হয়েছে
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    সাবস্ক্রাইব
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-white/75">
              সাবস্ক্রাইব করে আপনি আমাদের গোপনীয়তা নীতিতে সম্মত হচ্ছেন।
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
