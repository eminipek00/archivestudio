import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
        {/* Keskin ve Yıldırımlı S Formu */}
        <path 
          d="M75 20L35 45L55 50L25 80L65 55L45 50L75 20Z" 
          fill="#3B82F6" 
          className="animate-pulse"
        />
        <path 
          d="M70 25L40 43.75L57.5 48.75L35 70L60 51.25L42.5 46.25L70 25Z" 
          fill="white" 
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
};
