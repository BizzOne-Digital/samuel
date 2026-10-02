# Samuel Louis Jean Publications

A premium full-stack website and custom CMS for Samuel Louis Jean Publications, featuring cinematic animations, multilingual support, e-commerce functionality, and a comprehensive admin portal.

## 🚀 Features

### Public Website
- **Cinematic intro sequence** with skip functionality
- **Smooth scroll** experience using Lenis
- **Advanced animations** with GSAP and Framer Motion
- **Responsive design** optimized for all devices
- **Multilingual support** (English, French, Haitian Creole)
- **E-commerce functionality** with cart and checkout
- **Blog system** with categories and tags
- **Gallery** with lightbox
- **Booking system** for speaking engagements
- **Contact forms** with spam protection
- **Newsletter subscription**
- **SEO optimized** with meta tags and structured data

### Admin Portal
- **Secure authentication** with NextAuth
- **Dashboard** with real-time statistics
- **Content management** for all pages
- **Book management** with inventory tracking
- **Service management** with dynamic detail pages
- **Pricing & offers** configuration
- **Gallery management** by category
- **Testimonials** management
- **FAQ** management with categories
- **Blog management** with rich content
- **Booking requests** viewer
- **Order management** system
- **Contact messages** inbox
- **Newsletter subscribers** list
- **Global settings** configuration
- **Image upload** system with validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (optional but recommended) - [Download](https://www.mongodb.com/try/download/compass)

### Installing MongoDB

#### Windows
1. Download MongoDB Community Server from the official website
2. Run the installer and follow the installation wizard
3. MongoDB will typically install to `C:\Program Files\MongoDB\Server\{version}\bin`
4. The MongoDB service should start automatically
5. Verify installation by opening Command Prompt and running: `mongod --version`

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Using MongoDB Compass

MongoDB Compass is a GUI tool for managing your MongoDB databases:

1. Download and install MongoDB Compass
2. Open MongoDB Compass
3. Connect using the connection string: `mongodb://localhost:27017`
4. You'll see the `samuel-louis-jean` database after running the seed script
5. Use Compass to view collections, documents, and run queries

## 🛠️ Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:
```bash
copy .env.example .env.local
```

Edit `.env.local` and configure the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/samuel-louis-jean

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-characters

# Initial Admin Account
ADMIN_EMAIL=admin@samuellouis jean.com
ADMIN_PASSWORD=Admin123!

# Application Configuration
NODE_ENV=development

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/avif

# Site Configuration
SITE_URL=http://localhost:3000
DEFAULT_LOCALE=en
```

**Important:** Generate a secure `NEXTAUTH_SECRET` using:
```bash
openssl rand -base64 32
```
Or use an online generator.

4. **Ensure MongoDB is running**

Check if MongoDB is running:
```bash
# Windows (PowerShell)
Get-Service MongoDB

# macOS/Linux
sudo systemctl status mongod
```

If not running, start it:
```bash
# Windows
Start-Service MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

5. **Seed the database**

Run the seed script to create initial data:
```bash
npm run seed
```

To clear existing data and reseed:
```bash
npm run seed -- --clear
```

The seed script will:
- Create an admin user (email and password from .env.local)
- Set up site settings with contact information
- Create sample pages (Home, About, Services, etc.)
- Add sample services
- Add sample books
- Create pricing offers ($25 single book, $60 three books)
- Add gallery categories
- Create sample testimonials
- Add sample FAQs
- Set up basic blog posts

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Access Admin Portal

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with the credentials from your `.env.local` file:
   - Default email: `admin@samuellouis jean.com`
   - Default password: `Admin123!`

## 📦 Production Build

Build the application for production:
```bash
npm run build
```

Test the production build locally:
```bash
npm run start
```

## 🗂️ Project Structure

```
samuel-louis-jean-publications/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── admin/               # Admin portal pages
│   ├── (public)/            # Public pages
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── intro/               # Cinematic intro
│   ├── layout/              # Header, Footer
│   ├── providers/           # Context providers
│   └── ui/                  # UI components
├── lib/                     # Utility libraries
│   ├── db.ts               # MongoDB connection
│   ├── auth.ts             # NextAuth configuration
│   ├── upload.ts           # Image upload handler
│   ├── utils.ts            # Utility functions
│   └── validations.ts      # Zod schemas
├── models/                  # Mongoose models
│   ├── AdminUser.ts
│   ├── Book.ts
│   ├── Service.ts
│   ├── Page.ts
│   └── ... (other models)
├── public/                  # Static assets
│   └── uploads/            # Uploaded images
├── scripts/                 # Utility scripts
│   └── seed.ts             # Database seed script
├── .env.local              # Environment variables (not in git)
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npm run type-check` - Check TypeScript types

## 🖼️ Image Uploads

### Local File Storage

This project uses local file storage for uploads:

- **Location:** `/public/uploads/`
- **Subfolders:** `pages/`, `books/`, `services/`, `gallery/`, `testimonials/`, `blogs/`, `settings/`

### Important Notes

1. **Development:** Uploaded files are stored locally and persist across restarts
2. **Production (Traditional Hosting):** Ensure the uploads directory has write permissions
3. **Production (Serverless/Vercel/Netlify):** Local uploads will NOT persist. You need to:
   - Use a cloud storage service (AWS S3, Cloudinary, etc.)
   - Or use a hosting platform with persistent storage

### Backup Recommendations

Regularly backup:
1. MongoDB database: `mongodump --db samuel-louis-jean --out backup/`
2. Uploaded images: Copy the `/public/uploads/` folder

## 🌐 Multilingual Support

The site supports three languages:
- **English** (en) - Default
- **French** (fr)
- **Haitian Creole** (ht)

Language can be switched using the globe icon in the header.

## 💳 E-Commerce & Orders

### Current Payment Setup

The checkout system collects order information but does not process live payments. Orders are saved to the database with "pending" payment status.

### To Enable Live Payments

Integrate a payment provider:
- Stripe
- PayPal
- Square
- Authorize.Net

Update the checkout API route to process payments before creating orders.

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT-based authentication** with NextAuth
- **Rate limiting** on public forms
- **Honeypot fields** for spam prevention
- **Input validation** with Zod
- **SQL injection protection** via Mongoose
- **XSS protection** via sanitized inputs
- **CSRF protection** via HTTP-only cookies
- **File upload validation** (type, size, extension)

## 🎨 Design System

### Colors
- **Midnight** - Primary dark background
- **Espresso** - Secondary dark
- **Cream** - Light text and sections
- **Parchment** - Editorial sections
- **Gold** - Primary accent
- **Bronze** - Secondary accent

### Typography
- **Display Font:** Playfair Display (serif)
- **Body Font:** Inter (sans-serif)

### Animations
- **Lenis** - Smooth scrolling
- **GSAP** - Advanced animations and ScrollTrigger
- **Framer Motion** - React-based animations

## 🚨 Common Issues

### MongoDB Connection Failed
```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running:
```bash
# Windows
Start-Service MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port 3000 Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process or use a different port:
```bash
# Kill process on port 3000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Use different port
PORT=3001 npm run dev
```

### Upload Directory Permissions (Production)
```
Error: EACCES: permission denied
```
**Solution:** Set correct permissions:
```bash
chmod -R 755 public/uploads
```

### NextAuth Secret Missing
```
Error: [next-auth][error][NO_SECRET]
```
**Solution:** Ensure `NEXTAUTH_SECRET` is set in `.env.local`

## 📚 Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **Mongoose** - ODM
- **NextAuth** - Authentication
- **GSAP** - Animations
- **Framer Motion** - React animations
- **Lenis** - Smooth scroll
- **Zod** - Validation
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **bcrypt** - Password hashing

## 📧 Contact Information

**Email:** dr.louisjean@yahoo.com  
**Phone:** 904-444-3061  
**Address:** 1615 Night Owl Trail, Middleburg, FL 32068

## 📄 License

© 2026 Samuel Louis Jean Publications. All rights reserved.

## 🙏 Support

For issues, questions, or support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Samuel Louis Jean Publications**
