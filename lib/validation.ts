import { z } from 'zod'

// Enhanced birth data validation
export const birthDataSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  date: z.string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const now = new Date()
      const minDate = new Date('1900-01-01')
      return birthDate >= minDate && birthDate <= now
    }, 'Birth date must be between 1900 and today'),
  
  time: z.string()
    .min(1, 'Birth time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format (24-hour)'),
  
  location: z.string()
    .min(1, 'Birth location is required')
    .max(200, 'Location must be less than 200 characters')
    .regex(/^[a-zA-Z\s\-'\.\,\()]+$/, 'Location can only contain letters, spaces, hyphens, apostrophes, periods, commas, and parentheses'),
})

// Partner data validation for comprehensive plan
export const partnerDataSchema = z.object({
  partnerName: z.string()
    .min(1, 'Partner name is required')
    .max(100, 'Partner name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Partner name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  partnerDate: z.string()
    .min(1, 'Partner birth date is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const now = new Date()
      const minDate = new Date('1900-01-01')
      return birthDate >= minDate && birthDate <= now
    }, 'Partner birth date must be between 1900 and today'),
  
  partnerTime: z.string()
    .min(1, 'Partner birth time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Partner time must be in HH:MM format (24-hour)'),
  
  partnerLocation: z.string()
    .min(1, 'Partner birth location is required')
    .max(200, 'Partner location must be less than 200 characters')
    .regex(/^[a-zA-Z\s\-'\.\,\()]+$/, 'Partner location can only contain letters, spaces, hyphens, apostrophes, periods, commas, and parentheses'),
})

// Plan selection validation
export const planSchema = z.object({
  selectedPlan: z.enum(['Basic Reading', 'Detailed Analysis', 'Comprehensive Reading'], {
    errorMap: () => ({ message: 'Please select a valid plan' })
  })
})

// Stripe configuration validation
export const stripeConfigSchema = z.object({
  mode: z.enum(['test', 'live']),
  testPublishableKey: z.string().optional(),
  testSecretKey: z.string().optional(),
  livePublishableKey: z.string().optional(),
  liveSecretKey: z.string().optional(),
}).refine((data) => {
  // Allow empty keys for fallback scenarios
  if (data.mode === 'test') {
    return true // Allow empty keys for test mode fallback
  } else {
    return data.livePublishableKey && data.liveSecretKey
  }
}, {
  message: 'Both publishable and secret keys are required for live mode',
  path: ['mode']
})

// API request validation
export const apiRequestSchema = z.object({
  birthChartData: birthDataSchema,
  selectedAnalysisType: z.enum(['basic', 'detailed', 'comprehensive']),
  partnerChartData: partnerDataSchema.optional(),
})

// Sanitize input data
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validate and sanitize birth data
export function validateAndSanitizeBirthData(data: any) {
  const sanitizedData = {
    name: sanitizeInput(data.name),
    date: data.date,
    time: data.time,
    location: sanitizeInput(data.location),
  }
  
  return birthDataSchema.parse(sanitizedData)
}

// Validate and sanitize partner data
export function validateAndSanitizePartnerData(data: any) {
  const sanitizedData = {
    partnerName: sanitizeInput(data.partnerName),
    partnerDate: data.partnerDate,
    partnerTime: data.partnerTime,
    partnerLocation: sanitizeInput(data.partnerLocation),
  }
  
  return partnerDataSchema.parse(sanitizedData)
}
