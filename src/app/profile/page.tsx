"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, AtSign, UserSquare2, Save, Loader2, CheckCircle, Trash2, AlertTriangle, Edit3, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";
import { Logo } from "@/components/Logo";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { t } = useLanguage();
  const supabase = createClient();

  // Cropper States
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

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
        }
      }
    };
    getData();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            username: username,
            email: user.email,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        setSuccess(true);
        setIsEditingProfile(false);
        setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { alert("Hata: " + err.message); } finally { setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => { 
        setImage(reader.result as string); 
        setIsCropping(true); 
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => { 
    setCroppedAreaPixels(croppedAreaPixels); 
  }, []);

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
                window.location.reload(); // Başarılı olunca sayfayı yenile ki Navbar güncellensin
            }
        } catch (err: any) {
            alert("Yükleme hatası lo: " + err.message);
        } finally {
            setLoading(false);
        }
    }
  };

  if (!user) return null;

  const isAdmin = user?.email === 'ipekmuhammetemin@gmail.com' || profile?.is_admin;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center gap-6 bg-card border border-border-custom p-6 rounded-[2rem] shadow-lg">
            <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl bg-muted transition-transform hover:scale-105">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#111] p-4">
                            {isAdmin ? <Logo className="w-full h-full" /> : <User size={48} className="text-white/20" />}
                        </div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
                    <Camera className="text-white mb-2" size={24} />
                    <span className="text-[8px] font-black uppercase text-white tracking-widest">{t('edit')}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">{profile?.full_name || 'Sytex Editor'}</h1>
                    {isAdmin && <span className="text-[8px] font-black bg-primary text-white px-2 py-1 rounded-lg uppercase italic tracking-widest">ADMIN</span>}
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-1">@{profile?.username || 'user'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl text-white"><UserSquare2 size={20} /></div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">{t('accountManagement')}</h3>
                    </div>
                    <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[9px] font-black uppercase text-primary hover:underline">{isEditingProfile ? t('cancel') : t('edit')}</button>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t('fullName')}</label>
                        <input type="text" disabled={!isEditingProfile} value={fullName} onChange={(e) => setFullName(e.target.value.toUpperCase())} className={`w-full bg-muted border border-border-custom rounded-xl py-3.5 px-5 text-xs font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-2 ring-primary/20 bg-background'}`} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t('username')}</label>
                        <input type="text" disabled={!isEditingProfile} value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full bg-muted border border-border-custom rounded-xl py-3.5 px-5 text-xs font-bold text-white transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-2 ring-primary/20 bg-background'}`} />
                    </div>
                </div>
                {isEditingProfile && (
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} {t('save').toUpperCase()}
                    </button>
                )}
            </form>

            <div className="space-y-6">
                <div className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-xl text-white/40"><AtSign size={20} /></div>
                        <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">E-POSTA ADRESİ</p>
                            <p className="text-xs font-bold text-white">{user.email}</p>
                        </div>
                    </div>
                    <Lock size={16} className="text-white/10" />
                </div>
                <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-red-500/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><AlertTriangle size={20}/></div>
                        <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">{t('dangerZone')}</span>
                    </div>
                    <button onClick={() => { if(confirm(t('confirmDelete'))) supabase.from('profiles').delete().eq('id', user.id).then(() => supabase.auth.signOut().then(() => window.location.href="/")) }} className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-all"><Trash2 size={16}/></button>
                </div>
            </div>
          </div>
        </div>

        {/* CROP MODAL */}
        {isCropping && (
            <div className="fixed inset-0 z-[5000] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="relative w-full max-w-xl aspect-square bg-muted rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Cropper image={image!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                </div>
                <div className="mt-8 w-full max-w-xl space-y-6">
                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                    <div className="flex gap-4">
                        <button onClick={() => setIsCropping(false)} className="flex-1 py-4 rounded-2xl bg-muted text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">{t('cancel')}</button>
                        <button onClick={handleCropSave} disabled={loading} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />} {t('update').toUpperCase()}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>

      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0 text-[8px] font-black uppercase text-white/30 italic"><span>sytexarchive</span><p>&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default ProfilePage;
