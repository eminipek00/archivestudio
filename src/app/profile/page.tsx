"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import { Settings, LogOut, Package, Heart, Shield } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
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

  if (!user) return <div className="min-h-screen flex items-center justify-center font-black">Yükleniyor...</div>;

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-40 px-6 max-w-4xl mx-auto">
        <div className="glass-panel p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Header Background */}
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
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-background" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h1>
                <p className="text-muted-foreground font-medium">{user.email}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider">
                  Pro Editor
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-muted border border-border-custom text-muted-foreground text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <Shield size={12} />
                  Doğrulanmış
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border-custom rounded-2xl font-bold hover:bg-muted transition-all">
                <Settings size={18} />
                Ayarlar
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </div>
          </div>

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
              <Archive className="mx-auto text-blue-500 mb-2" size={24} />
              <p className="text-2xl font-black">12</p>
              <p className="text-xs text-muted-foreground font-bold uppercase">Koleksiyonlar</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
