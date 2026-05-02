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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between glass-panel rounded-2xl px-6 py-2">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Archive size={20} className="text-primary" />
          <span className="text-sm font-black uppercase tracking-widest hidden sm:block">sytexarchive</span>
        </Link>

        <div className="flex-1 max-w-md mx-4 relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full bg-muted/50 border border-border-custom rounded-xl py-1.5 pl-10 pr-4 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/upload" className="text-xs font-bold hover:text-primary transition-colors hidden sm:block">Yükle</Link>
          {user ? (
            <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-border-custom">
              <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
            </Link>
          ) : (
            <Link href="/login" className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-1">
              <LogIn size={14} />
              Giriş
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
