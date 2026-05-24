'use client'

import { motion } from 'framer-motion'
import { homePlansSeoIntro } from '@/lib/dictionaries'
import { useSiteLocale } from '@/lib/use-site-locale'

/**
 * SEO-oriented lead copy above the tier cards on the homepage (dark band before pricing section).
 */
export function ServicesSeoLead() {
  const locale = useSiteLocale()
  const copy = homePlansSeoIntro[locale]

  return (
    <section
      aria-labelledby="home-plans-intro-title"
      className="relative overflow-hidden border-y border-white/[0.06] bg-gradient-to-b from-[#08041a] via-[#0c061f] to-[#08051c] py-14 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(167,139,250,0.32),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_90%,rgba(244,114,182,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/45" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 inline-block rounded-full border border-fuchsia-400/25 bg-white/5 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-fuchsia-100/90 md:text-xs">
            AstroHoroscope.online
          </p>
          <h2
            id="home-plans-intro-title"
            className="mx-auto mb-5 max-w-4xl text-balance text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] sm:text-3xl md:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mx-auto mb-4 max-w-3xl text-balance text-base leading-relaxed text-purple-100/95 sm:text-lg md:text-xl">
            {copy.subtitle}
          </p>
          <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-purple-200/80 sm:text-base">{copy.highlight}</p>
        </motion.div>
      </div>
    </section>
  )
}
