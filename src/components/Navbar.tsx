"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, Archive, LogIn } from "lucide-react";
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
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-custom px-4 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Archive size={16} className="text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest hidden lg:block">sytexarchive</span>
        </Link>

        {/* Search Bar - Better Width Control */}
        <div className="flex-1 max-w-lg relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Arama yapın..."
            className="w-full bg-muted/50 border border-border-custom rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-border-custom hidden sm:block" />
          <Link href="/upload" className="text-xs font-bold hover:text-primary transition-colors hidden sm:block">Yükle</Link>
          
          {user ? (
            <Link href="/profile" className="w-9 h-9 rounded-xl overflow-hidden border border-border-custom p-0.5">
              <img 
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-lg"
              />
            </Link>
          ) : (
            <Link href="/login" className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-1.5">
              <LogIn size={16} />
              <span className="hidden sm:inline">Giriş</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
