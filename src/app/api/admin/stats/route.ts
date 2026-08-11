import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalComments,
      pendingComments,
      totalUsers,
      totalMedia,
      totalSubscribers,
      recentPosts,
    ] = await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.post.count({ where: { published: false } }),
      db.category.count(),
      db.comment.count(),
      db.comment.count({ where: { status: 'pending' } }),
      db.user.count(),
      db.media.count(),
      db.newsletter.count(),
      db.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true } },
          categoryRel: { select: { nameBn: true, slug: true } },
        },
      }),
    ])

    // Posts per day for last 7 days (for chart)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const postsPerDay = await db.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM Post
      WHERE createdAt >= ${sevenDaysAgo.toISOString()}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

    const chartData = postsPerDay.map((item) => ({
      date: item.date,
      count: Number(item.count),
    }))

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalComments,
      pendingComments,
      totalUsers,
      totalMedia,
      totalSubscribers,
      recentPosts,
      postsPerDay: chartData,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
