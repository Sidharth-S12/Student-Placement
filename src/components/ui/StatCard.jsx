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
    slate: 'bg-slate-800 text-slate-300 border border-slate-700/80',
    brand: 'bg-brand-500/15 text-brand-400 border border-brand-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  };

  const valueColorStyles = {
    slate: 'text-white',
    brand: 'text-brand-400',
    emerald: 'text-emerald-400',
    indigo: 'text-indigo-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
  };

  return (
    <Card
      className={`p-5 flex flex-col justify-between ${
        onClick ? 'cursor-pointer card-hover-lift hover:border-slate-700 hover:shadow-xl group' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
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
          <p className="text-xs text-slate-400 mt-1 font-medium line-clamp-1">{subtext}</p>
        )}
      </div>

      {trend ? (
        <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{trend.label}</span>
          <span className={`font-bold ${trend.positive ? 'text-emerald-400' : 'text-slate-400'}`}>
            {trend.value}
          </span>
        </div>
      ) : onClick ? (
        <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-500 group-hover:text-brand-400 font-semibold flex items-center justify-between transition-colors">
          <span>Open Module</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      ) : null}
    </Card>
  );
};
