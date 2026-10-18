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
    primary: 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-600/20 focus:ring-brand-500/30',
    gradient: 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-600/30 focus:ring-brand-500/30',
    secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 shadow-sm focus:ring-slate-700',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/80 focus:ring-slate-700',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 focus:ring-rose-500/40',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500/30',
    subtle: 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 focus:ring-slate-700',
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
