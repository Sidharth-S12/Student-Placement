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
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700/80',
    primary: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    dark: 'bg-slate-950 text-slate-200 border border-slate-800',
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
