/**
 * ═══════════════════════════════════════════════════════════════
 * The Bengal Desk — Editorial Font Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Three-font system for Bengali news portal:
 *   Hind Siliguri     → --font-sans  (body/UI, clean sans, 300–700)
 *   Noto Sans Bengali → --font-display (headlines, 400–900)
 *   Tiro Bangla       → --font-serif  (serif accent, drop caps, 400)
 * ═══════════════════════════════════════════════════════════════
 */

import { Tiro_Bangla, Hind_Siliguri, Noto_Sans_Bengali } from 'next/font/google'

/**
 * Hind Siliguri — Primary body/UI sans-serif.
 */
export const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

/**
 * Noto Sans Bengali — Display/headline font (wider weight range 400–900).
 */
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Tiro Bangla — Editorial serif for accents, drop caps, pull-quotes.
 */
export const tiroBangla = Tiro_Bangla({
  subsets: ['bengali'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})
