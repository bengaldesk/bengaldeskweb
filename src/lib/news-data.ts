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
};

export const NEWS: NewsItem[] = [
  // ===== Featured (Hero) =====
  {
    id: "n1",
    title:
      "পদ্মা সেতুর রেল সংযোগ চালু, ঢাকা থেকে যশোর পর্যন্ত ট্রেনে যাতায়াত শুরু",
    excerpt:
      "দীর্ঘ প্রতীক্ষার পর অবশেষে পদ্মা সেতুর ওপর দিয়ে রেল সংযোগ আনুষ্ঠানিকভাবে চালু হলো। এখন থেকে যাত্রীরা সরাসরি ট্রেনে ঢাকা থেকে যশোর যেতে পারবেন।",
    body: [
      "দীর্ঘ প্রতীক্ষার পর পদ্মা সেতুর রেল সংযোগ আনুষ্ঠানিকভাবে যাত্রীসেবায় যুক্ত হয়েছে। উদ্বোধনের দিন থেকেই ঢাকা–যশোর রুটে আন্তঃনগর ট্রেন চলাচল শুরু হওয়ায় দক্ষিণ-পশ্চিমাঞ্চলের মানুষের যাতায়াতে নতুন গতি এসেছে।",
      "রেলওয়ে সূত্র জানায়, নতুন এই রুটে চলাচলকারী ট্রেনের সময়সূচি শুরুতে সীমিত রাখা হলেও ধাপে ধাপে ট্রিপ সংখ্যা বাড়ানো হবে। যাত্রীচাপ বিবেচনায় ভোর, দুপুর ও রাত—এই তিন সময়ে অতিরিক্ত সার্ভিস যোগ করার পরিকল্পনাও রয়েছে।",
      "বিশ্লেষকদের মতে, এই রেল সংযোগ শুধু যাতায়াত সহজ করবে না; বরং কৃষিপণ্য, ক্ষুদ্র শিল্পপণ্য ও রপ্তানিমুখী পণ্যের পরিবহন ব্যয় কমিয়ে আঞ্চলিক অর্থনীতিতে ইতিবাচক প্রভাব ফেলবে। তবে নিয়মিত রক্ষণাবেক্ষণ, সময়নিষ্ঠতা এবং স্টেশন-ভিত্তিক সেবার মান নিশ্চিত করাই এখন বড় চ্যালেঞ্জ।"
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
    excerpt:
      "শ্রীলঙ্কার বিরুদ্ধে রোমাঞ্চকর ম্যাচে বাংলাদেশ দল জয়লাভ করেছে। অধিনায়কের অপরাজিত সেঞ্চুরিতে দল সিরিজে এগিয়ে গেল।",
    body: [
      "টি-২০ বিশ্বকাপের গুরুত্বপূর্ণ ম্যাচে শ্রীলঙ্কাকে ৬ উইকেটে হারিয়ে আত্মবিশ্বাসী জয় তুলে নিয়েছে বাংলাদেশ। লক্ষ্য তাড়ায় শুরুটা ধীর হলেও মাঝের ওভারে অধিনায়কের দায়িত্বশীল ব্যাটিং ম্যাচের মোড় ঘুরিয়ে দেয়।",
      "পাওয়ারপ্লেতে দুটি উইকেট হারানোর পর ইনিংস স্থির করেন অধিনায়ক ও মিডল-অর্ডারের এক ব্যাটার। ডেথ ওভারে বাউন্ডারির ধারাবাহিকতায় রানরেট নিয়ন্ত্রণে আসে এবং শেষ পর্যন্ত দুই ওভার হাতে রেখেই জয়ের বন্দরে পৌঁছে যায় টাইগাররা।",
      "ম্যাচ-পরবর্তী সংবাদ সম্মেলনে অধিনায়ক বলেন, পরিকল্পনা অনুযায়ী বোলিং ইউনিট কাজ করেছে বলেই রান চেজ সহজ হয়েছে। এই জয়ে পয়েন্ট টেবিলে বাংলাদেশের অবস্থান শক্ত হয়েছে এবং সেমিফাইনালের পথে সমীকরণ আরও অনুকূলে এসেছে।"
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
    title:
      "কৃত্রিম বুদ্ধিমত্তায় বিপ্লব: বাংলাদেশি স্টার্টআপের নতুন ভাষা মডেল উন্মোচন",
    excerpt:
      "দেশীয় এক প্রযুক্তি প্রতিষ্ঠান বাংলা ভাষায় কাজ করতে সক্ষম উন্নত কৃত্রিম বুদ্ধিমত্তা মডেল উন্মোচন করেছে, যা শিক্ষা ও স্বাস্থ্যখাতে ব্যবহার শুরু হচ্ছে।",
    body: [
      "বাংলা ভাষাভিত্তিক কৃত্রিম বুদ্ধিমত্তা গবেষণায় নতুন মাইলফলক স্থাপন করেছে দেশের একটি স্টার্টআপ। প্রতিষ্ঠানটি এমন একটি ভাষা মডেল উন্মোচন করেছে, যা বাংলা প্রমিত ভাষার পাশাপাশি বিভিন্ন আঞ্চলিক রূপও তুলনামূলকভাবে ভালোভাবে বুঝতে পারে।",
      "প্রতিষ্ঠানটির দাবি, পরীক্ষামূলক পর্যায়ে মডেলটি শিক্ষা-সহায়ক কনটেন্ট তৈরি, প্রাথমিক স্বাস্থ্যপরামর্শের সারাংশ প্রস্তুত এবং সরকারি তথ্যসেবায় প্রশ্নোত্তর সহায়তার মতো কাজে সন্তোষজনক ফল দিয়েছে। ডেটা সুরক্ষা ও দায়িত্বশীল এআই ব্যবহারের জন্য আলাদা নীতিমালাও ঘোষণা করা হয়েছে।",
      "প্রযুক্তি বিশেষজ্ঞদের মতে, দেশীয় ভাষা ও প্রেক্ষাপটে প্রশিক্ষিত মডেল স্থানীয় উদ্ভাবনকে এগিয়ে নিতে পারে। তবে দীর্ঘমেয়াদে নির্ভুলতা, পক্ষপাতমুক্ত আউটপুট এবং স্বচ্ছ মূল্যায়ন প্রক্রিয়া নিশ্চিত করা জরুরি।"
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
    excerpt:
      "চলতি অর্থবছরের বাজেটে স্বাস্থ্য ও শিক্ষাখাতে বরাদ্দ উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে। অর্থমন্ত্রী আশা প্রকাশ করেছেন মূল্যস্ফীতি নিয়ন্ত্রণে রাখা হবে।",
    body: [
      "জাতীয় বাজেট ২০২৫-২৬ এ স্বাস্থ্য ও শিক্ষাখাতে বরাদ্দ বৃদ্ধিকে সরকারের সামাজিক বিনিয়োগ কৌশলের অংশ হিসেবে দেখানো হয়েছে। বাজেট বক্তৃতায় অর্থমন্ত্রী জনস্বাস্থ্য সুরক্ষা, প্রাথমিক চিকিৎসা অবকাঠামো এবং দক্ষ মানবসম্পদ উন্নয়নকে অগ্রাধিকার ক্ষেত্র হিসেবে তুলে ধরেন।",
      "শিক্ষাখাতে নতুন বরাদ্দের একটি বড় অংশ ব্যয় হবে কারিগরি ও প্রযুক্তিভিত্তিক শিক্ষায়, যাতে শ্রমবাজারের চাহিদা অনুযায়ী দক্ষতা উন্নয়ন সম্ভব হয়। অন্যদিকে স্বাস্থ্যখাতে জেলা-উপজেলা পর্যায়ে ডায়াগনস্টিক সুবিধা বাড়ানো এবং জরুরি চিকিৎসা সেবার সক্ষমতা উন্নয়নের পরিকল্পনা রয়েছে।",
      "অর্থনীতিবিদরা বলছেন, বরাদ্দ বাড়ানো ইতিবাচক হলেও বাস্তবায়ন দক্ষতা, জবাবদিহি এবং ব্যয়ের গুণগত মান নিশ্চিত না হলে প্রত্যাশিত সুফল পুরোপুরি পাওয়া যাবে না। মূল্যস্ফীতি নিয়ন্ত্রণ, রাজস্ব আহরণ এবং উন্নয়ন ব্যয়ের সমন্বয়ই হবে বাজেট বাস্তবায়নের মূল পরীক্ষা।"
    ],
    category: "অর্থনীতি",
    author: "মাহফুজা আক্তার",
    publishedAt: hoursAgo(5),
    image: img("barta-budget-2025"),
    readTime: 6,
    views: 7340,
    featured: true,
  },

  // ===== Latest news =====
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
];

export const BREAKING_NEWS: string[] = [
  "পদ্মা সেতুর রেল সংযোগ আনুষ্ঠানিকভাবে চালু হলো",
  "টি-২০ বিশ্বকাপে বাংলাদেশের জয়, শ্রীলঙ্কাকে হারাল ৬ উইকেটে",
  "জাতীয় বাজেট ২০২৫-২৬ উত্থাপন, স্বাস্থ্যখাতে বরাদ্দ বৃদ্ধি",
  "মেট্রোরেলের নতুন রুট চালু, ভাড়া কমানো হলো",
  "ডেঙ্গু প্রতিরোধে নতুন নির্দেশনা জারি স্বাস্থ্য অধিদপ্তরের",
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
