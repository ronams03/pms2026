import { NextRequest, NextResponse } from 'next/server'
import { registerUser, createSession } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await registerUser(name || '', email, password)
    await createSession(user, rememberMe !== false)

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    const status = message.includes('already exists') ? 409 : message.includes('Password') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
