"use client";

import React from "react";
import AssetCard from "./AssetCard";
import { assets } from "@/data/assets";

const AssetGrid = () => {
  return (
    <div className="px-6 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default AssetGrid;
