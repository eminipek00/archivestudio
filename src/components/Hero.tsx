"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';

interface HeroProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Hero = ({ activeCategory, onCategoryChange }: HeroProps) => {
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
    <section className="relative pt-12 pb-8 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10 text-center">
        {/* KATEGORİ BUTONLARI (FİLTRELEME) */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          {categories.map((tag) => (
            <button 
              key={tag} 
              onClick={() => onCategoryChange(tag)}
              className={`px-8 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 ${activeCategory === tag ? 'bg-primary border-primary text-white shadow-primary/30 scale-105' : 'bg-[#111] border-border-custom text-white/50 hover:border-primary/50'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
          <Sparkles size={14} />
          <span>PROFESYONEL EDİTÖRLER İÇİN SEÇİLMİŞ EN KALİTELİ KAYNAKLAR</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
          {t('heroTitle').split(' ').map((word: string, i: number) => (
            <span key={i} className={i % 2 === 1 ? "text-primary" : ""}>{word} </span>
          ))}
        </h1>
        
        <p className="max-w-2xl mx-auto text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 italic">
          Sahne paketleri, ses efektleri ve geçişler tek bir çatı altında.
        </p>
      </div>
    </section>
  );
};

export default Hero;
