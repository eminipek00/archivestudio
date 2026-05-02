"use client";

import React, { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { createClient } from "@/utils/supabase/client";

const AssetGrid = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAssets(data);
      }
      setLoading(false);
    };
    fetchAssets();
  }, [supabase]);

  if (loading) {
    return (
      <div className="px-6 pb-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-32">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
      {assets.length === 0 && (
        <div className="text-center py-20 opacity-50 font-black uppercase tracking-widest italic">Henüz dosya yüklenmemiş...</div>
      )}
    </div>
  );
};

export default AssetGrid;
