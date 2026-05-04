"use client";

import React, { useState, useEffect } from 'react';
import { Globe, LogIn, UserPlus, Upload, LogOut, Settings, Search, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  
  const { language, setLanguage, t } = useLanguage();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        setProfile(profileData);
      }
    };
    getUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearch) onSearch(val);
  };

  // Sadece isimler kalsın, bayraklar ve kodlar kaldırıldı
  const languages: { code: Language; name: string }[] = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'az', name: 'Azərbaycan' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'pt', name: 'Português' },
  ];

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled ? 'py-3 bg-black/80 backdrop-blur-2xl border-b border-border-custom' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 transform group-hover:rotate-12 transition-transform duration-500">
            <Logo className="w-full h-full text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white leading-none uppercase italic">SYTEX<span className="text-primary">ARCHIVE</span></span>
            <span className="text-[7px] font-black tracking-[0.4em] text-white/30 leading-none uppercase mt-1">Professional Digital Assets</span>
          </div>
        </Link>

        {/* SEARCH BAR (Eğer onSearch varsa göster) */}
        {onSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
            <input type="text" value={localSearch} onChange={handleSearchChange} placeholder={t('searchPlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all" />
          </div>
        )}

        {/* NAVIGATION & ACTIONS */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* LANGUAGE SELECTOR (SADELEŞTİRİLMİŞ) */}
          <div className="relative">
            <button onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <Globe size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{languages.find(l => l.code === language)?.name}</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-card border border-border-custom rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }} className={`flex items-center justify-start px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang.code ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/upload" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <Upload size={14} /> {t('upload')}
                </Link>
              )}
              
              <div className="relative">
                <button onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); }} className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary transition-all p-0.5 bg-white/5">
                  <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover rounded-lg" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-card border border-border-custom rounded-[2.5rem] p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 p-4 border-b border-white/5 mb-2">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                        <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-black text-white uppercase italic truncate">@{profile?.username || 'user'}</span>
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{isAdmin ? t('admin') : t('editor')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1">
                      <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={16} /> {t('settings').toUpperCase()}
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={16} /> {t('logout').toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                <LogIn size={14} /> {t('login')}
              </Link>
              <Link href="/auth" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <UserPlus size={14} /> {t('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
