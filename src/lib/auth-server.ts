import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'cinematic-pms-secret-key-2025-very-long-and-secure'
)
const COOKIE_NAME = 'pms_session'
const MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export interface SessionUser {
  id: string
  email: string
  name: string
  avatar: string
}

/** Create a signed JWT for a user and set it as an httpOnly cookie */
export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

/** Clear the session cookie */
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Verify the JWT from the cookie. Returns the user payload or null. */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, SECRET)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      avatar: payload.avatar as string,
    }
  } catch {
    return null
  }
}

/** Register a new user — returns the user (without password) or throws */
export async function registerUser(name: string, email: string, password: string): Promise<SessionUser> {
  const normalizedEmail = email.toLowerCase().trim()

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    throw new Error('An account with this email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: {
      name: name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password: hashedPassword,
      avatar: 'amber',
    },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email.split('@')[0],
    avatar: user.avatar,
  }
}

/** Verify credentials — returns the user or throws */
export async function verifyCredentials(email: string, password: string): Promise<SessionUser> {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await db.user.findUnique({ where: { email: normalizedEmail } })
  if (!user) {
    throw new Error('No account found with that email')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Incorrect password')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email.split('@')[0],
    avatar: user.avatar,
  }
}
