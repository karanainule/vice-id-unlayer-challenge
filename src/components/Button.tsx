import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { clsx } from '../utils/clsx';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'bg-surface2 text-paper border border-white/10 hover:border-accent/50 hover:text-accent',
  ghost: 'bg-transparent text-paper hover:bg-white/5',
  outline: 'bg-transparent border border-white/20 text-paper hover:border-primary hover:text-primary',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonClasses(variant, size, className)} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

interface LinkButtonProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}

/** Same visual treatment as Button, but renders a real <a> via react-router Link. */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <Link ref={ref} className={buttonClasses(variant, size, className)} {...props}>
        {children}
      </Link>
    );
  },
);

LinkButton.displayName = 'LinkButton';
