"use client";

import React, { useState, useEffect } from 'react';
import { Globe, LogIn, UserPlus, Upload, LogOut, Settings, Search, Edit3, Check, Maximize2, Palette, MessageSquare, Bell, Home, User, LifeBuoy, X, ChevronLeft } from 'lucide-react';
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
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [logoSettings, setLogoSettings] = useState({ x: 0, y: 0, scale: 1 });

  const { language, setLanguage, t } = useLanguage();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const savedSettings = localStorage.getItem('sytexLogoSettings');
    if (savedSettings) setLogoSettings(JSON.parse(savedSettings));

    const getUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        setProfile(profileData);
        
        const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(5);
        if (notifs) setNotifications(notifs);

        const { count: followers } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', authUser.id);
        setFollowerCount(followers || 0);
        const { count: following } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', authUser.id);
        setFollowingCount(following || 0);
      }
    };
    getUserData();
  }, [supabase]);

  // LIVE SEARCH LOGIC
  useEffect(() => {
    const fetchResults = async () => {
      if (localSearch.length < 2) { setSearchResults([]); return; }
      const { data } = await supabase.from('assets').select('id, title, cover_url, category').ilike('title', `%${localSearch}%`).limit(5);
      if (data) setSearchResults(data);
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [localSearch, supabase]);

  const saveLogoSettings = () => {
    localStorage.setItem('sytexLogoSettings', JSON.stringify(logoSettings));
    setIsEditingLogo(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
    router.refresh();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearch) onSearch(val);
  };

  const clearSearch = () => {
    setLocalSearch("");
    if (onSearch) onSearch("");
  };

  const handleMobileSearchToggle = () => {
    if (window.location.pathname !== '/') {
      router.push('/');
      setTimeout(() => setIsMobileSearchActive(true), 300);
    } else {
      setIsMobileSearchActive(!isMobileSearchActive);
    }
  };

  const closeAllMenus = () => {
    setShowLangMenu(false);
    setShowUserMenu(false);
    setShowNotifMenu(false);
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
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
    {/* CLICK-AWAY OVERLAY */}
    {(showLangMenu || showUserMenu || showNotifMenu || (isMobileSearchActive && searchResults.length > 0)) && (
      <div className="fixed inset-0 z-[4500] bg-black/40 backdrop-blur-sm" onClick={() => { closeAllMenus(); setSearchResults([]); }} />
    )}

    <nav className="fixed top-0 left-0 right-0 z-[5000] py-3 md:py-4 bg-black border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-8 min-h-[48px]">
        
        {isMobileSearchActive ? (
          /* MOBILE ACTIVE SEARCH BAR */
          <div className="flex-1 flex items-center gap-2 animate-in slide-in-from-left-4 duration-300 relative">
            <button onClick={() => { setIsMobileSearchActive(false); clearSearch(); }} className="p-2 text-white/40 hover:text-primary transition-all">
              <ChevronLeft size={22} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
              <input 
                autoFocus
                type="text" 
                value={localSearch} 
                onChange={handleSearchChange} 
                placeholder={t('searchPlaceholder')} 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/30 shadow-inner"
              />
              {localSearch && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                  <X size={12} className="text-white/40" />
                </button>
              )}
            </div>

            {/* LIVE RESULTS DROPDOWN (MOBILE) */}
            {searchResults.length > 0 && (
              <div className="absolute top-[120%] left-0 right-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-[6000]">
                {searchResults.map(asset => (
                  <button key={asset.id} onClick={() => { setIsMobileSearchActive(false); router.push(`/?asset=${asset.id}`); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <img src={asset.cover_url || '/logo.png'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black text-white uppercase truncate group-hover:text-primary transition-colors">{asset.title}</span>
                      <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{asset.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* STANDARD NAV CONTENT */
          <>
          <div className="flex items-center gap-2 md:gap-6 shrink-0 text-left">
              <Link href="/" onClick={closeAllMenus} className="flex items-center gap-2 md:gap-3 shrink-0">
                  <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 transition-transform duration-500 hover:rotate-12" style={{ transform: `translate(${logoSettings.x}px, ${logoSettings.y}px) scale(${logoSettings.scale})` }}>
                      <Logo className="w-full h-full" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-base md:text-lg font-black tracking-tighter text-white leading-none uppercase italic">SYTEX<span className="text-primary">ARCHIVE</span></span>
                      <span className="text-[6px] md:text-[7px] font-black tracking-[0.4em] text-white/30 leading-none uppercase mt-1">Professional Digital Assets</span>
                  </div>
              </Link>
          </div>

          {onSearch && (
            <div className="hidden lg:flex flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
              <input id="global-search-input" type="text" value={localSearch} onChange={handleSearchChange} placeholder={t('searchPlaceholder')} className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 transition-all shadow-inner" />
              {localSearch && (
                <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                  <X size={14} className="text-white/40" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* MOBILE LANGUAGE BUTTON */}
            <div className="md:hidden relative">
              <button onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); setShowNotifMenu(false); }} className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-white active:scale-95 transition-all shadow-xl">
                <Globe size={16} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{language.toUpperCase()}</span>
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-3 w-40 bg-[#0a0a0a] border border-border-custom rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 z-[6000]">
                  <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto no-scrollbar">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }} className={`flex items-center justify-start px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${language === lang.code ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/upload" className="hidden sm:flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white/5 border border-white/10 hover:border-primary/50 text-white rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all">
              <Upload size={16} className="text-primary md:w-[18px] md:h-[18px]" />
              <span>{t('upload')}</span>
            </Link>

            <div className="hidden md:block relative">
              <button onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); setShowNotifMenu(false); }} className={`px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-[#0a0a0a] border transition-all flex items-center gap-2 md:gap-3 ${showLangMenu ? 'border-primary/50 text-white' : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'}`}>
                <Globe size={16} className="text-primary md:w-[18px] md:h-[18px]" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{languages.find(l => l.code === language)?.code.toUpperCase()}</span>
              </button>
            </div>

            {user ? (
              <div className="hidden md:flex relative items-center">
                  <button onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); setShowNotifMenu(false); }} className={`w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-[#0a0a0a] ${showUserMenu ? 'border-primary' : 'border-white/10'}`}>
                    <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover rounded-lg" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-[120%] right-0 w-[85vw] max-w-64 md:max-w-72 bg-[#0a0a0a] border border-border-custom rounded-[2rem] md:rounded-[2.5rem] p-4 shadow-2xl animate-in slide-in-from-top-2 duration-300 z-[6000]">
                      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-white/5 mb-2 text-left">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-[#050505]">
                          <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] md:text-xs font-black text-white uppercase italic truncate">@{profile?.username || 'user'}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">{followerCount} {t('followers')}</span>
                            <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">{followingCount} {t('following')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-0.5 md:gap-1 text-left">
                        <Link href="/support" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black text-white/40 hover:text-white hover:bg-white/5 transition-all">
                          <MessageSquare size={14} className="md:w-4 md:h-4" /> {t('supportCenter').toUpperCase()}
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
              <div className="hidden md:flex items-center">
                <Link href="/login" className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-primary text-white rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <LogIn size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">{t('login').toUpperCase()}</span><span className="sm:hidden">GİRİŞ</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[6000] bg-black/80 backdrop-blur-xl border-t border-border-custom px-4 py-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" onClick={() => { closeAllMenus(); setIsMobileSearchActive(false); }} className="p-2 text-white/40 hover:text-primary transition-all">
          <Home size={22} />
        </Link>
        <button onClick={handleMobileSearchToggle} className={`p-2 transition-all ${isMobileSearchActive ? 'text-primary' : 'text-white/40'}`}>
          <Search size={22} />
        </button>
        <button onClick={() => { closeAllMenus(); setIsMobileSearchActive(false); router.push('/upload'); }} className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 -mt-8 border-4 border-black active:scale-95 transition-all">
          <Upload size={22} />
        </button>
        <div className="relative">
            <button onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); setShowLangMenu(false); setIsMobileSearchActive(false); }} className={`p-2 transition-all relative ${showNotifMenu ? 'text-primary' : 'text-white/40'}`}>
                <Bell size={22} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-black" />}
            </button>
            {showNotifMenu && (
                <div className="fixed bottom-[80px] left-4 right-4 bg-[#0a0a0a] border border-border-custom rounded-[2rem] p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 z-[7000]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 px-4 mb-4 text-left">{t('notifications')}</h3>
                    <div className="space-y-1 max-h-[40vh] overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? ( <div className="p-8 text-center opacity-20"><Bell size={32} className="mx-auto mb-2" /><p className="text-[8px] font-black uppercase">{t('noNotifications')}</p></div> ) : (
                            notifications.map(n => (
                                <Link key={n.id} href={n.link || '#'} onClick={() => setShowNotifMenu(false)} className="block p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group text-left">
                                    <p className="text-[9px] font-black text-white group-hover:text-primary transition-colors mb-1">{n.content}</p>
                                    <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        
        <div className="relative">
          <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); setShowLangMenu(false); setIsMobileSearchActive(false); }} className="p-2 text-white/40 hover:text-primary transition-all">
            {profile?.avatar_url ? (
              <div className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${showUserMenu ? 'border-primary' : 'border-white/20'}`}>
                <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" />
              </div>
            ) : (
              user ? <Settings size={22} className={showUserMenu ? 'text-primary' : ''} /> : <LogIn size={22} />
            )}
          </button>
          {showUserMenu && (
            <div className="fixed bottom-[80px] left-4 right-4 bg-[#0a0a0a] border border-border-custom rounded-[2rem] p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 z-[7000]">
                <div className="flex items-center gap-4 p-4 border-b border-white/5 mb-2 text-left">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-[#050505]">
                    <img src={profile?.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase italic">@{profile?.username || 'user'}</span>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1">{followerCount} {t('followers')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 text-left">
                  <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-black text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <User size={18} /> {t('profile').toUpperCase()}
                  </Link>
                  <Link href="/support" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-black text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <MessageSquare size={18} /> {t('supportCenter').toUpperCase()}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-black text-red-400 hover:bg-red-500/10 transition-all text-left">
                    <LogOut size={18} /> {t('logout').toUpperCase()}
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
