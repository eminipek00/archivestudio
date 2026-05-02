"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 blur-[80px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent animate-pulse">
          <Sparkles size={12} />
          <span>Yeni Paketler Yayında</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Editörler İçin <br />
          <span className="bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
            Premium Kaynaklar
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Sahneler, AEP ve AMP presetleri ile editlerini bir üst seviyeye taşı. 
          Minimalist, profesyonel ve sinematik bir dijital arşiv.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Kütüphaneyi Keşfet
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-semibold transition-all">
            Topluluğa Katıl
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
