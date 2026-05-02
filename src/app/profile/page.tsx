"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Trash2, Camera, X, Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage && user) {
        setLoading(true);
        const fileName = `${Date.now()}-${user.id}.jpg`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImage);
        
        if (!uploadError) {
          const avatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
          await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
          window.location.reload();
        }
        setLoading(false);
        setIsCropping(false);
      }
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

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1">
            <div className="glass-panel p-8 rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-24 bg-primary/10" />
                <div className="relative pt-4">
                    <div className="w-24 h-24 rounded-[2rem] border-4 border-background mx-auto overflow-hidden shadow-xl mb-4 relative group cursor-pointer">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                <User size={40} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">{profile?.full_name || 'Kullanıcı'}</h2>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">
                        {user.email === 'ipekmuhammetemin@gmail.com' ? t('admin') : t('editor')}
                    </p>
                </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Lock size={20} /></div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">{t('changePassword')}</h3>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-muted/50 border border-border-custom rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" required />
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20">Güncelle</button>
                </form>
            </div>
          </div>
        </div>
      </main>

      {/* Cropping Modal */}
      {isCropping && image && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-card rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-muted/20">
                        <h3 className="font-black uppercase tracking-widest text-sm">Fotoğrafı Kırp</h3>
                        <button onClick={() => setIsCropping(false)} className="text-muted-foreground hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="relative h-[400px] w-full bg-black">
                        <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                    </div>
                    <div className="p-8 space-y-6 bg-card">
                        <button onClick={handleCropSave} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30">Kaydet</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;
