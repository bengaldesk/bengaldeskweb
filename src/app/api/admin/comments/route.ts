import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      where.status = status
    }

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: { select: { id: true, title: true } },
          author: { select: { id: true, name: true } },
        },
      }),
      db.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Comments list error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Id and status are required' }, { status: 400 })
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const comment = await db.comment.update({
      where: { id },
      data: { status },
      include: {
        post: { select: { title: true } },
      },
    })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'update_comment',
        details: `Updated comment status to ${status} on post: ${comment.post?.title || 'Unknown'}`,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Update comment error:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}
