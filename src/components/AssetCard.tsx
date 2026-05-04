"use client";

import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, User, X, Calendar, Share2, PlayCircle, Trash2, Edit3, Save, Camera, Heart } from 'lucide-react';
import { useLanguage } from '@/utils/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import { Toast, useToast } from './Toast';
import Link from 'next/link';

const AssetCard = ({ asset, isAdmin, onDelete }: { asset: any, isAdmin: boolean, onDelete?: (id: string) => void }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(asset.title);
  const [editUrl, setEditUrl] = useState(asset.image_url);
  const [loading, setLoading] = useState(false);
  
  // GLOBAL LIKE SYSTEM (DATABASE DRIVEN)
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(asset.likes_count || 0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const checkLikeStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUserId(user.id);
            const { data } = await supabase.from('likes').select('id').eq('asset_id', asset.id).eq('user_id', user.id).maybeSingle();
            setLiked(!!data);
        }
    };
    checkLikeStatus();
    
    // BEĞENİ SAYISINI GÜNCELLE
    const fetchLikeCount = async () => {
        const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('asset_id', asset.id);
        setLikeCount(count || 0);
    };
    fetchLikeCount();
  }, [asset.id, supabase]);

  const handleLike = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUserId) { showToast("Beğenmek için giriş yapmalısınız.", "error"); return; }

      if (liked) {
          // UNLIKE
          setLiked(false);
          setLikeCount(prev => prev - 1);
          await supabase.from('likes').delete().eq('asset_id', asset.id).eq('user_id', currentUserId);
      } else {
          // LIKE
          setLiked(true);
          setLikeCount(prev => prev + 1);
          await supabase.from('likes').insert([{ asset_id: asset.id, user_id: currentUserId }]);
      }
      
      // Notify other components
      window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
        title: asset.title,
        text: `Sytex Archive üzerinden şu varlığa göz atın: ${asset.title}`,
        url: window.location.origin + `?id=${asset.id}`
    };
    try {
        if (navigator.share) { await navigator.share(shareData); } 
        else { await navigator.clipboard.writeText(shareData.url); showToast("Bağlantı kopyalandı.", "success"); }
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bu varlığı silmek istediğinize emin misiniz?")) {
        const { error } = await supabase.from('assets').delete().eq('id', asset.id);
        if (!error) { showToast("Varlık silindi.", "success"); if (onDelete) onDelete(asset.id); setShowModal(false); }
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.from('assets').update({ title: editTitle, image_url: editUrl }).eq('id', asset.id);
    if (!error) { showToast("Güncellendi.", "success"); setIsEditing(false); asset.title = editTitle; asset.image_url = editUrl; }
    setLoading(false);
  };

  const uploader = asset.profiles || { username: 'Sytex Editor', avatar_url: '/logo.png' };

  return (
    <>
      <div onClick={() => setShowModal(true)} className="group relative bg-card border border-border-custom rounded-[2.5rem] overflow-hidden hover:border-primary transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full">
        <div className="aspect-video relative overflow-hidden">
          <img src={asset.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[7px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {asset.file_type || 'PAKET'}
          </div>
          {isAdmin && (
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setShowModal(true); }} className="p-2 bg-primary text-white rounded-xl hover:scale-110 transition-all"><Edit3 size={14} /></button>
                <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-all"><Trash2 size={14} /></button>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">{asset.category}</div>
        </div>

        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase italic tracking-tighter text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors">{asset.title}</h3>
            <Link href={`/user/${asset.author_id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 hover:bg-primary/20 hover:border-primary/30 border border-transparent transition-all group/uploader">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 shrink-0 group-hover/uploader:scale-110 transition-transform">
                    <img src={uploader.avatar_url || '/logo.png'} alt={uploader.username} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-0.5">{t('uploader')}</span>
                    <span className="text-[10px] font-black text-white uppercase italic leading-none group-hover/uploader:text-primary transition-colors">@{uploader.username}</span>
                </div>
            </Link>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border-custom/50">
            <button onClick={handleLike} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${liked ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white'}`}>
                <Heart size={14} fill={liked ? "currentColor" : "none"} />
                <span className="text-[10px] font-black">{likeCount}</span>
            </button>
            <div className="p-2.5 rounded-xl bg-muted text-white/40 group-hover:bg-primary group-hover:text-white transition-all shadow-inner"><Download size={16} /></div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => { setShowModal(false); setIsEditing(false); }} />
          <div className="relative bg-card border border-border-custom w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="w-full md:w-3/5 aspect-video md:aspect-auto bg-muted relative">
                <img src={isEditing ? editUrl : asset.image_url} alt={asset.title} className="w-full h-full object-cover" />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 space-y-4">
                        <Camera size={32} className="text-primary animate-pulse" />
                        <input type="text" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="Yeni Kapak URL" className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-primary" />
                    </div>
                )}
                <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="absolute top-6 left-6 p-3 bg-black/50 hover:bg-black backdrop-blur-md text-white rounded-2xl md:hidden"><X size={20} /></button>
            </div>
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-[#050505]">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">{asset.category}</span>
                        <div className="flex items-center gap-2">
                            {isAdmin && !isEditing && <button onClick={() => setIsEditing(true)} className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit3 size={20} /></button>}
                            <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="hidden md:block text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                    </div>
                    {isEditing ? (
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-muted border border-white/10 rounded-xl p-4 text-xl font-black uppercase text-white italic outline-none focus:border-primary" />
                    ) : (
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white leading-none">{asset.title}</h2>
                    )}
                    <Link href={`/user/${asset.author_id}`} onClick={() => setShowModal(false)} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border-custom shadow-inner hover:bg-primary/10 transition-all group/modal-uploader">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 group-hover/modal-uploader:scale-110 transition-transform">
                            <img src={uploader.avatar_url || '/logo.png'} alt="P" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">{t('uploader')}</p>
                            <p className="text-xs font-black text-white uppercase italic group-hover/modal-uploader:text-primary transition-colors">@{uploader.username}</p>
                        </div>
                    </Link>
                </div>
                <div className="space-y-4">
                    {isEditing ? (
                        <button onClick={handleUpdate} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95">
                            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <Save size={20} />} {t('save')}
                        </button>
                    ) : (
                        <a href={asset.download_url} target="_blank" className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95">
                            <Download size={20} />{t('download')}
                        </a>
                    )}
                    <button onClick={handleShare} className="w-full bg-muted hover:bg-border-custom text-white/60 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                        <Share2 size={16} />PAYLAŞ
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetCard;
