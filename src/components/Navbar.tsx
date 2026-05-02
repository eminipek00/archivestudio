"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, Archive, User, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "py-2 px-4" : "py-4 px-6"
    }`}>
      <div className={`max-w-[1400px] mx-auto flex items-center justify-between glass-panel rounded-3xl px-6 py-2.5 shadow-2xl transition-all ${
        isScrolled ? "bg-background/90" : "bg-background/60"
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-500">
            <Archive size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block uppercase">
            sytexarchive
          </span>
        </Link>

        {/* Search Bar - Better Width Control */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative group">
          <Search className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Arama yapın..."
            className="w-full bg-muted/40 border border-border-custom rounded-2xl py-2 pl-12 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          
          <Link 
            href="/upload"
            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Upload size={14} />
            Yükle
          </Link>

          {user ? (
            <Link href="/profile" className="flex items-center gap-2 group ml-2">
              <div className="w-9 h-9 rounded-xl border border-border-custom group-hover:border-primary transition-all overflow-hidden">
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Profil" 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors text-xs ml-2"
            >
              <LogIn size={16} />
              <span className="hidden lg:inline">Giriş Yap</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
