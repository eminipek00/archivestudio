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
    <div className="w-full px-6 mb-12 flex justify-center">
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-1 shadow-lg overflow-x-auto no-scrollbar max-w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
              activeTab === category
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
