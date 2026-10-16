import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs font-semibold px-3.5 py-2 gap-2',
    lg: 'text-sm font-semibold px-4 py-2.5 gap-2.5',
    icon: 'p-2',
  };

  const variantStyles = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-subtle focus:ring-slate-900/20',
    gradient: 'bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white shadow-subtle focus:ring-brand-500/25',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-subtle focus:ring-slate-300',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-300',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 focus:ring-rose-400',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-subtle focus:ring-emerald-500/20',
    subtle: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-300',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      ) : null}
    </button>
  );
};
