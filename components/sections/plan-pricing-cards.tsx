'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckIcon, StarIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { LIST_PRICE_EUR, COMPARE_AT_EUR, type AnalysisTier } from '@/lib/pricing'
import { getPlanRowsForLocale, pricingSection, isBasicProductName, type PlanProductName } from '@/lib/plan-locale'
import { useSiteLocale } from '@/lib/use-site-locale'

const PlanIcon: Record<AnalysisTier, typeof StarIcon> = {
  basic: StarIcon,
  detailed: SparklesIcon,
  comprehensive: HeartIcon,
}

function formatEur(n: number): string {
  return `€${n.toFixed(2)}`
}

type Props = {
  /** 'home' = features section on landing; 'page' = full /pricing */
  layout?: 'home' | 'page'
}

export function PlanPricingCards({ layout = 'home' }: Props) {
  const router = useRouter()
  const locale = useSiteLocale()
  const t = pricingSection[locale]
  const plans = getPlanRowsForLocale(locale)

  /** Mirrors `pricingSnapshotFromCode()` — DB override only via TRUST_DATABASE_PRICES on API; UI stays consistent with repo prices. */
  const listOf = (tier: AnalysisTier) => LIST_PRICE_EUR[tier]
  const compareOf = (tier: AnalysisTier) => COMPARE_AT_EUR[tier]

  const handlePlanSelect = (productName: PlanProductName) => {
    sessionStorage.setItem('selectedPlan', productName)
    router.push('/birth-chart')
  }

  const darkHome = layout === 'home'

  return (
    <section
      className={
        darkHome
          ? 'relative overflow-hidden bg-gradient-to-b from-[#05030a] via-[#0f0820] via-60% to-[#060414] py-24'
          : 'relative overflow-hidden py-20'
      }
    >
      {darkHome ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_-10%,rgba(168,85,247,0.38),transparent_56%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(244,114,182,0.16),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(30,58,138,0.28),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/55" />
        </>
      ) : null}

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          {layout === 'page' ? (
            <h1
              className={
                darkHome
                  ? 'mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_3px_28px_rgba(0,0,0,0.78)] md:text-5xl'
                  : 'gradient-text mb-6 text-4xl font-bold md:text-5xl'
              }
            >
              {t.title}
            </h1>
          ) : (
            <h2
              className={
                darkHome
                  ? 'mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_3px_28px_rgba(0,0,0,0.78)] md:text-5xl'
                  : 'gradient-text mb-6 text-4xl font-bold md:text-5xl'
              }
            >
              {t.title}
            </h2>
          )}
          <p
            className={`mx-auto mb-8 max-w-3xl text-xl font-medium leading-relaxed ${
              darkHome ? 'text-slate-100 drop-shadow-[0_1px_12px_rgba(0,0,0,.6)]' : 'text-cosmic-700 dark:text-cosmic-300'
            }`}
          >
            {t.subtitle}
          </p>
          <div className="mb-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm ${darkHome ? 'text-purple-50/92' : 'text-cosmic-600 dark:text-cosmic-400'}`}
            >
              {t.oneTimeLine}
            </span>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => {
            const listPrice = listOf(plan.tier)
            const compareAt = compareOf(plan.tier)
            const Icon = PlanIcon[plan.tier]
            const cardPadding = plan.popular && darkHome ? 'px-8 pb-8 pt-14' : plan.popular ? 'p-8 pt-14' : 'p-8'
            const cardShell = darkHome
              ? `relative rounded-2xl border-2 bg-white/[0.09] shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_28px_64px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md backdrop-saturate-150 transition-colors duration-300 hover:bg-white/[0.12] ${plan.borderColor} border-white/30 ${cardPadding}`
              : `relative rounded-2xl border-2 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-cosmic-800/80 ${plan.borderColor} ${cardPadding}`
            const emph = darkHome ? 'ring-2 ring-fuchsia-400/55 shadow-fuchsia-500/16 scale-105' : 'ring-2 ring-cosmic-500 scale-105'
            return (
              <motion.div
                key={plan.productName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${cardShell}${plan.popular ? ` ${emph}` : ''}`}
              >
                {plan.popular && (
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[40%]">
                    <span className="inline-block max-w-[min(94vw,20rem)] whitespace-nowrap rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-3 py-2 text-center text-[11px] font-semibold leading-tight tracking-wide text-white shadow-lg shadow-purple-900/55 sm:max-w-none sm:px-4 sm:text-sm">
                      {plan.popularLabel ?? t.popular}
                    </span>
                  </div>
                )}

                <div className="mb-8 text-center">
                  <div
                    className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${plan.gradient}`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3
                    className={`mb-2 text-2xl font-bold ${
                      darkHome ? 'text-white drop-shadow-sm' : 'text-cosmic-800 dark:text-cosmic-200'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mb-6 ${darkHome ? 'text-slate-100/95 drop-shadow-[0_1px_8px_rgba(0,0,0,.5)]' : 'text-cosmic-600 dark:text-cosmic-400'}`}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span
                        className={`text-4xl font-bold tabular-nums ${
                          darkHome ? 'text-white' : 'text-cosmic-800 dark:text-cosmic-200'
                        }`}
                      >
                        {formatEur(listPrice)}
                      </span>
                      {compareAt > listPrice && (
                        <span
                          className={`text-lg line-through ${
                            darkHome ? 'text-purple-200/85' : 'text-cosmic-500'
                          }`}
                        >
                          {formatEur(compareAt)}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${darkHome ? 'text-purple-100/80' : 'text-cosmic-600 dark:text-cosmic-400'}`}>
                      {t.oneTimePayment}
                    </p>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${darkHome ? 'text-green-400' : 'text-green-500'}`}
                      />
                      <span
                        className={`text-sm leading-relaxed ${
                          darkHome ? 'text-slate-100/[0.98]' : 'text-cosmic-700 dark:text-cosmic-300'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.emotionalLine ? (
                  <p
                    className={`mb-6 px-1 text-center text-sm font-medium leading-snug ${
                      darkHome ? 'text-slate-100' : 'text-cosmic-700 dark:text-cosmic-200'
                    }`}
                  >
                    {plan.emotionalLine}
                  </p>
                ) : null}

                <Button
                  onClick={() => handlePlanSelect(plan.productName)}
                  variant={plan.buttonVariant}
                  size="lg"
                  className={`w-full border-2 ${
                    plan.popular
                      ? 'border-purple-400/35 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                      : isBasicProductName(plan.productName)
                        ? darkHome
                          ? 'border-blue-400/45 bg-blue-950/25 text-purple-50 hover:border-blue-300/65 hover:bg-blue-950/35'
                          : 'border-blue-500/30 hover:border-blue-500/50'
                        : darkHome
                          ? 'border-fuchsia-400/45 bg-fuchsia-950/20 text-purple-50 hover:border-fuchsia-300/65 hover:bg-fuchsia-950/35'
                          : 'border-pink-500/30 hover:border-pink-500/50'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {darkHome ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="flex flex-col items-center justify-center gap-8 text-purple-100/90 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow shadow-blue-500/40">
                  <CheckIcon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium">{t.trustSsl}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 shadow shadow-purple-600/35">
                  <CheckIcon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium">{t.trustNoRecurring}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
