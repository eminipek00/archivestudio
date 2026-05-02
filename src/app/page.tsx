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
    <>
      <Navbar />
      <main className="flex-grow">
        <div id="assets">
          <Hero />
          <FilterBar />
          <AssetGrid />
        </div>
      </main>
      
      {/* Footer - DAHA DA AŞAĞIYA MONTE EDİLDİ */}
      <footer className="border-t border-border-custom bg-background/50 py-24 mt-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="bg-primary/20 p-2 rounded-xl">
                <Archive size={32} className="text-primary" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic">sytexarchive</span>
          </div>
          <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />
          <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 opacity-60">
            {t('footerSub')}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} sytexarchive. {t('footer')} | <span className="text-primary/30">v1.1.2</span>
          </p>
        </div>
      </footer>
    </>
  );
}
