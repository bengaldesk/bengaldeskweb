import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const polls = await db.poll.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        options: {
          orderBy: { votes: 'desc' },
        },
        _count: { select: { options: true } },
      },
    })

    // Add total votes to each poll
    const pollsWithCounts = polls.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)
      return { ...poll, totalVotes }
    })

    return NextResponse.json(pollsWithCounts)
  } catch (error) {
    console.error('Polls list error:', error)
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question, options, active } = body

    if (!question || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: 'Question and options are required' },
        { status: 400 }
      )
    }

    const poll = await db.poll.create({
      data: {
        question,
        active: active !== undefined ? active : true,
        options: {
          create: options.map((text: string) => ({ text })),
        },
      },
      include: { options: true },
    })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'create_poll',
        details: `Created poll: ${question}`,
      },
    })

    return NextResponse.json(poll, { status: 201 })
  } catch (error) {
    console.error('Create poll error:', error)
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 })
  }
}
