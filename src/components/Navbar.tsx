"use client";

import React, { useEffect, useState } from 'react';
import { Archive, Upload, User, LogOut, ChevronDown, Languages, UserCircle, Settings, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const supabase = createClient();
  const { t, setLanguage, language } = useLanguage();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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
    alert("🚀 Premium Üyelik Yakında Sizlerle! Takipte Kalın.");
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
  ];

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-border-custom bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
            <Archive size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">sytexarchive</span>
            {authLoaded && (
               <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">
                {isAdmin ? "sytexarchive ADMIN" : "sytexarchive EDITOR"}
              </span>
            )}
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          <Link href="/#assets" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">{t('allFiles')}</Link>
          <button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">
            {t('categories')}
          </button>
          <button onClick={handlePremiumClick} className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary group">
            <Star size={14} className="group-hover:rotate-45 transition-transform" />
            PREMIUM
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 h-10 px-4 rounded-xl border border-border-custom bg-muted/30 hover:bg-muted transition-all">
              <span className="text-[10px] font-black uppercase">{language}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-12 right-0 w-48 bg-card border border-border-custom rounded-2xl shadow-2xl p-2 z-[200] animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 gap-1">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${language === lang.code ? 'bg-primary text-white' : 'hover:bg-muted'}`}>
                      <span>{lang.label}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {authLoaded ? (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/upload" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                  <Upload size={14} />
                  <span>{t('upload')}</span>
                </Link>
                <div className="relative group">
                  <button className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-border-custom hover:border-primary bg-muted/50 transition-all shadow-lg active:scale-95">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-muted-foreground" /></div>
                    )}
                  </button>
                  {/* Dropdown Panel - Z-INDEX VE KONUM DÜZELTİLDİ */}
                  <div className="absolute top-14 right-0 w-72 bg-card border border-border-custom rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-[300]">
                    <div className="px-5 py-5 border-b border-border-custom mb-2 bg-muted/20 rounded-t-2xl">
                      <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2">{isAdmin ? 'SYTEX ADMIN' : 'PROFESSIONAL EDITOR'}</p>
                      <p className="text-sm font-black truncate uppercase italic tracking-tighter">@{profile?.username || 'kullanici'}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-medium opacity-60">{user.email}</p>
                    </div>
                    <div className="p-1 space-y-1">
                        <Link href="/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group/item">
                            <UserCircle size={18} className="text-primary group-hover/item:text-white" />
                            Hesap Yönetimi
                        </Link>
                        <Link href="/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all group/item">
                            <Settings size={18} className="text-muted-foreground" />
                            Profil Ayarları
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 text-red-500 transition-all border-t border-border-custom mt-2 pt-4">
                            <LogOut size={18} />
                            Güvenli Çıkış
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">{t('login')}</Link>
                <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20">{t('register')}</Link>
              </div>
            )
          ) : (
            <div className="w-12 h-12 bg-muted animate-pulse rounded-2xl" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
