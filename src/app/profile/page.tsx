"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import { Settings, LogOut, Package, Heart, Shield, Trash2, Key, MailCheck } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) setMessage(`Hata: ${error.message}`);
    else setMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (!confirm) return;
    
    // Not: Gerçek silme işlemi için bir Edge Function veya Admin API gerekir.
    // Client SDK ile kullanıcı kendi hesabını silemez (security risk).
    // Buraya bir uyarı veya yönlendirme ekleyelim.
    setMessage("Hesap silme işlemi için lütfen destek ekibiyle iletişime geçin veya yönetici paneline başvurun.");
  };

  const handleVerifyEmail = async () => {
    if (!user?.email) return;
    setLoading(true);
    // Sytex Archive özel doğrulaması için email tetikleme
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
    });
    if (error) setMessage(`Hata: ${error.message}`);
    else setMessage("Doğrulama kodu tekrar gönderildi. Lütfen e-postanızı kontrol edin.");
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center font-black">Yükleniyor...</div>;

  return (
    <main className="min-h-screen pb-20 bg-background">
      <Navbar />
      
      <div className="pt-40 px-6 max-w-4xl mx-auto">
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-blue-600/20 -z-10" />
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] border-8 border-background overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img 
                  src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
                <p className="text-muted-foreground font-medium">{user.email}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                  sytexarchive Editor
                </div>
                {!user.email_confirmed_at && (
                    <button 
                        onClick={handleVerifyEmail}
                        className="px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-amber-500/20 transition-all"
                    >
                        <MailCheck size={12} />
                        Hesabı Doğrula
                    </button>
                )}
                {user.email_confirmed_at && (
                    <div className="px-4 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                        <Shield size={12} />
                        Doğrulanmış
                    </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={handlePasswordReset}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border-custom rounded-2xl font-bold hover:bg-muted transition-all disabled:opacity-50"
              >
                <Key size={18} />
                Şifre Değiştir
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-muted border border-border-custom rounded-2xl font-bold hover:bg-card transition-all"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </div>
          </div>

          {message && (
              <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center text-sm font-bold text-primary">
                  {message}
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-muted/30 p-6 rounded-[2rem] border border-border-custom text-center space-y-1">
              <Package className="mx-auto text-primary mb-2" size={24} />
              <p className="text-2xl font-black">24</p>
              <p className="text-xs text-muted-foreground font-bold uppercase">Yüklemeler</p>
            </div>
            <div className="bg-muted/30 p-6 rounded-[2rem] border border-border-custom text-center space-y-1">
              <Heart className="mx-auto text-red-500 mb-2" size={24} />
              <p className="text-2xl font-black">156</p>
              <p className="text-xs text-muted-foreground font-bold uppercase">Beğeniler</p>
            </div>
            <div className="bg-muted/30 p-6 rounded-[2rem] border border-border-custom text-center space-y-1">
              <Trash2 className="mx-auto text-muted-foreground mb-2 cursor-pointer hover:text-red-500 transition-colors" size={24} onClick={handleDeleteAccount} />
              <p className="text-xs text-muted-foreground font-bold uppercase">Hesabı Sil</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
