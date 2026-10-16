import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-[11px] px-2.5 py-1 font-semibold',
    lg: 'text-xs px-3 py-1 font-bold',
  };

  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/70',
    primary: 'bg-brand-50 text-brand-700 border border-brand-200/60',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    dark: 'bg-slate-900 text-white border border-slate-800',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    primary: 'bg-brand-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
    dark: 'bg-emerald-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide select-none ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral}`} />
      )}
      {children}
    </span>
  );
};
