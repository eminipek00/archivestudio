"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Camera, FileArchive, CheckCircle2, ChevronRight, Link as LinkIcon, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/utils/LanguageContext";
import { Toast, useToast } from "@/components/Toast";

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
  const { toast, showToast, hideToast } = useToast();
  const supabase = createClient();
  const categories = [t('tags.all'), t('tags.scene'), t('tags.ae'), t('tags.am'), t('tags.lut'), t('tags.overlay')];

  const MAX_FILE_SIZE_MB = 20;
  // PROFESYONEL DOSYA FİLTRESİ
  const ACCEPTED_FILE_TYPES = ".zip,.rar,.7z,.aep,.prproj,.psd,.ai,.cube,.mp4,.mov,.png,.jpg";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) return showToast("Kapak fotoğrafı 2MB'dan büyük olamaz!", "error");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { 
        const file = e.target.files[0];
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            showToast(`Dosya ${MAX_FILE_SIZE_MB}MB'dan büyük! Lütfen Mega/Drive yükleyip LİNK kullanın.`, "error");
            e.target.value = "";
            return;
        }
        setAssetFile(file); 
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!useExternal && !assetFile) return showToast("Lütfen bir dosya seçin.", "error");
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return showToast("Hata: Giriş yapmalısınız.", "error");

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
            else throw fileErr;
        }

        const { error } = await supabase.from('assets').insert([{
            title, category, download_url: finalDownloadUrl, image_url: uploadedImageUrl,
            author_id: user.id, file_type: assetFile ? assetFile.name.split('.').pop()?.toUpperCase() : 'LINK'
        }]);

        if (error) throw error;
        setStep(2);
        setTimeout(() => window.location.href = "/", 1500);
    } catch (err: any) { showToast(err.message, "error"); } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-card border border-border-custom p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {step === 1 ? (
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">{t('upload')}</h1>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Sınır: {MAX_FILE_SIZE_MB}MB</p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 tracking-widest italic">{t('admin')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-3xl bg-muted overflow-hidden border-2 border-dashed border-border-custom hover:border-primary transition-all">
                            {imagePreview ? <img src={imagePreview} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><Camera size={24} className="text-muted-foreground"/><span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">KAPAK RESMİ</span></div>}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-xs font-bold text-white" placeholder="VARLIK BAŞLIĞI" required />
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-2">
                            {categories.filter(c => c !== t('tags.all')).map(c => (
                                <button key={c} type="button" onClick={() => setCategory(c)} className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${category === c ? 'bg-primary border-primary text-white shadow-lg' : 'bg-muted border-border-custom text-white/40'}`}>{c}</button>
                            ))}
                        </div>
                        
                        <div className="p-1 bg-[#111] rounded-2xl flex gap-1 border border-border-custom">
                            <button type="button" onClick={() => setUseExternal(false)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!useExternal ? 'bg-muted text-white shadow-inner' : 'text-white/30'}`}>Dosya Yükle</button>
                            <button type="button" onClick={() => setUseExternal(true)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${useExternal ? 'bg-muted text-white shadow-inner' : 'text-white/30'}`}>Link Kullan</button>
                        </div>

                        {useExternal ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[9px] font-black text-primary uppercase ml-2 italic flex items-center gap-2"><LinkIcon size={12}/> BULUT DEPOLAMA LİNKİ</label>
                                <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-xs font-bold text-white" placeholder="https://..." required />
                            </div>
                        ) : (
                            <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-2 bg-muted/30 ${assetFile ? 'border-primary bg-primary/5' : 'border-border-custom group-hover:border-primary/50'}`}>
                                    <FileArchive size={28} className={assetFile ? 'text-primary' : 'text-muted-foreground'}/>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{assetFile ? assetFile.name : 'Asset Seç'}</span>
                                    <input type="file" accept={ACCEPTED_FILE_TYPES} onChange={handleAssetFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!useExternal} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : t('save')}
                    {!loading && <ChevronRight size={18} />}
                </button>
              </form>
          ) : (
            <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto text-green-500"><CheckCircle2 size={40} /></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{t('uploadSuccess')}</h2>
            </div>
          )}
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0"><span className="text-[8px] font-black uppercase text-white/30 italic">sytexarchive</span><p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default UploadPage;
