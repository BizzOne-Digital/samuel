# 🛠️ Development Guide - Samuel Louis Jean Publications

## 📖 Table of Contents
1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Creating New Pages](#creating-new-pages)
4. [Creating API Routes](#creating-api-routes)
5. [Adding Models](#adding-models)
6. [Working with Images](#working-with-images)
7. [Admin Portal Development](#admin-portal-development)
8. [Animation Guidelines](#animation-guidelines)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites Checklist:
- ✅ Node.js v18+ installed
- ✅ MongoDB installed and running
- ✅ Dependencies installed (`npm install`)
- ✅ Environment variables configured (`.env.local`)
- ✅ Database seeded (`npm run seed`)

### Start Development:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch for TypeScript errors
npm run type-check -- --watch

# Terminal 3: Run MongoDB (if not running as service)
mongod
```

---

## 🏗️ Project Architecture

```
samuel-louis-jean-publications/
├── app/                          # Next.js App Directory
│   ├── (public)/                # Public pages group
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── books/              # Books pages
│   │   └── ...
│   ├── admin/                   # Admin portal (protected)
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── ...
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth
│   │   ├── newsletter/         # Newsletter API
│   │   └── ...
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── intro/                   # Intro sequence
│   ├── layout/                  # Header, Footer
│   ├── providers/               # Context providers
│   └── ui/                      # Reusable UI components
├── lib/                         # Utilities
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # NextAuth config
│   ├── upload.ts               # File uploads
│   ├── utils.ts                # Helper functions
│   └── validations.ts          # Zod schemas
├── models/                      # Mongoose models
│   ├── AdminUser.ts
│   ├── Book.ts
│   ├── Service.ts
│   └── ...
├── public/                      # Static assets
│   └── uploads/                # User-uploaded images
└── scripts/                     # Utility scripts
    └── seed.ts                 # Database seeder
```

---

## 📄 Creating New Pages

### 1. Public Pages (Next.js App Router)

Create a new folder in `app/` with a `page.tsx`:

```typescript
// app/new-page/page.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';

export const metadata = {
  title: 'Page Title | Samuel Louis Jean Publications',
  description: 'Page description for SEO',
};

export default function NewPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-midnight-300">
        <Header />
        
        <main>
          {/* Your content here */}
        </main>
        
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
```

### 2. Dynamic Pages (e.g., /books/[slug])

```typescript
// app/books/[slug]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Book from '@/models/Book';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const book = await Book.findOne({ slug, isPublished: true });
  
  if (!book) return {};
  
  return {
    title: `${book.title} | Samuel Louis Jean Publications`,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const book = await Book.findOne({ slug, isPublished: true }).lean();
  
  if (!book) {
    notFound();
  }
  
  return (
    <div>
      {/* Render book details */}
    </div>
  );
}
```

---

## 🔌 Creating API Routes

### Basic API Route Structure:

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { exampleSchema } from '@/lib/validations';

// GET request
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Your logic here
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST request with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const validatedData = exampleSchema.parse(body);
    
    await connectDB();
    // Your logic here
    
    return NextResponse.json(
      { success: true, message: 'Created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Protected API Route (Admin Only):

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Your protected logic here
}
```

---

## 🗄️ Adding Models

### Creating a New Mongoose Model:

```typescript
// models/Example.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExample extends Document {
  title: string;
  description: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<IExample>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes
ExampleSchema.index({ displayOrder: 1 });
ExampleSchema.index({ isPublished: 1 });

const Example: Model<IExample> =
  mongoose.models.Example || mongoose.model<IExample>('Example', ExampleSchema);

export default Example;
```

---

## 🖼️ Working with Images

### 1. Uploading Images (API Route):

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const result = await uploadImage(file, folder);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

### 2. Using Images in Components:

```typescript
import Image from 'next/image';

// For uploaded images
<Image
  src={book.coverImage || '/placeholder.jpg'}
  alt={book.coverImageAlt || book.title}
  width={400}
  height={600}
  className="rounded-lg"
/>

// For static images
<Image
  src="/images/hero-bg.jpg"
  alt="Hero background"
  fill
  className="object-cover"
  priority
/>
```

### 3. Adding Images from /images Folder:

The images in your `/images` folder can be:
1. Moved to `/public/images/` to use directly
2. Uploaded through the admin panel once it's built
3. Seeded into the database with the seed script

---

## 👨‍💼 Admin Portal Development

### Creating an Admin Page:

```typescript
// app/admin/example/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminExamplePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      {/* Admin content */}
    </div>
  );
}
```

### Admin Layout Pattern:

```typescript
// app/admin/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

---

## 🎬 Animation Guidelines

### Using Framer Motion:

```typescript
import { motion } from 'framer-motion';

// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  Content
</motion.div>

// Staggered children
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### GSAP for Advanced Animations:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.animate-item', {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);
    
    return () => ctx.revert(); // Cleanup
  }, []);
  
  return (
    <section ref={sectionRef}>
      {/* Content */}
    </section>
  );
}
```

---

## 🔄 Common Patterns

### Loading States:

```typescript
'use client';

import { useState } from 'react';

export default function ExampleComponent() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Success
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

### Form Handling with React Hook Form:

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });
  
  const onSubmit = async (data: any) => {
    // Handle submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Name"
      />
      {errors.name && (
        <span className="error">{errors.name.message}</span>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB
Start-Service MongoDB

# Test connection
mongosh
```

### Port Already in Use:
```bash
# Find and kill process (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### TypeScript Errors:
```bash
# Check types
npm run type-check

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Clear Next.js Cache:
```bash
# Delete .next folder and rebuild
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server

# Database
npm run seed            # Seed database
npm run seed -- --clear # Clear and reseed

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript
```

---

## 🎯 Next Development Steps

1. **Complete public pages** - Focus on Books, Services, Gallery
2. **Build admin CRUD interfaces** - Start with Books and Services
3. **Implement shopping cart** - Cart state, persistence, checkout
4. **Add more API routes** - Contact, booking, admin APIs
5. **Integrate images** - Move images from /images folder
6. **Add animations** - Page transitions, scroll effects
7. **Test thoroughly** - All forms, cart, admin functions

---

**Happy Coding! 🚀**
