"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, Sparkles, Camera } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/utils/LanguageContext";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sahne Paketleri");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { t } = useLanguage();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Lütfen önce giriş yapın.");
        return;
    }

    let uploadedImageUrl = "";
    if (imageFile) {
        const fileName = `${Date.now()}-asset-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, imageFile);
        if (!uploadError) {
            uploadedImageUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
        }
    }

    const { error } = await supabase.from('assets').insert([{
      title,
      category,
      download_url: downloadUrl,
      image_url: uploadedImageUrl,
      author_id: user.id,
      file_type: 'zip'
    }]);

    if (error) {
      alert(`Hata: ${error.message}`);
    } else {
      alert("Asset başarıyla yüklendi!");
      window.location.href = "/";
    }
    setLoading(false);
  };

  const categories = [
    t('tags.scene'),
    t('tags.ae'),
    t('tags.am'),
    t('tags.lut'),
    t('tags.overlay')
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="mb-10">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Yeni Asset Yükle</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Topluluğa katkıda bulun</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative group w-full">
                    <div className="w-full h-48 rounded-2xl bg-muted/50 border-2 border-dashed border-border-custom flex items-center justify-center overflow-hidden transition-all hover:border-primary cursor-pointer relative">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Camera size={32} className="text-muted-foreground" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Kapak Fotoğrafı Seç</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Başlığı</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="Örn: 4K Film Grain Pack" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold appearance-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">İndirme Linki</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="url" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} className="w-full bg-muted/50 border border-border-custom rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="https://drive.google.com/..." required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
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
