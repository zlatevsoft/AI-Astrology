import 'next-auth'

type AppRole = 'SUPER_ADMIN' | 'INFLUENCER'

declare module 'next-auth' {
  interface User {
    id: string
    role: AppRole
    username?: string | null
  }
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      role: AppRole
      username?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: AppRole
    username?: string | null
  }
}
