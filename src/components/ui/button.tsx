import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm active:scale-95 transition-all duration-200',
                    {
                        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
                        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                        'bg-accent text-accent-foreground hover:bg-accent/90': variant === 'accent',
                        'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground': variant === 'outline',
                        'hover:bg-accent/10 text-foreground': variant === 'ghost',
                        'h-9 px-4 py-2 text-sm': size === 'sm',
                        'h-11 px-6 py-2.5 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, cn };
