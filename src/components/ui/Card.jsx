import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm text-slate-100',
    subtle: 'bg-slate-850/80 border border-slate-800/80 text-slate-100',
    elevated: 'bg-slate-900 border border-slate-750 shadow-2xl text-slate-100',
    glass: 'bg-slate-900/70 backdrop-blur-md border border-slate-800/80 shadow-xl text-slate-100',
  };

  const hoverStyle = hover
    ? 'transition-all duration-200 hover:shadow-2xl hover:border-slate-700'
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
  <div className={`p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between text-white ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-5 border-t border-slate-800 bg-slate-950/40 rounded-b-2xl ${className}`} {...props}>
    {children}
  </div>
);
