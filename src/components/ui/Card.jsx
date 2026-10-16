import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-card',
    subtle: 'bg-slate-50/70 border border-slate-200/60',
    elevated: 'bg-white border border-slate-200/80 shadow-elevated',
    glass: 'bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-card',
  };

  const hoverStyle = hover
    ? 'transition-all duration-200 hover:shadow-card-hover hover:border-slate-300'
    : '';

  return (
    <div
      className={`rounded-2xl ${variantStyles[variant] || variantStyles.default} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 rounded-b-2xl ${className}`} {...props}>
    {children}
  </div>
);
