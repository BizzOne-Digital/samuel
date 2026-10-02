import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AmazonLink = {
  label: string;
  url: string;
};

export const AMAZON_STOREFRONT_URL = 'https://a.co/d/0j4aIOCK';

/** Use book-specific links when present; otherwise link to the author Amazon storefront. */
export function resolveAmazonLinks(links?: AmazonLink[]): AmazonLink[] {
  if (links?.length) return links;
  return [{ label: 'Author Storefront', url: AMAZON_STOREFRONT_URL }];
}

export function AmazonPurchaseLinks({
  links,
  className,
  size = 'default',
}: {
  links: AmazonLink[];
  className?: string;
  size?: 'default' | 'compact';
}) {
  if (!links?.length) return null;

  const isCompact = size === 'compact';

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {links.map((link) => (
        <a
          key={`${link.url}-${link.label}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wider transition-all duration-300',
            isCompact
              ? 'px-4 py-2 text-xs border border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-black'
              : 'px-8 py-4 text-sm bg-[#FF9900] hover:bg-[#E88B00] text-black'
          )}
        >
          <ExternalLink size={isCompact ? 14 : 18} />
          {isCompact ? (
            <span className="truncate">{link.label}</span>
          ) : (
            `Buy on Amazon — ${link.label}`
          )}
        </a>
      ))}
    </div>
  );
}
