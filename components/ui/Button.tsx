import Link from 'next/link';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'link';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-sans font-medium',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'relative overflow-hidden group'
  );

  const variants = {
    primary: cn(
      'bg-midnight-300 text-cream border-2 border-midnight-300',
      'hover:bg-midnight-200 hover:border-midnight-200',
      'hover:shadow-lg hover:shadow-midnight-500/20'
    ),
    secondary: cn(
      'bg-cream text-midnight-300 border-2 border-cream',
      'hover:bg-parchment hover:border-parchment',
      'hover:shadow-lg hover:shadow-cream/20'
    ),
    outline: cn(
      'bg-transparent text-cream border-2 border-cream/30',
      'hover:border-cream hover:bg-cream/5'
    ),
    ghost: cn(
      'bg-transparent text-cream border-2 border-transparent',
      'hover:bg-cream/10 hover:border-cream/20'
    ),
    gold: cn(
      'bg-gold text-midnight-300 border-2 border-gold',
      'hover:bg-gold-600 hover:border-gold-600',
      'hover:shadow-lg hover:shadow-gold/30'
    ),
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (props.as === 'link') {
    const { as, href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </Link>
    );
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </button>
  );
};

export default Button;
