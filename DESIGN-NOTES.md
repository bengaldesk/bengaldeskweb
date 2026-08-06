# Prothomalo.com Design Analysis → Barta Improvement Plan

## STEP 1: MOBILE VIEW ANALYSIS

### Header
- **Sticky header** that hides on scroll down, shows on scroll up (headroom.js)
- **Left**: Hamburger menu icon
- **Center**: Prothomalo logo (red text, white bg)
- **Right**: Search icon + Login button
- **Background**: White, subtle bottom border/shadow
- Height: ~56px

### Breaking News Ticker
- Thin red bar (bg: #E3192D) immediately below header
- White scrolling text, left-to-right marquee
- Small "শিরোনাম" label on the left
- Height: ~32px

### Category Navigation Tabs
- Horizontally scrollable row of category pills/tabs
- **Active tab**: Red background (#E3192D), white text, rounded
- **Inactive tabs**: Transparent bg, dark text, rounded
- Sticky below header when scrolling
- Height: ~40px, gap: 8px, padding: 6-12px

### Hero / Lead Story
- **Full-width image** (aspect 16:9 or 3:2)
- **Gradient overlay**: Black from bottom (70%) to transparent
- **Red category label** pill at top-left of image
- **Headline**: White, bold, 20-22px, 2-line clamp
- **Meta**: Author name + time in small white/semi-transparent text
- No border-radius (sharp edges like newspaper)
- Slight image zoom on hover

### সর্বশেষ (Latest News) Section
- **Section header**: Bengali text + thin left red border (3px) + "আরও" link right
- **List items**: Each item is a horizontal row
  - **Left**: Small square thumbnail (80x80px), sharp edges
  - **Right**: Bold headline (14-15px, 2-line clamp) + timestamp below (11px, gray)
  - **Bottom border**: Thin light-gray line between items
  - No card shadow, flat design

### Category Sections
- **Section header**: Same as Latest — left red border + name + "আরও পড়ুন"
- **Lead story**: Large image (full width, 16:9), headline below image, author + time
- **Grid**: 2-column grid below lead story
  - Each item: Image (3:2 or 1:1) on top, headline below (13-14px, 2-line)
  - Thin gap (12-16px) between grid items
  - Flat design, no shadows, no rounded corners

### Video Section
- Horizontal scrollable row of video cards
- Each card: Thumbnail with play button overlay (centered, semi-transparent white circle)
- Duration badge at bottom-right of thumbnail
- Title below (2-line clamp)
- Section header with video icon

### Opinion Section
- Author avatar (circular, 48-56px) on the left
- Author name (bold) + role/description below
- Article title (slightly larger, 2-line clamp)
- Clean card with left border accent or no border

### Footer
- **Dark background** (#1A1A2E or similar dark)
- **Logo** at top
- **Multi-column links**: Categories, About, Contact, etc.
- **Social icons**: Facebook, X/Twitter, YouTube, Instagram
- **Copyright** bar at very bottom
- App download badges (Play Store, App Store)

### Mobile Design Principles
- **Flat design** — no card shadows, no rounded corners
- **Sharp edges** — border-radius: 0 on images and cards
- **Newspaper feel** — clean, content-first, minimal decoration
- **Red accent** (#E3192D) used sparingly for active states and labels
- **Generous line height** for Bengali text readability
- **Numbered lists** with styled numbers (01, 02, 03...)

---

## STEP 2: DESKTOP VIEW ANALYSIS

### Header (3 Levels)
**Level 1 — Utility Bar** (thin, ~32px)
- Left: Date in Bengali (বৃহস্পতিবার, ৬ আগস্ট ২০২৫)
- Right: E-paper link, English version, Login, social icons
- Background: White, bottom border

**Level 2 — Logo Bar** (~80px)
- Center: Large logo
- Left/Right: Ad banner spaces (728x90 leaderboard)
- Background: White

**Level 3 — Main Navigation** (~44px)
- Horizontal list of ALL main categories
- Active: Red text + red bottom border (2-3px)
- Hover: Red text transition
- Font: 14-15px, medium weight
- Background: White
- Sticky on scroll (below utility bar)

### Content Layout (12-column grid)
- **Main Content**: 8 columns (left ~66%)
- **Sidebar**: 4 columns (right ~34%)
- Max-width: ~1200px, centered
- Gap: 24-32px between columns

### Hero Section (Desktop)
- Very large lead story: full-width of main content area
- Image: 16:9 or wider, sharp edges
- Overlay: Dark gradient from bottom
- Large headline (28-32px, bold, white)
- Category label + meta info below headline
- OR: Grid of 2-3 featured stories side by side

### সর্বশেষ Sidebar
- **In right sidebar**
- Numbered list (01, 02, 03... up to 10)
- Each item: Just headline (13-14px, 2-line) + timestamp
- Red accent numbers
- Thin bottom border between items
- Section header: "সর্বশেষ" with red left border

### Category Sections (Desktop)
- **Section header**: Red left border + section name + "আরও পড়ুন" link
- **Layout**: One large lead story (left, ~60%) + 2-3 stacked smaller stories (right, ~40%)
- OR: Full-width lead + 3-column grid below
- Lead story: Image + headline below + meta
- Smaller stories: Horizontal card (small thumbnail left, text right)

### Trending / Popular (Sidebar)
- In right sidebar
- Similar to Latest but with view counts
- Often has a "সবচেয়ে পঠিত" header

### Ad Placements
- Between sections: Full-width leaderboard (728x90)
- In sidebar: 300x250 rectangles
- Below header: Large billboard

### Footer (Desktop)
- Multi-column layout (4-5 columns)
- Category links, quick links, about, contact info
- Social icons
- App download badges
- Copyright bar
- Background: Dark (#1A1A2E)

### Desktop Design Principles
- **Newspaper-style grid** — content-dense, multi-column
- **Clear visual hierarchy** — size differences between lead and secondary stories
- **Consistent spacing** — 24-32px gaps, 16-24px padding
- **Red accent only** for interactive/active elements
- **No rounded corners** on content images
- **Thin borders** (1px, #E5E5E5) as dividers
- **Clean typography** — Bengali serif headlines, sans-serif body
