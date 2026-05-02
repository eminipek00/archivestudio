"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, Github, Mail, ArrowRight, Lock, User } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Hata: ${error.message}`);
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,var(--muted),transparent)]">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        
        <div className="text-center relative">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Archive size={32} className="text-white" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Tekrar Hoş Geldin</h1>
          <p className="text-muted-foreground mt-2 font-medium">Archive Studio'ya giriş yapın</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-card border border-border-custom py-3.5 rounded-2xl font-bold hover:bg-muted transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Google ile Devam Et
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-border-custom" />
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Veya</span>
            <div className="h-[1px] flex-1 bg-border-custom" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">E-Posta</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted/50 border border-border-custom rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Şifre</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/50 border border-border-custom rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {message && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20">{message}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium pt-4">
          Hesabın yok mu? <Link href="/register" className="text-primary font-bold hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
