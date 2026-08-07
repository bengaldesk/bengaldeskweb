/**
 * ═══════════════════════════════════════════════════════════════
 * বার্তা — Editorial Font Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Two-font system for Bengali news portal:
 *   Tiro Bangla  → Headlines & display text (serif-style, editorial authority)
 *   Hind Siliguri → Body copy & UI elements (clean sans-serif, high legibility)
 *
 * Both loaded via next/font/google with:
 *   - CSS variable binding for theme integration
 *   - Automatic subsetting (bengali + latin glyphs only)
 *   - font-display: swap (prevents FOIT, allows FOUT with fallback)
 *   - Automatic preloading of critical font files
 *   - adjustFontFallback: true (default) for CLS prevention
 * ═══════════════════════════════════════════════════════════════
 */

import { Tiro_Bangla, Hind_Siliguri } from 'next/font/google'

/**
 * Tiro Bangla — Editorial serif for headlines & display text.
 * Origins: Murty Classical Library of India book series.
 * Only weight 400 (regular) + italic — hierarchy achieved via size, spacing, color.
 */
export const tiroBangla = Tiro_Bangla({
  subsets: ['bengali'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

/**
 * Hind Siliguri — Clean sans-serif for body copy & UI elements.
 * Highly legible Bengali font, widely used in Bengali digital media.
 * Multiple weights enable clear typographic hierarchy in body text.
 */
export const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
