import { redirect } from 'next/navigation'

type Search = { [key: string]: string | string[] | undefined }

export default function SignInRedirectPage({ searchParams }: { searchParams: Search }) {
  const u = new URLSearchParams()
  for (const [k, v] of Object.entries(searchParams)) {
    if (v === undefined) continue
    if (Array.isArray(v)) v.forEach((x) => u.append(k, x))
    else u.set(k, v)
  }
  const qs = u.toString()
  redirect(qs ? `/login?${qs}` : '/login')
}
