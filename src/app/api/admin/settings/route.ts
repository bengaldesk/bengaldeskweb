import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNextAuthServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await db.siteSettings.findMany()

    const settingsObj: Record<string, string> = {}
    for (const s of settings) {
      settingsObj[s.key] = s.value
    }

    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getNextAuthServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const settings: Array<{ key: string; value: string }> = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 })
    }

    const results = []
    for (const setting of settings) {
      if (!setting.key) continue

      const result = await db.siteSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
      results.push(result)
    }

    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'update_settings',
        details: `Updated ${settings.length} site settings`,
      },
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
