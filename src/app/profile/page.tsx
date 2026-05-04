"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Camera, AtSign, UserSquare2, Save, Loader2, CheckCircle, Heart, Database, Eye, EyeOff, Check, X } from "lucide-react";
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
  const [newPassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showFavorites, setShowFavorites] = useState(true);
  const [assetCount, setAssetCount] = useState(0);
  const [favoriteAssets, setFavoriteAssets] = useState<any[]>([]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // SITE EDITOR STATE
  const [isSiteEditorMode, setIsSiteEditorMode] = useState(false);
  const [headerPos, setHeaderPos] = useState({ x: 0, y: 0, scale: 1 });
  const [gridPos, setGridPos] = useState({ x: 0, y: 0 });
  
  const { t } = useLanguage();
  const supabase = createClient();

  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const fetchFavorites = useCallback(async (userId: string) => {
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
    // EDITOR AYARLARINI YÜKLE
    const savedHeader = localStorage.getItem('sytexHeaderSettings');
    const savedGrid = localStorage.getItem('sytexGridSettings');
    if (savedHeader) setHeaderPos(JSON.parse(savedHeader));
    if (savedGrid) setGridPos(JSON.parse(savedGrid));

    const handleToggleEditor = () => setIsSiteEditorMode(prev => !prev);
    window.addEventListener('toggleSiteEditor', handleToggleEditor);

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
    return () => window.removeEventListener('toggleSiteEditor', handleToggleEditor);
  }, [supabase, fetchFavorites]);

  const saveEditorSettings = () => {
      localStorage.setItem('sytexHeaderSettings', JSON.stringify(headerPos));
      localStorage.setItem('sytexGridSettings', JSON.stringify(gridPos));
      setIsSiteEditorMode(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
        await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            username: username,
            show_favorites: showFavorites,
            email: user.email,
            updated_at: new Date().toISOString()
        });
        if (newPassword.length >= 6) await supabase.auth.updateUser({ password: newPassword });
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
                await supabase.storage.from('avatars').upload(fileName, croppedImage);
                const avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
                await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
                window.location.reload();
            }
        } catch (err: any) { alert(err.message); } finally { setLoading(false); }
    }
  };

  if (!user) return null;
  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-grow flex flex-col p-4 pt-24 space-y-4 no-scrollbar overflow-hidden">
          
          {/* PROFILE HEADER - AYARLANABİLİR */}
          <div 
            className="flex flex-col md:flex-row items-center gap-6 bg-card border border-border-custom p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden shrink-0 transition-transform duration-300"
            style={{ transform: `translate(${headerPos.x}px, ${headerPos.y}px) scale(${headerPos.scale})` }}
          >
            <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-background shadow-2xl bg-[#111]">
                    {profile?.avatar_url ? ( <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> ) : (
                        <div className="w-full h-full flex items-center justify-center p-6"> {isAdmin ? <Logo className="w-full h-full" /> : <User size={40} className="text-white/10" />} </div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] cursor-pointer">
                    <Camera className="text-white mb-1" size={16} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 className="text-xl md:text-2xl font-[1000] uppercase italic tracking-tighter text-white leading-none">{profile?.full_name || 'Sytex Editor'}</h1>
                    {isAdmin && <span className="text-[7px] font-black bg-primary text-white px-2 py-0.5 rounded-lg uppercase italic tracking-widest shadow-lg shadow-primary/20">ADMIN</span>}
                </div>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic opacity-60">@{profile?.username || 'user'}</p>
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                    <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <Database size={10} className="text-primary" />
                        <span className="text-[9px] font-black text-white italic">{assetCount} {t('uploaded')}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* GRID AREA - AYARLANABİLİR */}
          <div 
            className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 items-start overflow-hidden transition-transform duration-300"
            style={{ transform: `translate(${gridPos.x}px, ${gridPos.y}px)` }}
          >
            <div className="space-y-4 h-full flex flex-col overflow-hidden">
                <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-6 rounded-[2.5rem] shadow-xl flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 text-left">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary"><UserSquare2 size={16} /></div>
                            <h3 className="text-xs font-black uppercase italic tracking-tighter text-white">{t('accountManagement')}</h3>
                        </div>
                        <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[8px] font-black uppercase text-primary hover:underline">{isEditingProfile ? t('cancel') : t('edit')}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 text-left">
                            <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">{t('fullName')}</label>
                            <input type="text" disabled={!isEditingProfile} value={fullName} onChange={(e) => setFullName(e.target.value.toUpperCase())} className={`w-full bg-[#111] border border-border-custom rounded-xl py-2 px-4 text-[10px] font-bold text-white outline-none ${!isEditingProfile && 'opacity-30'}`} />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">{t('username')}</label>
                            <input type="text" disabled={!isEditingProfile} value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full bg-[#111] border border-border-custom rounded-xl py-2 px-4 text-[10px] font-bold text-white outline-none ${!isEditingProfile && 'opacity-30'}`} />
                        </div>
                    </div>
                    <div className="space-y-1 relative text-left">
                        <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">{t('newPassword')}</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} disabled={!isEditingProfile} value={newPassword} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full bg-[#111] border border-border-custom rounded-xl py-2 px-4 text-[10px] font-bold text-white outline-none ${!isEditingProfile && 'opacity-30'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={!isEditingProfile} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"><Eye size={14} /></button>
                        </div>
                    </div>
                    {isEditingProfile && (
                        <button type="submit" disabled={loading} className="w-full bg-primary py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                            {loading ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} {t('save')}
                        </button>
                    )}
                </form>

                <div className="bg-card border border-border-custom p-4 rounded-[2rem] shadow-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4 text-left">
                        <div className="p-2 bg-[#111] rounded-xl text-white/40"><AtSign size={14} /></div>
                        <div>
                            <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-0.5">{t('emailAddress')}</p>
                            <p className="text-[9px] font-black text-white italic tracking-tight">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border-custom p-6 rounded-[2.5rem] shadow-xl flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2 text-left">
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><Heart size={16} fill="currentColor" /></div>
                    <h3 className="text-xs font-black uppercase italic tracking-tighter text-white">{t('myLikes')}</h3>
                </div>
                <div className="flex-grow overflow-y-auto pr-1 no-scrollbar space-y-3">
                    {favoriteAssets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/10 text-center opacity-20">
                            <Heart size={24} />
                        </div>
                    ) : (
                        favoriteAssets.map((asset) => <AssetCard key={asset.id} asset={asset} isAdmin={false} />)
                    )}
                </div>
            </div>
          </div>
      </main>

      {/* GLOBAL SITE EDITOR CONTROLS */}
      {isSiteEditorMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[7000] bg-black border border-primary/40 p-4 rounded-[2rem] shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-primary uppercase">HEADER POS</span>
                  <div className="flex gap-2">
                    <input type="number" value={headerPos.x} onChange={(e) => setHeaderPos({...headerPos, x: parseInt(e.target.value) || 0})} className="w-10 bg-[#111] text-[10px] text-white text-center rounded-lg border border-white/10" />
                    <input type="number" value={headerPos.y} onChange={(e) => setHeaderPos({...headerPos, y: parseInt(e.target.value) || 0})} className="w-10 bg-[#111] text-[10px] text-white text-center rounded-lg border border-white/10" />
                    <input type="number" step="0.1" value={headerPos.scale} onChange={(e) => setHeaderPos({...headerPos, scale: parseFloat(e.target.value) || 1})} className="w-10 bg-[#111] text-[10px] text-white text-center rounded-lg border border-white/10" />
                  </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-primary uppercase">GRID POS</span>
                  <div className="flex gap-2">
                    <input type="number" value={gridPos.x} onChange={(e) => setGridPos({...gridPos, x: parseInt(e.target.value) || 0})} className="w-10 bg-[#111] text-[10px] text-white text-center rounded-lg border border-white/10" />
                    <input type="number" value={gridPos.y} onChange={(e) => setGridPos({...gridPos, y: parseInt(e.target.value) || 0})} className="w-10 bg-[#111] text-[10px] text-white text-center rounded-lg border border-white/10" />
                  </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveEditorSettings} className="p-3 bg-primary text-white rounded-2xl hover:scale-105 transition-all"><Check size={16}/></button>
                <button onClick={() => setIsSiteEditorMode(false)} className="p-3 bg-red-500 text-white rounded-2xl hover:scale-105 transition-all"><X size={16}/></button>
              </div>
          </div>
      )}

      {isCropping && (
          <div className="fixed inset-0 z-[6000] bg-black flex flex-col items-center justify-center p-6">
              <div className="relative w-full max-w-lg aspect-square bg-[#111] rounded-[3rem] overflow-hidden">
                  <Cropper image={image!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
              </div>
              <div className="mt-8 w-full max-w-lg flex gap-4">
                  <button onClick={() => setIsCropping(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest">{t('cancel')}</button>
                  <button onClick={handleCropSave} disabled={loading} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/40">
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} {t('update').toUpperCase()}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProfilePage;
