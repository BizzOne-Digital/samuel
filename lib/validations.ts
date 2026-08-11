import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0).optional(), // spam protection
});

// Booking Form Schema
export const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  organization: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  audienceSize: z.string().optional(),
  budgetRange: z.string().optional(),
  eventDetails: z.string().min(20, 'Please provide more details about your event'),
  preferredContact: z.enum(['email', 'phone']),
  honeypot: z.string().max(0).optional(),
});

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  honeypot: z.string().max(0).optional(),
});

// Checkout Schema
export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  country: z.string().default('USA'),
  orderNotes: z.string().optional(),
});

// Admin Book Schema
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  author: z.string().default('Dr. Samuel Louis Jean'),
  shortDescription: z.string().min(10, 'Short description is required'),
  fullDescription: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().optional(),
  isSaleActive: z.boolean().default(false),
  format: z.string().optional(),
  isbn: z.string().optional(),
  pageCount: z.number().optional(),
  publicationDate: z.string().optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Admin Service Schema
export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  ctaLabel: z.string().default('Learn More'),
  displayOrder: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

// Admin FAQ Schema
export const faqSchema = z.object({
  question: z.string().min(5, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
  category: z.string().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
});

// Admin Testimonial Schema
export const testimonialSchema = z.object({
  personName: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  organization: z.string().optional(),
  quote: z.string().min(10, 'Quote is required'),
  rating: z.number().min(1).max(5).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

// Image Upload Schema
export const imageUploadSchema = z.object({
  file: z.instanceof(File),
  folder: z.string(),
  alt: z.string().optional(),
});
