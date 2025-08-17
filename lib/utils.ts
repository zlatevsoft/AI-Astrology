import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getZodiacSign(month: number, day: number): string {
  const zodiacSigns = [
    { name: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { name: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ]

  for (const sign of zodiacSigns) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay) ||
      (sign.startMonth > sign.endMonth && (month >= sign.startMonth || month <= sign.endMonth))
    ) {
      return sign.name
    }
  }

  return 'Capricorn' // Default fallback
}

export function getZodiacEmoji(sign: string): string {
  const emojiMap: Record<string, string> = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓',
  }
  return emojiMap[sign] || '✨'
}

export function getPlanetEmoji(planet: string): string {
  const emojiMap: Record<string, string> = {
    'Sun': '☀️',
    'Moon': '🌙',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
  }
  return emojiMap[planet] || '✨'
}
