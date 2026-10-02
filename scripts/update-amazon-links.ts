/**
 * Updates Amazon purchase links on existing books without re-running full seed.
 * Run: npx tsx scripts/update-amazon-links.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Book from '../models/Book';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const STOREFRONT = 'https://a.co/d/0j4aIOCK';

const AMAZON_BY_SLUG: Record<string, Array<{ label: string; url: string }>> = {
  'comprendre-la-vie-a-deux-dans-le-mariage': [
    { label: 'French Edition', url: 'https://a.co/d/0jkzZOqK' },
    {
      label: 'Understanding Life Together in Marriage (English)',
      url: 'https://a.co/d/0iXiUt0v',
    },
  ],
  'jaime-mon-eglise': [
    { label: 'French Edition', url: 'https://a.co/d/08QT8jpq' },
    { label: 'I Love My Church (English)', url: 'https://a.co/d/08v5YmUI' },
  ],
  'franchir-les-obstacles': [{ label: 'Author Storefront', url: STOREFRONT }],
  'overcoming-obstacles': [{ label: 'Author Storefront', url: STOREFRONT }],
  'triompher-de-ladversite': [{ label: 'Author Storefront', url: STOREFRONT }],
};

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env.local');
  }

  await mongoose.connect(MONGODB_URI);

  for (const [slug, amazonLinks] of Object.entries(AMAZON_BY_SLUG)) {
    const result = await Book.findOneAndUpdate(
      { slug },
      { $set: { amazonLinks } },
      { new: true }
    );
    if (result) {
      console.log(`Updated Amazon links: ${slug}`);
    } else {
      console.warn(`Book not found: ${slug}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
