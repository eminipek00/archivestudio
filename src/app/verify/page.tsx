"use client";

import React, { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, ArrowRight, RefreshCw, Timer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyContent = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 Dakika (300 saniye)
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  // Sayaç Mantığı
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setMessage("Hata: Kodun süresi doldu. Lütfen yeni kod isteyin.");
      return;
    }
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const result = await res.json();

    if (result.success) {
      router.push("/");
    } else {
      setMessage("Hata: Geçersiz veya hatalı kod.");
    }
    setLoading(false);
  };

  const resendCode = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setTimeLeft(300); // Sayacı sıfırla
      setMessage("Yeni kod gönderildi!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-[400px] w-full space-y-8 glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl text-center relative overflow-hidden">
        {/* Timer Bar */}
        <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
            <div 
                className="h-full bg-primary transition-all duration-1000 linear" 
                style={{ width: `${(timeLeft / 300) * 100}%` }}
            />
        </div>

        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <Archive size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Kodu Onayla</h1>
          <p className="text-muted-foreground mt-2 text-xs font-medium">
            <span className="font-bold text-primary">{email}</span> adresine gönderilen kodu girin.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
            <Timer size={16} className={timeLeft < 60 ? "animate-pulse text-red-500" : ""} />
            <span className={timeLeft < 60 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            disabled={timeLeft <= 0}
            className="w-full bg-muted/50 border border-border-custom rounded-2xl py-5 text-center text-3xl font-black tracking-[12px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-30"
            required
          />

          {message && (
            <p className={`text-[10px] font-black py-2 rounded-lg ${message.includes("Hata") ? "text-red-500 bg-red-500/10" : "text-green-500 bg-green-500/10"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6 || timeLeft <= 0}
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

// Next.js build hatasını çözmek için Suspense ekliyoruz
const VerifyPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <VerifyContent />
    </Suspense>
  );
};

export default VerifyPage;
