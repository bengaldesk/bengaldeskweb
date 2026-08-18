import type { MetadataRoute } from 'next'
import { getLatest, CATEGORY_SLUG_MAP } from '@/lib/posts'
import { SITE_URL } from '@/lib/brand'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category routes
  const categorySlugs = Object.values(CATEGORY_SLUG_MAP)
  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }))

  // Article routes
  const articles = getLatest()
  const articleRoutes: MetadataRoute.Sitemap = articles.map((item) => ({
    url: `${SITE_URL}/news/${item.id}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes]
}
