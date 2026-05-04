import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* LOGO GÖRSELİ - ÖLÇEKLENDİRME TEMİZLENDİ, TAM OTURTUYORUZ */}
      <img 
        src="/logo.png" 
        alt="Sytex Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-primary flex items-center justify-center text-white font-black text-xs italic">S</div>';
        }}
      />
    </div>
  );
};
