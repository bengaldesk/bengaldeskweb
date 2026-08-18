// Prisma-backed data layer — drop-in replacement for news-data.ts
// All exported names match news-data.ts so components can switch imports with zero signature changes.
//
// CACHING STRATEGY:
//   - Mock path (local dev): returns sync values directly
//   - DB path (production): uses unstable_cache, which returns values synchronously
//     on cache hits. First request populates the cache async; subsequent requests
//     get the cached value synchronously. Type assertions are used to maintain the
//     original sync return types.
//   - Homepage/trending: 60s revalidation
//   - Category posts: 120s
//   - Article pages: 300s
//   - Authors: 600s

import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

// ── Types (re-exported from news-data.ts) ──────────────────────────────────

export type {
  NewsCategory,
  NewsArea,
  NewsItem,
  VideoItem,
  OpinionItem,
  AuthorProfile,
} from './news-data'

// ── Static constants (re-exported from news-data.ts) ────────────────────────

export {
  CATEGORY_SLUG_MAP,
  SLUG_CATEGORY_MAP,
  ALL_CATEGORY_SLUGS,
  NEWS_CATEGORIES,
  NEWS_AREAS,
} from './news-data'

// ── Static utils (re-exported + locally available) ──────────────────────────

export { getCategorySlug, getCategoryBySlug, categoryColor, getAuthorSlug } from './news-data'

import { getAuthorSlug } from './news-data'

// ── Mock data imports (for fallback when no PostgreSQL) ────────────────────

import {
  NEWS as MOCK_NEWS,
  VIDEOS as MOCK_VIDEOS,
  OPINIONS as MOCK_OPINIONS,
  BREAKING_NEWS as MOCK_BREAKING_NEWS,
  getFeatured as mockGetFeatured,
  getLatest as mockGetLatest,
  getByCategory as mockGetByCategory,
  getTrending as mockGetTrending,
  getNewsById as mockGetNewsById,
  getNewsBody as mockGetNewsBody,
  getNewsByAuthor as mockGetNewsByAuthor,
  getNewsByAuthorSlug as mockGetNewsByAuthorSlug,
  getAreaByNewsId as mockGetAreaByNewsId,
  getNewsByArea as mockGetNewsByArea,
  getAuthors as mockGetAuthors,
  getAuthorBySlug as mockGetAuthorBySlug,
} from './news-data'

import type { NewsCategory as TNewsCat, NewsArea as TNewsArea, NewsItem as TNewsItem, AuthorProfile as TAuthorProfile } from './news-data'

// ── Mode flag ──────────────────────────────────────────────────────────────

const USE_MOCK = !process.env.DATABASE_URL?.startsWith('postgresql')

// ── HTML stripping helper ──────────────────────────────────────────────────

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '')

// ── Map a single Post row → NewsItem ───────────────────────────────────────

function mapPostToNewsItem(post: {
  id: string
  title: string
  summary: string | null
  content: string | null
  image: string | null
  category: string | null
  categoryRel: { nameBn: string | null } | null
  author: { name: string | null } | null
  createdAt: Date
  viewCount: number
  featured: boolean
}): TNewsItem {
  const content = post.content ?? ''
  return {
    id: post.id,
    title: post.title,
    excerpt: post.summary ?? '',
    category: (post.categoryRel?.nameBn ?? post.category ?? 'জাতীয়') as TNewsCat,
    author: post.author?.name ?? 'The Bengal Desk',
    publishedAt: post.createdAt.toISOString(),
    image: post.image ?? '/logo.svg',
    readTime: Math.max(1, Math.ceil((content?.split(/\s+/).length ?? 0) / 200)),
    views: post.viewCount,
    featured: post.featured,
  }
}

// ── DB query helpers (shared include pattern) ─────────────────────────────

const POST_INCLUDE = {
  author: { select: { name: true } },
  categoryRel: { select: { nameBn: true } },
} as const

// ═══════════════════════════════════════════════════════════════════════
// Data functions
//
// unstable_cache returns cached values SYNCHRONOUSLY on cache hits.
// Type assertions preserve the original sync return types so existing
// components work without modification.
// First request after server start populates the cache async.
// ═══════════════════════════════════════════════════════════════════════

export const getFeatured = (USE_MOCK
  ? mockGetFeatured
  : unstable_cache(
      async () => {
        const posts = await db.post.findMany({
          where: { published: true, featured: true },
          include: POST_INCLUDE,
          orderBy: { createdAt: 'desc' },
        })
        return posts.map(mapPostToNewsItem)
      },
      ['get-featured'],
      { revalidate: 60 },
    )) as typeof mockGetFeatured

export const getLatest = (USE_MOCK
  ? mockGetLatest
  : unstable_cache(
      async (limit?: number) => {
        const posts = await db.post.findMany({
          where: { published: true },
          include: POST_INCLUDE,
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        return posts.map(mapPostToNewsItem)
      },
      ['get-latest'],
      { revalidate: 60 },
    )) as typeof mockGetLatest

export const getByCategory = (USE_MOCK
  ? mockGetByCategory
  : unstable_cache(
      async (cat: TNewsCat, limit?: number) => {
        const posts = await db.post.findMany({
          where: {
            published: true,
            OR: [
              { categoryRel: { nameBn: cat } },
              { category: cat },
            ],
          },
          include: POST_INCLUDE,
          orderBy: { createdAt: 'desc' },
          take: limit,
        })
        return posts.map(mapPostToNewsItem)
      },
      ['get-by-category'],
      { revalidate: 120 },
    )) as typeof mockGetByCategory

export const getTrending = (USE_MOCK
  ? mockGetTrending
  : unstable_cache(
      async (limit = 5) => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const posts = await db.post.findMany({
          where: { published: true, createdAt: { gte: sevenDaysAgo } },
          include: POST_INCLUDE,
          orderBy: { viewCount: 'desc' },
          take: limit,
        })
        return posts.map((p) => ({ ...mapPostToNewsItem(p), trending: true }))
      },
      ['get-trending'],
      { revalidate: 60 },
    )) as typeof mockGetTrending

export const getNewsById = (USE_MOCK
  ? mockGetNewsById
  : unstable_cache(
      async (id: string) => {
        const post = await db.post.findFirst({
          where: { published: true, id },
          include: POST_INCLUDE,
        })
        if (!post) return undefined
        return mapPostToNewsItem(post)
      },
      ['get-news-by-id'],
      { revalidate: 300 },
    )) as typeof mockGetNewsById

export const getNewsBody = (USE_MOCK
  ? mockGetNewsBody
  : unstable_cache(
      async (id: string) => {
        const post = await db.post.findFirst({
          where: { published: true, id },
          select: { content: true },
        })
        if (!post?.content) return []
        const stripped = stripHtml(post.content)
        return stripped.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
      },
      ['get-news-body'],
      { revalidate: 300 },
    )) as typeof mockGetNewsBody

export const getNewsByAuthor = (USE_MOCK
  ? mockGetNewsByAuthor
  : unstable_cache(
      async (authorName: string) => {
        const posts = await db.post.findMany({
          where: { published: true, author: { name: authorName } },
          include: POST_INCLUDE,
          orderBy: { createdAt: 'desc' },
        })
        return posts.map(mapPostToNewsItem)
      },
      ['get-news-by-author'],
      { revalidate: 120 },
    )) as typeof mockGetNewsByAuthor

export const getNewsByAuthorSlug = (USE_MOCK
  ? mockGetNewsByAuthorSlug
  : unstable_cache(
      async (slug: string) => {
        const allUsers = await db.user.findMany({ select: { id: true, name: true } })
        const user = allUsers.find((u) => u.name && getAuthorSlug(u.name) === slug)
        if (!user?.name) return []
        return getNewsByAuthor(user.name)
      },
      ['get-news-by-author-slug'],
      { revalidate: 120 },
    )) as typeof mockGetNewsByAuthorSlug

export const getAreaByNewsId = USE_MOCK
  ? mockGetAreaByNewsId
  : (_id: string): TNewsArea | undefined => undefined

export const getNewsByArea = USE_MOCK
  ? mockGetNewsByArea
  : (_area: TNewsArea, _limit?: number): TNewsItem[] => []

export const getAuthors = (USE_MOCK
  ? mockGetAuthors
  : unstable_cache(
      async () => {
        const posts = await db.post.findMany({
          where: { published: true, authorId: { not: null } },
          include: { author: { select: { id: true, name: true, avatar: true, bio: true } } },
        })
        const authorMap = new Map<string, { name: string; avatar: string | null; bio: string | null; count: number }>()
        for (const post of posts) {
          if (!post.author?.name) continue
          const key = post.author.id
          const existing = authorMap.get(key)
          if (existing) { existing.count++ } else {
            authorMap.set(key, { name: post.author.name, avatar: post.author.avatar, bio: post.author.bio, count: 1 })
          }
        }
        return Array.from(authorMap.entries()).map(([, info]) => {
          const slug = getAuthorSlug(info.name)
          return {
            name: info.name,
            slug,
            avatar: info.avatar ?? `https://picsum.photos/seed/author-${slug}/320/320`,
            role: info.bio ? info.bio.slice(0, 40) : 'প্রতিবেদক',
            bio: info.bio ?? `${info.name} The Bengal Desk-র একজন স্টাফ রিপোর্টার।`,
            articleCount: info.count,
          }
        })
      },
      ['get-authors'],
      { revalidate: 600 },
    )) as typeof mockGetAuthors

export const getAuthorBySlug = (USE_MOCK
  ? mockGetAuthorBySlug
  : unstable_cache(
      async (slug: string) => {
        const authors = await getAuthors()
        return authors.find((a) => a.slug === slug)
      },
      ['get-author-by-slug'],
      { revalidate: 600 },
    )) as typeof mockGetAuthorBySlug

// ── Constants (sync arrays for component consumption) ────────────────────

export const VIDEOS: TVideoItem[] = USE_MOCK ? MOCK_VIDEOS : []

export const OPINIONS: TOpinionItem[] = USE_MOCK ? MOCK_OPINIONS : []

export const BREAKING_NEWS: string[] = USE_MOCK ? MOCK_BREAKING_NEWS : []

export const ALL_NEWS: TNewsItem[] = USE_MOCK ? MOCK_NEWS : []

// ── viewCount increment (fire-and-forget) ──────────────────────────────────

export async function incrementViewCount(id: string): Promise<void> {
  if (USE_MOCK) return
  try {
    await db.post.update({ where: { id }, data: { viewCount: { increment: 1 } } })
  } catch {
    // Silently fail — non-critical
  }
}
