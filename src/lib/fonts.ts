/**
 * ═══════════════════════════════════════════════════════════════
 * The Bengal Desk — Editorial Font Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Two-font system for Bengali news portal:
 *   Hind Siliguri → Body/UI (clean sans-serif, high legibility)
 *   Tiro Bangla   → Accent/display (serif, editorial feel)
 *   Noto Sans Bengali → Loaded via CSS @import in globals.css
 * ═══════════════════════════════════════════════════════════════
 */

import { Tiro_Bangla, Hind_Siliguri } from 'next/font/google'

/**
 * Tiro Bangla — Editorial serif for accent/display text.
 */
export const tiroBangla = Tiro_Bangla({
  subsets: ['bengali'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

/**
 * Hind Siliguri — Primary sans-serif for body copy & UI.
 */
export const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})
