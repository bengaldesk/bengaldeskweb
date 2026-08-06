// Mock news data for the বার্তা (Barta) news portal.
// In later steps this will be replaced with a Prisma-backed API.

export type NewsCategory =
  | "জাতীয়"
  | "আন্তর্জাতিক"
  | "রাজনীতি"
  | "খেলা"
  | "বিনোদন"
  | "প্রযুক্তি"
  | "স্বাস্থ্য"
  | "লাইফস্টাইল"
  | "অর্থনীতি"
  | "মতামত";

export type NewsArea =
  | "ঢাকা"
  | "চট্টগ্রাম"
  | "রাজশাহী"
  | "খুলনা"
  | "সিলেট"
  | "বরিশাল"
  | "রংপুর"
  | "ময়মনসিংহ";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  body?: string[]; // full article body paragraphs
  category: NewsCategory;
  area?: NewsArea;
  author: string;
  publishedAt: string; // ISO string
  image: string;
  readTime: number; // minutes
  views: number;
  featured?: boolean;
  trending?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  category: NewsCategory;
  duration: string;
  thumbnail: string;
  views: number;
  publishedAt: string;
}

export interface OpinionItem {
  id: string;
  title: string;
  author: string;
  role: string;
  excerpt: string;
  avatar: string;
  publishedAt: string;
}

export interface AuthorProfile {
  name: string;
  slug: string;
  avatar: string;
  role: string;
  bio: string;
  articleCount: number;
}

const img = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Build relative timestamps
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const CATEGORY_SLUG_MAP: Record<NewsCategory, string> = {
  "জাতীয়": "national",
  "আন্তর্জাতিক": "international",
  "রাজনীতি": "politics",
  "খেলা": "sports",
  "বিনোদন": "entertainment",
  "প্রযুক্তি": "technology",
  "স্বাস্থ্য": "health",
  "লাইফস্টাইল": "lifestyle",
  "অর্থনীতি": "economy",
  "মতামত": "opinion",
};

export const SLUG_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([bn, en]) => [en, bn])
) as Record<string, NewsCategory>;

export const getCategorySlug = (cat: NewsCategory) =>
  `/category/${CATEGORY_SLUG_MAP[cat]}`;

export const getCategoryBySlug = (slug: string): NewsCategory | undefined =>
  SLUG_CATEGORY_MAP[slug];

export const ALL_CATEGORY_SLUGS = Object.values(CATEGORY_SLUG_MAP);

export const NEWS_CATEGORIES: { label: NewsCategory; color: string }[] = [
  { label: "জাতীয়", color: "bg-red-600" },
  { label: "আন্তর্জাতিক", color: "bg-amber-600" },
  { label: "রাজনীতি", color: "bg-rose-600" },
  { label: "খেলা", color: "bg-emerald-600" },
  { label: "বিনোদন", color: "bg-fuchsia-600" },
  { label: "প্রযুক্তি", color: "bg-cyan-600" },
  { label: "স্বাস্থ্য", color: "bg-teal-600" },
  { label: "লাইফস্টাইল", color: "bg-pink-600" },
  { label: "অর্থনীতি", color: "bg-orange-600" },
  { label: "মতামত", color: "bg-violet-600" },
];

export const categoryColor = (cat: NewsCategory): string =>
  NEWS_CATEGORIES.find((c) => c.label === cat)?.color ?? "bg-brand";

export const NEWS_AREAS: NewsArea[] = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "সিলেট",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
];

const NEWS_AREA_MAP: Record<string, NewsArea> = {
  n1: "ঢাকা",
  n2: "চট্টগ্রাম",
  n3: "ঢাকা",
  n4: "ঢাকা",
  n5: "ঢাকা",
  n6: "সিলেট",
  n7: "রাজশাহী",
  n8: "খুলনা",
  n9: "ঢাকা",
  n10: "চট্টগ্রাম",
  n11: "বরিশাল",
  n12: "রংপুর",
  n13: "খুলনা",
  n14: "চট্টগ্রাম",
  n15: "ময়মনসিংহ",
  n16: "রাজশাহী",
  n17: "ঢাকা",
  n18: "চট্টগ্রাম",
  n19: "সিলেট",
  n20: "রংপুর",
  n21: "ঢাকা",
  n22: "ঢাকা",
  n23: "খুলনা",
  n24: "বরিশাল",
  n25: "রাজশাহী",
  n26: "ঢাকা",
  n27: "চট্টগ্রাম",
  n28: "সিলেট",
  n29: "রংপুর",
  n30: "ময়মনসিংহ",
  n31: "ঢাকা",
  n32: "ঢাকা",
  n33: "চট্টগ্রাম",
  n34: "রাজশাহী",
  n35: "ঢাকা",
  n36: "ঢাকা",
  n37: "চট্টগ্রাম",
  n38: "সিলেট",
  n39: "খুলনা",
  n40: "ঢাকা",
  n41: "ঢাকা",
  n42: "চট্টগ্রাম",
  n43: "ঢাকা",
  n44: "চট্টগ্রাম",
  n45: "সিলেট",
  n46: "রাজশাহী",
  n47: "খুলনা",
  n48: "ঢাকা",
  n49: "চট্টগ্রাম",
  n50: "সিলেট",
  n51: "রাজশাহী",
  n52: "খুলনা",
  n53: "ঢাকা",
  n54: "ঢাকা",
  n55: "চট্টগ্রাম",
  n56: "সিলেট",
};

export const NEWS: NewsItem[] = [
  // ═══════════════════════════════════════════
  // Featured (Hero) — 4 items
  // ═══════════════════════════════════════════
  {
    id: "n1",
    title: "পদ্মা সেতুর রেল সংযোগ চালু, ঢাকা থেকে যশোর পর্যন্ত ট্রেনে যাতায়াত শুরু",
    excerpt: "দীর্ঘ প্রতীক্ষার পর অবশেষে পদ্মা সেতুর ওপর দিয়ে রেল সংযোগ আনুষ্ঠানিকভাবে চালু হলো। এখন থেকে যাত্রীরা সরাসরি ট্রেনে ঢাকা থেকে যশোর যেতে পারবেন।",
    body: [
      "দীর্ঘ প্রতীক্ষার পর পদ্মা সেতুর রেল সংযোগ আনুষ্ঠানিকভাবে যাত্রীসেবায় যুক্ত হয়েছে। উদ্বোধনের দিন থেকেই ঢাকা–যশোর রুটে আন্তঃনগর ট্রেন চলাচল শুরু হওয়ায় দক্ষিণ-পশ্চিমাঞ্চলের মানুষের যাতায়াতে নতুন গতি এসেছে।",
      "রেলওয়ে সূত্র জানায়, নতুন এই রুটে চলাচলকারী ট্রেনের সময়সূচি শুরুতে সীমিত রাখা হলেও ধাপে ধাপে ট্রিপ সংখ্যা বাড়ানো হবে। যাত্রীচাপ বিবেচনায় ভোর, দুপুর ও রাত—এই তিন সময়ে অতিরিক্ত সার্ভিস যোগ করার পরিকল্পনাও রয়েছে।",
      "বিশ্লেষকদের মতে, এই রেল সংযোগ শুধু যাতায়াত সহজ করবে না; বরং কৃষিপণ্য, ক্ষুদ্র শিল্পপণ্য ও রপ্তানিমুখী পণ্যের পরিবহন ব্যয় কমিয়ে আঞ্চলিক অর্থনীতিতে ইতিবাচক প্রভাব ফেলবে।"
    ],
    category: "জাতীয়",
    author: "আবদুল্লাহ আল মামুন",
    publishedAt: hoursAgo(1),
    image: img("barta-padma-bridge"),
    readTime: 4,
    views: 18420,
    featured: true,
    trending: true,
  },
  {
    id: "n2",
    title: "টি-২০ বিশ্বকাপ: বাংলাদেশের জয়রথ অব্যাহত, শ্রীলঙ্কাকে হারাল ৬ উইকেটে",
    excerpt: "শ্রীলঙ্কার বিরুদ্ধে রোমাঞ্চকর ম্যাচে বাংলাদেশ দল জয়লাভ করেছে। অধিনায়কের অপরাজিত সেঞ্চুরিতে দল সিরিজে এগিয়ে গেল।",
    body: [
      "টি-২০ বিশ্বকাপের গুরুত্বপূর্ণ ম্যাচে শ্রীলঙ্কাকে ৬ উইকেটে হারিয়ে আত্মবিশ্বাসী জয় তুলে নিয়েছে বাংলাদেশ।",
      "পাওয়ারপ্লেতে দুটি উইকেট হারানোর পর ইনিংস স্থির করেন অধিনায়ক ও মিডল-অর্ডারের এক ব্যাটার। ডেথ ওভারে বাউন্ডারির ধারাবাহিকতায় রানরেট নিয়ন্ত্রণে আসে।",
      "ম্যাচ-পরবর্তী সংবাদ সম্মেলনে অধিনায়ক বলেন, পরিকল্পনা অনুযায়ী বোলিং ইউনিট কাজ করেছে বলেই রান চেজ সহজ হয়েছে।"
    ],
    category: "খেলা",
    author: "রফিকুল ইসলাম",
    publishedAt: hoursAgo(2),
    image: img("barta-cricket-win"),
    readTime: 3,
    views: 24310,
    featured: true,
    trending: true,
  },
  {
    id: "n3",
    title: "কৃত্রিম বুদ্ধিমত্তায় বিপ্লব: বাংলাদেশি স্টার্টআপের নতুন ভাষা মডেল উন্মোচন",
    excerpt: "দেশীয় এক প্রযুক্তি প্রতিষ্ঠান বাংলা ভাষায় কাজ করতে সক্ষম উন্নত কৃত্রিম বুদ্ধিমত্তা মডেল উন্মোচন করেছে।",
    body: [
      "বাংলা ভাষাভিত্তিক কৃত্রিম বুদ্ধিমত্তা গবেষণায় নতুন মাইলফলক স্থাপন করেছে দেশের একটি স্টার্টআপ।",
      "প্রতিষ্ঠানটির দাবি, পরীক্ষামূলক পর্যায়ে মডেলটি শিক্ষা-সহায়ক কনটেন্ট তৈরি, প্রাথমিক স্বাস্থ্যপরামর্শ এবং সরকারি তথ্যসেবায় সন্তোষজনক ফল দিয়েছে।",
      "প্রযুক্তি বিশেষজ্ঞদের মতে, দেশীয় ভাষা ও প্রেক্ষাপটে প্রশিক্ষিত মডেল স্থানীয় উদ্ভাবনকে এগিয়ে নিতে পারে।"
    ],
    category: "প্রযুক্তি",
    author: "সাবরিনা হক",
    publishedAt: hoursAgo(3),
    image: img("barta-ai-startup"),
    readTime: 5,
    views: 9870,
    featured: true,
  },
  {
    id: "n4",
    title: "জাতীয় বাজেট ২০২৫-২৬: স্বাস্থ্য ও শিক্ষাখাতে বরাদ্দ বৃদ্ধি",
    excerpt: "চলতি অর্থবছরের বাজেটে স্বাস্থ্য ও শিক্ষাখাতে বরাদ্দ উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে।",
    body: [
      "জাতীয় বাজেট ২০২৫-২৬ এ স্বাস্থ্য ও শিক্ষাখাতে বরাদ্দ বৃদ্ধিকে সরকারের সামাজিক বিনিয়োগ কৌশলের অংশ হিসেবে দেখানো হয়েছে।",
      "শিক্ষাখাতে নতুন বরাদ্দের একটি বড় অংশ ব্যয় হবে কারিগরি ও প্রযুক্তিভিত্তিক শিক্ষায়।",
      "অর্থনীতিবিদরা বলছেন, বরাদ্দ বাড়ানো ইতিবাচক হলেও বাস্তবায়ন দক্ষতা নিশ্চিত না হলে প্রত্যাশিত সুফল পুরোপুরি পাওয়া যাবে না।"
    ],
    category: "অর্থনীতি",
    author: "মাহফুজা আক্তার",
    publishedAt: hoursAgo(5),
    image: img("barta-budget-2025"),
    readTime: 6,
    views: 7340,
    featured: true,
  },

  // ═══════════════════════════════════════════
  // জাতীয় (National) — 7 items total
  // ═══════════════════════════════════════════
  {
    id: "n5",
    title: "শহরে আজ থেকেই শুরু হচ্ছে মেট্রোরেলের নতুন রুট, ভাড়া কমানো হলো",
    excerpt: "নতুন রুট চালুর ফলে যাত্রীদের যাতায়াতের সময় ও খরচ দুটোই কমবে বলে জানানো হয়েছে।",
    category: "জাতীয়",
    author: "তানভীর হাসান",
    publishedAt: minsAgo(25),
    image: img("barta-metro-rail"),
    readTime: 3,
    views: 5120,
    trending: true,
  },
  {
    id: "n16",
    title: "নদী দখল অব্যাহত, পরিবেশবাদীদের উদ্বেগ বাড়ছে",
    excerpt: "নদী দখল ও দূষণ রোধে কার্যকর ব্যবস্থা নেওয়ার দাবি পরিবেশবাদীদের।",
    category: "জাতীয়",
    author: "হাসনাত আলম",
    publishedAt: hoursAgo(16),
    image: img("barta-river-pollution"),
    readTime: 3,
    views: 2840,
  },
  {
    id: "n17",
    title: "সারাদেশে অভিযান: ভেজাল খাদ্যপণ্য তৈরির কারখানায় অভিযান, ১২টি মামলা",
    excerpt: "র্যাব ও ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর যৌথভাবে সারাদেশে ভেজাল খাদ্যপণ্য তৈরির কারখানায় অভিযান চালিয়েছে।",
    category: "জাতীয়",
    author: "আবদুল্লাহ আল মামুন",
    publishedAt: hoursAgo(6),
    image: img("barta-food-safety"),
    readTime: 3,
    views: 6540,
    trending: true,
  },
  {
    id: "n18",
    title: "কর্ণফুলী নদীতে নতুন সেতু নির্মাণের কাজ শুরু, যাতায়াতে সুবিধা বাড়বে",
    excerpt: "চট্টগ্রামের কর্ণফুলী নদীতে নতুন সেতু নির্মাণ প্রকল্পের কাজ আনুষ্ঠানিকভাবে শুরু হয়েছে।",
    category: "জাতীয়",
    author: "নুসরাত জাহান",
    publishedAt: hoursAgo(10),
    image: img("barta-karnaphuli-bridge"),
    readTime: 4,
    views: 4320,
  },
  {
    id: "n19",
    title: "সিলেটে ভূমিকম্পের ঝুঁকি মূল্যায়ন: ভূতাত্ত্বিক জরিপ চলছে",
    excerpt: "সিলেট অঞ্চলে ভূমিকম্পের ঝুঁকি মূল্যায়নে বাংলাদেশ ভূতাত্ত্বিক জরিপ অধিদপ্তর নতুন জরিপ শুরু করেছে।",
    category: "জাতীয়",
    author: "রিয়াদ মাহমুদ",
    publishedAt: hoursAgo(18),
    image: img("barta-earthquake-survey"),
    readTime: 5,
    views: 3210,
  },
  {
    id: "n20",
    title: "রংপুরে শীতকালীন কৃষি পণ্যের বাম্পার ফলন, কৃষকরা খুশি",
    excerpt: "এবার রংপুর অঞ্চলে শীতকালীন সবজি ও ফসলের উৎপাদন লক্ষ্যমাত্রার চেয়ে বেশি হয়েছে।",
    category: "জাতীয়",
    author: "হাসনাত আলম",
    publishedAt: hoursAgo(22),
    image: img("barta-rangpur-harvest"),
    readTime: 3,
    views: 2780,
  },

  // ═══════════════════════════════════════════
  // আন্তর্জাতিক (International) — 6 items
  // ═══════════════════════════════════════════
  {
    id: "n6",
    title: "জলবায়ু সম্মেলনে বাংলাদেশের নেতৃত্বের প্রশংসা বিশ্ব নেতাদের",
    excerpt: "জলবায়ু পরিবর্তনের ঝুঁকি মোকাবিলায় বাংলাদেশের ভূমিকা গুরুত্বপূর্ণ বলে মনে করছেন বিশ্ব নেতারা।",
    category: "আন্তর্জাতিক",
    author: "নুসরাত জাহান",
    publishedAt: minsAgo(48),
    image: img("barta-climate-summit"),
    readTime: 4,
    views: 3210,
  },
  {
    id: "n21",
    title: "জাতিসংঘে ফিলিস্তিন ইস্যুতে নতুন প্রস্তাব পাস, যুদ্ধবিরতির আহ্বান",
    excerpt: "জাতিসংঘ নিরাপত্তা পরিষদে ফিলিস্তিন ইস্যুতে একটি নতুন প্রস্তাব পাস হয়েছে যা তাৎক্ষণিক যুদ্ধবিরতির আহ্বান জানায়।",
    category: "আন্তর্জাতিক",
    author: "নুসরাত জাহান",
    publishedAt: hoursAgo(4),
    image: img("barta-un-palestine"),
    readTime: 5,
    views: 5670,
    trending: true,
  },
  {
    id: "n22",
    title: "যুক্তরাষ্ট্রে নতুন প্রেসিডেন্টের শপথগ্রহণ: বিশ্ব রাজনীতিতে কী পরিবর্তন আসবে",
    excerpt: "যুক্তরাষ্ট্রের নবনির্বাচিত প্রেসিডেন্ট আনুষ্ঠানিকভাবে শপথ গ্রহণ করেছেন। বিশ্লেষকরা নতুন পররাষ্ট্রনীতির দিকে নজর রাখছেন।",
    category: "আন্তর্জাতিক",
    author: "মাহফুজা আক্তার",
    publishedAt: hoursAgo(8),
    image: img("barta-us-president"),
    readTime: 6,
    views: 8920,
  },
  {
    id: "n23",
    title: "সৌদি আরবে নতুন অর্থনৈতিক অঞ্চল ঘোষণা, বিনিয়োগের সুযোগ",
    excerpt: "সৌদি আরব ভিশন ২০৩০-এর আওতায় চারটি নতুন অর্থনৈতিক বিশেষ অঞ্চল ঘোষণা করেছে।",
    category: "আন্তর্জাতিক",
    author: "আবদুল করিম",
    publishedAt: hoursAgo(14),
    image: img("barta-saudi-economy"),
    readTime: 4,
    views: 3450,
  },
  {
    id: "n24",
    title: "চীনের মহাকাশ স্টেশনে নতুন ক্রু, চন্দ্র অভিযানের প্রস্তুতি",
    excerpt: "চীন তার মহাকাশ স্টেশনে নতুন ক্রু পাঠিয়েছে এবং আগামী বছরের চন্দ্র অভিযানের প্রস্তুতি শুরু করেছে।",
    category: "আন্তর্জাতিক",
    author: "সাবরিনা হক",
    publishedAt: hoursAgo(20),
    image: img("barta-china-space"),
    readTime: 4,
    views: 4870,
  },
  {
    id: "n25",
    title: "ইউরোপে শরণার্থী সংকট তীব্র: নতুন অভিবাসন নীতি নিয়ে বিতর্ক",
    excerpt: "ইউরোপীয় ইউনিয়নে শরণার্থী ও অভিবাসীদের নিয়ে নতুন নীতিমালা নিয়ে সদস্য দেশগুলোর মধ্যে তীব্র বিতর্ক চলছে।",
    category: "আন্তর্জাতিক",
    author: "রফিকুল ইসলাম",
    publishedAt: hoursAgo(26),
    image: img("barta-europe-refugee"),
    readTime: 5,
    views: 4120,
  },

  // ═══════════════════════════════════════════
  // রাজনীতি (Politics) — 6 items
  // ═══════════════════════════════════════════
  {
    id: "n7",
    title: "স্থানীয় নির্বাচন: ভোটার তালিকা হালনাগাদের কাজ শুরু",
    excerpt: "আগামী স্থানীয় নির্বাচনের প্রস্তুতিতে ভোটার তালিকা হালনাগাদের কাজ শুরু করেছে নির্বাচন কমিশন।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(1),
    image: img("barta-voter-list"),
    readTime: 3,
    views: 4180,
  },
  {
    id: "n26",
    title: "সংসদে নতুন বিল উত্থাপন: ডিজিটাল নিরাপত্তা আইন সংশোধনের প্রস্তাব",
    excerpt: "সংসদে ডিজিটাল নিরাপত্তা আইন সংশোধনের একটি বিল উত্থাপন করা হয়েছে। বিরোধী দল এর কয়েকটি ধারা নিয়ে আপত্তি জানিয়েছে।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(5),
    image: img("barta-parliament-bill"),
    readTime: 5,
    views: 7650,
    trending: true,
  },
  {
    id: "n27",
    title: "দলীয় সম্মেলন: নতুন কমিটি গঠনের ঘোষণা আসছে আগামী মাসে",
    excerpt: "একটি প্রধান রাজনৈতিক দলের কাউন্সিল সম্মেলন আগামী মাসে অনুষ্ঠিত হবে বলে দলীয় সূত্র জানিয়েছে।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(9),
    image: img("barta-party-council"),
    readTime: 4,
    views: 5430,
  },
  {
    id: "n28",
    title: "সিটি কর্পোরেশন নির্বাচনে নতুন মেয়রদের শপথগ্রহণ",
    excerpt: "সম্প্রতি অনুষ্ঠিত সিটি কর্পোরেশন নির্বাচনে বিজয়ী মেয়ররা আনুষ্ঠানিকভাবে শপথগ্রহণ করেছেন।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(15),
    image: img("barta-mayor-oath"),
    readTime: 3,
    views: 3870,
  },
  {
    id: "n29",
    title: "পৌরসভা নির্বাচনে তরুণ প্রার্থীদের ব্যাপক সাড়া, নতুন রাজনীতির সূচনা?",
    excerpt: "পৌরসভা নির্বাচনে তরুণ প্রার্থীদের অংশগ্রহণ বেশি হওয়ায় রাজনৈতিক মহলে আলোচনা শুরু হয়েছে।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(19),
    image: img("barta-youth-candidates"),
    readTime: 4,
    views: 4210,
  },
  {
    id: "n30",
    title: "জাতীয় সংলাপ: সরকার ও বিরোধী দলের মধ্যে আলোচনা শুরু",
    excerpt: "জাতীয় স্বার্থে সরকার ও বিরোধী দলের মধ্যে একটি সংলাপ প্রক্রিয়া শুরু হয়েছে বলে নির্ভরযোগ্য সূত্র জানিয়েছে।",
    category: "রাজনীতি",
    author: "কামরুল হক",
    publishedAt: hoursAgo(24),
    image: img("barta-national-dialogue"),
    readTime: 4,
    views: 3560,
  },

  // ═══════════════════════════════════════════
  // খেলা (Sports) — 7 items total
  // ═══════════════════════════════════════════
  {
    id: "n8",
    title: "ঢাকা প্রিমিয়ার লিগে রোমাঞ্চকর জয় এক ক্লাবের, শেষ ওভারে নাটক",
    excerpt: "শেষ ওভারের শেষ বলে ছক্কা হাঁকিয়ে ম্যাচ জিতে নিল দল। দর্শকেরা পেয়েছেন রোমাঞ্চকর ম্যাচ।",
    category: "খেলা",
    author: "ইমরান খান",
    publishedAt: hoursAgo(2),
    image: img("barta-dpl-cricket"),
    readTime: 2,
    views: 8740,
    trending: true,
  },
  {
    id: "n14",
    title: "বিশ্বকাপ ফুটবল বাছাই: আজ রাতে বড় ম্যাচ, কাদের দেখছেন দর্শক",
    excerpt: "বিশ্বকাপ বাছাইপর্বের গুরুত্বপূর্ণ ম্যাচ আজ রাতে, ফুটবলপ্রেমীদের অপেক্ষার পালা শেষ।",
    category: "খেলা",
    author: "জাকির হোসেন",
    publishedAt: hoursAgo(12),
    image: img("barta-worldcup-qualifier"),
    readTime: 2,
    views: 11230,
    trending: true,
  },
  {
    id: "n31",
    title: "বাংলাদেশ ফুটবল দলের নতুন কোচ নিয়োগ, দায়িত্ব নিচ্ছেন দক্ষিণ আমেরিকান গতিশীল",
    excerpt: "বাংলাদেশ ফুটবল ফেডারেশন দলের নতুন প্রধান কোচ হিসেবে একজন দক্ষিণ আমেরিকান কোচকে নিয়োগ দিয়েছে।",
    category: "খেলা",
    author: "ইমরান খান",
    publishedAt: hoursAgo(7),
    image: img("barta-football-coach"),
    readTime: 3,
    views: 6340,
  },
  {
    id: "n32",
    title: "অলিম্পিক প্রস্তুতি: বাংলাদেশের সাঁতারু নতুন জাতীয় রেকর্ড গড়লেন",
    excerpt: "আসন্ন অলিম্পিকের প্রস্তুতি চলাকালীন একজন বাংলাদেশি সাঁতারু জাতীয় রেকর্ড ভেঙেছেন।",
    category: "খেলা",
    author: "জাকির হোসেন",
    publishedAt: hoursAgo(13),
    image: img("barta-swimming-record"),
    readTime: 3,
    views: 4560,
  },
  {
    id: "n33",
    title: "ক্রিকেটে বাংলাদেশের নতুন ফাস্ট বোলারের আন্তর্জাতিক অভিষেক",
    excerpt: "বাংলাদেশ দলের নতুন ফাস্ট বোলার আসন্ন সিরিজে আন্তর্জাতিক অভিষেক করতে যাচ্ছেন।",
    category: "খেলা",
    author: "রফিকুল ইসলাম",
    publishedAt: hoursAgo(17),
    image: img("barta-new-bowler"),
    readTime: 3,
    views: 5780,
  },
  {
    id: "n34",
    title: "হকি বিশ্বকাপ বাছাই: বাংলাদেশ দলের জয়, সেমিফাইনালের আশা",
    excerpt: "হকি বিশ্বকাপ বাছাইপর্বে গুরুত্বপূর্ণ জয় পেয়েছে বাংলাদেশ দল। সেমিফাইনালে ওঠার সম্ভাবনা বেড়েছে।",
    category: "খেলা",
    author: "ইমরান খান",
    publishedAt: hoursAgo(21),
    image: img("barta-hockey-win"),
    readTime: 2,
    views: 3210,
  },

  // ═══════════════════════════════════════════
  // বিনোদন (Entertainment) — 6 items
  // ═══════════════════════════════════════════
  {
    id: "n9",
    title: "নতুন চলচ্চিত্রের ট্রেইলার মুক্তি পেয়েই ভাইরাল, দর্শকদের প্রশংসা",
    excerpt: "জনপ্রিয় এক পরিচালকের নতুন চলচ্চিত্রের ট্রেইলার মুক্তির কয়েক ঘণ্টায় মিলিয়ন ভিউ পেয়েছে।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(4),
    image: img("barta-film-trailer"),
    readTime: 2,
    views: 6520,
  },
  {
    id: "n35",
    title: "জনপ্রিয় ব্যান্ড চলচ্চিত্রের সঙ্গীত পরিচালক হিসেবে আত্মপ্রকাশ",
    excerpt: "দেশের একটি জনপ্রিয় ব্যান্ডের প্রধান গায়ক প্রথমবারের মতো চলচ্চিত্রের সঙ্গীত পরিচালনা করছেন।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(6),
    image: img("barta-band-music-director"),
    readTime: 3,
    views: 7890,
    trending: true,
  },
  {
    id: "n36",
    title: "ঢাকা আন্তর্জাতিক চলচ্চিত্র উৎসবের তারিখ ঘোষণা, রেকর্ড সংখ্যক দেশ অংশ নেবে",
    excerpt: "আসন্ন ঢাকা আন্তর্জাতিক চলচ্চিত্র উৎসবে ৫০টিরও বেশি দেশের চলচ্চিত্র প্রদর্শিত হবে।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(11),
    image: img("barta-film-festival"),
    readTime: 3,
    views: 5340,
  },
  {
    id: "n37",
    title: "ওটিটি প্ল্যাটফর্মে বাংলা ওয়েব সিরিজের বুম, দর্শক সংখ্যায় নতুন রেকর্ড",
    excerpt: "দেশীয় ওটিটি প্ল্যাটফর্মগুলোতে বাংলা ওয়েব সিরিজের দর্শক সংখ্যা বিগত বছরের তুলনায় দ্বিগুণ হয়েছে।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(15),
    image: img("barta-ott-boom"),
    readTime: 3,
    views: 6120,
  },
  {
    id: "n38",
    title: "জনপ্রিয় অভিনেত্রীর আন্তর্জাতিক চলচ্চিত্রে অভিনয়ের ঘোষণা",
    excerpt: "বাংলাদেশের একজন জনপ্রিয় অভিনেত্রী হলিউডের একটি প্রজেক্টে অভিনয় করতে যাচ্ছেন বলে জানা গেছে।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(20),
    image: img("barta-actress-hollywood"),
    readTime: 2,
    views: 9340,
    trending: true,
  },
  {
    id: "n39",
    title: "নতুন নাটক নিয়ে আলোচনায় পরিচালক, সামাজিক বার্তায় গুরুত্ব",
    excerpt: "তরুণ একজন নাট্য পরিচালকের নতুন নাটকটি সামাজিক সচেতনতামূলক বিষয় নিয়ে নির্মিত হয়েছে।",
    category: "বিনোদন",
    author: "শারমিন আক্তার",
    publishedAt: hoursAgo(28),
    image: img("barta-new-drama"),
    readTime: 3,
    views: 2870,
  },

  // ═══════════════════════════════════════════
  // প্রযুক্তি (Technology) — 6 items total
  // ═══════════════════════════════════════════
  {
    id: "n10",
    title: "স্মার্টফোনে আসছে নতুন ফোল্ডেবল ডিসপ্লে, দাম কমানোর প্রতিশ্রুতি",
    excerpt: "প্রযুক্তি প্রতিষ্ঠানটি আরও সাশ্রয়ী ফোল্ডেবল স্মার্টফোন বাজারে আনতে যাচ্ছে আগামী মাসে।",
    category: "প্রযুক্তি",
    author: "ফাহিম রহমান",
    publishedAt: hoursAgo(6),
    image: img("barta-foldable-phone"),
    readTime: 3,
    views: 4290,
  },
  {
    id: "n15",
    title: "নতুন গ্যালাক্সি আবিষ্কার করলেন বাংলাদেশি বিজ্ঞানীর নেতৃত্বে দল",
    excerpt: "মহাকাশ গবেষণায় বাংলাদেশি বিজ্ঞানীর নেতৃত্বে আন্তর্জাতিক দল নতুন গ্যালাক্সি আবিষ্কার করেছে।",
    category: "প্রযুক্তি",
    author: "রিয়াদ মাহমুদ",
    publishedAt: hoursAgo(14),
    image: img("barta-galaxy-discovery"),
    readTime: 4,
    views: 6740,
  },
  {
    id: "n40",
    title: "বাংলাদেশে ৫জি নেটওয়ার্কের পরীক্ষামূলক চালু: কোন শহরে পাওয়া যাবে",
    excerpt: "টেলিকম অপারেটররা দেশের প্রধান শহরগুলোতে ৫জি নেটওয়ার্কের পরীক্ষামূলক সেবা চালু করেছে।",
    category: "প্রযুক্তি",
    author: "ফাহিম রহমান",
    publishedAt: hoursAgo(8),
    image: img("barta-5g-launch"),
    readTime: 4,
    views: 8760,
    trending: true,
  },
  {
    id: "n41",
    title: "সাইবার নিরাপত্তায় নতুন সতর্কতা: ব্যাংকিং লেনদেনে বায়োমেট্রিক যাচাই বাধ্যতামূলক",
    excerpt: "বাংলাদেশ ব্যাংক ব্যাংকিং লেনদেনে বায়োমেট্রিক যাচাই বাধ্যতামূলক করার নতুন নির্দেশনা জারি করেছে।",
    category: "প্রযুক্তি",
    author: "সাবরিনা হক",
    publishedAt: hoursAgo(18),
    image: img("barta-cyber-security"),
    readTime: 4,
    views: 5430,
  },
  {
    id: "n42",
    title: "দেশীয় ই-কমার্স প্ল্যাটফর্মের বার্ষিক বিক্রয়ে রেকর্ড, গ্রাহক সংখ্যা বেড়েছে",
    excerpt: "চলতি বছর দেশের প্রধান ই-কমার্স প্ল্যাটফর্মগুলোর বার্ষিক বিক্রয়ে বিগত বছরের তুলনায় ৪০ শতাংশ প্রবৃদ্ধি হয়েছে।",
    category: "প্রযুক্তি",
    author: "ফাহিম রহমান",
    publishedAt: hoursAgo(23),
    image: img("barta-ecommerce-growth"),
    readTime: 3,
    views: 4670,
  },

  // ═══════════════════════════════════════════
  // স্বাস্থ্য (Health) — 6 items
  // ═══════════════════════════════════════════
  {
    id: "n11",
    title: "ডেঙ্গু প্রতিরোধে নতুন নির্দেশনা, বাড়ির ছাদে পানি জমতে দেওয়া যাবে না",
    excerpt: "ডেঙ্গু রোগের প্রকোপ কমাতে স্বাস্থ্য অধিদপ্তর নতুন নির্দেশনা জারি করেছে।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(7),
    image: img("barta-dengue-health"),
    readTime: 4,
    views: 5870,
  },
  {
    id: "n43",
    title: "নতুন ভ্যাকসিন উৎপাদনে বাংলাদেশের সক্ষমতা বাড়ছে, আশা গবেষকদের",
    excerpt: "বাংলাদেশের ওষুধ প্রস্তুতকারক প্রতিষ্ঠানগুলো নতুন ভ্যাকসিন উৎপাদনে সক্ষমতা অর্জন করছে বলে গবেষকরা জানিয়েছেন।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(3),
    image: img("barta-vaccine-production"),
    readTime: 5,
    views: 7230,
    trending: true,
  },
  {
    id: "n44",
    title: "মানসিক স্বাস্থ্যসেবায় নতুন উদ্যোগ: টেলিমেডিসিনে বিনামূল্যে পরামর্শ",
    excerpt: "সরকার মানসিক স্বাস্থ্যসেবার প্রসারে টেলিমেডিসিনের মাধ্যমে বিনামূল্যে পরামর্শ সেবা চালু করেছে।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(10),
    image: img("barta-mental-health"),
    readTime: 4,
    views: 4560,
  },
  {
    id: "n45",
    title: "দেশে ডায়াবেটিস রোগীর সংখ্যা বাড়ছে: বিশেষজ্ঞদের সতর্কতা",
    excerpt: "সাম্প্রতিক এক জরিপে দেখা গেছে দেশে ডায়াবেটিস রোগীর সংখ্যা আশঙ্কাজনক হারে বাড়ছে।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(16),
    image: img("barta-diabetes-alert"),
    readTime: 4,
    views: 6340,
  },
  {
    id: "n46",
    title: "চোখের চিকিৎসায় নতুন প্রযুক্তি: লেজার সার্জারিতে সাফল্য",
    excerpt: "দেশের একটি বিশেষায়িত হাসপাতালে অত্যাধুনিক লেজার প্রযুক্তিতে চোখের সফল সার্জারি সম্পন্ন হয়েছে।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(21),
    image: img("barta-eye-surgery"),
    readTime: 3,
    views: 3780,
  },
  {
    id: "n47",
    title: "স্বাস্থ্যবিমা প্রকল্পে নতুন অন্তর্ভুক্তি: গরিব রোগীদের সুবিধা বাড়বে",
    excerpt: "সরকারের স্বাস্থ্যবিমা প্রকল্পে নতুন করে আরও ১০ লাখ পরিবারকে অন্তর্ভুক্ত করা হয়েছে।",
    category: "স্বাস্থ্য",
    author: "ডা. সালমা রহমান",
    publishedAt: hoursAgo(27),
    image: img("barta-health-insurance"),
    readTime: 3,
    views: 2980,
  },

  // ═══════════════════════════════════════════
  // লাইফস্টাইল (Lifestyle) — 6 items
  // ═══════════════════════════════════════════
  {
    id: "n12",
    title: "শীতের সকালে গ্রামের রূপ আজ অন্যরকম, কুয়াশায় ঢাকা প্রকৃতি",
    excerpt: "উত্তরবঙ্গের বিস্তীর্ণ এলাকা জুড়ে নেমেছে ঘন কুয়াশা, দৃশ্যপট হয়ে উঠেছে ছবির মতো।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(9),
    image: img("barta-winter-village"),
    readTime: 2,
    views: 3920,
  },
  {
    id: "n48",
    title: "ঢাকায় নতুন থ্রিলার ক্যাফে: অভিনব থিমে তরুণদের ভিড়",
    excerpt: "রাজধানীতে সম্প্রতি উদ্বোধন হওয়া একটি থ্রিলার থিমের ক্যাফে তরুণদের মধ্যে ব্যাপক জনপ্রিয় হয়ে উঠেছে।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(5),
    image: img("barta-thriller-cafe"),
    readTime: 3,
    views: 5670,
    trending: true,
  },
  {
    id: "n49",
    title: "চট্টগ্রামের ঐতিহ্যবাহী খাবার এখন বিশ্বমানের রেস্তোরাঁয়",
    excerpt: "চট্টগ্রামের ঐতিহ্যবাহী খাবারগুলো এখন শহরের অভিজাত রেস্তোরাঁগুলোতে আধুনিক উপস্থাপনায় পরিবেশিত হচ্ছে।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(12),
    image: img("barta-ctg-food"),
    readTime: 3,
    views: 4890,
  },
  {
    id: "n50",
    title: "সিলেটের চা বাগানে ইকো-ট্যুরিজম: পর্যটকদের নতুন গন্তব্য",
    excerpt: "সিলেটের চা বাগানগুলোতে ইকো-ট্যুরিজম সুবিধা চালু হওয়ায় দেশীয় ও বিদেশি পর্যটকদের আগমন বেড়েছে।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(17),
    image: img("barta-sylhet-tea-tourism"),
    readTime: 4,
    views: 6230,
  },
  {
    id: "n51",
    title: "বাংলাদেশের হাতের তৈরি জামদানি শাড়ি এখন আন্তর্জাতিক ফ্যাশন শোতে",
    excerpt: "বাংলাদেশের ঐতিহ্যবাহী হাতের তৈরি জামদানি শাড়ি আন্তর্জাতিক ফ্যাশন শোতে প্রশংসিত হয়েছে।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(22),
    image: img("barta-jamdani-saree"),
    readTime: 3,
    views: 5340,
  },
  {
    id: "n52",
    title: "রমজানে ইফতার প্রস্তুতি: পুষ্টিকর ও স্বাস্থ্যকর ইফতারের রেসিপি",
    excerpt: "রমজান মাসে স্বাস্থ্যকর ইফতার সাজাতে পুষ্টিবিদদের পরামর্শ নিয়ে প্রস্তুত করা হয়েছে এই রেসিপি সিরিজ।",
    category: "লাইফস্টাইল",
    author: "মুনতাহা বিনতে",
    publishedAt: hoursAgo(30),
    image: img("barta-iftar-recipe"),
    readTime: 3,
    views: 4120,
  },

  // ═══════════════════════════════════════════
  // অর্থনীতি (Economy) — 6 items total
  // ═══════════════════════════════════════════
  {
    id: "n13",
    title: "রপ্তানি আয় বেড়েছে গত মাসে, তৈরি পোশাক খাতে ইতিবাচক প্রবৃদ্ধি",
    excerpt: "গত মাসে দেশের রপ্তানি আয় লক্ষ্যমাত্রার চেয়ে বেশি হয়েছে বলে জানিয়েছে রপ্তানি উন্নয়ন ব্যুরো।",
    category: "অর্থনীতি",
    author: "আবদুল করিম",
    publishedAt: hoursAgo(11),
    image: img("barta-garment-export"),
    readTime: 5,
    views: 4610,
  },
  {
    id: "n53",
    title: "শেয়ার বাজারে বিনিয়োগকারীদের আস্থা ফিরছে, সূচক ঊর্ধ্বমুখী",
    excerpt: "গত কয়েক সপ্তাহে দেশের শেয়ার বাজারে ধারাবাহিক উত্থান দেখা গেছে। বিশ্লেষকরা একে ইতিবাচক সংকেত বলছেন।",
    category: "অর্থনীতি",
    author: "আবদুল করিম",
    publishedAt: hoursAgo(4),
    image: img("barta-stock-market"),
    readTime: 4,
    views: 7340,
    trending: true,
  },
  {
    id: "n54",
    title: "রিজার্ভ বৃদ্ধি পেয়েছে: কেন্দ্রীয় ব্যাংকের নতুন পরিসংখ্যান",
    excerpt: "বাংলাদেশ ব্যাংকের সাম্প্রতিক তথ্য অনুযায়ী দেশের বৈদেশিক মুদ্রার রিজার্ভ বৃদ্ধি পেয়েছে।",
    category: "অর্থনীতি",
    author: "মাহফুজা আক্তার",
    publishedAt: hoursAgo(13),
    image: img("barta-reserve-increase"),
    readTime: 4,
    views: 5670,
  },
  {
    id: "n55",
    title: "চট্টগ্রাম বন্দরে পণ্য পরিবহন বৃদ্ধি, নতুন টার্মিনাল চালু",
    excerpt: "চট্টগ্রাম বন্দরে নতুন কন্টেইনার টার্মিনাল চালু হওয়ায় পণ্য পরিবহন ক্ষমতা উল্লেখযোগ্য হারে বেড়েছে।",
    category: "অর্থনীতি",
    author: "আবদুল করিম",
    publishedAt: hoursAgo(19),
    image: img("barta-chittagong-port"),
    readTime: 4,
    views: 4230,
  },
  {
    id: "n56",
    title: "কৃষি ঋণে সুদের হার কমালো কেন্দ্রীয় ব্যাংক, কৃষকদের সুবিধা",
    excerpt: "কৃষি খাতের উন্নয়নে কেন্দ্রীয় ব্যাংক কৃষি ঋণের সুদের হার ১ শতাংশ কমিয়েছে।",
    category: "অর্থনীতি",
    author: "মাহফুজা আক্তার",
    publishedAt: hoursAgo(25),
    image: img("barta-agri-loan"),
    readTime: 3,
    views: 3560,
  },
];

export const BREAKING_NEWS: string[] = [
  "পদ্মা সেতুর রেল সংযোগ আনুষ্ঠানিকভাবে চালু হলো",
  "টি-২০ বিশ্বকাপে বাংলাদেশের জয়, শ্রীলঙ্কাকে হারাল ৬ উইকেটে",
  "জাতীয় বাজেট ২০২৫-২৬ উত্থাপন, স্বাস্থ্যখাতে বরাদ্দ বৃদ্ধি",
  "মেট্রোরেলের নতুন রুট চালু, ভাড়া কমানো হলো",
  "ডেঙ্গু প্রতিরোধে নতুন নির্দেশনা জারি স্বাস্থ্য অধিদপ্তরের",
  "দেশে ৫জি নেটওয়ার্কের পরীক্ষামূলক চালু",
  "শেয়ার বাজারে বিনিয়োগকারীদের আস্থা ফিরছে, সূচক ঊর্ধ্বমুখী",
];

export const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "পদ্মা সেতুতে প্রথম আন্তঃনগর ট্রেন: যাত্রীদের আনন্দের দৃশ্য",
    category: "জাতীয়",
    duration: "৪:৩২",
    thumbnail: img("barta-video-train", 800, 450),
    views: 45200,
    publishedAt: hoursAgo(2),
  },
  {
    id: "v2",
    title: "ম্যাচের হাইলাইটস: শ্রীলঙ্কার বিরুদ্ধে বাংলাদেশের জয়ের মুহূর্ত",
    category: "খেলা",
    duration: "৮:১৫",
    thumbnail: img("barta-video-cricket", 800, 450),
    views: 89100,
    publishedAt: hoursAgo(3),
  },
  {
    id: "v3",
    title: "বাজেট ২০২৫-২৬: সাধারণ মানুষের জন্য কী আছে, বিশ্লেষণ",
    category: "অর্থনীতি",
    duration: "৬:৪৮",
    thumbnail: img("barta-video-budget", 800, 450),
    views: 23400,
    publishedAt: hoursAgo(5),
  },
  {
    id: "v4",
    title: "সিলেটের চা বাগানে ইকো-ট্যুরিজম: ভ্রমণের অসাধারণ অভিজ্ঞতা",
    category: "লাইফস্টাইল",
    duration: "৫:২০",
    thumbnail: img("barta-video-sylhet-tea", 800, 450),
    views: 15600,
    publishedAt: hoursAgo(8),
  },
  {
    id: "v5",
    title: "বাংলাদেশি স্টার্টআপের এআই মডেল: বাংলা ভাষায় নতুন সম্ভাবনা",
    category: "প্রযুক্তি",
    duration: "৭:১০",
    thumbnail: img("barta-video-ai-model", 800, 450),
    views: 31200,
    publishedAt: hoursAgo(10),
  },
];

export const OPINIONS: OpinionItem[] = [
  {
    id: "o1",
    title: "উন্নয়নের পরবর্তী ধাপ: আমাদের চিন্তা করা প্রয়োজন কোথায়",
    author: "ড. মাহবুব আলম",
    role: "অর্থনীতিবিদ",
    excerpt:
      "বাংলাদেশ উন্নয়নের এক গুরুত্বপূর্ণ সন্ধিক্ষণে দাঁড়িয়ে আছে। আগামী দশকে আমাদের অগ্রাধিকার হওয়া উচিত মানুষের দক্ষতা ও উদ্ভাবন।",
    avatar: img("barta-author-1", 200, 200),
    publishedAt: hoursAgo(8),
  },
  {
    id: "o2",
    title: "জলবায়ু পরিবর্তন: আমরা কি প্রস্তুত ভবিষ্যতের জন্য",
    author: "সাবরিনা চৌধুরী",
    role: "পরিবেশ বিশ্লেষক",
    excerpt:
      "জলবায়ু পরিবর্তনের প্রভাব এখন আর ভবিষ্যতের কোনো দূরবর্তী সম্ভাবনা নয়, বরং বর্তমান বাস্তবতা। প্রস্তুতি ও স্থিতিস্থাপকতাই একমাত্র পথ।",
    avatar: img("barta-author-2", 200, 200),
    publishedAt: hoursAgo(18),
  },
  {
    id: "o3",
    title: "প্রযুক্তির যুগে শিক্ষা: নতুন প্রজন্মের জন্য কী দরকার",
    author: "প্রফেসর নাসির উদ্দিন",
    role: "শিক্ষাবিদ",
    excerpt:
      "কৃত্রিম বুদ্ধিমত্তা ও ডিজিটাল প্রযুক্তি শিক্ষার রূপ বদলে দিচ্ছে। আমাদের শিক্ষাব্যবস্থাকেও এই পরিবর্তনের সাথে তাল মিলিয়ে এগোতে হবে।",
    avatar: img("barta-author-3", 200, 200),
    publishedAt: hoursAgo(26),
  },
  {
    id: "o4",
    title: "রাজনীতি ও সুশাসন: প্রত্যাশার গ্যাপ কমাবে কীভাবে",
    author: "ড. আনোয়ারুল কবীর",
    role: "রাজনৈতিক বিশ্লেষক",
    excerpt:
      "সুশাসন প্রতিষ্ঠায় রাজনৈতিক দলগুলোর ভেতরে গণতান্ত্রিক চর্চা ও নেতৃত্বের জবাবদিহিতি নিশ্চিত করা জরুরি।",
    avatar: img("barta-author-4", 200, 200),
    publishedAt: hoursAgo(32),
  },
  {
    id: "o5",
    title: "ক্রীড়াঙ্গনে নতুন সম্ভাবনা: তরুণ ক্রীড়াবিদদের জন্য কী করা দরকার",
    author: "বদরুদ্দোজা চৌধুরী",
    role: "ক্রীড়া সাংবাদিক",
    excerpt:
      "বাংলাদেশের ক্রীড়াবিদরা প্রতিভাবান। কিন্তু সঠিক অবকাঠামো, প্রশিক্ষণ ও সুযোগ না পেলে এই প্রতিভা ব্যর্থ হবে।",
    avatar: img("barta-author-5", 200, 200),
    publishedAt: hoursAgo(40),
  },
];

const slugify = (value: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]+/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || encodeURIComponent(value.trim().toLowerCase());
};

export const getAuthorSlug = (authorName: string) => slugify(authorName);

// Helpers
export const getFeatured = () => NEWS.filter((n) => n.featured);
export const getLatest = (limit?: number) => {
  const sorted = [...NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};
export const getByCategory = (cat: NewsCategory, limit?: number) => {
  const items = NEWS.filter((n) => n.category === cat);
  return limit ? items.slice(0, limit) : items;
};
export const getTrending = (limit = 5) =>
  [...NEWS].sort((a, b) => b.views - a.views).slice(0, limit);

export const getNewsById = (id: string) => NEWS.find((n) => n.id === id);

export const getNewsBody = (id: string): string[] => {
  const item = getNewsById(id);
  if (!item) return [];

  if (item.body?.length) return item.body;

  return [
    `${item.excerpt}`,
    `${item.category} ডেস্ক জানায়, বিষয়টি ঘিরে সংশ্লিষ্ট পক্ষগুলোর মধ্যে আলোচনা অব্যাহত রয়েছে এবং বাস্তবায়নের বিভিন্ন দিক নিয়ে কাজ চলছে। নীতিগত স্বচ্ছতা, সময়মতো সিদ্ধান্ত এবং মাঠপর্যায়ে কার্যকর তদারকি নিশ্চিত করা গেলে এর ইতিবাচক প্রভাব আরও দ্রুত দৃশ্যমান হবে বলে বিশেষজ্ঞরা মনে করছেন।`,
    `সংশ্লিষ্ট সূত্রগুলোর ভাষ্য অনুযায়ী, পরবর্তী ধাপে তথ্য-উপাত্তভিত্তিক মূল্যায়ন, সেবার মানোন্নয়ন এবং জনগণের প্রত্যাশা অনুযায়ী কার্যক্রম জোরদার করা হবে। পরিস্থিতির অগ্রগতি নিয়ে বার্তা নিয়মিত হালনাগাদ প্রতিবেদন প্রকাশ করবে।`,
  ];
};

export const getNewsByAuthor = (authorName: string) =>
  getLatest().filter((item) => item.author === authorName);

export const getAuthors = (): AuthorProfile[] => {
  const names = Array.from(new Set(NEWS.map((item) => item.author)));

  return names.map((name) => {
    const authoredNews = getNewsByAuthor(name);
    const lead = authoredNews[0];
    const slug = getAuthorSlug(name);

    return {
      name,
      slug,
      avatar: img(`author-${slug}`, 320, 320),
      role: lead ? `${lead.category} প্রতিবেদক` : "স্টাফ রিপোর্টার",
      bio: lead
        ? `${name} বার্তা-র ${lead.category} বিভাগের সঙ্গে যুক্ত একজন সাংবাদিক। মাঠপর্যায়ের তথ্য, সূত্র যাচাই এবং বিশ্লেষণধর্মী প্রতিবেদনের মাধ্যমে পাঠকদের জন্য নির্ভরযোগ্য সংবাদ তুলে ধরেন।`
        : `${name} বার্তা-র একজন স্টাফ রিপোর্টার।`,
      articleCount: authoredNews.length,
    };
  });
};

export const getAuthorBySlug = (slug: string): AuthorProfile | undefined =>
  getAuthors().find((author) => author.slug === slug);

export const getNewsByAuthorSlug = (slug: string) => {
  const author = getAuthorBySlug(slug);
  if (!author) return [];
  return getNewsByAuthor(author.name);
};

export const getAreaByNewsId = (id: string): NewsArea =>
  NEWS_AREA_MAP[id] ?? "ঢাকা";

export const getNewsByArea = (area: NewsArea, limit?: number) => {
  const items = getLatest().filter((item) => getAreaByNewsId(item.id) === area);
  return limit ? items.slice(0, limit) : items;
};
