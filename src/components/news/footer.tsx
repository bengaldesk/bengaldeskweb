import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react'
import { NEWS_CATEGORIES, getCategorySlug } from '@/lib/news-data'

const QUICK_LINKS = [
  { label: 'প্রচ্ছদ', href: '/' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'যোগাযোগ', href: '/contact' },
  { label: 'বিজ্ঞাপন', href: '#' },
  { label: 'কর্মসংস্থান', href: '#' },
  { label: 'গোপনীয়তা নীতি', href: '/privacy' },
]

const LOGO_URL = 'https://res.cloudinary.com/dtdmwcs4r/image/upload/v1784526258/Bengaldesklogo_vgd6pt.png'

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'X', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src={LOGO_URL}
                alt="বার্তা লোগো"
                width={220}
                height={64}
                className="h-auto w-[158px] object-contain transition-[filter] dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, বিশ্লেষণ ও বিশেষ প্রতিবেদনের
              নির্ভরযোগ্য উৎস। সত্য ও নিরপেক্ষ সংবাদে আমরা বিশ্বাসী।
            </p>
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
              ক্যাটাগরি
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NEWS_CATEGORIES.map((c) => (
                <li key={c.label}>
                  <Link
                    href={getCategorySlug(c.label)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${c.color}`} />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
              দ্রুত লিংক
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">
              যোগাযোগ
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>১২৩ মিডিয়া কমপ্লেক্স, কারওয়ান বাজার, ঢাকা-১২১৫</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <span>+৮৮ ০২ ৯৮৮৭৭৬৬</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a
                  href="mailto:info@barta.news"
                  className="transition-colors hover:text-brand"
                >
                  info@barta.news
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} বার্তা নিউজ। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-brand">
              ব্যবহারের শর্তাবলী
            </Link>
            <Link href="/cookies" className="hover:text-brand">
              কুকিজ নীতি
            </Link>
            <Link href="#" className="hover:text-brand">
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
