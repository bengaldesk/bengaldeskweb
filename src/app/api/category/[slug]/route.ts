import { NextResponse } from 'next/server'
import {
  getCategoryBySlug,
  getCategorySlug,
  getByCategory,
  getTrending,
  NEWS_CATEGORIES,
  categoryColor,
} from '@/lib/posts'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return NextResponse.json({ error: 'ক্যাটাগরি পাওয়া যায়নি' }, { status: 404 })
  }

  const news = getByCategory(category)
  const trending = getTrending(5).filter((n) => n.category !== category)
  const color = categoryColor(category)
  const categoryInfo = NEWS_CATEGORIES.find((c) => c.label === category)
  const allCategories = NEWS_CATEGORIES.map((c) => ({
    label: c.label,
    color: c.color,
    slug: getCategorySlug(c.label),
  }))

  return NextResponse.json({
    category,
    color,
    news,
    trending,
    categoryInfo,
    allCategories,
  })
}
