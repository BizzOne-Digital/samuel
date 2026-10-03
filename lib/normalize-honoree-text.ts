/**
 * Ensures legacy CMS copy uses "Dr. Louis-Jean" instead of "Dr. Jean".
 */
export function normalizeHonoreeText(text: string | undefined | null): string {
  if (text == null || text === '') {
    return text ?? '';
  }

  return text
    .replace(/\bDr\.\s*Jean([''\u2019]s)\b/gi, "Dr. Louis-Jean$1")
    .replace(/\bDr\.\s*Jean\b/gi, 'Dr. Louis-Jean')
    .replace(/\bDR\.\s*JEAN(['']S)?\b/g, (_, possessive) =>
      possessive ? `DR. LOUIS-JEAN${possessive}` : 'DR. LOUIS-JEAN'
    );
}

const PAGE_SECTION_TEXT_FIELDS = [
  'eyebrow',
  'heading',
  'subheading',
  'body',
  'primaryCtaLabel',
  'secondaryCtaLabel',
  'imageAlt',
] as const;

export function normalizePageSection<T extends Record<string, unknown>>(
  section: T | undefined | null
): T | undefined {
  if (!section) return undefined;

  const next = { ...section } as T;
  for (const field of PAGE_SECTION_TEXT_FIELDS) {
    const value = next[field];
    if (typeof value === 'string') {
      (next as Record<string, string>)[field] = normalizeHonoreeText(value);
    }
  }
  return next;
}

export function normalizeTestimonialQuote<T extends { quote?: string }>(item: T): T {
  if (!item.quote) return item;
  return { ...item, quote: normalizeHonoreeText(item.quote) };
}

export function normalizeFaq<T extends { question?: string; answer?: string }>(item: T): T {
  return {
    ...item,
    question: item.question ? normalizeHonoreeText(item.question) : item.question,
    answer: item.answer ? normalizeHonoreeText(item.answer) : item.answer,
  };
}
