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
    const limit = parseInt(searchParams.get('limit') || '20')

    const [subscribers, total] = await Promise.all([
      db.newsletter.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.newsletter.count(),
    ])

    return NextResponse.json({
      subscribers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Newsletter list error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 })
    }

    const subscriber = await db.newsletter.findUnique({ where: { id } })

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    await db.newsletter.delete({ where: { id } })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'delete_subscriber',
        details: `Removed newsletter subscriber: ${subscriber.email}`,
      },
    })

    return NextResponse.json({ message: 'Subscriber removed' })
  } catch (error) {
    console.error('Delete subscriber error:', error)
    return NextResponse.json({ error: 'Failed to remove subscriber' }, { status: 500 })
  }
}
