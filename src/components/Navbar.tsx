"use client";

import React, { useEffect, useState } from 'react';
import { Upload, User, LogOut, ChevronDown, Settings, Search, Zap } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';
import { Toast, useToast } from './Toast';
import { Logo } from './Logo';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  const renderAvatar = () => {
    if (profile?.avatar_url) {
        return <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" />;
    }
    if (isAdmin) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black/50 p-1.5">
                <Logo className="w-full h-full" />
            </div>
        );
    }
    const seed = profile?.username || user?.email || 'default';
    return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt="Avatar" className="w-full h-full object-cover" />;
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-border-custom bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* LOGO AREA - HİZALAMA DÜZELTİLDİ */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Logo className="w-10 h-10 md:w-14 md:h-14 transition-transform group-hover:scale-105" />
          <div className="flex flex-col justify-center">
            <span className="text-sm md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">sytexarchive</span>
            {authLoaded && (
               <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-primary mt-0.5 italic">
                {isAdmin ? 'ADMIN' : 'EDITOR'}
              </span>
            )}
          </div>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 max-w-[120px] sm:max-w-sm relative group md:flex">
            <div className="absolute inset-y-0 left-3 md:left-4 flex items-center text-white/30 group-focus-within:text-primary transition-colors">
                <Search className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
            </div>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full bg-[#111] border border-border-custom rounded-xl md:rounded-2xl py-2 md:py-2.5 pl-9 md:pl-12 pr-4 text-[9px] md:text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" 
            />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 md:gap-2 h-9 md:h-10 px-2 md:px-4 rounded-xl border border-border-custom bg-[#111] hover:bg-[#222] transition-all text-white">
              <span className="text-[8px] md:text-[10px] font-black uppercase">{language}</span>
              <ChevronDown className={`transition-transform duration-200 w-3 h-3 md:w-3.5 md:h-3.5 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-12 right-0 w-32 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 z-[2000] animate-in fade-in slide-in-from-top-2">
                {['tr', 'en', 'es', 'fr', 'de', 'ru', 'ar', 'zh', 'ja', 'pt'].map((l) => (
                    <button key={l} onClick={() => { setLanguage(l as Language); setIsLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase mb-1 ${language === l ? 'bg-primary text-white' : 'text-white/60 hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          {authLoaded ? (
            user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/upload" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
                  <Upload size={14} />
                  <span className="hidden lg:inline">{t('upload')}</span>
                </Link>
                
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 md:w-10 h-9 md:h-10 rounded-xl overflow-hidden border border-border-custom hover:border-primary transition-all bg-[#111] shadow-inner">
                    {renderAvatar()}
                  </button>
                  
                  {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-[2000] md:hidden" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute top-12 right-0 w-56 md:w-64 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 z-[3000]">
                            <div className="px-4 py-4 border-b border-border-custom mb-1">
                                <p className="text-[10px] md:text-xs font-black uppercase italic text-white line-clamp-1">@{profile?.username || 'user'}</p>
                            </div>
                            <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all text-white/60 italic">
                                <Settings size={16} />
                                {t('settings')}
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10 text-red-500 transition-all italic">
                                <LogOut size={16} />
                                {t('logout')}
                            </button>
                        </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/login" className="text-[9px] md:text-[10px] font-black uppercase text-white/70 hover:text-primary transition-colors">{t('login')}</Link>
                <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase">{t('register')}</Link>
              </div>
            )
          ) : (
            <div className="w-9 md:w-10 h-9 md:h-10 bg-[#111] animate-pulse rounded-xl" />
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </nav>
  );
};

export default Navbar;
