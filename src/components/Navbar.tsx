"use client";

import React, { useEffect, useState } from 'react';
import { Archive, Upload, User, LogOut, ChevronDown, Languages, ShieldCheck, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/utils/LanguageContext';
import { Language } from '@/utils/i18n';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
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
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
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
    <nav className="sticky top-0 z-50 w-full border-b border-border-custom bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
            <Archive size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">sytexarchive</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">
              {isAdmin ? t('admin') : t('editor')}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/assets" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">{t('allFiles')}</Link>
          <Link href="/categories" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">{t('categories')}</Link>
          <Link href="/pricing" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Premium</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border-custom hover:bg-muted transition-all"
            >
              <Languages size={18} className="text-muted-foreground" />
              <span className="text-[10px] font-black uppercase">{language}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLangOpen && (
              <div className="absolute top-12 right-0 w-48 bg-card border border-border-custom rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${language === lang.code ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                    >
                      <span>{lang.label}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/upload" 
                className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
              >
                <Upload size={14} />
                <span>{t('upload')}</span>
              </Link>
              
              <div className="relative group">
                <button className="w-10 h-10 rounded-xl overflow-hidden border border-border-custom hover:border-primary transition-all shadow-sm">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User size={20} className="text-muted-foreground" />
                    </div>
                  )}
                </button>
                
                <div className="absolute top-12 right-0 w-56 bg-card border border-border-custom rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-border-custom mb-2">
                    <p className="text-[10px] font-black uppercase text-primary tracking-tighter">
                      {isAdmin ? 'ADMIN ACCOUNT' : 'USER ACCOUNT'}
                    </p>
                    <p className="text-xs font-bold truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-muted transition-all">
                    <UserCircle size={16} />
                    Profil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <LogOut size={16} />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">{t('login')}</Link>
              <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
