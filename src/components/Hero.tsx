"use client";

import React from "react";
import { Sparkles, Play, Layers, Zap, Archive } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
      
      <div className="container max-w-[1400px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs animate-float">
              <Sparkles size={16} />
              <span>Next-Gen Video Assets</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-foreground uppercase">
              PREMIUM <br />
              <span className="text-primary italic">SYTEX</span> <br />
              ARCHIVE
            </h1>

            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-xl leading-relaxed">
              Sahneler, AEP ve AMP presetleri ile yaratıcılığını serbest bırak. Editörler için tasarlanmış en kapsamlı kütüphane.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button className="px-10 py-5 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 flex items-center gap-3 group">
                <Play size={24} fill="currentColor" />
                KEŞFET
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold">
                  <span className="text-foreground">+12k</span>
                  <p className="text-muted-foreground">Aktif Editör</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-border-custom max-w-lg">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-amber-500">
                  <Zap size={18} />
                  <span className="font-black text-[10px] uppercase tracking-wider">Hız</span>
                </div>
                <p className="font-bold text-xs">Hızlı İndirme</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-blue-500">
                  <Layers size={18} />
                  <span className="font-black text-[10px] uppercase tracking-wider">Kalite</span>
                </div>
                <p className="font-bold text-xs">4K Kalite</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-green-500">
                  <Archive size={18} />
                  <span className="font-black text-[10px] uppercase tracking-wider">Arşiv</span>
                </div>
                <p className="font-bold text-xs">Geniş Arşiv</p>
              </div>
            </div>
          </div>

          {/* Hero Visual - Made more responsive and better fits screen */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 glass-panel p-3 rounded-[3.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 max-w-[500px] ml-auto">
               <img 
                 src="https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&q=80&w=1200" 
                 alt="Premium Preview" 
                 className="rounded-[3rem] w-full aspect-[4/5] object-cover"
               />
               <div className="absolute -bottom-8 -left-8 glass-panel p-6 rounded-3xl shadow-2xl animate-float">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">YENİ EKLENEN</p>
                  <p className="text-xl font-black">Cyberpunk Pack v2</p>
               </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/20 blur-[120px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
