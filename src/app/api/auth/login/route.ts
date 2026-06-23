import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await verifyCredentials(email, password)
    await createSession(user, rememberMe !== false)

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    // 401 for credential errors so the client can show the right message
    const status = message.includes('No account') || message.includes('Incorrect') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
