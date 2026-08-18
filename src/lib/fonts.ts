/**
 * ═══════════════════════════════════════════════════════════════
 * The Bengal Desk — Editorial Font Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Two-font editorial system for Bengali news portal:
 *   Noto Serif Bengali  → --font-serif  (headlines: H1–H3, hero, cards, section headers)
 *   Noto Sans Bengali   → --font-sans   (body text, UI chrome, badges, meta, ticker, breadcrumb)
 *
 * Weight files loaded: 400, 500, 600, 700 for both fonts.
 * NEVER request weight values not in this list — prevents synthetic/faux bold.
 * ═══════════════════════════════════════════════════════════════
 */

import { Noto_Serif_Bengali, Noto_Sans_Bengali } from 'next/font/google'

/**
 * Noto Serif Bengali — Editorial headlines only (≥16px).
 * Genuine serif with visible thick/thin stroke contrast.
 * Part of Google's Noto family: full Unicode coverage, reliable conjunct/matra shaping.
 */
export const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif',
  display: 'swap',
})

/**
 * Noto Sans Bengali — Body text AND all UI chrome.
 * Widest Unicode/script coverage of any Bangla web font.
 * Most consistent glyph shaping across browsers and OS.
 */
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})
