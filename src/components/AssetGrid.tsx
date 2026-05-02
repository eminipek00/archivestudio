"use client";

import React from "react";
import AssetCard from "./AssetCard";
import { assets } from "@/data/assets";

const AssetGrid = () => {
  return (
    <div className="px-6 pb-32">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default AssetGrid;
