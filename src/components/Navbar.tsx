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
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border-custom">
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <Archive size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">sytexarchive</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full bg-muted border border-border-custom rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link href="/upload" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">Yükle</Link>
          
          {user ? (
            <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-border-custom">
              <img 
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
              <LogIn size={16} />
              Giriş
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
