import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-neu font-semibold 
    transition-all duration-200 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    active:shadow-neu-pressed active:scale-[0.98]
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-br from-primary to-primary-dark text-white
      shadow-neu hover:shadow-neu-hover
      focus:ring-primary-light
    `,
    secondary: `
      bg-gradient-to-br from-secondary to-secondary/90 text-white
      shadow-neu hover:shadow-neu-hover
      focus:ring-secondary-light
    `,
    outline: `
      bg-surface text-text-primary border-2 border-border-soft
      shadow-neu-sm hover:shadow-neu hover:border-primary-light
      focus:ring-primary-light
    `,
    ghost: `
      bg-transparent text-text-secondary hover:text-primary
      hover:bg-surface-dark/50
      focus:ring-primary-light
    `,
    danger: `
      bg-gradient-to-br from-error to-red-700 text-white
      shadow-neu hover:shadow-neu-hover
      focus:ring-red-300
    `,
  };

  const sizes = {
    sm: "h-9 px-4 text-sm gap-1.5",
    md: "h-11 px-5 py-2.5 gap-2",
    lg: "h-13 px-7 py-3 text-lg gap-2.5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
