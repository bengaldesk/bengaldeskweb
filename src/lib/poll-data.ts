export interface PollOption {
  id: string
  label: string
  votes: number
}

export interface PollItem {
  id: string
  question: string
  publishedAt: string
  isActive?: boolean
  options: PollOption[]
}

export const POLLS: PollItem[] = [
  {
    id: 'p4',
    question: 'আপনার মতে বর্তমান সময়ে দেশের সবচেয়ে জরুরি অগ্রাধিকার কোনটি?',
    publishedAt: '2026-08-04T09:00:00.000Z',
    isActive: true,
    options: [
      { id: 'economy', label: 'মূল্যস্ফীতি নিয়ন্ত্রণ', votes: 328 },
      { id: 'jobs', label: 'কর্মসংস্থান বৃদ্ধি', votes: 294 },
      { id: 'health', label: 'স্বাস্থ্যসেবার মানোন্নয়ন', votes: 186 },
      { id: 'education', label: 'শিক্ষাখাতে বিনিয়োগ', votes: 214 },
    ],
  },
  {
    id: 'p3',
    question: 'নগর জীবনে যানজট কমাতে কোন পদক্ষেপ সবচেয়ে কার্যকর হবে?',
    publishedAt: '2026-07-30T09:00:00.000Z',
    options: [
      { id: 'metro', label: 'মেট্রোরেল রুট সম্প্রসারণ', votes: 411 },
      { id: 'bus', label: 'সমন্বিত বাস রুট ব্যবস্থাপনা', votes: 267 },
      { id: 'parking', label: 'পার্কিং নীতি কঠোর প্রয়োগ', votes: 131 },
      { id: 'rideshare', label: 'রাইড-শেয়ারিং নিয়ন্ত্রণ', votes: 89 },
    ],
  },
  {
    id: 'p2',
    question: 'বাংলাদেশের ক্রিকেটে কোন ফরম্যাটে দীর্ঘমেয়াদি পরিকল্পনা বেশি দরকার?',
    publishedAt: '2026-07-24T09:00:00.000Z',
    options: [
      { id: 'test', label: 'টেস্ট ক্রিকেট', votes: 245 },
      { id: 'odi', label: 'ওয়ানডে ক্রিকেট', votes: 308 },
      { id: 't20', label: 'টি-২০ ক্রিকেট', votes: 377 },
      { id: 'all', label: 'তিন ফরম্যাটেই সমান জোর', votes: 402 },
    ],
  },
  {
    id: 'p1',
    question: 'আপনি অনলাইনে সংবাদ পড়তে সবচেয়ে বেশি কোন সময়ে স্বাচ্ছন্দ্যবোধ করেন?',
    publishedAt: '2026-07-18T09:00:00.000Z',
    options: [
      { id: 'morning', label: 'সকালে', votes: 219 },
      { id: 'afternoon', label: 'দুপুরে', votes: 143 },
      { id: 'evening', label: 'সন্ধ্যায়', votes: 336 },
      { id: 'night', label: 'রাতে', votes: 278 },
    ],
  },
]

export const getActivePoll = () => POLLS.find((poll) => poll.isActive) ?? POLLS[0]
export const getPastPolls = (limit = 3) => POLLS.filter((poll) => !poll.isActive).slice(0, limit)
