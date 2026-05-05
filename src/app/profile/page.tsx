"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Camera, AtSign, UserSquare2, Save, Loader2, CheckCircle, Heart, Database, Eye, EyeOff } from "lucide-react";
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
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
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
        
        const { count: followers } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', authUser.id);
        setFollowerCount(followers || 0);
        const { count: following } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', authUser.id);
        setFollowingCount(following || 0);

        fetchFavorites(authUser.id);
      }
    };
    getData();
  }, [supabase, fetchFavorites]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const reservedUsernames = ["sytex.ae", "sytex", "sytexarchive", "admin", "sytexyedek"];
    const lowerUsername = username.toLowerCase();
    const isAdminEmail = user.email?.toLowerCase() === "ipekmuhammetemin@gmail.com";

    if (reservedUsernames.includes(lowerUsername) && !isAdminEmail) {
      alert("Hata: Bu kullanıcı adı rezerve edilmiştir.");
      return;
    }

    setLoading(true);
    try {
        await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, username: username, show_favorites: showFavorites, email: user.email, updated_at: new Date().toISOString() });
        if (newPassword.length >= 6) await supabase.auth.updateUser({ password: newPassword });
        setIsEditingProfile(false);
        window.location.reload();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
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
      <main className="flex-grow flex flex-col items-center pt-20 md:pt-24 pb-4 overflow-hidden">
        <div className="w-full max-w-4xl px-3 md:px-6 space-y-4 md:space-y-6 flex flex-col">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-card border border-border-custom p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative shrink-0">
            <div className="relative group shrink-0">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl bg-[#111]">
                    {profile?.avatar_url ? ( <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 md:p-8"> {isAdmin ? <Logo className="w-full h-full" /> : <User size={48} className="text-white/10" />} </div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer">
                    <Camera className="text-white mb-2" size={20} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                    <h1 className="text-xl md:text-2xl font-[1000] uppercase italic tracking-tighter text-white leading-none">{profile?.full_name || 'Sytex Editor'}</h1>
                    {isAdmin && <span className="text-[7px] md:text-[9px] font-black bg-primary text-white px-2 py-1 rounded-lg uppercase italic tracking-widest shadow-lg shadow-primary/20">ADMIN</span>}
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.3em] italic opacity-60">@{profile?.username || 'user'}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 pt-2">
                    <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center gap-2">
                        <Database className="text-primary w-[10px] md:w-[14px]" />
                        <span className="text-[8px] md:text-[10px] font-black text-white italic">{assetCount} {t('uploaded')}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black text-white italic">{followerCount} {t('followers')}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black text-white italic">{followingCount} {t('following')}</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start overflow-hidden">
            <div className="space-y-4 md:space-y-6 flex flex-col overflow-y-auto no-scrollbar max-h-full">
                <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col gap-3 md:gap-5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 md:pb-4 text-left">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary"><UserSquare2 size={20} /></div>
                            <h3 className="text-xs md:text-lg font-black uppercase italic tracking-tighter text-white">{t('accountSettings')}</h3>
                        </div>
                        <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[8px] md:text-[10px] font-black uppercase text-primary hover:underline">{isEditingProfile ? t('cancel') : t('edit')}</button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-5 text-left">
                        <div className="space-y-1">
                            <label className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-white/20 ml-1">{t('fullName')}</label>
                            <input type="text" disabled={!isEditingProfile} value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full bg-muted border border-border-custom rounded-lg md:rounded-xl py-2.5 md:py-3.5 px-4 md:px-5 text-[10px] md:text-sm font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-1 ring-primary/20 bg-background'}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-white/20 ml-1">{t('username')}</label>
                            <input type="text" disabled={!isEditingProfile} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} className={`w-full bg-muted border border-border-custom rounded-lg md:rounded-xl py-2.5 md:py-3.5 px-4 md:px-5 text-[10px] md:text-sm font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-1 ring-primary/20 bg-background'}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-white/20 ml-1">{t('newPassword')}</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} disabled={!isEditingProfile} value={newPassword} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full bg-muted border border-border-custom rounded-lg md:rounded-xl py-2.5 md:py-3.5 px-4 md:px-5 pr-12 text-[10px] md:text-sm font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-1 ring-primary/20 bg-background'}`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={!isEditingProfile} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-lg md:rounded-2xl border border-white/5">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] md:text-xs font-black text-white uppercase italic">{t('showFavorites')}</span>
                                <span className="text-[6px] md:text-[9px] font-medium text-white/30 uppercase tracking-widest italic">{t('favoritesDesc')}</span>
                            </div>
                            <button type="button" onClick={() => setShowFavorites(!showFavorites)} disabled={!isEditingProfile} className={`w-8 md:w-12 h-4 md:h-6 rounded-full relative transition-all ${showFavorites ? 'bg-primary' : 'bg-white/10'} ${!isEditingProfile && 'opacity-30'}`}>
                                <div className={`absolute top-0.5 w-3 md:w-5 h-3 md:h-5 bg-white rounded-full transition-all ${showFavorites ? 'left-4 md:left-6.5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                    {isEditingProfile && (
                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 md:py-4 rounded-lg md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all">
                            {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} {t('save')}
                        </button>
                    )}
                </form>

                <div className="bg-card border border-border-custom p-3 md:p-5 rounded-xl md:rounded-[2rem] shadow-2xl flex items-center justify-between group transition-all hover:border-primary/20 shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 text-left">
                        <div className="p-2 md:p-3 bg-muted rounded-lg md:rounded-xl text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all"><AtSign className="w-[14px] md:w-[18px]" /></div>
                        <div>
                            <p className="text-[6px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-0.5">{t('emailAddress')}</p>
                            <p className="text-[9px] md:text-sm font-black text-white italic tracking-tight">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border-custom p-4 md:p-8 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl flex flex-col gap-3 md:gap-5 h-full overflow-hidden">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3 md:pb-5 text-left">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Heart className="w-[16px] md:w-[22px]" fill="currentColor" /></div>
                    <h3 className="text-xs md:text-xl font-black uppercase italic tracking-tighter text-white">{t('myLikes')}</h3>
                </div>
                <div className="flex-grow overflow-y-auto pr-1 no-scrollbar space-y-3 md:space-y-4">
                    {favoriteAssets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/10 text-center space-y-4 opacity-20 py-10">
                            <Heart className="w-[24px] md:w-[48px]" />
                            <p className="text-[8px] md:text-sm font-black uppercase tracking-[0.5em]">{t('noFavorites')}</p>
                        </div>
                    ) : (
                        favoriteAssets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} isAdmin={false} />
                        ))
                    )}
                </div>
            </div>
          </div>
        </div>

        {isCropping && (
            <div className="fixed inset-0 z-[6000] bg-black/98 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="relative w-full max-w-2xl aspect-square bg-muted rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Cropper image={image!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                </div>
                <div className="mt-10 w-full max-w-2xl flex gap-4">
                    <button onClick={() => setIsCropping(false)} className="flex-1 py-4 md:py-6 rounded-xl md:rounded-[2rem] bg-muted text-white font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-white/10 transition-all">{t('cancel')}</button>
                    <button onClick={handleCropSave} className="flex-1 py-4 md:py-6 rounded-xl md:rounded-[2rem] bg-primary text-white font-black text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/40">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />} {t('update').toUpperCase()}
                    </button>
                </div>
            </div>
        )}
      </main>
      <footer className="bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between text-[8px] font-black uppercase text-white/30 italic shrink-0">
          <span className="tracking-widest">sytexarchive</span>
          <p className="tracking-widest">&copy; {new Date().getFullYear()} sytexarchive</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
