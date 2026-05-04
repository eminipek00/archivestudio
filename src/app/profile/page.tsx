"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, AtSign, UserSquare2, Save, Loader2, CheckCircle, Trash2, AlertTriangle, Edit3, Heart, Trophy, Database, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";
import { Logo } from "@/components/Logo";
import AssetCard from "@/components/AssetCard";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [showFavorites, setShowFavorites] = useState(true);
  const [assetCount, setAssetCount] = useState(0);
  const [favoriteAssets, setFavoriteAssets] = useState<any[]>([]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { t } = useLanguage();
  const supabase = createClient();

  // Cropper States
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const fetchFavorites = useCallback(async (userId: string) => {
      // GLOBAL LIKES TABLOSUNDAN ÇEK
      const { data: likesData } = await supabase.from('likes').select('asset_id').eq('user_id', userId);
      if (likesData && likesData.length > 0) {
          const ids = likesData.map(l => l.asset_id);
          const { data } = await supabase.from('assets').select('*, profiles:author_id (username, avatar_url, full_name)').in('id', ids);
          if (data) setFavoriteAssets(data);
      } else {
          setFavoriteAssets([]);
      }
  }, [supabase]);

  useEffect(() => {
    const getData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
        if (profileData) {
            setProfile(profileData);
            setFullName(profileData.full_name || "");
            setUsername(profileData.username || "");
            setShowFavorites(profileData.show_favorites ?? true);
        }

        const { count } = await supabase.from('assets').select('*', { count: 'exact', head: true }).eq('author_id', authUser.id);
        setAssetCount(count || 0);
        fetchFavorites(authUser.id);
      }
    };
    getData();

    const handleUpdate = () => { if (user) fetchFavorites(user.id); };
    window.addEventListener('favoritesUpdated', handleUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleUpdate);
  }, [supabase, fetchFavorites, user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            username: username,
            show_favorites: showFavorites,
            email: user.email,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        setIsEditingProfile(false);
    } catch (err: any) { alert(err.message); } finally { setLoading(false); window.location.reload(); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => { setImage(reader.result as string); setIsCropping(true); });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => { setCroppedAreaPixels(croppedAreaPixels); }, []);

  const handleCropSave = async () => {
    if (image && croppedAreaPixels && user) {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) {
                const fileName = `avatars/${Date.now()}-${user.id}.jpg`;
                const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImage);
                if (uploadError) throw uploadError;
                const avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
                const { error: updateError } = await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
                if (updateError) throw updateError;
                setIsCropping(false);
                window.location.reload();
            }
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    }
  };

  if (!user) return null;
  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* PROFİL ÜST KART */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-card border border-border-custom p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
            <div className="relative group shrink-0">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl bg-[#111]">
                    {profile?.avatar_url ? ( <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> ) : (
                        <div className="w-full h-full flex items-center justify-center p-6"> {isAdmin ? <Logo className="w-full h-full" /> : <User size={64} className="text-white/10" />} </div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
                    <Camera className="text-white mb-2" size={24} />
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">{t('edit')}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl md:text-4xl font-[1000] uppercase italic tracking-tighter text-white leading-none">{profile?.full_name || 'Sytex Editor'}</h1>
                    {isAdmin && <span className="text-[8px] font-black bg-primary text-white px-2.5 py-1 rounded-xl uppercase italic tracking-widest shadow-lg shadow-primary/20">ADMIN</span>}
                </div>
                <p className="text-xs font-black text-primary uppercase tracking-[0.3em] italic opacity-60">@{profile?.username || 'user'}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                    <div className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <Database size={14} className="text-primary" />
                        <span className="text-xs font-black text-white italic">{assetCount} {t('uploaded')}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
                {/* HESAP YÖNETİMİ */}
                <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-8 rounded-[3rem] shadow-xl flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary"><UserSquare2 size={20} /></div>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{t('accountManagement')}</h3>
                        </div>
                        <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[9px] font-black uppercase text-primary hover:underline">{isEditingProfile ? t('cancel') : t('edit')}</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">{t('fullName')}</label>
                            <input type="text" disabled={!isEditingProfile} value={fullName} onChange={(e) => setFullName(e.target.value.toUpperCase())} className={`w-full bg-muted border border-border-custom rounded-2xl py-3 px-5 text-xs font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-1 ring-primary/20 bg-background'}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">{t('username')}</label>
                            <input type="text" disabled={!isEditingProfile} value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full bg-muted border border-border-custom rounded-2xl py-3 px-5 text-xs font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-1 ring-primary/20 bg-background'}`} />
                        </div>
                        
                        {/* GİZLİLİK ANAHTARI (TOGGLE) */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 mt-2">
                            <div className="flex items-center gap-3">
                                {showFavorites ? <Eye size={16} className="text-primary" /> : <EyeOff size={16} className="text-white/20" />}
                                <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Favorileri Göster</span>
                            </div>
                            <button type="button" onClick={() => setShowFavorites(!showFavorites)} disabled={!isEditingProfile} className={`w-12 h-6 rounded-full transition-all relative ${showFavorites ? 'bg-primary' : 'bg-white/10'} ${!isEditingProfile && 'opacity-30'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showFavorites ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                    {isEditingProfile && (
                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all">
                            {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} {t('save')}
                        </button>
                    )}
                </form>

                <div className="bg-card border border-border-custom p-6 rounded-[3rem] shadow-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all"><AtSign size={18} /></div>
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">E-POSTA ADRESİ</p>
                            <p className="text-[10px] font-black text-white italic tracking-tight">{user.email}</p>
                        </div>
                    </div>
                    <Lock size={14} className="text-white/5" />
                </div>
            </div>

            {/* FAVORİ VARLIKLARIM (DATABASE LİSTE) */}
            <div className="bg-card border border-border-custom p-8 rounded-[3rem] shadow-xl flex flex-col gap-6 min-h-[400px]">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><Heart size={20} fill="currentColor" /></div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{t('myLikes')}</h3>
                </div>
                
                {favoriteAssets.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/10 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Heart size={32} className="opacity-10" /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">HENÜZ FAVORİ VARLIK EKLEMEDİNİZ.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {favoriteAssets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} isAdmin={false} />
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* CROP MODAL */}
        {isCropping && (
            <div className="fixed inset-0 z-[5000] bg-black/98 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="relative w-full max-w-2xl aspect-square bg-muted rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Cropper image={image!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                </div>
                <div className="mt-12 w-full max-w-2xl flex gap-4">
                    <button onClick={() => setIsCropping(false)} className="flex-1 py-5 rounded-3xl bg-muted text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">{t('cancel')}</button>
                    <button onClick={handleCropSave} disabled={loading} className="flex-1 py-5 rounded-3xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/40">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />} {t('update').toUpperCase()}
                    </button>
                </div>
            </div>
        )}
      </main>
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0 text-[8px] font-black uppercase text-white/30 italic"><span>sytexarchive</span><p>&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default ProfilePage;
