"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AssetGrid from "@/components/AssetGrid";
import { useLanguage } from "@/utils/LanguageContext";
import { Toast, useToast } from "@/components/Toast";

export default function Home() {
  const { t } = useLanguage();
  const { toast, showToast, hideToast } = useToast();
  
  // MERKEZİ STATE: Arama ve Kategori artık burada yönetiliyor
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(t('tags.all'));

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Navbar'a arama fonksiyonunu gönderdik */}
      <Navbar onSearch={setSearchQuery} />
      
      <main className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div id="assets" className="container mx-auto pb-10">
          {/* Hero'ya kategori seçim fonksiyonunu gönderdik */}
          <Hero activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          
          {/* AssetGrid artık arama ve kategoriye göre süzülüyor */}
          <AssetGrid searchQuery={searchQuery} activeCategory={activeCategory} />
        </div>
      </main>
      
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase italic tracking-tighter text-white/30">sytexarchive</span>
        </div>
        <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} sytexarchive. Tüm hakları saklıdır.
        </p>
      </footer>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { overflow: hidden !important; height: 100vh; }
      `}</style>
    </div>
  );
}
