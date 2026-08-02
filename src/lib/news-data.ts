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

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
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

const img = (seed: string, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Build relative timestamps
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

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

export const NEWS: NewsItem[] = [
  // ===== Featured (Hero) =====
  {
    id: "n1",
    title:
      "পদ্মা সেতুর রেল সংযোগ চালু, ঢাকা থেকে যশোর পর্যন্ত ট্রেনে যাতায়াত শুরু",
    excerpt:
      "দীর্ঘ প্রতীক্ষার পর অবশেষে পদ্মা সেতুর ওপর দিয়ে রেল সংযোগ আনুষ্ঠানিকভাবে চালু হলো। এখন থেকে যাত্রীরা সরাসরি ট্রেনে ঢাকা থেকে যশোর যেতে পারবেন।",
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
