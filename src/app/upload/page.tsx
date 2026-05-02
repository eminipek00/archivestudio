"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Camera, FileArchive, CheckCircle2, ChevronRight, LayoutGrid } from "lucide-react";
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

  const categories = ["Sahne Paketleri", "After Effects", "Alight Motion", "LUT Paketleri", "Overlay"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setAssetFile(e.target.files[0]); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Lütfen önce giriş yapın.");

    try {
        let uploadedImageUrl = "";
        if (imageFile) {
            const imgName = `assets/${Date.now()}-thumb-${imageFile.name}`;
            const { error: imgErr } = await supabase.storage.from('avatars').upload(imgName, imageFile);
            if (!imgErr) uploadedImageUrl = supabase.storage.from('avatars').getPublicUrl(imgName).data.publicUrl;
        }

        let finalDownloadUrl = externalUrl;
        if (!useExternal && assetFile) {
            const fileName = `assets/${Date.now()}-file-${assetFile.name}`;
            const { error: fileErr } = await supabase.storage.from('avatars').upload(fileName, assetFile);
            if (!fileErr) finalDownloadUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
        }

        const { error } = await supabase.from('assets').insert([{
            title, category, download_url: finalDownloadUrl, image_url: uploadedImageUrl,
            author_id: user.id, file_type: assetFile ? assetFile.name.split('.').pop() : 'link'
        }]);

        if (error) throw error;
        setStep(2);
        setTimeout(() => window.location.href = "/", 2000);
    } catch (err: any) { alert(`Hata: ${err.message}`); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card border border-border-custom p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
          {step === 1 ? (
              <form onSubmit={handleUpload} className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Yeni Asset Yükle</h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 opacity-50">Dosyanı arşive ekle ve paylaş</p>
                    </div>
                    <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
                        <CheckCircle2 size={16} />
                        <span>Admin Yetkisi Aktif</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kapak Fotoğrafı Seç</label>
                            <div className="relative group aspect-video">
                                <div className="w-full h-full rounded-[2rem] bg-muted/50 border-2 border-dashed border-border-custom flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={32} className="text-muted-foreground" />}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Dosya Başlığı</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted border border-border-custom rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold" placeholder="Asset ismini girin..." required />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Kategori Seçimi</label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(c => (
                                    <button key={c} type="button" onClick={() => setCategory(c)} className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${category === c ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-muted border-border-custom text-muted-foreground hover:border-primary/50'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Dosya Kaynağı</label>
                                <button type="button" onClick={() => setUseExternal(!useExternal)} className="text-[9px] font-black uppercase text-primary underline">
                                    {useExternal ? "Dosya Yükle" : "Dış Link Kullan"}
                                </button>
                            </div>
                            {useExternal ? (
                                <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-muted border border-border-custom rounded-2xl py-5 px-6 text-sm font-bold" placeholder="Google Drive, Mega linki..." required />
                            ) : (
                                <div className="relative w-full">
                                    <div className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-3 ${assetFile ? 'bg-primary/5 border-primary/50' : 'bg-muted/50 border-border-custom'}`}>
                                        <FileArchive size={32} className={assetFile ? "text-primary" : "text-muted-foreground"} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{assetFile ? assetFile.name : "Zip/Rar Dosyasını Seç"}</span>
                                        <input type="file" onChange={handleAssetFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                    {loading ? "YÜKLENİYOR..." : "YAYINA AL VE PAYLAŞ"}
                    <ChevronRight size={20} />
                </button>
              </form>
          ) : (
            <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-green-500/20 text-green-500"><CheckCircle2 size={48} /></div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Yayına Alındı!</h2>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
