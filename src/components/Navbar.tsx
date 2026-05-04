"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Upload, User, LogOut, ChevronDown, Settings, Search, Zap, Move, Sliders, X as CloseIcon, Save } from 'lucide-react';
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
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  
  // LOGO TASARIM AYARLARI
  const [logoPos, setLogoPos] = useState({ x: 20, y: -1, size: 64 }); // Default X20 Y-1 Size64
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const logoStart = useRef({ x: 0, y: 0 });

  const supabase = createClient();
  const { t, setLanguage, language } = useLanguage();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    // LocalStorage'dan kayıtlı ayarları yükle
    const savedPos = localStorage.getItem('sytex_logo_config');
    if (savedPos) setLogoPos(JSON.parse(savedPos));

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

  // SÜRÜKLEME MANTIĞI
  const onMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    logoStart.current = { x: logoPos.x, y: logoPos.y };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setLogoPos(prev => ({
        ...prev,
        x: Math.round(logoStart.current.x + dx / 3),
        y: Math.round(logoStart.current.y + dy / 3)
      }));
    };
    const onMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const saveLogoConfig = () => {
    localStorage.setItem('sytex_logo_config', JSON.stringify(logoPos));
    setIsDesignOpen(false);
    alert("Logo ayarları kaydedildi lo! (Tarayıcında saklı kalacak)");
  };

  const renderAvatar = () => {
    if (profile?.avatar_url) return <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" />;
    if (isAdmin) return <div className="w-full h-full flex items-center justify-center bg-black/50 p-1.5"><Logo className="w-full h-full" /></div>;
    const seed = profile?.username || user?.email || 'default';
    return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt="Avatar" className="w-full h-full object-cover" />;
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b border-border-custom bg-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* LOGO AREA - TASARIM MODU ENTEGRE */}
        <div className="flex items-center shrink-0 relative">
          <Link href="/" className="flex items-center gap-3">
            <div 
                onMouseDown={onMouseDown}
                style={{ 
                    transform: `translate(${logoPos.x}px, ${logoPos.y}px)`,
                    width: `${logoPos.size}px`,
                    height: `${logoPos.size}px`
                }}
                className={`relative transition-all duration-75 ${isDragging ? 'cursor-grabbing scale-105 z-[5000]' : isAdmin ? 'cursor-grab hover:scale-105' : ''}`}>
                <Logo className="w-full h-full" />
                {isAdmin && isDragging && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap">
                        X:{logoPos.x} Y:{logoPos.y}
                    </div>
                )}
            </div>

            <div className="flex flex-col -space-y-1 ml-1">
                <span className="text-lg md:text-3xl font-[1000] tracking-tighter uppercase italic leading-none text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    SYTEXARCHIVE
                </span>
                {authLoaded && (
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary italic">
                        {isAdmin ? 'ADMIN' : 'EDITOR'}
                    </span>
                )}
            </div>
          </Link>

          {/* ADMIN TASARIM BUTONU */}
          {isAdmin && (
            <button 
                onClick={() => setIsDesignOpen(true)}
                className="ml-4 p-2 bg-white/5 hover:bg-primary/20 text-white/30 hover:text-primary rounded-xl transition-all border border-white/5">
                <Sliders size={16} />
            </button>
          )}
        </div>

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
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 md:w-10 h-9 md:h-10 rounded-xl overflow-hidden border border-border-custom hover:border-primary transition-all bg-[#111] shadow-inner">{renderAvatar()}</button>
                  {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-[2000] md:hidden" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute top-12 right-0 w-56 md:w-64 bg-black border border-border-custom rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 z-[3000]">
                            <div className="px-4 py-4 border-b border-border-custom mb-1"><p className="text-[10px] md:text-xs font-black uppercase italic text-white line-clamp-1">@{profile?.username || 'user'}</p></div>
                            <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all text-white/60 italic"><Settings size={16} />{t('settings')}</Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/10 text-red-500 transition-all italic"><LogOut size={16} />{t('logout')}</button>
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

      {/* LOGO TASARIM PANELİ (MODAL) */}
      {isDesignOpen && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#111] border border-border-custom rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-8">
                  <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">LOGO AYARLARI</h3>
                      <button onClick={() => setIsDesignOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/50"><CloseIcon size={20}/></button>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40"><span>YATAY (X)</span><span>{logoPos.x}</span></div>
                          <input type="range" min="-50" max="100" value={logoPos.x} onChange={(e) => setLogoPos({...logoPos, x: Number(e.target.value)})} className="w-full accent-primary bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer" />
                      </div>
                      <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40"><span>DİKEY (Y)</span><span>{logoPos.y}</span></div>
                          <input type="range" min="-50" max="50" value={logoPos.y} onChange={(e) => setLogoPos({...logoPos, y: Number(e.target.value)})} className="w-full accent-primary bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer" />
                      </div>
                      <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40"><span>BOYUT</span><span>{logoPos.size}px</span></div>
                          <input type="range" min="20" max="150" value={logoPos.size} onChange={(e) => setLogoPos({...logoPos, size: Number(e.target.value)})} className="w-full accent-primary bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer" />
                      </div>
                  </div>

                  <button onClick={saveLogoConfig} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                      <Save size={16} /> AYARLARI KAYDET
                  </button>
                  <p className="text-[8px] text-center font-black text-white/20 uppercase tracking-widest">Sürükleyerek de ayarlayabilirsin lo!</p>
              </div>
          </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </nav>
  );
};

export default Navbar;
