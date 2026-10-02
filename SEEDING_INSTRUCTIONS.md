# Database Seeding Instructions

## How to Seed the Database with Books

### Step 1: Make sure MongoDB is running
Ensure your MongoDB connection string is correct in `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
```

### Step 2: Run the seed script
```bash
npm run seed
```

Or to clear existing data first:
```bash
npm run seed -- --clear
```

### Step 3: Add Book Images
Place your book cover images in the `public/uploads/books/` folder with these names:
- `book-1.jpg` - Comprendre la vie à deux dans le mariage
- `book-2.jpg` - Franchir Les Obstacles
- `book-3.jpg` - Overcoming Obstacles
- `book-4.jpg` - J'aime Mon Eglise

### Step 4: Access Admin Portal
1. Go to: http://localhost:3004/admin/login
2. Login with:
   - Email: `admin@samuellouis jean.com` (or your ADMIN_EMAIL from .env.local)
   - Password: `Admin123!` (or your ADMIN_PASSWORD from .env.local)

### Step 5: Manage Books
From the admin dashboard, you can:
- ✅ View all books
- ✅ Edit any book (title, description, price, images, etc.)
- ✅ Add new books
- ✅ Delete books
- ✅ Toggle featured status
- ✅ Publish/unpublish books
- ✅ Change display order

## Admin Portal Features

### Books Management (/admin/books)
- List all books with cover images
- Edit book details (French/English content supported)
- Add new books
- Delete books
- Upload book covers
- Set pricing
- Featured/Published toggles

### Dashboard (/admin/dashboard)
- Overview of all admin functions
- Quick access to books, messages, testimonials, etc.

## Default Admin Credentials

**Email:** admin@samuellouis jean.com  
**Password:** Admin123!

⚠️ **IMPORTANT:** Change these credentials in production by updating your `.env.local` file:
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

Then run the seed script again to update the admin user.

## Books Included in Seed

1. **Comprendre la vie à deux dans le mariage** (French) - $25.00
2. **Franchir Les Obstacles** (French) - $25.00
3. **Overcoming Obstacles** (English) - $30.00
4. **J'aime Mon Eglise** (French) - $25.00

All books include full French descriptions as provided.
