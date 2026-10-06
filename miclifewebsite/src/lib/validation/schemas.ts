import { z } from 'zod';

// Phone number validation (Egyptian format)
const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
  .transform(val => `+20${val}`);

// Email validation
const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .trim()
  .toLowerCase();

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Name can only contain letters and spaces')
  .trim();

// Quote form validation
export const quoteFormStep1Schema = z.object({
  model: z.string().min(1, 'Model is required').max(100).trim(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  insuredSum: z.number()
    .positive('Amount must be positive')
    .max(8000000, 'Amount exceeds maximum')
    .min(1, 'Amount is required'),
  details: z.string().max(1000, 'Details too long').optional().or(z.literal('')),
});

export const quoteFormStep2Schema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Accident report validation
export const accidentReportSchema = z.object({
  policy: z.string().max(50, 'Policy number too long').optional().or(z.literal('')),
  email: emailSchema,
  description: z.string().max(5000, 'Description too long').optional().or(z.literal('')),
});

// Registration validation
export const registrationSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
});

// Ticket creation validation
export const ticketSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  TicketType: z.number().int().min(1).max(100),
  Email: emailSchema,
  Phone: z.string().optional(),
  TicketStatus: z.number().int(),
  Description: z.string().max(10000).trim(),
});

// API request validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  searchTerm: z.string().max(200).optional(),
});

// Export individual validators for reuse
export { phoneSchema, emailSchema, nameSchema };

