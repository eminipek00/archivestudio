"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";
import { useLanguage } from "@/utils/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Sabit Üst Menü */}
      <Navbar />
      
      {/* Orta Alan - KAYDIRMA ÇUBUĞU GİZLENDİ */}
      <main className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div id="assets" className="container mx-auto pb-10">
          <Hero />
          <FilterBar />
          <AssetGrid />
        </div>
      </main>
      
      {/* Sabit Alt Bar */}
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase italic tracking-tighter text-white/30">sytexarchive</span>
        </div>
        <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} sytexarchive. Tüm hakları saklıdır.
        </p>
      </footer>

      {/* TÜM KAYDIRMA ÇUBUKLARINI VE MAVİ ÇİZGİLERİ SİLEN ÖZEL KOD */}
      <style jsx global>{`
        /* Kaydırma çubuğunu tamamen gizle ama kaydırma özelliğini koru (mouse wheel çalışır) */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Sayfa genelinde kaymayı engelle */
        body {
          overflow: hidden !important;
          height: 100vh;
        }
      `}</style>
    </div>
  );
}
