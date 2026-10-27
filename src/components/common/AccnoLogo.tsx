'use client';

import React from 'react';

interface AccnoLogoProps {
  className?: string;
  height?: number;
  showTagline?: boolean;
}

export const AccnoLogo: React.FC<AccnoLogoProps> = ({
  className = '',
  height = 42,
  showTagline = true,
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="ACCNO SOLUTION - I.T. Done Right"
        style={{ height: `${height}px` }}
        className="w-auto object-contain transition-all hover:brightness-110"
      />
    </div>
  );
};
