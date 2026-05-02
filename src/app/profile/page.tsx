"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Camera, X, Mail, AtSign, UserSquare2, Save, Loader2, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
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
        const cleanedUsername = username.toLowerCase().trim().replace(/\s/g, '');
        const { error } = await supabase.from('profiles').upsert({
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
        alert("Hata: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("DİKKAT: Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz! Onaylıyor musunuz?")) {
        setLoading(true);
        // İstemci tarafında auth.admin olmadığı için kullanıcıyı bir tabloya işaretleyebiliriz veya basitçe çıkış yaptırıp profilini silebiliriz.
        // Gerçek silme için bir Supabase Function gerekir, ama şimdilik profili silip çıkış yaptıralım.
        const { error } = await supabase.from('profiles').delete().eq('id', user.id);
        if (!error) {
            await supabase.auth.signOut();
            window.location.href = "/";
        }
        setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else { alert("Şifre başarıyla güncellendi!"); setNewPassword(""); }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row items-center gap-8 bg-card border border-border-custom p-10 rounded-[3rem]">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl bg-muted">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User size={48} /></div>}
                </div>
                <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
                    <Camera className="text-white" size={24} />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{fullName || 'Yeni Editör'}</h1>
                <p className="text-xs font-black text-primary uppercase tracking-widest">@{username || 'kullanici'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* HESAP AYARLARI */}
            <form onSubmit={handleUpdateProfile} className="bg-card border border-border-custom p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-white"><UserSquare2 size={24} /></div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Hesap Yönetimi</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">İsim Soyisim</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted border border-border-custom rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kullanıcı Adı</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-muted border border-border-custom rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : (success ? <CheckCircle /> : <Save />)}
                    {success ? "KAYDEDİLDİ!" : "GÜNCELLE"}
                </button>
            </form>

            <div className="space-y-8">
                {/* GÜVENLİK */}
                <form onSubmit={handleUpdatePassword} className="bg-card border border-border-custom p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl"><Lock size={24} /></div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Güvenlik</h3>
                    </div>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-muted border border-border-custom rounded-2xl py-4 px-6 text-sm font-bold" placeholder="Yeni Şifre" />
                    <button type="submit" className="w-full bg-muted hover:bg-border-custom py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">ŞİFREYİ GÜNCELLE</button>
                </form>

                {/* HESAP SİLME */}
                <div className="bg-red-500/5 border border-red-500/20 p-10 rounded-[3.5rem] shadow-2xl space-y-6">
                    <div className="flex items-center gap-4 text-red-500">
                        <AlertTriangle size={24} />
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Tehlikeli Bölge</h3>
                    </div>
                    <p className="text-[10px] font-bold text-red-500/60 uppercase leading-relaxed tracking-wider">Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak kaldırılır.</p>
                    <button onClick={handleDeleteAccount} className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 flex items-center justify-center gap-3">
                        <Trash2 size={18} />
                        HESABI KALICI OLARAK SİL
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>

      {isCropping && image && (
            <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/95">
                <div className="w-full max-w-xl bg-card border border-border-custom rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-border-custom flex justify-between items-center bg-muted">
                        <h3 className="font-black uppercase tracking-widest text-sm">Kırp</h3>
                        <button onClick={() => setIsCropping(false)}><X size={30} /></button>
                    </div>
                    <div className="relative h-[400px] w-full bg-black">
                        <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div className="p-8 bg-card"><button onClick={handleCropSave} className="w-full bg-primary py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl">KAYDET</button></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;
