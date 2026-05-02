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
    <div className="px-6 mb-12">
      <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 min-w-max pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeTab === category
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10"
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
