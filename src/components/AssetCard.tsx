"use client";

import React from "react";
import { Download, Heart, Eye, ArrowUpRight } from "lucide-react";
import { Asset } from "@/data/assets";

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <div className="group relative bg-card border border-border-custom rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-primary/30">
      {/* Visual Area */}
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
        <img
          src={asset.image}
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-background/80 backdrop-blur-md border border-border-custom text-[10px] font-black tracking-widest text-foreground uppercase">
            {asset.type}
          </div>
        </div>

        <button className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-primary/40 hover:bg-primary/90">
          <ArrowUpRight size={24} />
        </button>
      </div>

      {/* Details */}
      <div className="px-2 pb-2 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{asset.category}</p>
            <h3 className="text-xl font-black text-foreground line-clamp-1">
              {asset.title}
            </h3>
          </div>
          <button className="text-muted-foreground hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-custom">
          <div className="flex items-center gap-3 group/author cursor-pointer">
            <div className="w-8 h-8 rounded-full border-2 border-border-custom overflow-hidden group-hover/author:border-primary transition-all">
              <img src={asset.authorAvatar} alt={asset.author} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-muted-foreground group-hover/author:text-foreground transition-colors">{asset.author}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span className="text-[10px] font-bold">1.2k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download size={14} />
              <span className="text-[10px] font-bold">450</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
