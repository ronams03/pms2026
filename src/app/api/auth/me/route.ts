import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
