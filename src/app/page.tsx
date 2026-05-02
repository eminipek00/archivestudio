"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";
import { useLanguage } from "@/utils/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Sabit Üst Menü */}
      <Navbar />
      
      {/* Kaydırılabilir Orta Alan */}
      <main className="flex-grow overflow-y-auto custom-scrollbar">
        <div id="assets" className="container mx-auto">
          <Hero />
          <FilterBar />
          <AssetGrid />
          {/* Alttaki boşluğu doldurmak için görünmez bir alan */}
          <div className="h-20" />
        </div>
      </main>
      
      {/* Sabit ve Minicik Alt Bar (License) */}
      <footer className="z-[2000] bg-[#000000] border-t border-border-custom py-2 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase italic tracking-tighter text-white/40">sytexarchive</span>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest hidden sm:inline">| Profesyonel Editör Kaynakları</span>
        </div>
        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} sytexarchive. Tüm hakları saklıdır.
        </p>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
