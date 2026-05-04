"use client";

import React, { useEffect, useState } from 'react';
import { Archive, Upload, User, LogOut, ChevronDown, Settings, Search, Zap, Menu } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';
import { Toast, useToast } from './Toast';

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

  const handlePremiumClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast("Premium üyelik sistemi yakında aktif edilecektir!", "info");
  };

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-border-custom bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary p-2 rounded-xl shadow-lg">
            <Archive size={20} className="text-white md:size-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl font-black tracking-tighter uppercase italic leading-none text-white">sytexarchive</span>
            {authLoaded && (
               <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-primary mt-0.5 italic">
                {isAdmin ? 'ADMIN' : 'EDITOR'}
              </span>
            )}
          </div>
        </Link>

        {/* PREMIUM - HIDDEN ON SMALL MOBILE */}
        <div className="hidden lg:flex items-center gap-6">
            <button onClick={handlePremiumClick} className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-500 hover:text-yellow-400 transition-colors group">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-all">
                    <Zap size={14} className="fill-yellow-500" />
                </div>
                <span>PREMIUM</span>
            </button>
        </div>

        {/* SEARCH - COMPACT ON MOBILE */}
        <div className="flex-1 max-w-[120px] sm:max-w-sm relative group md:flex">
            <div className="absolute inset-y-0 left-3 md:left-4 flex items-center text-white/30 group-focus-within:text-primary transition-colors">
                <Search size={14} md:size={18} />
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
          {/* LANG TOGGLE */}
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 md:gap-2 h-9 md:h-10 px-2 md:px-4 rounded-xl border border-border-custom bg-[#111] hover:bg-[#222] transition-all text-white">
              <span className="text-[8px] md:text-[10px] font-black uppercase">{language}</span>
              <ChevronDown size={12} md:size={14} className={isLangOpen ? 'rotate-180' : ''} />
            </button>
            {isLangOpen && (
              <div className="absolute top-12 right-0 w-32 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 z-[2000] animate-in fade-in slide-in-from-top-2">
                {['tr', 'en', 'es', 'fr', 'de', 'ru', 'ar', 'zh', 'ja', 'pt'].map((l) => (
                    <button key={l} onClick={() => { setLanguage(l as Language); setIsLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase mb-1 ${language === l ? 'bg-primary text-white' : 'text-white/60 hover:bg-muted'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {authLoaded ? (
            user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/upload" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
                  <Upload size={14} />
                  <span className="hidden lg:inline">{t('upload')}</span>
                </Link>
                
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 md:w-10 h-9 md:h-10 rounded-xl overflow-hidden border border-border-custom hover:border-primary transition-all bg-muted">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/40"><User size={18} md:size={20} /></div>}
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
                            <Link href="/upload" onClick={() => setIsProfileOpen(false)} className="sm:hidden flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all text-white/60 italic">
                                <Upload size={16} />
                                {t('upload')}
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
