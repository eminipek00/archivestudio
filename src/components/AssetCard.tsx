"use client";

import React from "react";
import { Download, Heart, Eye, ArrowUpRight, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface AssetCardProps {
  asset: any;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const supabase = createClient();

  const handleDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Bu dosyayı indirmek için lütfen giriş yapın.");
      window.location.href = "/login";
      return;
    }

    // İndirme linkine yönlendir
    window.open(asset.download_url, '_blank');
  };

  const handleDelete = async () => {
    if (confirm("Bu asseti silmek istediğinize emin misiniz?")) {
      const { error } = await supabase.from('assets').delete().eq('id', asset.id);
      if (!error) window.location.reload();
    }
  };

  return (
    <div className="group relative bg-card border border-border-custom rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-primary/30 animate-in fade-in zoom-in-95 duration-500">
      {/* Visual Area */}
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-muted/20">
        {asset.image_url ? (
            <img
            src={asset.image_url}
            alt={asset.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center italic font-black text-muted-foreground/20 uppercase text-xs">No Preview</div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-background/80 backdrop-blur-md border border-border-custom text-[10px] font-black tracking-widest text-foreground uppercase">
            {asset.category}
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-primary/40 hover:bg-primary/90"
        >
          <Download size={24} />
        </button>
      </div>

      {/* Details */}
      <div className="px-2 pb-2 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-black text-foreground line-clamp-1 italic uppercase tracking-tighter">
              {asset.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-custom">
          <div className="flex items-center gap-3 group/author">
            <div className="w-8 h-8 rounded-full border-2 border-border-custom overflow-hidden shadow-sm">
              <img 
                src={asset.profiles?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"} 
                alt="Author" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{asset.profiles?.username || 'Kullanıcı'}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span className="text-[10px] font-bold">{asset.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download size={14} />
              <span className="text-[10px] font-bold">{asset.downloads_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
