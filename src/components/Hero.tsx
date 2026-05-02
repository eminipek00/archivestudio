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
    <section className="relative pt-8 pb-12 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
          <Sparkles size={12} />
          <span>{t('footerSub')}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] mb-2">
          {t('heroTitle').split(' ').map((word: string, i: number) => (
            <span key={i} className={i % 2 === 1 ? "text-primary" : ""}>{word} </span>
          ))}
        </h1>
        
        <p className="max-w-xl mx-auto text-muted-foreground text-xs font-bold uppercase tracking-wide mb-6">
          {t('heroSub')}
        </p>

        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card border border-border-custom rounded-2xl p-1.5 shadow-2xl">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent border-none focus:outline-none text-sm font-bold py-2"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
              ARA
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {categories.map((tag) => (
            <button key={tag} className="px-4 py-1.5 rounded-lg bg-muted/30 border border-border-custom text-[9px] font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
