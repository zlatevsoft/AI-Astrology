'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SparklesIcon,
  UserIcon,
  ChartBarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
         <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
       scrolled 
         ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-cosmic-200/50 dark:border-cosmic-500/20 shadow-2xl' 
         : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-cosmic-100/50 dark:border-cosmic-500/20'
     }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
                     {/* Logo */}
           <Link href="/" className="flex items-center space-x-3 group">
             <div className="relative">
               <SparklesIcon className="h-8 w-8 text-cosmic-400 group-hover:text-cosmic-300 transition-all duration-300" />
               <div className="absolute inset-0 bg-cosmic-400/30 rounded-full blur-lg group-hover:bg-cosmic-300/40 transition-all duration-300 animate-pulse" />
             </div>
             <span className="text-xl font-bold font-display text-cosmic-800 dark:text-white group-hover:text-cosmic-600 dark:group-hover:text-cosmic-300 transition-all duration-300">
               AI Astrology
             </span>
           </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('/#')) {
                    e.preventDefault()
                    if (pathname === '/') {
                      // If we're on home page, scroll to section
                      const element = document.getElementById(item.href.substring(2))
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    } else {
                      // If we're on another page, navigate to home and scroll
                      window.location.href = item.href
                    }
                  }
                }}
                                 className={`text-sm font-medium transition-all duration-300 hover:text-cosmic-600 dark:hover:text-cosmic-300 hover:scale-105 ${
                   pathname === item.href
                     ? 'text-cosmic-600 dark:text-cosmic-300 font-semibold'
                     : 'text-cosmic-700 dark:text-white/90 hover:text-cosmic-800 dark:hover:text-white'
                 }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <ThemeToggle />
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-cosmic-500 via-purple-500 to-indigo-500 hover:from-cosmic-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Choose Plan
              </Button>
            </Link>
          </div>

                     {/* Mobile menu button */}
           <div className="lg:hidden flex items-center space-x-2">
             <ThemeToggle />
             <Button
               variant="ghost"
               size="sm"
               onClick={() => setMobileMenuOpen(true)}
               className="p-2 text-cosmic-700 dark:text-white hover:text-cosmic-600 dark:hover:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-white/10"
             >
               <Bars3Icon className="h-6 w-6" />
             </Button>
           </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[9999]"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/90"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-[10000]"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cosmic-200 dark:border-cosmic-700 bg-gradient-to-r from-cosmic-50 to-purple-50 dark:from-cosmic-800 dark:to-purple-800">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <SparklesIcon className="h-6 w-6 text-cosmic-600 dark:text-cosmic-300" />
                    <span className="text-lg font-bold font-display text-cosmic-800 dark:text-white">AI Astrology</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-cosmic-100 dark:hover:bg-cosmic-700"
                  >
                    <XMarkIcon className="h-6 w-6 text-cosmic-700 dark:text-cosmic-300" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4 bg-white dark:bg-cosmic-900">
                  <div className="space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false)
                          if (item.href.startsWith('/#')) {
                            e.preventDefault()
                            const element = document.getElementById(item.href.substring(2))
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' })
                            }
                          }
                        }}
                        className={`block text-lg font-semibold transition-colors hover:text-cosmic-600 dark:hover:text-cosmic-300 py-4 px-4 rounded-lg hover:bg-cosmic-100 dark:hover:bg-cosmic-800 border-b border-cosmic-100 dark:border-cosmic-700 ${
                          pathname === item.href
                            ? 'text-cosmic-600 dark:text-cosmic-300 bg-cosmic-100 dark:bg-cosmic-800'
                            : 'text-cosmic-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile Actions */}
                <div className="p-6 border-t border-cosmic-200 dark:border-cosmic-700 space-y-4 bg-gradient-to-r from-cosmic-50 to-purple-50 dark:from-cosmic-800 dark:to-purple-800">
                  <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Choose Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
