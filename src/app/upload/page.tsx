"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/utils/LanguageContext";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Transitions");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { t } = useLanguage();
  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Lütfen önce giriş yapın.");
        return;
    }

    const { error } = await supabase.from('assets').insert([{
      title,
      category,
      download_url: downloadUrl,
      image_url: imageUrl,
      author_id: user.id,
      file_type: 'zip' // Varsayılan
    }]);

    if (error) {
      alert(`Hata: ${error.message}`);
    } else {
      alert("Başarıyla yüklendi!");
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Upload size={120} className="text-primary" />
          </div>

          <div className="mb-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              <span>Share your work</span>
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Yeni Asset Yükle</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Topluluğa katkıda bulun</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Başlığı</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                  placeholder="Örn: 4K Film Grain Pack"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kategori</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold appearance-none"
                >
                  <option>Transitions</option>
                  <option>SFX</option>
                  <option>LUTs</option>
                  <option>Overlays</option>
                  <option>Presets</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Önizleme Resim URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">İndirme Linki (Google Drive, Dropbox vb.)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="url" 
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full bg-muted/50 border border-border-custom rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Yükleniyor..." : "Asseti Paylaş"}
              <Upload size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
