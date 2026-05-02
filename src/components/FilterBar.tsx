"use client";

import React, { useState } from "react";

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
    <div className="w-full px-4 mb-8">
      <div className="container mx-auto flex justify-center">
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === category
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
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
