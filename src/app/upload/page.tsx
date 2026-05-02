"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Camera, FileArchive, CheckCircle2, ChevronRight } from "lucide-react";
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
    if (!user) return alert("Giriş yapın.");

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
        setTimeout(() => window.location.href = "/", 1500);
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-card border border-border-custom p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {step === 1 ? (
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Asset Yükle</h1>
                    <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 tracking-widest italic">Admin Modu</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-3xl bg-muted overflow-hidden border-2 border-dashed border-border-custom hover:border-primary transition-all">
                            {imagePreview ? <img src={imagePreview} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><Camera size={24} className="text-muted-foreground"/><span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Kapak Resmi</span></div>}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-sm font-bold" placeholder="Asset Başlığı" required />
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(c => (
                                <button key={c} type="button" onClick={() => setCategory(c)} className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${category === c ? 'bg-primary border-primary text-white shadow-lg' : 'bg-muted border-border-custom text-muted-foreground'}`}>{c}</button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <button type="button" onClick={() => setUseExternal(!useExternal)} className="text-[9px] font-black uppercase text-primary underline">Link Kullan</button>
                            {useExternal ? <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-sm font-bold" placeholder="URL" required /> : <div className="relative"><div className="w-full py-6 rounded-xl border-2 border-dashed border-border-custom flex flex-col items-center gap-2 bg-muted/50"><FileArchive size={24} className="text-muted-foreground"/><span className="text-[9px] font-black uppercase tracking-widest">Dosya Seç</span><input type="file" onChange={handleAssetFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required /></div></div>}
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl">
                    {loading ? "YÜKLENİYOR" : "YAYINA AL"}
                    <ChevronRight size={18} />
                </button>
              </form>
          ) : (
            <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto text-green-500"><CheckCircle2 size={32} /></div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Yüklendi!</h2>
            </div>
          )}
        </div>
      </main>
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between"><span className="text-[8px] font-black uppercase text-white/30 italic">sytexarchive</span><p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default UploadPage;
