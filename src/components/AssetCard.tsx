"use client";

import React from "react";
import { Download, User } from "lucide-react";
import { Asset } from "@/data/assets";

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border-custom hover:border-white/20 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-2xl">
      {/* Preview Image Area */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={asset.image}
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* Type Tag */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-white uppercase">
          {asset.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
            {asset.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1">{asset.category}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
              <img src={asset.authorAvatar} alt={asset.author} className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-400 text-xs font-medium">{asset.author}</span>
          </div>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white text-gray-400 transition-all group/btn">
            <Download size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hover Overlay Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
    </div>
  );
};

export default AssetCard;
