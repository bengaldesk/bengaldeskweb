# The Bengal Desk — Typography System

## Architecture

### Two-Four-Font Editorial Pairing

| Token | Font | Role | Size Floor |
|-------|------|------|-----------|
| `--font-headline` → `--font-serif` | Noto Serif Bengali | Editorial headlines | ≥ 16 px |
| `--font-body` → `--font-sans` | Noto Sans Bengali | Body text, UI chrome, meta | — |

- **Weights loaded**: 400, 500, 600, 700 (both families)
- **Subset**: `bengali` + Latin fallback
- **Display**: `swap` (prevents invisible text during load)
- **Loader**: `src/lib/fonts.ts` → CSS variables `--font-serif` and `--font-sans` applied on `<html>`

### Token Resolution Chain

```
--font-serif  (set by next/font on <html>)
    └── --font-headline: var(--font-serif)   (declared in :root)

--font-sans   (set by next/font on <html>)
    └── --font-body: var(--font-sans)        (declared in :root)

--font-display: var(--font-serif)           (declared in @theme inline)
```

### Tailwind Integration

- `font-display` Tailwind class → `var(--font-display)` → `var(--font-serif)` → Noto Serif Bengali
- Base `h1`–`h6` elements automatically get `font-family: var(--font-headline), serif`
- `body` automatically gets `font-family: var(--font-body), sans-serif`

## Which Token to Use

### Headlines (Serif)

Use for: section titles, article titles, card titles, hero text, pull-quotes.

| Class / Element | When to Use |
|----------------|-------------|
| `h1`, `h2`, `h3`, `h4`, `h5`, `h6` (base) | Any heading element anywhere |
| `.font-display` | Quick Tailwind utility for serif text |
| `.hero-headline` | Homepage lead story title |
| `.card-headline` | News card titles in grids/lists |
| `.section-heading` | Section headers (রাজনীতি, খেলা, etc.) |
| `.section-header h2` | Alternative section header style |
| `.article-headline` | Article page H1 |
| `.opinion-headline` | Opinion/column headline |
| `.poll-question` | Poll question text |
| `.newsletter-headline` | Newsletter section heading |
| `.masthead-wordmark` | Site logo/wordmark |

### Body Text (Sans)

Use for: paragraphs, descriptions, UI labels, form inputs, general content.

| Class / Element | When to Use |
|----------------|-------------|
| `body` (base) | All body text by default |
| `.article-body` | Article page long-form text |
| `.card-dek` | Card summary/excerpt text |
| `.newsletter-body` | Newsletter body copy |
| `.poll-option` | Poll option labels |
| `.author-bio` | Author biography text |
| `.article-dek` | Article subtitle/excerpt |
| `.article-dateline` | Article location + date |
| `.editorial-rule-label` | Section divider labels |

### Meta / Caption (Sans, Small)

Use for: timestamps, author names, view counts, captions, breadcrumbs.

| Class / Element | When to Use |
|----------------|-------------|
| `.meta-text` | Meta row (time, views, read-time) |
| `.byline` | Author + date line |
| `.byline-author` | Author name in byline |
| `.image-caption` | Image captions |
| `.breadcrumb` | Breadcrumb navigation |
| `.video-duration` | Video duration badge |
| `.author-title` | Author job title |
| `.footer-copyright` | Footer copyright line |
| `.article-meta-stats` | Article meta stats row |
| `time`, `figcaption` (base) | HTML semantic elements |

### Eyebrow / Badge (Sans, Caps, Small)

Use for: category labels, navigation, tickers, badges.

| Class / Element | When to Use |
|----------------|-------------|
| `.category-eyebrow` | Category text above headline |
| `.category-badge` | Colored category pill |
| `.ticker-label` | Breaking news ticker label |
| `.ticker-text` | Breaking news ticker content |
| `.nav-link` | Navigation links |
| `.utility-bar` | Top utility bar (date, settings) |
| `.footer-heading` | Footer column headings |
| `.footer-link` | Footer navigation links |

## Rules for Contributors & AI Agents

1. **Never add a `font-family` declaration** in a component file. Use the token system above.
2. **Never introduce a third font family.** Only Noto Serif Bengali and Noto Sans Bengali.
3. **Only use weights 400, 500, 600, 700.** Never use 300, 800, 900 or any value not in the loaded set — synthetic bold distorts Bangla conjuncts.
4. **Never use `font-style: italic` on Bangla text.** Neither Noto font has an italic face; the browser would synthesize one, distorting যুক্তাক্ষর (conjunct clusters) and মাত্রা (vowel signs). Italic is acceptable ONLY on short Latin-only text (e.g., photo credits in figcaptions).
5. **New components must reuse an existing class** from the catalogue above. If none fits, add a new entry to the `@layer utilities` block in `globals.css` — never inline a one-off `fontFamily` style.
6. **Run `bash scripts/check-tokens.sh`** after any edit to `globals.css` to catch dangling `var()` references.

## Fluid Type Scale

All sizes use `clamp()` for smooth scaling between 360px and 1920px viewports:

| Token | Range | Usage |
|-------|-------|-------|
| `--text-caption` | 12–14px | Meta, timestamps, badges |
| `--text-small` | 13–15px | Nav links, utility text |
| `--text-base` | 15–17.5px | Body text |
| `--text-body-lg` | 15.5–17.5px | Article body |
| `--text-h4` | 16–19px | Small headings |
| `--text-h3` | 18–22px | Section titles |
| `--text-h2` | 22–32px | Sub-headlines |
| `--text-h1` | 24–36px | Main headlines |
| `--text-display` | 28–42px | Masthead wordmark |

## Weight Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-regular` | 400 | Body text, article prose |
| `--weight-medium` | 500 | Slightly emphasized body, nav |
| `--weight-semibold` | 600 | Sub-headlines, labels, buttons |
| `--weight-bold` | 700 | Main headlines, wordmark |

## Line-Height Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | 1.35 | H1, H2, hero |
| `--leading-snug` | 1.45 | H3, card headlines |
| `--leading-normal` | 1.6 | H4–H6, meta text |
| `--leading-relaxed` | 1.8 | Body text, article prose |