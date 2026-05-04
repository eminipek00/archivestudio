import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className}`}>
      {/* KULLANICININ SEÇTİĞİ EFSANE HEXAGON LOGO */}
      <img 
        src="/logo.png" 
        alt="Sytex Logo" 
        className="w-full h-full object-cover scale-110"
        onError={(e) => {
            // Eğer logo.png henüz yüklenmediyse yedek şık bir ikon göster
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-primary flex items-center justify-center text-white font-black text-xs italic">S</div>';
        }}
      />
    </div>
  );
};
