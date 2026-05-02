"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Kodu kontrol et (API üzerinden)
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const result = await res.json();

    if (result.success) {
      // 2. Kullanıcıyı manuel olarak doğrulanmış yap (Metadata güncellemesi)
      // Supabase'de email_confirmed_at'i client tarafından güncelleyemeyiz,
      // bu yüzden profiles tablosunda bir 'is_verified' alanı kullanmak veya
      // API tarafında auth.admin ile onaylamak en iyisi.
      
      router.push("/?verified=true");
    } else {
      setMessage("Hata: Geçersiz veya süresi dolmuş kod.");
    }
    setLoading(false);
  };

  const resendCode = async () => {
    setLoading(true);
    await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMessage("Yeni kod gönderildi!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-[400px] w-full space-y-8 glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl text-center">
        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <Archive size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Kodu Onayla</h1>
          <p className="text-muted-foreground mt-2 text-xs font-medium">
            <span className="font-bold text-primary">{email}</span> adresine gönderdiğimiz 6 haneli kodu girin.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full bg-muted/50 border border-border-custom rounded-2xl py-5 text-center text-3xl font-black tracking-[12px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          />

          {message && (
            <p className={`text-[10px] font-black py-2 rounded-lg ${message.includes("Hata") ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Onaylanıyor..." : "Hesabı Doğrula"}
            <ArrowRight size={16} />
          </button>
        </form>

        <button
          onClick={resendCode}
          disabled={loading}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Kodu Tekrar Gönder
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
