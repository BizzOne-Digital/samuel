/**
 * Replaces legacy "Dr. Jean" with "Dr. Louis-Jean" in MongoDB content.
 * Run: npm run fix-dr-jean-copy
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Testimonial from '../models/Testimonial';
import FAQ from '../models/FAQ';
import Page from '../models/Page';
import Service from '../models/Service';
import { normalizeHonoreeText } from '../lib/normalize-honoree-text';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function needsNormalize(text: string): boolean {
  return /\bDr\.\s*Jean\b/i.test(text) || /\bDR\.\s*JEAN\b/.test(text);
}

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env.local');
  }

  await mongoose.connect(MONGODB_URI);

  let testimonialUpdates = 0;
  const testimonials = await Testimonial.find({});
  for (const doc of testimonials) {
    const next = normalizeHonoreeText(doc.quote);
    if (next !== doc.quote) {
      doc.quote = next;
      await doc.save();
      testimonialUpdates++;
    }
  }

  let faqUpdates = 0;
  const faqs = await FAQ.find({});
  for (const doc of faqs) {
    const nextQ = normalizeHonoreeText(doc.question);
    const nextA = normalizeHonoreeText(doc.answer);
    if (nextQ !== doc.question || nextA !== doc.answer) {
      doc.question = nextQ;
      doc.answer = nextA;
      await doc.save();
      faqUpdates++;
    }
  }

  let pageUpdates = 0;
  const pages = await Page.find({});
  for (const doc of pages) {
    let changed = false;
    for (const section of doc.sections) {
      for (const key of [
        'eyebrow',
        'heading',
        'subheading',
        'body',
        'primaryCtaLabel',
        'secondaryCtaLabel',
        'imageAlt',
      ] as const) {
        const value = section[key];
        if (typeof value === 'string' && needsNormalize(value)) {
          section[key] = normalizeHonoreeText(value);
          changed = true;
        }
      }
    }
    if (doc.metaTitle && needsNormalize(doc.metaTitle)) {
      doc.metaTitle = normalizeHonoreeText(doc.metaTitle);
      changed = true;
    }
    if (doc.metaDescription && needsNormalize(doc.metaDescription)) {
      doc.metaDescription = normalizeHonoreeText(doc.metaDescription);
      changed = true;
    }
    if (changed) {
      await doc.save();
      pageUpdates++;
    }
  }

  let serviceUpdates = 0;
  const services = await Service.find({});
  for (const doc of services) {
    let changed = false;
    if (doc.shortDescription && needsNormalize(doc.shortDescription)) {
      doc.shortDescription = normalizeHonoreeText(doc.shortDescription);
      changed = true;
    }
    if (doc.hero?.description && needsNormalize(doc.hero.description)) {
      doc.hero.description = normalizeHonoreeText(doc.hero.description);
      changed = true;
    }
    if (doc.hero?.title && needsNormalize(doc.hero.title)) {
      doc.hero.title = normalizeHonoreeText(doc.hero.title);
      changed = true;
    }
    for (const section of doc.detailSections ?? []) {
      if (section.content && needsNormalize(section.content)) {
        section.content = normalizeHonoreeText(section.content);
        changed = true;
      }
      if (section.heading && needsNormalize(section.heading)) {
        section.heading = normalizeHonoreeText(section.heading);
        changed = true;
      }
    }
    if (changed) {
      await doc.save();
      serviceUpdates++;
    }
  }

  console.log(`Updated testimonials: ${testimonialUpdates}`);
  console.log(`Updated FAQs: ${faqUpdates}`);
  console.log(`Updated pages: ${pageUpdates}`);
  console.log(`Updated services: ${serviceUpdates}`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
