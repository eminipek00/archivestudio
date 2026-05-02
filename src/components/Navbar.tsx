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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "py-3 px-4 md:px-10" : "py-6 px-6 md:px-12"
    }`}>
      <div className={`max-w-[1600px] mx-auto flex items-center justify-between glass-panel rounded-2xl px-6 py-3 shadow-xl transition-all ${
        isScrolled ? "bg-background/80" : "bg-background/40"
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-500 rotate-3 group-hover:rotate-0">
            <Archive size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block uppercase">
            sytexarchive
          </span>
        </Link>

        {/* Search Bar - Fixed width and better styling */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-12 relative group">
          <Search className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            className="w-full bg-muted/30 border border-border-custom rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle />
          
          <Link 
            href="/upload"
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Upload size={18} />
            Yükle
          </Link>

          <div className="h-8 w-[1px] bg-border-custom hidden sm:block" />

          {user ? (
            <Link href="/profile" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl border-2 border-border-custom group-hover:border-primary transition-all overflow-hidden p-0.5">
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Profil" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </Link>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors text-sm"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Link>
          )}
          
          <button className="lg:hidden text-foreground">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
