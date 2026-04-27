import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email or username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        if (!process.env.DATABASE_URL) return null

        const key = credentials.username.trim()
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: { equals: key, mode: 'insensitive' } }, { email: { equals: key, mode: 'insensitive' } }],
          },
        })
        if (!user) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username,
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: 'SUPER_ADMIN' | 'INFLUENCER' }).role
        token.username = (user as { username?: string | null }).username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'SUPER_ADMIN' | 'INFLUENCER'
        session.user.username = token.username as string | null | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
