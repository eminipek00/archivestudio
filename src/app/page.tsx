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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchCount = async () => {
        const { count } = await supabase.from('assets').select('*', { count: 'exact', head: true });
        setTotalAssets(count || 0);

        // FETCH FOLLOWS & PROFILE
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const { data: profileData } = await supabase.from('profiles').select('username').eq('id', authUser.id).maybeSingle();
            if (profileData) setProfile(profileData);

            const { count: followers } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', authUser.id);
            setFollowerCount(followers || 0);
            const { count: following } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', authUser.id);
            setFollowingCount(following || 0);
        }
    };
    fetchCount();
  }, [supabase]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Navbar onSearch={setSearchQuery} />
      
      <main className="flex-grow pt-20 md:pt-24">
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
        <div className="flex flex-col min-w-0">
            <span className="text-[10px] md:text-xs font-black text-white uppercase italic truncate">@{profile?.username || 'user'}</span>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">{followerCount} {t('followers')}</span>
                <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">{followingCount} {t('following')}</span>
            </div>
        </div>
        <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest italic">
          &copy; {new Date().getFullYear()} sytexarchive. {t('footer')}
        </p>
      </footer>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
