"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-[1400px] mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
          Hoş Geldiniz
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Kendi içeriğinizi buraya eklemeye başlayabilirsiniz. <br />
          sytexarchive premium kütüphanesine hoş geldiniz.
        </p>
      </div>
    </section>
  );
};

export default Hero;
