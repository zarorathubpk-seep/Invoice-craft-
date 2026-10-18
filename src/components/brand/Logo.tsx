import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
}) => {
  const iconDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 32, h: 32 },
    lg: { w: 40, h: 40 },
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Geometric Document + Checkmark Symbol */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="InvoiceCraft Document Mark"
      >
        {/* Background rounded document silhouette */}
        <rect
          x="3"
          y="3"
          width="30"
          height="30"
          rx="7"
          className={isDark ? 'fill-slate-800 stroke-slate-700' : 'fill-blue-50 stroke-blue-100'}
          strokeWidth="1.5"
        />
        {/* Navy folded document page */}
        <path
          d="M10 8C8.89543 8 8 8.89543 8 10V26C8 27.1046 8.89543 28 10 28H23C24.1046 28 25 27.1046 25 26V14L19 8H10Z"
          fill={isDark ? '#1E293B' : '#102A43'}
        />
        {/* Fold corner accent */}
        <path
          d="M19 8V13C19 13.5523 19.4477 14 20 14H25L19 8Z"
          fill="#2563EB"
        />
        {/* Document horizontal precision lines */}
        <line x1="12" y1="13" x2="16" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="17" x2="21" y2="17" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        {/* Precision Paid Checkmark in Vibrant Teal */}
        <circle cx="23" cy="23" r="7" fill="#0D9488" />
        <path
          d="M20 23L22 25L26 21"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {variant === 'full' && (
        <span
          className={`font-bold tracking-tight ${textSizes} ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Invoice<span className="text-blue-600">Craft</span>
        </span>
      )}
    </div>
  );
};
