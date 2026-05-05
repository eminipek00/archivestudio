"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Camera, FileArchive, CheckCircle2, ChevronRight, Link as LinkIcon, Loader2, FileCode2, Film, Box, FileType, ShieldAlert } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/utils/LanguageContext";
import { Toast, useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
  const router = useRouter();
  
  const categories = [t('tags.scene'), t('tags.ae'), t('tags.am'), t('tags.lut'), t('tags.overlay')];
  const ADMIN_EMAIL = "ipekmuhammetemin@gmail.com";

  // KATEGORİ BAZLI PROFESYONEL EDİTÖR KAPAKLARI
  const DEFAULT_THUMBS: Record<string, string> = {
    "Sahne Paketleri": "https://images.unsplash.com/photo-1574717024453-354056afd6fc?w=800&q=80",
    "After Effects": "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80",
    "Alight Motion": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    "LUT Paketleri": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80",
    "Overlay": "https://images.unsplash.com/photo-1535016120720-40c646bebbbb?w=800&q=80",
    "Default": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
  };

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      if (user.email === ADMIN_EMAIL || profile?.is_admin) { setIsAdmin(true); } 
      else { showToast("Bu sayfaya erişim yetkiniz yok!", "error"); setTimeout(() => router.push("/"), 2000); }
      setIsVerifying(false);
    };
    checkAccess();
  }, [supabase, router]);

  const MAX_FILE_SIZE_MB = 20;

  const getAcceptedFiles = (cat: string) => {
    const c = cat.toLowerCase();
    const common = ".zip,.rar,.7z";
    if (c.includes('sahne') || c.includes('scene')) return `${common},.mp4,.mov`;
    if (c.includes('after') || c.includes('ae')) return `${common},.aep,.ffx,.prproj`;
    if (c.includes('alight') || c.includes('am')) return `${common},.xml`;
    if (c.includes('lut')) return `${common},.cube`;
    if (c.includes('overlay')) return `${common},.mp4,.mov,.png,.jpg`;
    return `${common},.mp4,.mov,.aep,.xml,.cube`;
  };

  const getCategoryContext = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('sahne') || c.includes('scene')) return { label: `${t('selectFile')} (MP4/RAR)`, icon: <Box size={28} /> };
    if (c.includes('after') || c.includes('ae')) return { label: t('selectFile'), icon: <FileCode2 size={28} /> };
    if (c.includes('alight') || c.includes('am')) return { label: t('selectFile'), icon: <FileType size={28} /> };
    if (c.includes('lut')) return { label: t('selectFile'), icon: <FileArchive size={28} /> };
    if (c.includes('overlay')) return { label: t('selectFile'), icon: <Film size={28} /> };
    return { label: t('selectFile'), icon: <FileArchive size={28} /> };
  };

  const currentContext = getCategoryContext(category);
  const acceptedFiles = getAcceptedFiles(category);

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
        if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            showToast(`Dosya ${MAX_FILE_SIZE_MB}MB'dan büyük! Lütfen Link kullanın.`, "error");
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
        let uploadedImageUrl = DEFAULT_THUMBS[category] || DEFAULT_THUMBS["Default"];
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

  if (isVerifying) return <div className="h-screen w-full bg-black flex items-center justify-center"><Loader2 size={40} className="text-primary animate-spin" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Navbar />
      <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-card border border-border-custom p-6 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {step === 1 ? (
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">{t('upload')}</h1>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1 italic">{t('smartCoverActive')}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 text-primary italic">
                        <ShieldAlert size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">SECURE ADMIN</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="relative aspect-video rounded-3xl bg-muted overflow-hidden border-2 border-dashed border-border-custom hover:border-primary transition-all">
                            {imagePreview ? <img src={imagePreview} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><Camera size={24} className="text-muted-foreground"/><span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{t('tags.overlay')} ({t('optional')})</span></div>}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-xs font-bold text-white focus:ring-1 focus:ring-primary/50 outline-none" placeholder={t('assetTitle')} required />
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(c => (
                                <button key={c} type="button" onClick={() => setCategory(c)} className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${category === c ? 'bg-primary border-primary text-white shadow-lg' : 'bg-muted border-border-custom text-white/40'}`}>{c}</button>
                            ))}
                        </div>
                        
                        <div className="p-1 bg-[#111] rounded-2xl flex gap-1 border border-border-custom">
                            <button type="button" onClick={() => setUseExternal(false)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!useExternal ? 'bg-muted text-white shadow-inner' : 'text-white/30'}`}>{t('file')}</button>
                            <button type="button" onClick={() => setUseExternal(true)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${useExternal ? 'bg-muted text-white shadow-inner' : 'text-white/30'}`}>{t('link')}</button>
                        </div>

                        {useExternal ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[9px] font-black text-primary uppercase ml-2 italic flex items-center gap-2"><LinkIcon size={12}/> {t('link')}</label>
                                <input type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-muted border border-border-custom rounded-xl py-4 px-5 text-xs font-bold text-white outline-none" placeholder="https://..." required />
                            </div>
                        ) : (
                            <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-2 bg-muted/30 ${assetFile ? 'border-primary bg-primary/5' : 'border-border-custom group-hover:border-primary/50'}`}>
                                    <div className={assetFile ? 'text-primary' : 'text-muted-foreground'}>{currentContext.icon}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{assetFile ? assetFile.name : currentContext.label}</span>
                                    <input type="file" accept={acceptedFiles} onChange={handleAssetFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!useExternal} />
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
      <footer className="z-[2000] bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between shrink-0 text-[8px] font-black uppercase text-white/30 italic"><span>sytexarchive</span><p>&copy; {new Date().getFullYear()} sytexarchive</p></footer>
    </div>
  );
};

export default UploadPage;
