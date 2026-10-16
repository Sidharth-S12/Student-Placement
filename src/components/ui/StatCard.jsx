import React from 'react';
import { Card } from './Card';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  colorScheme = 'slate', // slate | brand | emerald | indigo | amber | purple
  className = '',
  onClick,
}) => {
  const iconBgStyles = {
    slate: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const valueColorStyles = {
    slate: 'text-slate-900',
    brand: 'text-brand-600',
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
  };

  return (
    <Card
      className={`p-5 flex flex-col justify-between ${
        onClick ? 'cursor-pointer card-hover-lift hover:border-brand-500/50 hover:shadow-md group' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${onClick ? 'group-hover:scale-110' : ''} ${iconBgStyles[colorScheme] || iconBgStyles.slate}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${valueColorStyles[colorScheme] || valueColorStyles.slate}`}>
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1">{subtext}</p>
        )}
      </div>

      {trend ? (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{trend.label}</span>
          <span className={`font-bold ${trend.positive ? 'text-emerald-600' : 'text-slate-600'}`}>
            {trend.value}
          </span>
        </div>
      ) : onClick ? (
        <div className="mt-2 pt-1.5 border-t border-slate-100/60 text-[10px] text-slate-400 group-hover:text-brand-600 font-semibold flex items-center justify-between transition-colors">
          <span>Open Module</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      ) : null}
    </Card>
  );
};
