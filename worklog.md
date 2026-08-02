# বার্তা (Barta) News Portal — Worklog

---
Task ID: 1
Agent: main (orchestrator)
Task: আধুনিক বাংলা নিউজ পোর্টালের হোমপেজ ডিজাইন করা (ধাপ ১)

Work Log:
- প্রজেক্ট স্ট্রাকচার ও বিদ্যমান shadcn/ui কম্পোনেন্ট পর্যালোচনা করা হয়েছে
- `src/app/globals.css` আপডেট — নিউজ ব্র্যান্ড লাল থিম (oklch red), ডার্ক মোড, বাংলা ফন্ট ভ্যারিয়েবল, marquee/scrollbar/line-clamp ইউটিলিটি, img-zoom হোভার অ্যানিমেশন, ticker-pulse
- `src/app/layout.tsx` আপডেট — Noto Sans Bengali ফন্ট, বাংলা metadata, ThemeProvider (next-themes)
- `src/components/theme-provider.tsx` তৈরি
- `src/lib/bn.ts` — বাংলা নিউমেরাল/তারিখ/সময়/relative-time হেল্পার
- `src/lib/news-data.ts` — মক নিউজ ডেটা: ১৬টি সংবাদ (১০ ক্যাটাগরি), ৫টি ব্রেকিং নিউজ, ৩টি ভিডিও, ৩টি মতামত; সব ছবি picsum.photos seeded
- `src/components/news/` এ কম্পোনেন্ট: theme-toggle, top-bar, category-badge, section-header, news-image, news-card (hero/feature/horizontal/overlay/text ভ্যারিয়েন্ট), header (logo+nav+search+mobile Sheet), breaking-ticker (marquee), hero-section, latest-news (grid + sticky trending sidebar), category-section (reusable), trending-sidebar, video-section, opinion-section, newsletter (useToast), footer
- `src/app/page.tsx` অ্যাসেম্বল — min-h-screen flex-col (sticky footer), sr-only h1
- `next.config.ts` — picsum.photos remotePatterns যোগ (next/image)
- Agent Browser দিয়ে এন্ড-টু-এন্ড যাচাই: পেজ রেন্ডার ✓, কনসোলে কোনো error/warning নেই ✓, নিউজলেটার ফর্ম (valid→success toast, invalid→error toast) ✓, থিম টগল (light↔dark) ✓, মোবাইল মেনু (Sheet এ সব ক্যাটাগরি) ✓, ফুটার সঠিকভাবে push ✓
- VLM দিয়ে ভিজ্যুয়াল যাচাই: ডেস্কটপ (৪/৫ রেটিং, clean modern UI, সব ছবি লোডেড, কোনো overlap/cutoff নেই) এবং মোবাইল (bug-free, responsive, কোনো overflow/break নেই) উভয় ভিউ নিশ্চিত
- `bun run lint` পরিষ্কার, dev log-এ সব GET / 200

Stage Summary:
- ব্র্যান্ড: "বার্তা" (Barta) — লাল অ্যাকসেন্ট, Noto Sans Bengali, লাইট/ডার্ক মোড
- হোমপেজ সম্পূর্ণ ও কার্যকর: TopBar → Header → BreakingTicker → Hero → LatestNews+Trending → Category(রাজনীতি/খেলা/প্রযুক্তি) → Video → Opinion → Newsletter → Footer
- বর্তমানে সব ডেটা মক (src/lib/news-data.ts); পরবর্তী ধাপে Prisma ডেটাবেস + API তৈরি করা হবে
- ব্যবহৃত কম্পোনেন্ট ফোল্ডার: src/components/news/ (১৩টি ফাইল)
- পরবর্তী ধাপের সম্ভাব্য কাজ: প্রিজমা স্কিমা (Article, Category, Author, Video), seed ডেটা, API routes, আর্টিকেল ডিটেইল পেজ, সার্চ, ক্যাটাগরি ফিল্টার

---
Task ID: 2
Agent: main (orchestrator)
Task: প্রফেশনাল ও নির্ভরযোগ্য বাংলা ফন্ট সিস্টেম আপগ্রেড (ধাপ ১.৫)

Work Log:
- layout.tsx: Noto_Sans_Bengali প্রতিস্থাপন করে Hind_Siliguri (body/UI, ৫ weight) + Noto_Serif_Bengali (display, ৪ weight) লোড করা হয়েছে; ভেরিয়েবল ক্লাস `<html>`-এ সরানো হয়েছে (আগে body-তে ছিল, যার ফলে Tailwind v4 preflight রেজল্ভ করতে পারছিল না)
- globals.css: `--font-sans` এখন Hind Siliguri; `--font-display` (serif) যোগ; base layer-এ বাংলা গ্লিফের জন্য line-height 1.65, h1/h2/h3 এর জন্য 1.3 + letter-spacing 0 (tracking-tight বাংলা যুক্তাক্ষরে ওভারল্যাপ করতে পারে); `.font-display` ইউটিলিটি ক্লাস যোগ; text-rendering optimizeLegibility
- প্রধান শিরোনামে .font-display প্রয়োগ: Hero হেডলাইন, SectionHeader, TrendingSidebar টাইটেল, Opinion টাইটেল, Newsletter হেডিং
- Agent Browser যাচাই: html স্কোপে --font-hind/--font-serif-bn রেজল্ভ হচ্ছে; body/paragraph = "Hind Siliguri"; hero h2 = "Noto Serif Bengali" → serif নিশ্চিত; ফন্ট loaded; কোনো error/console warning নেই
- VLM ভিজ্যুয়াল যাচাই (ডেস্কটপ): ৯/১০ রেটিং — serif হেডলাইনে সম্পাদকীয় গাম্ভীর্য, sans-serif বডিতে পঠনযোগ্যতা, যুক্তাক্ষর/মাত্রা নিখুঁত, কোনো overlap/বিকৃতি নেই, প্রিন্ট-রেডি নির্ভরযোগ্য লুক

Stage Summary:
- টাইপোগ্রাফি: Hind Siliguri (sans, body/UI) + Noto Serif Bengali (serif, display headlines) — ক্লাসিক প্রফেশনাল পেয়ারিং
- বাংলা-অপ্টিমাইজড: relaxed line-height, neutral letter-spacing (conjunct overlap এড়াতে)
- ফন্ট ভেরিয়েবল `<html>`-এ (next/font স্ট্যান্ডার্ড প্যাটার্ন), Tailwind v4 @theme এর সাথে সামঞ্জস্যপূর্ণ
- পরবর্তী ধাপের সম্ভাব্য কাজ অপরিবর্তিত: Prisma স্কিমা + API, আর্টিকেল ডিটেইল পেজ, সার্চ
