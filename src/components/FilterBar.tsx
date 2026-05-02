"use client";

import React, { useState } from "react";
import { assets } from "@/data/assets";

const categories = [
  "Tümü",
  "Sahne Paketleri",
  "After Effects",
  "Alight Motion",
  "LUT Paketleri",
  "Overlay",
];

const FilterBar = () => {
  const [activeTab, setActiveTab] = useState("Tümü");

  return (
    <div className="sticky top-24 z-40 px-6 mb-16 py-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="glass-panel p-2 rounded-2xl inline-flex items-center gap-1 shadow-lg">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                activeTab === category
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
