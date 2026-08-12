import { revalidatePath } from 'next/cache';

const PUBLIC_PATHS = [
  '/',
  '/books',
  '/pricing',
  '/faqs',
  '/testimonials',
  '/contact',
  '/gallery',
  '/about',
] as const;

export function revalidatePublicPages() {
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path);
  }
}

export function revalidatePageSlug(slug?: string) {
  revalidatePublicPages();

  if (!slug) return;

  const normalized = slug.startsWith('/') ? slug : `/${slug}`;
  if (!PUBLIC_PATHS.includes(normalized as (typeof PUBLIC_PATHS)[number])) {
    revalidatePath(normalized);
  }
}
