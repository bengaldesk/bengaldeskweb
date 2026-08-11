import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react'
import { NEWS_CATEGORIES, getCategorySlug } from '@/lib/news-data'

const QUICK_LINKS = [
  { label: 'প্রচ্ছদ', href: '/' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'যোগাযোগ', href: '/contact' },
  { label: 'বিজ্ঞাপন', href: '#' },
  { label: 'গোপনীয়তা নীতি', href: '/privacy' },
]

const LOGO_URL = '/logo.png'
const LOGO_WHITE_URL = '/logo.png'

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'X', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
]

export function Footer() {
  return (
    <footer className='mt-auto border-t-4 border-brand bg-[var(--footer-bg)] text-[var(--footer-text)]'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <Link href='/' className='inline-flex items-center'>
              <Image
                src={LOGO_WHITE_URL}
                alt='বার্তা লোগো'
                width={180}
                height={52}
                className='h-auto w-[140px] object-contain sm:w-[160px]'
              />
            </Link>
            <p className='mt-3 text-sm leading-relaxed text-[var(--footer-text)]'>
              বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদনের
              নির্ভরযোগ্য উৎস। সত্য ও নিরপেক্ষ সংবাদে আমরা বিশ্বাসী।
            </p>
            <div className='mt-4 flex items-center gap-2'>
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-brand hover:text-white hover:scale-110'
                >
                  <Icon className='h-4 w-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className='mb-3 text-sm font-bold text-[var(--footer-heading)]'>
              বিভাগ সমূহ
            </h3>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-1.5'>
              {NEWS_CATEGORIES.map((c) => (
                <li key={c.label}>
                  <Link
                    href={getCategorySlug(c.label)}
                    className='text-sm leading-loose text-[var(--footer-text)] transition-colors hover:text-white'
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className='mb-3 text-sm font-bold text-[var(--footer-heading)]'>
              দ্রুত লিংক
            </h3>
            <ul className='flex flex-col gap-1.5'>
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className='text-sm leading-loose text-[var(--footer-text)] transition-colors hover:text-white'
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='mb-3 text-sm font-bold text-[var(--footer-heading)]'>
              যোগাযোগ
            </h3>
            <ul className='flex flex-col gap-3 text-sm text-[var(--footer-text)]'>
              <li className='flex items-start gap-2.5'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-brand' />
                <span>১২৩ মিডিয়া কমপ্লেক্স, কারওয়ান বাজার, ঢাকা-১২১৫</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <Phone className='h-4 w-4 shrink-0 text-brand' />
                <span>+৮৮ ০২ ৯৮৮৭৭৬৬</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <Mail className='h-4 w-4 shrink-0 text-brand' />
                <a
                  href='mailto:info@barta.news'
                  className='transition-colors hover:text-white'
                >
                  info@barta.news
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row'>
          <p>© {new Date().getFullYear()} বার্তা নিউজ। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className='flex items-center gap-4'>
            <Link href='/terms' className='transition-colors hover:text-white'>
              ব্যবহারের শর্তাবলী
            </Link>
            <Link href='/cookies' className='transition-colors hover:text-white'>
              কুকিজ নীতি
            </Link>
            <Link href='/admin/login' className='transition-colors hover:text-white'>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
