"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, AtSign, UserSquare2, Save, Loader2, CheckCircle, Trash2, AlertTriangle, Edit3, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else { alert("Şifre güncellendi!"); setNewPassword(""); setIsEditingPassword(false); }
    setLoading(false);
  };

  const handleCancelEdit = (type: 'profile' | 'password') => {
    if (type === 'profile') {
        setFullName(profile?.full_name || "");
        setUsername(profile?.username || "");
        setIsEditingProfile(false);
    } else {
        setNewPassword("");
        setIsEditingPassword(false);
    }
  };

  // ... (handleFileChange, onCropComplete, handleCropSave, handleDeleteAccount kısımları aynı)
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
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
            const fileName = `avatars/${Date.now()}-${user.id}.jpg`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImage);
            if (!uploadError) {
                const avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
                await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
                window.location.reload();
            }
        }
        setLoading(false);
    }
  };
  const handleDeleteAccount = async () => {
    if (confirm("Hesabı silmek üzeresiniz!")) {
        const { error } = await supabase.from('profiles').delete().eq('id', user.id);
        if (!error) { await supabase.auth.signOut(); window.location.href = "/"; }
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center gap-6 bg-card border border-border-custom p-6 rounded-[2rem] shadow-lg">
            <div className="relative group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-background shadow-lg bg-muted">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={32} /></div>}
                </div>
                <label className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                    <Camera className="text-white" size={20} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">{profile?.full_name || 'YENİ EDİTÖR'}</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">@{profile?.username || 'kullanici'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl text-white"><UserSquare2 size={20} /></div>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">Hesap Yönetimi</h3>
                    </div>
                    {isEditingProfile ? (
                        <button type="button" onClick={() => handleCancelEdit('profile')} className="text-[9px] font-black uppercase text-red-500 hover:underline">Vazgeç</button>
                    ) : (
                        <button type="button" onClick={() => setIsEditingProfile(true)} className="text-[9px] font-black uppercase text-primary hover:underline flex items-center gap-1"><Edit3 size={12}/> Düzenle</button>
                    )}
                </div>
                <div className="space-y-4">
                    <input type="text" disabled={!isEditingProfile} value={fullName} onChange={(e) => setFullName(e.target.value.toUpperCase())} className={`w-full bg-muted border border-border-custom rounded-xl py-3 px-4 text-xs font-bold transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-2 ring-primary/20'}`} placeholder="TAM ADINIZ" />
                    <input type="text" disabled={!isEditingProfile} value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full bg-muted border border-border-custom rounded-xl py-3 px-4 text-xs font-bold transition-all ${!isEditingProfile ? 'opacity-40' : 'ring-2 ring-primary/20'}`} placeholder="kullaniciadi" />
                </div>
                {isEditingProfile && (
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} KAYDET
                    </button>
                )}
            </form>

            <div className="space-y-6">
                <form onSubmit={handleUpdatePassword} className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-xl"><Lock size={20} /></div>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter">Güvenlik</h3>
                        </div>
                        {isEditingPassword ? (
                            <button type="button" onClick={() => handleCancelEdit('password')} className="text-[9px] font-black uppercase text-red-500 hover:underline">Vazgeç</button>
                        ) : (
                            <button type="button" onClick={() => setIsEditingPassword(true)} className="text-[9px] font-black uppercase text-white/40 hover:text-white flex items-center gap-1"><Lock size={12}/> Şifre Düzenle</button>
                        )}
                    </div>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} disabled={!isEditingPassword} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full bg-muted border border-border-custom rounded-xl py-3 px-4 text-xs font-bold transition-all ${!isEditingPassword ? 'opacity-40' : 'ring-2 ring-primary/20'}`} placeholder="YENİ ŞİFRE" />
                        {isEditingPassword && newPassword.length > 0 && (
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary"><Eye size={16} /></button>
                        )}
                    </div>
                    {isEditingPassword && (
                        <button type="submit" disabled={!newPassword || loading} className="w-full bg-white text-black py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">ŞİFREYİ GÜNCELLE</button>
                    )}
                </form>

                <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem] flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2"><AlertTriangle size={14}/> Hesabı Sil</span>
                    <button onClick={handleDeleteAccount} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"><Trash2 size={16}/></button>
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0">
        <span className="text-[8px] font-black uppercase italic tracking-tighter text-white/30">sytexarchive</span>
        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">&copy; {new Date().getFullYear()} sytexarchive</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
