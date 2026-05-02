"use client";

import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const categories = [
    t('tags.all'),
    t('tags.scene'),
    t('tags.ae'),
    t('tags.am'),
    t('tags.lut'),
    t('tags.overlay')
  ];

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
          <Sparkles size={14} />
          <span>{t('footerSub')}</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {t('heroTitle').split(' ').map((word: string, i: number) => (
            <span key={i} className={i % 2 === 1 ? "text-primary" : ""}>{word} </span>
          ))}
        </h1>
        
        <p className="max-w-2xl mx-auto text-muted-foreground text-sm font-black uppercase tracking-widest mb-10 opacity-70">
          {t('heroSub')}
        </p>

        <div className="max-w-3xl mx-auto relative group mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center bg-card/50 backdrop-blur-xl border border-border-custom rounded-3xl p-2 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="flex-1 flex items-center px-6 gap-4">
              <Search className="text-muted-foreground" size={22} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent border-none focus:outline-none text-base font-bold py-3"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30">
              ARA
            </button>
          </div>
        </div>

        {/* Kategoriler - Tek Sıra ve Büyük */}
        <div id="categories" className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((tag) => (
            <button 
              key={tag} 
              className="px-8 py-4 rounded-2xl bg-muted/20 border border-border-custom text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
