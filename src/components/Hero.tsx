"use client";

import React from "react";
import { Sparkles, Play, Layers, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="container max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm animate-float">
              <Sparkles size={18} />
              <span>Next-Gen Video Assets</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
              PREMIUM <br />
              <span className="text-primary italic">DIGITAL</span> <br />
              ARCHIVE
            </h1>

            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-xl leading-snug">
              Sahneler, AEP ve AMP presetleri ile yaratıcılığını serbest bırak. Editörler için tasarlanmış en kapsamlı kütüphane.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button className="px-10 py-5 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 flex items-center gap-3 group">
                <Play size={24} fill="currentColor" />
                KEŞFET
              </button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-background overflow-hidden bg-muted">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold">
                  <span className="text-foreground">+12k</span>
                  <p className="text-muted-foreground">Aktif Editör</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border-custom">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-amber-500" />
                <span className="font-bold text-sm">Hızlı İndirme</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-blue-500" />
                <span className="font-bold text-sm">4K Kalite</span>
              </div>
              <div className="flex items-center gap-2">
                <Archive size={20} className="text-green-500" />
                <span className="font-bold text-sm">Geniş Arşiv</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 glass-panel p-4 rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&q=80&w=1200" 
                 alt="Premium Preview" 
                 className="rounded-[2.5rem] w-full aspect-[4/5] object-cover"
               />
               <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-3xl shadow-xl animate-float">
                  <p className="text-xs font-black text-muted-foreground uppercase mb-1">Yeni Eklenen</p>
                  <p className="text-lg font-black">Cyberpunk Pack v2</p>
               </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[150px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
