"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, FileText, Image as ImageIcon, Sparkles, Camera, FileArchive, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/utils/LanguageContext";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sahne Paketleri");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [useExternal, setUseExternal] = useState(false);

  const { t } = useLanguage();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssetFile(e.target.files[0]);
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

    try {
        // 1. Kapak Fotoğrafını Yükle
        let uploadedImageUrl = "";
        if (imageFile) {
            const imgName = `${Date.now()}-thumb-${imageFile.name}`;
            const { error: imgErr } = await supabase.storage.from('avatars').upload(imgName, imageFile);
            if (!imgErr) uploadedImageUrl = supabase.storage.from('avatars').getPublicUrl(imgName).data.publicUrl;
        }

        // 2. Asset Dosyasını Yükle veya Linki Al
        let finalDownloadUrl = externalUrl;
        if (!useExternal && assetFile) {
            const fileName = `${Date.now()}-file-${assetFile.name}`;
            const { error: fileErr } = await supabase.storage.from('avatars').upload(fileName, assetFile);
            if (!fileErr) finalDownloadUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
        }

        // 3. Veritabanına Yaz
        const { error } = await supabase.from('assets').insert([{
            title,
            category,
            download_url: finalDownloadUrl,
            image_url: uploadedImageUrl,
            author_id: user.id,
            file_type: assetFile ? assetFile.name.split('.').pop() : 'link'
        }]);

        if (error) throw error;
        setStep(2);
        setTimeout(() => window.location.href = "/", 2000);

    } catch (err: any) {
        alert(`Hata: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {step === 1 ? (
              <>
                <div className="mb-10">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Yeni Asset Paylaş</h1>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">Dosyalarını tüm dünyayla paylaş</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Resim Seçme */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kapak Fotoğrafı</label>
                        <div className="relative group w-full">
                            <div className="w-full h-40 rounded-2xl bg-muted/30 border-2 border-dashed border-border-custom flex items-center justify-center overflow-hidden transition-all hover:border-primary cursor-pointer">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Camera size={24} className="text-muted-foreground" />
                                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Resim Seç</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Başlığı</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted/30 border border-border-custom rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="Örn: Ultimate Transition Pack" required />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kategori</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-muted/30 border border-border-custom rounded-xl py-4 px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold appearance-none">
                            {["Sahne Paketleri", "After Effects", "Alight Motion", "LUT Paketleri", "Overlay"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Dosya Yükleme Alanı */}
                    <div className="pt-4 border-t border-border-custom space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Dosya Kaynağı</label>
                            <button type="button" onClick={() => setUseExternal(!useExternal)} className="text-[9px] font-black uppercase underline text-muted-foreground">
                                {useExternal ? "Dosya Yükle" : "Dış Link Kullan"}
                            </button>
                        </div>

                        {useExternal ? (
                            <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-muted/30 border border-border-custom rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-bold" placeholder="Google Drive, Mega, Mediafire linki..." required />
                        ) : (
                            <div className="relative group w-full">
                                <div className={`w-full py-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${assetFile ? 'bg-primary/5 border-primary/50' : 'bg-muted/10 border-border-custom hover:border-primary'}`}>
                                    <FileArchive size={24} className={assetFile ? "text-primary" : "text-muted-foreground"} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {assetFile ? assetFile.name : "Dosyayı Seç (Zip, Rar, Proje)"}
                                    </span>
                                    <input type="file" onChange={handleAssetFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                </div>
                                <p className="text-[8px] text-muted-foreground mt-2 text-center uppercase font-bold">Maksimum 50MB (Büyük dosyalar için dış link kullanın)</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                        {loading ? "Dosyalar Hazırlanıyor..." : "Asseti Yayına Al"}
                        <Upload size={18} />
                    </button>
                </form>
              </>
          ) : (
            <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20"><CheckCircle2 size={40} className="text-green-500" /></div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Başarıyla Yüklendi!</h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Assetin ana sayfada görünüyor.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
