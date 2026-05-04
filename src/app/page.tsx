"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AssetGrid from "@/components/AssetGrid";
import { useLanguage } from "@/utils/LanguageContext";
import { Toast, useToast } from "@/components/Toast";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const { t } = useLanguage();
  const { toast, showToast, hideToast } = useToast();
  const supabase = createClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(t('tags.all'));
  const [totalAssets, setTotalAssets] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
        const { count } = await supabase.from('assets').select('*', { count: 'exact', head: true });
        setTotalAssets(count || 0);
    };
    fetchCount();
  }, [supabase]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <main className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div id="assets" className="container mx-auto pb-10">
          <Hero 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
            totalAssets={totalAssets} 
          />
          <AssetGrid searchQuery={searchQuery} activeCategory={activeCategory} />
        </div>
      </main>
      
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase italic tracking-tighter text-white/30">sytexarchive</span>
        </div>
        <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest italic">
          &copy; {new Date().getFullYear()} sytexarchive. {t('footer')}
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
