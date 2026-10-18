import React from 'react';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({
  breadcrumb,
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 ${className}`}>
      <div className="space-y-1 min-w-0">
        {breadcrumb && (
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                <span className={index === breadcrumb.length - 1 ? 'text-brand-600 font-semibold' : ''}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
