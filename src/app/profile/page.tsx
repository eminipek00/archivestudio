"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, Mail, AtSign, UserSquare2, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        if (data) {
            setFullName(data.full_name || "");
            setUsername(data.username || "");
        }
      }
    };
    getData();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        username: username.toLowerCase().replace(/\s/g, '')
    }).eq('id', user.id);

    if (error) {
        alert("Hata: " + error.message);
    } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else {
      alert("Şifre başarıyla güncellendi!");
      setNewPassword("");
    }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
            const fileName = `${Date.now()}-${user.id}.jpg`;
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

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-card shadow-2xl bg-muted">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={40} /></div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <span className="text-[8px] font-black text-white mt-1 uppercase">Değiştir</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">{profile?.full_name || 'Kullanıcı'}</h1>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{profile?.username ? `@${profile.username}` : 'Henüz kullanıcı adı seçilmemiş'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* HESAP AYARLARI */}
            <div className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <div className="flex items-center gap-3 mb-8">
                    <UserSquare2 className="text-primary" size={24} />
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Hesap Ayarları</h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ad Soyad</label>
                        <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            className="w-full bg-muted border border-border-custom rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                            placeholder="Adınız Soyadınız"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kullanıcı Adı</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className="w-full bg-muted border border-border-custom rounded-2xl py-4 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                                placeholder="kullaniciadi"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {success ? "BAŞARIYLA KAYDEDİLDİ!" : "DEĞİŞİKLİKLERİ KAYDET"}
                    </button>
                </form>
            </div>

            {/* ŞİFRE AYARLARI */}
            <div className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-muted" />
                <div className="flex items-center gap-3 mb-8">
                    <Lock className="text-muted-foreground" size={24} />
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Şifre Ayarları</h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yeni Şifre</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            className="w-full bg-muted border border-border-custom rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-muted hover:bg-border-custom text-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                        {loading ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
                    </button>
                </form>
            </div>
          </div>
        </div>
      </main>

      {/* Cropper Modal - MAT ARKA PLAN */}
      {isCropping && image && (
            <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95">
                <div className="w-full max-w-xl bg-card border border-border-custom rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-border-custom flex justify-between items-center bg-muted">
                        <h3 className="font-black uppercase tracking-widest text-sm">Fotoğrafı Kırp</h3>
                        <button onClick={() => setIsCropping(false)} className="text-muted-foreground hover:text-white"><X size={30} /></button>
                    </div>
                    <div className="relative h-[400px] w-full bg-black">
                        <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div className="p-8 bg-card">
                        <button onClick={handleCropSave} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl">KAYDET</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;
