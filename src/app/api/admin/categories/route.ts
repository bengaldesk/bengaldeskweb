import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories list error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, nameBn, slug, description, icon, color, order, active } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name,
        nameBn: nameBn || null,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'create_category',
        details: `Created category: ${name}`,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
