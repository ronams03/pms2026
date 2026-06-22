import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[auth] authorize called', { hasEmail: !!credentials?.email, hasPassword: !!credentials?.password })

        if (!credentials?.email || !credentials?.password) {
          console.warn('[auth] missing email or password')
          return null
        }

        const email = credentials.email.toLowerCase().trim()

        try {
          const user = await db.user.findUnique({
            where: { email },
          })
          console.log('[auth] user lookup result:', user ? `${user.email} (id: ${user.id})` : 'NOT FOUND')

          if (!user) {
            console.warn('[auth] no user found for:', email)
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          console.log('[auth] bcrypt compare result:', isValid)

          if (!isValid) {
            console.warn('[auth] password mismatch for:', email)
            return null
          }

          const result = {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            image: user.avatar,
          }
          console.log('[auth] authorize success:', result.email)
          return result
        } catch (err) {
          console.error('[auth] authorize threw:', err)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.avatar = (user as { image?: string }).image || 'amber'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as { avatar?: string }).avatar = token.avatar as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
}
