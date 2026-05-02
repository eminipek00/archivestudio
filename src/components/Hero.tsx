"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container text-center space-y-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase">
          sytexarchive
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg font-medium tracking-[0.2em] uppercase opacity-60">
          Premium Digital Archive for Editors
        </p>
      </div>
    </section>
  );
};

export default Hero;
