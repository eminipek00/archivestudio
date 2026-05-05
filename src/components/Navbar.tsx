"use client";

import React, { useState, useEffect } from 'react';
import { Globe, LogIn, UserPlus, Upload, LogOut, Settings, Search, Edit3, Check, Maximize2, Palette, MessageSquare } from 'lucide-react';
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  
  // LOGO & SITE EDITOR SETTINGS
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [logoSettings, setLogoSettings] = useState({ x: 0, y: 0, scale: 1 });

  const { language, setLanguage, t } = useLanguage();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const savedSettings = localStorage.getItem('sytexLogoSettings');
    if (savedSettings) setLogoSettings(JSON.parse(savedSettings));

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        setProfile(profileData);
      }
    };
    getUser();
  }, [supabase]);

  const saveLogoSettings = () => {
    localStorage.setItem('sytexLogoSettings', JSON.stringify(logoSettings));
    setIsEditingLogo(false);
  };

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
    <nav className="fixed top-0 left-0 right-0 z-[5000] py-3 md:py-4 bg-black border-b border-border-custom shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-8">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
                <div 
                  className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform duration-500 hover:rotate-12"
                  style={{ 
                    transform: `translate(${logoSettings.x}px, ${logoSettings.y}px) scale(${logoSettings.scale})` 
                  }}
                >
                    <Logo className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="text-base md:text-lg font-black tracking-tighter text-white leading-none uppercase italic">SYTEX<span className="text-primary">ARCHIVE</span></span>
                    <span className="text-[6px] md:text-[7px] font-black tracking-[0.4em] text-white/30 leading-none uppercase mt-1">Professional Digital Assets</span>
                </div>
            </Link>

            {isAdmin && (
                <div className="hidden sm:flex items-center ml-2">
                    {isEditingLogo ? (
                        <div className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded-xl border border-primary/30 shadow-2xl animate-in zoom-in-95 duration-200">
                            <input type="number" value={logoSettings.x} onChange={(e) => setLogoSettings({...logoSettings, x: parseInt(e.target.value) || 0})} className="w-8 bg-black text-[8px] text-white text-center rounded border border-white/10" />
                            <input type="number" value={logoSettings.y} onChange={(e) => setLogoSettings({...logoSettings, y: parseInt(e.target.value) || 0})} className="w-8 bg-black text-[8px] text-white text-center rounded border border-white/10" />
                            <input type="number" step="0.1" value={logoSettings.scale} onChange={(e) => setLogoSettings({...logoSettings, scale: parseFloat(e.target.value) || 1})} className="w-8 bg-black text-[8px] text-white text-center rounded border border-white/10" />
                            <button onClick={saveLogoSettings} className="p-1.5 bg-primary text-white rounded-lg"><Check size={12}/></button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditingLogo(true)} className="p-2 text-white/5 hover:text-primary transition-all rounded-lg">
                            <Edit3 size={12}/>
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* SEARCH BAR (DESKTOP ONLY) */}
        {onSearch && (
          <div className="hidden lg:flex flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
            <input type="text" value={localSearch} onChange={handleSearchChange} placeholder={t('searchPlaceholder')} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 transition-all shadow-inner" />
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          
          {/* UPLOAD BUTTON */}
          <Link href="/upload" className="hidden sm:flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all">
            <Upload size={16} className="text-primary md:w-[18px] md:h-[18px]" />
            <span>{t('upload')}</span>
          </Link>

          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }} className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 md:gap-3">
              <Globe size={16} className="text-primary md:w-[18px] md:h-[18px]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{languages.find(l => l.code === language)?.code.toUpperCase()}</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute top-full right-0 mt-3 w-40 md:w-48 bg-[#0a0a0a] border border-border-custom rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 z-[6000]">
                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto no-scrollbar">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }} className={`flex items-center justify-start px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${language === lang.code ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative flex items-center">
                <button onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); }} className="w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary transition-all p-0.5 bg-[#0a0a0a]">
                  <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover rounded-lg" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-[110%] right-0 w-56 md:w-64 bg-[#0a0a0a] border border-border-custom rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-4 shadow-2xl animate-in slide-in-from-top-2 duration-300 z-[6000]">
                    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-white/5 mb-2 text-left">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#050505]">
                        <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] md:text-xs font-black text-white uppercase italic truncate">@{profile?.username || 'user'}</span>
                        <span className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-widest">{isAdmin ? t('admin') : t('editor')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-0.5 md:gap-1">
                      {isAdmin && (
                        <button onClick={() => { window.dispatchEvent(new CustomEvent('toggleSiteEditor')); setShowUserMenu(false); }} className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-primary hover:bg-primary/10 transition-all text-left">
                          <Palette size={14} className="md:w-4 md:h-4" /> {t('siteEditor').toUpperCase()}
                        </button>
                      )}
                      <Link href="/support" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <MessageSquare size={14} className="md:w-4 md:h-4" /> DESTEK MERKEZİ
                      </Link>
                      <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={14} className="md:w-4 md:h-4" /> {t('settings').toUpperCase()}
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={14} className="md:w-4 md:h-4" /> {t('logout').toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/auth" className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-primary text-white rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <UserPlus size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">{t('register')}</span><span className="sm:hidden">GİRİŞ</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
