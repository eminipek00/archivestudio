"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, Archive, LogIn, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-custom bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Archive size={16} className="text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-tighter hidden sm:block">sytexarchive</span>
        </Link>

        {/* Search - Responsive Width */}
        <div className="flex-1 max-w-lg relative group hidden min-[450px]:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            className="w-full bg-muted/50 border border-border-custom rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link href="/upload" className="text-[11px] font-black uppercase tracking-wider hover:text-primary transition-colors hidden sm:block">Yükle</Link>
          
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-border-custom">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-custom p-0.5">
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Profil" 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Giriş</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
