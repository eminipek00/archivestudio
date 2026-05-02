"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import AssetGrid from "@/components/AssetGrid";
import { useLanguage } from "@/utils/LanguageContext";
import { Archive } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div id="assets">
          <Hero />
          <FilterBar />
          <AssetGrid />
        </div>
      </main>
      
      <footer className="border-t border-border-custom bg-[#000000] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-primary p-2 rounded-xl">
                <Archive size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">sytexarchive</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 italic">
            Profesyonel Editörler İçin Premium Kaynaklar.
          </p>
          <div className="max-w-xs mx-auto h-px bg-white/10 mb-6" />
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} sytexarchive. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
