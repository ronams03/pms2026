import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth-server'

export async function POST() {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
