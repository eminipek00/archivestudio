"use client";

import React, { useEffect, useState } from 'react';
import AssetCard from './AssetCard';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/utils/LanguageContext';
import { Loader2, FolderOpen, Database, TrendingUp, Users } from 'lucide-react';

interface AssetGridProps {
  searchQuery: string;
  activeCategory: string;
}

const AssetGrid = ({ searchQuery, activeCategory }: AssetGridProps) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      // AUTHOR_ID İLE PROFILES TABLOSUNU BAĞLIYORUZ (JOIN)
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
        
      if (!error && data) setAssets(data);
      setLoading(false);
    };

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'ipekmuhammetemin@gmail.com') {
            setIsAdmin(true);
        } else if (user) {
            const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
            if (profile?.is_admin) setIsAdmin(true);
        }
    };

    fetchAssets();
    checkAdmin();
  }, [supabase]);

  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === t('tags.all') || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">ARŞİV TARANIYOR...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {filteredAssets.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="p-6 bg-muted rounded-[2.5rem] border border-border-custom">
                    <FolderOpen size={48} className="text-muted-foreground opacity-20" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{t('noResults')}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t('tryAnotherSearch')}</p>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {filteredAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} isAdmin={isAdmin} onDelete={handleDelete} />
                ))}
            </div>
        )}
    </div>
  );
};

export default AssetGrid;
