"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, User, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: identity, // Supabase varsayılan olarak email ister
      password,
    });

    if (error) {
      setMessage(`Hata: ${error.message}`);
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-[400px] w-full space-y-8 glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <Archive size={28} className="text-white" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight uppercase">sytexarchive</h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-black uppercase tracking-widest">Giriş Yap</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">E-Posta veya Kullanıcı Adı</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                placeholder="kullanici_adi veya e-posta"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Parola</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border-custom text-primary focus:ring-primary bg-muted/50" />
              <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">Beni Hatırla</span>
            </label>
            <Link href="/forgot-password" className="text-[11px] font-bold text-primary hover:underline">Şifremi Unuttum</Link>
          </div>

          {message && <p className="text-red-500 text-[10px] font-black text-center bg-red-500/10 py-2 rounded-lg">{message}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          Hesabın yok mu? <Link href="/register" className="text-primary hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
