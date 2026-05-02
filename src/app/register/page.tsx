"use client";

import React, { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Archive, Mail, ArrowRight, Lock, User, Camera, AtSign, CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/imageUtils";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  
  // Image States
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalAvatar, setFinalAvatar] = useState<Blob | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

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
    try {
      if (image && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
          setFinalAvatar(croppedImage);
          setAvatarPreview(URL.createObjectURL(croppedImage));
          setIsCropping(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let avatarUrl = "";

    // 1. Avatar yükleme (Eğer seçildiyse)
    if (finalAvatar) {
      const fileName = `${Date.now()}-${username}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, finalAvatar);
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    // 2. Kayıt işlemi
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          avatar_url: avatarUrl,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Hata: ${error.message}`);
    } else {
      setStep(3);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div className="max-w-[400px] w-full space-y-8 glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-muted flex">
            <div className={`h-full bg-primary transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <Archive size={28} className="text-white" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight uppercase">sytexarchive</h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-black uppercase tracking-widest">
            {step === 1 ? "Hesap Oluştur" : step === 2 ? "Profilini Tamamla" : "Hoş Geldin"}
          </p>
        </div>

        {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Ad Soyad</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="Adınız Soyadınız" required />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">E-Posta</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="E-posta adresiniz" required />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Parola</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="••••••••" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
                    İleri <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        )}

        {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-5">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[2rem] bg-muted border-2 border-dashed border-border-custom flex items-center justify-center overflow-hidden transition-all hover:border-primary cursor-pointer relative">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="text-muted-foreground" size={32} />
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Profil Fotoğrafı Seç</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Kullanıcı Adı</label>
                    <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} className="w-full bg-muted/50 border border-border-custom rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="kullanici_adi" required />
                    </div>
                </div>

                {message && <p className="text-[10px] font-black text-center py-2 rounded-lg text-red-500 bg-red-500/10">{message}</p>}

                <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-muted hover:bg-border-custom text-foreground py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Geri</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                        {loading ? "Kaydediliyor..." : "Kaydı Tamamla"}
                    </button>
                </div>
            </form>
        )}

        {step === 3 && (
            <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20"><CheckCircle2 size={40} className="text-green-500" /></div>
                <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase">Harika!</h2>
                    <p className="text-sm text-muted-foreground font-medium px-4">Kaydın başarıyla alındı. Lütfen e-postanı doğrula ve giriş yap.</p>
                </div>
                <Link href="/login" className="inline-block w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center">Giriş Sayfasına Git</Link>
            </div>
        )}

        {/* Cropping Modal */}
        {isCropping && image && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full max-w-lg bg-card rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/10">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-muted/20">
                        <h3 className="font-black uppercase tracking-widest text-sm">Fotoğrafı Kırp</h3>
                        <button onClick={() => setIsCropping(false)} className="text-muted-foreground hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    
                    <div className="relative h-[400px] w-full bg-black">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    
                    <div className="p-8 space-y-6 bg-card">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Zoom</p>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <button 
                            onClick={handleCropSave}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30"
                        >
                            Kırpmayı Tamamla & Kaydet
                        </button>
                    </div>
                </div>
            </div>
        )}

        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          {step < 3 ? <Link href="/login" className="text-primary hover:underline">Zaten hesabın var mı? Giriş Yap</Link> : null}
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
