"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full pt-40 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        {/* Kullanıcının kendi içeriğini ekleyebileceği boş alan */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          Hoş Geldiniz
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Kendi içeriğinizi buraya eklemeye başlayabilirsiniz.
        </p>
      </div>
    </section>
  );
};

export default Hero;
