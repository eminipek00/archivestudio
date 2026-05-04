"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Database, Heart, Trophy, ChevronLeft, Loader2, FolderOpen, EyeOff } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import AssetCard from "@/components/AssetCard";
import Link from "next/link";
import { useParams } from "next/navigation";

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [favoriteAssets, setFavoriteAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  
  const { t } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // 1. PROFİL BİLGİSİNİ ÇEK
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profileData) {
          setProfile(profileData);
          
          // 2. KİŞİNİN KENDİ YÜKLEDİĞİ ASSETLERİ ÇEK
          const { data: assetData } = await supabase
            .from('assets')
            .select(`*, profiles:author_id (username, avatar_url, full_name)`)
            .eq('author_id', userId)
            .order('created_at', { ascending: false });
            
          if (assetData) {
              setAssets(assetData);
              
              // GERÇEK TOPLAM BEĞENİ SAYISINI ÇEK (TÜM ASSETLERİ İÇİN)
              const assetIds = assetData.map(a => a.id);
              if (assetIds.length > 0) {
                  const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).in('asset_id', assetIds);
                  setTotalLikes(count || 0);
              }
          }

          // 3. FAVORİLERİNİ ÇEK (EĞER GİZLİ DEĞİLSE)
          if (profileData.show_favorites !== false) {
              const { data: likesData } = await supabase.from('likes').select('asset_id').eq('user_id', userId);
              if (likesData && likesData.length > 0) {
                  const favIds = likesData.map(l => l.asset_id);
                  const { data: favs } = await supabase.from('assets').select('*, profiles:author_id (username, avatar_url, full_name)').in('id', favIds);
                  if (favs) setFavoriteAssets(favs);
              }
          }
      }
      setLoading(false);
    };
    if (userId) fetchUserData();
  }, [userId, supabase]);

  if (loading) return <div className="h-screen w-full bg-black flex items-center justify-center"><Loader2 size={40} className="text-primary animate-spin" /></div>;
  if (!profile) return <div className="h-screen w-full bg-black flex items-center justify-center text-white font-black uppercase tracking-widest">Kullanıcı Bulunamadı</div>;

  const isAdmin = profile.email === 'ipekmuhammetemin@gmail.com' || profile.is_admin;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* GERİ DÖN BUTONU */}
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-white/30 hover:text-primary transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            ANA SAYFAYA DÖN
          </Link>

          {/* PROFİL BANNER */}
          <div className="bg-card border border-border-custom p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[4rem] overflow-hidden border-8 border-background shadow-2xl bg-[#111] shrink-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src={profile.avatar_url || '/logo.png'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <h1 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-2xl leading-none">{profile.full_name || 'Sytex Editor'}</h1>
                    {isAdmin && <span className="text-[10px] font-black bg-primary text-white px-4 py-2 rounded-2xl uppercase italic tracking-widest shadow-xl shadow-primary/20">{t('masterArchivist')}</span>}
                </div>
                <p className="text-lg font-black text-primary uppercase tracking-[0.4em] italic opacity-80">@{profile.username || 'user'}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all">
                        <Database size={20} className="text-primary" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white leading-none">{assets.length}</span>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{t('uploaded')}</span>
                        </div>
                    </div>
                    <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all">
                        <Heart size={20} className="text-red-500" fill="currentColor" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white leading-none">{totalLikes}</span>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{t('likes')}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* KULLANICI ASSETLERİ (VİTRİN) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border-custom" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white/40">EDİTÖR VİTRİNİ</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border-custom" />
            </div>
            {assets.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-white/20">
                    <FolderOpen size={64} className="mb-4 opacity-10" />
                    <span className="text-xs font-black uppercase tracking-widest">Henüz bir varlık paylaşılmamış.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                    {assets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} isAdmin={false} />
                    ))}
                </div>
            )}
          </div>

          {/* FAVORİ VARLIKLAR (GİZLİLİK KONTROLLÜ) */}
          <div className="space-y-8 pt-8">
            <div className="flex items-center gap-4 px-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border-custom" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white/40">FAVORİ VARLIKLAR</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border-custom" />
            </div>
            {profile.show_favorites === false ? (
                <div className="py-16 flex flex-col items-center justify-center text-white/10 text-center">
                    <EyeOff size={48} className="mb-4 opacity-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed italic">BU KULLANICI FAVORİ LİSTESİNİ GİZLEDİ.</p>
                </div>
            ) : favoriteAssets.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-white/10 text-center">
                    <Heart size={48} className="mb-4 opacity-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">HENÜZ FAVORİ VARLIK BULUNMUYOR.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                    {favoriteAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} isAdmin={false} />
                    ))}
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0 text-[8px] font-black uppercase text-white/30 italic"><span>sytexarchive</span><p>&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default UserProfilePage;
