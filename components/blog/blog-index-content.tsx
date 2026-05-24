'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { blogIndexCopy, getBlogListPosts } from '@/lib/blog-index-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const POST_COVER = '/astrohoroscope.png'

export function BlogIndexContent() {
  const locale = useSiteLocale()
  const t = blogIndexCopy[locale]
  const blogPosts = getBlogListPosts(locale)

  return (
    <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 pt-page-header-safe dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950">
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t.h1}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">{t.h2}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{t.intro}</p>
        </div>

        {blogPosts
          .filter((post) => post.featured)
          .map((post) => (
            <div key={post.id} className="mb-16">
              <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-cosmic-700">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="relative h-64 min-h-[16rem] w-full md:h-full md:min-h-[20rem]">
                      <Image
                        src={POST_COVER}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-[center_18%]"
                        unoptimized
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/55 via-purple-950/25 to-transparent"
                        aria-hidden
                      />
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <div className="text-4xl text-white md:text-5xl">✨</div>
                        <div className="text-xs font-medium uppercase tracking-wider text-white/90">{t.featured}</div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cosmic-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cosmic-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                    >
                      {t.readFull}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-cosmic-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-cosmic-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={POST_COVER}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-[center_15%]"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/45 via-purple-950/15 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-3 left-3 right-3 text-center text-white drop-shadow-lg">
                    <div className="text-3xl mb-1">⭐️</div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-white/90">{t.cardHint}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="px-2 py-1 bg-cosmic-100 dark:bg-cosmic-700 text-cosmic-700 dark:text-cosmic-300 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-cosmic-600 dark:text-cosmic-400 font-semibold text-sm hover:text-cosmic-700 dark:hover:text-cosmic-300 transition-colors"
                  >
                    {t.readMore}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cosmic-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.ctaTitle}</h3>
            <p className="text-lg mb-6 opacity-90">{t.ctaText}</p>
            <Link
              href="/pricing"
              className="inline-flex items-center px-8 py-4 bg-white text-cosmic-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              {t.ctaButton}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
