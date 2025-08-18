'use client'

import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

const navigation = {
  plans: [
    { name: 'Basic Reading', href: '/pricing' },
    { name: 'Detailed Analysis', href: '/pricing' },
    { name: 'Comprehensive Reading', href: '/pricing' },
    { name: 'Features', href: '/#features' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Contact', href: 'mailto:contact@zlatevsoft.com' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'Instagram', href: '#', icon: '📷' },
  { name: 'YouTube', href: '#', icon: '📺' },
]

export function Footer() {
  return (
    <footer className="bg-cosmic-900 text-white">
      <div className="container mx-auto px-4 py-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cosmic-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <span className="text-2xl font-bold">AstroHoroscope.online</span>
            </div>
            <p className="text-cosmic-300 mb-6 max-w-md">
              Get your personalized AI astrology birth chart reading. Professional astro horoscope analysis with cosmic insights at AstroHoroscope.online.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-cosmic-400" />
                <span className="text-cosmic-300">contact@zlatevsoft.com</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plans</h3>
            <ul className="space-y-3">
              {navigation.plans.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-cosmic-300 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

                     <div>
             <h3 className="text-lg font-semibold mb-4">Important Links</h3>
             <ul className="space-y-3">
               {navigation.support.map((item) => (
                 <li key={item.name}>
                   <a href={item.href} className="text-cosmic-300 hover:text-white transition-colors">
                     {item.name}
                   </a>
                 </li>
               ))}
             </ul>
           </div>
        </div>



        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-cosmic-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-cosmic-400">
                © 2024 AstroHoroscope.online. All rights reserved.
              </span>
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="w-4 h-4 text-cosmic-400" />
                <span className="text-cosmic-400 text-sm">SSL Secured</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-cosmic-800 hover:bg-cosmic-700 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
