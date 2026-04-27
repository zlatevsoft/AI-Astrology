import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { LegalDocument } from '@/components/legal/legal-document'
import { legalSeo } from '@/lib/legal-locale'

export async function generateMetadata(): Promise<Metadata> {
  const loc = cookies().get('NEXT_LOCALE')?.value === 'bg' ? 'bg' : 'en'
  const s = legalSeo.privacy[loc]
  return {
    title: s.title,
    description: s.description,
  }
}

export default function PrivacyPolicyPage() {
  return <LegalDocument doc="privacy" />
}
