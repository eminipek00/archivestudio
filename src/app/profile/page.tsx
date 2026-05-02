"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Trash2, Camera, X, Mail, AtSign, UserSquare2 } from "lucide-react";
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

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        username: username.toLowerCase().replace(/\s/g, '')
    }).eq('id', user.id);

    if (error) alert(error.message);
    else alert("Profil başarıyla güncellendi!");
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

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sol Panel: Profil Özet */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-10 rounded-[3rem] text-center relative overflow-hidden shadow-2xl border border-primary/10">
                <div className="absolute top-0 left-0 w-full h-32 bg-primary/5" />
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] border-4 border-background mx-auto overflow-hidden shadow-2xl mb-6 relative group cursor-pointer">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground"><User size={50} /></div>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={30} />
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">{profile?.full_name || 'Editör'}</h2>
                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mt-2">
                        {user.email === 'ipekmuhammetemin@gmail.com' ? 'sytexarchive ADMIN' : 'sytexarchive EDITOR'}
                    </p>
                </div>
            </div>
          </div>

          {/* Sağ Panel: Ayarlar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Kişisel Bilgiler */}
            <div className="glass-panel p-10 rounded-[3rem] shadow-xl border border-white/5">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary"><UserSquare2 size={24} /></div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Hesap Yönetimi</h3>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted/30 border border-border-custom rounded-2xl py-4 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kullanıcı Adı</label>
                            <div className="relative">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-muted/30 border border-border-custom rounded-2xl py-4 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20">Bilgileri Güncelle</button>
                </form>
            </div>

            {/* Şifre Değiştir */}
            <div className="glass-panel p-10 rounded-[3rem] shadow-xl border border-white/5">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Lock size={24} /></div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Şifre Ayarları</h3>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yeni Şifre</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-muted/30 border border-border-custom rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" required />
                    </div>
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20">Şifreyi Değiştir</button>
                </form>
            </div>
          </div>
        </div>
      </main>

      {/* Cropping Modal */}
      {isCropping && image && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                <div className="w-full max-w-xl bg-card rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-muted/20">
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Fotoğrafı Kırp</h3>
                        <button onClick={() => setIsCropping(false)} className="text-muted-foreground hover:text-white transition-colors"><X size={30} /></button>
                    </div>
                    <div className="relative h-[450px] w-full bg-black">
                        <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div className="p-10 space-y-6 bg-card">
                        <button onClick={handleCropSave} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/40">Profil Fotoğrafını Kaydet</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;
