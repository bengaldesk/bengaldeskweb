import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'
import { del } from '@vercel/blob'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const media = await db.media.findUnique({ where: { id } })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      if (media.url.startsWith('https://')) {
        await del(media.url)
      }
    } catch {
      // Blob might not exist, continue with DB deletion
    }

    await db.media.delete({ where: { id } })

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'delete_media',
        details: `Deleted media: ${media.filename}`,
      },
    })

    return NextResponse.json({ message: 'Media deleted' })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
