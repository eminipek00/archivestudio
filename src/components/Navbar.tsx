"use client";

import React, { useEffect, useState } from 'react';
import { Archive, Upload, User, LogOut, ChevronDown, Settings, Search, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';
import { Toast, useToast } from './Toast';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const supabase = createClient();
  const { t, setLanguage, language } = useLanguage();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (authUser) {
        const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        setProfile(data);
      }
      setAuthLoaded(true);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Premium üyelik sistemi yakında aktif edilecektir!", "info");
  };

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-border-custom bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary p-2 rounded-xl shadow-lg">
            <Archive size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-white">sytexarchive</span>
            {authLoaded && (
               <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5 italic">
                {isAdmin ? t('admin') : t('editor')}
              </span>
            )}
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
            <button onClick={handlePremiumClick} className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-500 hover:text-yellow-400 transition-colors group">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-all">
                    <Zap size={14} className="fill-yellow-500" />
                </div>
                <span>PREMIUM</span>
            </button>
        </div>

        <div className="hidden md:flex flex-1 max-w-sm relative group">
            <div className="absolute inset-y-0 left-4 flex items-center text-white/30 group-focus-within:text-primary transition-colors">
                <Search size={18} />
            </div>
            <input type="text" placeholder={t('searchPlaceholder')} className="w-full bg-[#111] border border-border-custom rounded-2xl py-2.5 pl-12 pr-4 text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 h-10 px-4 rounded-xl border border-border-custom bg-[#111] hover:bg-[#222] transition-all text-white">
              <span className="text-[10px] font-black uppercase">{language}</span>
              <ChevronDown size={14} className={isLangOpen ? 'rotate-180' : ''} />
            </button>
            {isLangOpen && (
              <div className="absolute top-12 right-0 w-32 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 z-[2000]">
                {['tr', 'en', 'es', 'fr', 'de', 'ru', 'ar', 'zh', 'ja', 'pt'].map((l) => (
                    <button key={l} onClick={() => { setLanguage(l as Language); setIsLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase mb-1 ${language === l ? 'bg-primary text-white' : 'text-white/60 hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />

          {authLoaded ? (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/upload" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  <Upload size={14} />
                  <span>{t('upload')}</span>
                </Link>
                
                <div className="relative group">
                  <button className="w-10 h-10 rounded-xl overflow-hidden border border-border-custom hover:border-primary transition-all">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/40"><User size={20} /></div>}
                  </button>
                  <div className="absolute top-12 right-0 w-64 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[3000]">
                    <div className="px-4 py-4 border-b border-border-custom mb-1">
                        <p className="text-xs font-black uppercase italic text-white">@{profile?.username || 'user'}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all text-white/60 italic"><Settings size={16} />{t('settings')}</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10 text-red-500 transition-all italic"><LogOut size={16} />{t('logout')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-[10px] font-black uppercase text-white/70 hover:text-primary transition-colors">{t('login')}</Link>
                <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase">{t('register')}</Link>
              </div>
            )
          ) : (
            <div className="w-10 h-10 bg-[#111] animate-pulse rounded-xl" />
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </nav>
  );
};

export default Navbar;
