"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Trash2, Camera, ShieldCheck, Mail } from "lucide-react";
import { useLanguage } from "@/utils/LanguageContext";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const supabase = createClient();

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

  const handleDeleteAccount = async () => {
    if (confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      setLoading(true);
      // Not: Client-side deletion is restricted. Usually needs an API route with admin privileges.
      // For now we'll just sign out and show a message or use an API route.
      alert("Hesap silme talebi alındı. Güvenlik gereği lütfen destekle iletişime geçin.");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sol Panel: Profil Kartı */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-primary/10" />
                <div className="relative pt-4">
                    <div className="w-24 h-24 rounded-[2rem] border-4 border-background mx-auto overflow-hidden shadow-xl mb-4">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                <User size={40} />
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">{profile?.full_name || 'Kullanıcı'}</h2>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">
                        {user.email === 'ipekmuhammetemin@gmail.com' ? t('admin') : t('editor')}
                    </p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border-custom space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-xl text-left">
                        <Mail size={16} className="text-muted-foreground" />
                        <div className="overflow-hidden">
                            <p className="text-[9px] font-black uppercase text-muted-foreground">E-Posta</p>
                            <p className="text-xs font-bold truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Sağ Panel: Ayarlar */}
          <div className="md:col-span-2 space-y-6">
            {/* Şifre Değiştir */}
            <div className="glass-panel p-8 rounded-[2.5rem] shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Lock size={20} />
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">{t('changePassword')}</h3>
                </div>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Yeni Şifre</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-muted/50 border border-border-custom rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        Şifreyi Güncelle
                    </button>
                </form>
            </div>

            {/* Tehlikeli Alan */}
            <div className="glass-panel p-8 rounded-[2.5rem] border-red-500/20 bg-red-500/5 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <Trash2 size={20} />
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-red-500">{t('deleteAccount')}</h3>
                </div>
                <p className="text-xs font-medium text-red-500/70 mb-6 leading-relaxed">
                    Hesabınızı sildiğinizde tüm verileriniz, yüklemeleriniz ve tercihleriniz kalıcı olarak kaldırılacaktır. Bu işlem geri alınamaz.
                </p>
                <button 
                    onClick={handleDeleteAccount}
                    className="border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                >
                    Hesabı Tamamen Sil
                </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
