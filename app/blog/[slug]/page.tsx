import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BlogArticleView } from '@/components/blog/blog-article-view'
import { ARTICLE_HTML } from '@/lib/blog-articles-html'
import { getAllBlogSlugs, resolveBlogMeta } from '@/lib/blog-index-locale'

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const en = resolveBlogMeta(params.slug, 'en')
  if (!en) {
    return { title: 'Article' }
  }
  return {
    title: `${en.title} | AstroHoroscope.online`,
    description: en.excerpt,
    openGraph: {
      title: en.title,
      description: en.excerpt,
      type: 'article',
      publishedTime: `${en.date}T00:00:00.000Z`,
      authors: [en.author],
    },
  }
}

export default function BlogArticlePage({ params }: PageProps) {
  if (!getAllBlogSlugs().includes(params.slug) || !ARTICLE_HTML[params.slug]) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 pt-page-header-safe dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
        <BlogArticleView slug={params.slug} />
      </main>
      <Footer />
    </>
  )
}
