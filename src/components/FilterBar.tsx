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
    <div className="py-6 bg-background">
      <div className="container flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 max-w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === category
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-border-custom hover:text-foreground"
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
