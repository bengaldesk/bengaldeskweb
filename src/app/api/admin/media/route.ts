import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const [media, total] = await Promise.all([
      db.media.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.media.count(),
    ])

    return NextResponse.json({
      media,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Media list error:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() || 'bin'
    const blob = await put(`uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`, buffer, {
      access: 'public',
      contentType: file.type,
    })

    const media = await db.media.create({
      data: {
        filename: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        uploadedBy: session.user.id,
      },
    })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'upload_media',
        details: `Uploaded file: ${file.name}`,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Upload media error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
