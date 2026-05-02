"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, Mail, AtSign, UserSquare2, Save, Loader2, CheckCircle } from "lucide-react";
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();
            
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
    setSuccess(false);

    try {
        const cleanedUsername = username.toLowerCase().trim().replace(/\s/g, '');
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: fullName,
                username: cleanedUsername,
                email: user.email,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
        alert("Güncelleme Hatası: " + err.message);
    } finally {
        setLoading(false);
    }
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
            const fileName = `avatars/${Date.now()}-${user.id}.jpg`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImage);
            if (!uploadError) {
                const avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
                await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
                window.location.reload();
            } else {
                alert("Fotoğraf yükleme hatası: " + uploadError.message);
            }
        }
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Üst Profil Kartı */}
          <div className="bg-card border border-border-custom p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-background shadow-2xl bg-muted">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={48} /></div>
                    )}
                </div>
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <span className="text-[10px] font-black text-white mt-1 uppercase">Değiştir</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{fullName || 'Yeni Editör'}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                        @{username || 'kullanici'}
                    </span>
                    <span className="px-4 py-1.5 bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full border border-border-custom">
                        {user.email}
                    </span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* HESAP BİLGİLERİ GÜNCELLEME */}
            <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <UserSquare2 size={120} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20"><UserSquare2 size={24} /></div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Hesap Yönetimi</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tam Adınız</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="Ad Soyad" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kullanıcı Adı</label>
                        <div className="relative">
                            <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="kullaniciadi" />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${success ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'}`}>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (success ? <CheckCircle size={20} /> : <Save size={20} />)}
                    {success ? "BAŞARIYLA KAYDEDİLDİ!" : "GÜNCELLEMELERİ KAYDET"}
                </button>
            </form>

            {/* GÜVENLİK AYARLARI */}
            <form onSubmit={handleUpdatePassword} className="bg-card border border-border-custom p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-muted-foreground">
                    <Lock size={120} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-2xl text-muted-foreground"><Lock size={24} /></div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-muted-foreground">Güvenlik</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Yeni Şifre Belirle</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all" placeholder="••••••••" required minLength={6} />
                    </div>
                    <p className="text-[9px] text-muted-foreground font-medium italic">* Şifreniz en az 6 karakterden oluşmalıdır.</p>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-muted hover:bg-border-custom text-foreground py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                    {loading ? "ŞİFRE GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
                </button>
            </form>
          </div>
        </div>
      </main>

      {/* Fotoğraf Kırpma Modalı */}
      {isCropping && image && (
            <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95">
                <div className="w-full max-w-xl bg-card border border-border-custom rounded-[3rem] overflow-hidden shadow-2xl relative">
                    <div className="p-8 border-b border-border-custom flex justify-between items-center bg-muted">
                        <h3 className="font-black uppercase tracking-widest text-sm">Fotoğrafı Kırp</h3>
                        <button onClick={() => setIsCropping(false)} className="text-muted-foreground hover:text-white transition-colors"><X size={30} /></button>
                    </div>
                    <div className="relative h-[400px] w-full bg-black">
                        <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div className="p-8 bg-card">
                        <button onClick={handleCropSave} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "FOTOĞRAFI KAYDET"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;
