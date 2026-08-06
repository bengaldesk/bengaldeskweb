# Barta → Prothomalo-Style Redesign: Improvement Plan

## GAP ANALYSIS: Current Barta vs Prothomalo

### CRITICAL DIFFERENCES (Must Fix)

| Area | Current Barta | Prothomalo | Priority |
|---|---|---|---|
| **Design Style** | Rounded corners, shadows, cards | Flat, sharp edges, thin borders | HIGH |
| **Mobile Header** | Tall (h-16), search visible | Compact, hamburger+logo+search icon only | HIGH |
| **Mobile Hero** | Complex 3-col sidebar layout | Full-width image with gradient overlay | HIGH |
| **Category Tabs (Mobile)** | None | Sticky scrollable red tab bar | HIGH |
| **Latest News (Mobile)** | 3-col grid | Numbered vertical list with thumbnails | HIGH |
| **Breaking Ticker** | Hidden on mobile (`sm:block`) | Visible on all screens | HIGH |
| **Desktop Layout** | Sections have own sidebars | Fixed 8/4 grid: main + right sidebar | HIGH |
| **Desktop Header** | Single-level nav | 3-level: utility + logo + nav | MEDIUM |
| **Footer** | Light background | Dark background (#1a1a2e) | MEDIUM |
| **Section Headers** | Red bottom border | Red LEFT border (3px) + bottom line | MEDIUM |
| **Category Section (Mobile)** | Lead + horizontal list | Lead + 2-col grid of smaller stories | MEDIUM |
| **Category Section (Desktop)** | Lead + horizontal list | Lead (left 60%) + stacked list (right 40%) | MEDIUM |
| **Opinion Section** | Simple list with avatar | Card layout with avatar, name, role, title | LOW |
| **Video Section** | Good already | Similar, maybe add horizontal scroll on mobile | LOW |

## IMPLEMENTATION PLAN

### Phase 1: Design Foundation (CSS & Global)
1. Remove rounded corners from news images/cards (border-radius: 0)
2. Remove box shadows from content areas
3. Make footer dark (#1a1a2e bg, white text)
4. Adjust section header to use left red border accent
5. Ensure consistent thin borders (border-border/40)

### Phase 2: Header Overhaul
1. Make mobile header compact (h-14)
2. Hide search bar on mobile, show only icon
3. Add sticky category tabs below header (all screens)
4. Show breaking ticker on all screen sizes

### Phase 3: Homepage Hero (Mobile-first)
1. Replace 3-column hero with full-width overlay hero
2. Lead story: full-width image, gradient overlay, white text
3. Below hero: 2-3 secondary stories in compact grid

### Phase 4: Homepage Content Layout
1. Desktop: Switch to 8/4 column grid
2. Move Latest News to right sidebar (numbered list)
3. Move Trending to right sidebar
4. Main content: category sections in single column
5. Mobile: Everything in single column

### Phase 5: Section Components
1. Category Section: Lead (large) + 2-col grid (mobile), Lead left + list right (desktop)
2. Latest News: Numbered list style (01, 02, 03...)
3. Opinion: Card layout with left border accent

### Phase 6: Category Pages
1. Apply same design improvements
2. Add lead hero story at top
3. 2-col grid for remaining stories on desktop

### Phase 7: Footer Redesign
1. Dark background
2. White text
3. Better column layout
4. Social icons with hover effects

## CONSTRAINTS
- NO dynamic [slug] routes (Turbopack crashes)
- Use individual static category pages
- Use plain `<img>` instead of `next/image` where possible (stability)
- Keep dark mode support but default to light
- Minimize new file creation to avoid Turbopack recompilation issues
