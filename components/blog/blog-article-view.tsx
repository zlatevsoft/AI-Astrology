'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { ARTICLE_HTML } from '@/lib/blog-articles-html'
import { blogArticleChrome, resolveBlogMeta } from '@/lib/blog-index-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const HERO_COVER = '/astrohoroscope.png'

type Props = {
  slug: string
}

export function BlogArticleView({ slug }: Props) {
  const locale = useSiteLocale()
  const meta = resolveBlogMeta(slug, locale)
  const bodies = ARTICLE_HTML[slug]
  if (!meta || !bodies) return null

  const chrome = blogArticleChrome[locale]
  const html = locale === 'bg' ? bodies.bg : bodies.en
  const formattedDate = new Date(meta.date).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav className="mb-10" aria-label="Breadcrumb">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-cosmic-700 transition hover:text-cosmic-900 dark:text-cosmic-300 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          {chrome.back}
        </Link>
      </nav>

      <header className="mb-10 text-center">
        <span className="mb-6 inline-flex rounded-full bg-cosmic-100 px-4 py-1.5 text-sm font-semibold text-cosmic-800 dark:bg-cosmic-700/80 dark:text-cosmic-100">
          {meta.category}
        </span>

        <h1 className="mx-auto mb-6 max-w-4xl text-balance text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-[2.85rem]">
          {meta.title}
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-balance text-lg text-gray-600 dark:text-cosmic-200 sm:text-xl">
          {meta.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-600 dark:text-cosmic-300">
          <span className="inline-flex items-center gap-2">
            <UserIcon className="h-4 w-4" aria-hidden />
            {meta.author}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" aria-hidden />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-2">
            <ClockIcon className="h-4 w-4" aria-hidden />
            {meta.readTime}
          </span>
        </div>
      </header>

      <div className="relative mb-10 h-52 w-full overflow-hidden rounded-2xl border border-cosmic-200/70 shadow-xl dark:border-cosmic-600/60 sm:h-60 md:h-72">
        <Image
          src={HERO_COVER}
          alt=""
          fill
          className="object-cover object-[center_18%]"
          sizes="(min-width: 1024px) 896px, 96vw"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-purple-950/25 to-transparent"
          aria-hidden
        />
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl border border-cosmic-200 bg-white px-6 py-10 shadow-xl dark:border-cosmic-700 dark:bg-cosmic-950/95 sm:p-12">
        <article
          className="prose prose-lg prose-cosmic max-w-none dark:prose-invert [&_h2]:scroll-mt-32 [&_h2]:text-balance [&_p]:text-pretty"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
