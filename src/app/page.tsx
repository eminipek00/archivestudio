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
        <Hero />
        <FilterBar />
        <AssetGrid />
      </main>
      
      <footer className="border-t border-border-custom bg-background/50 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Archive size={24} className="text-primary" />
            <span className="text-xl font-black tracking-tighter uppercase italic">sytexarchive</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
            {t('footerSub')}
          </p>
          <div className="w-12 h-0.5 bg-primary/20 mx-auto mb-6" />
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} sytexarchive. {t('footer')} | <span className="text-primary/40">v1.1.0</span>
          </p>
        </div>
      </footer>
    </>
  );
}
