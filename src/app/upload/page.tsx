"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import { Upload, Check, Loader2, Image as ImageIcon, Link as LinkIcon, File as FileIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/utils/LanguageContext';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';

const UploadPage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'link' | 'file'>('file');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const { t } = useLanguage();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push('/login'); return; }
      setUser(authUser);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (profileData) setProfile(profileData);
      setLoading(false);
    };
    checkUser();
  }, [supabase, router]);

  const onCropComplete = useCallback((_croppedArea: any, pixelCrop: any) => { setCroppedAreaPixels(pixelCrop); }, []);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) { setTags(tags.filter(t => t !== tag)); } 
    else { setTags([...tags, tag]); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => { setImage(reader.result as string); setIsCropping(true); });
      reader.readAsDataURL(file);
    }
  };

  const saveCroppedImage = async () => {
    try {
      if (!image || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (!croppedImage) return;
      setCoverPreview(URL.createObjectURL(croppedImage));
      const file = new File([croppedImage], "cover.jpg", { type: "image/jpeg" });
      setCoverImage(file);
      setIsCropping(false);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || (!fileUrl && !selectedFile) || !user) return;

    setIsUploading(true);
    try {
      let cover_url = '';
      if (coverImage) {
        const fileName = `${Date.now()}-${Math.random()}.jpg`;
        const { error: uploadError } = await supabase.storage.from('asset-covers').upload(`${user.id}/${fileName}`, coverImage);
        if (uploadError) throw uploadError;
        cover_url = supabase.storage.from('asset-covers').getPublicUrl(`${user.id}/${fileName}`).data.publicUrl;
      }

      let final_file_url = fileUrl;
      if (uploadMode === 'file' && selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const { error: fileUploadError } = await supabase.storage.from('asset-files').upload(`${user.id}/${fileName}`, selectedFile);
        if (fileUploadError) throw fileUploadError;
        final_file_url = supabase.storage.from('asset-files').getPublicUrl(`${user.id}/${fileName}`).data.publicUrl;
      }

      const { error } = await supabase.from('assets').insert({
        title, category, tags, file_url: final_file_url, cover_url, author_id: user.id, downloads: 0, likes: 0, views: 0
      });

      if (error) throw error;
      setUploadSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) { alert(error.message); } finally { setIsUploading(false); }
  };

  if (loading) return <div className="h-screen w-full bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24 pb-4 px-4 md:px-6 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-2xl flex flex-col h-full overflow-y-auto no-scrollbar pb-32 md:pb-12">
          <div className="space-y-1 text-center md:text-left mb-4 shrink-0">
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">{t('uploadAsset')}</h1>
            <p className="text-[8px] md:text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Sytex Archive Premium Dashboard</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-3 md:space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('coverImage')} <span className="text-primary/40 italic">({t('optional')})</span></label>
              <div className="relative aspect-video max-h-[160px] md:max-h-[220px] mx-auto w-full rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-white/10 hover:border-primary/50 bg-[#0a0a0a] transition-all overflow-hidden group cursor-pointer" onClick={() => document.getElementById('cover-input')?.click()}>
                {coverPreview ? <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" /> : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                    <ImageIcon size={24} strokeWidth={1} />
                    <span className="text-[8px] font-black uppercase mt-2 tracking-widest">{t('selectFile')}</span>
                  </div>
                )}
                <input id="cover-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-left">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">{t('assetTitle')}</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-4 md:px-5 text-[10px] md:text-xs font-black uppercase tracking-widest text-white focus:border-primary transition-all outline-none" placeholder="TITLE..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">{t('categories')}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-4 md:px-5 text-[10px] md:text-xs font-black uppercase tracking-widest text-white focus:border-primary transition-all outline-none appearance-none">
                  <option value="">{t('all')}</option>
                  <option value="scene">SCENE</option><option value="ae">AFTER EFFECTS</option><option value="am">ALIGHT MOTION</option><option value="lut">LUTS</option><option value="overlay">OVERLAY</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex p-1.5 bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[1.5rem] w-full max-w-sm mx-auto md:mx-0">
                <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-3 px-4 rounded-xl md:rounded-[1.2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/20 hover:text-white/40'}`}>
                  <div className="flex items-center justify-center gap-2">
                    <FileIcon size={14} /> {t('selectFile')}
                  </div>
                </button>
                <button type="button" onClick={() => setUploadMode('link')} className={`flex-1 py-3 px-4 rounded-xl md:rounded-[1.2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'link' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/20 hover:text-white/40'}`}>
                  <div className="flex items-center justify-center gap-2">
                    <LinkIcon size={14} /> {t('link')}
                  </div>
                </button>
              </div>

              {uploadMode === 'file' ? (
                <div onClick={() => document.getElementById('asset-file')?.click()} className={`w-full bg-[#0a0a0a] border-2 border-dashed rounded-xl md:rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:border-primary/50 ${selectedFile ? 'border-primary bg-primary/5 shadow-inner' : 'border-white/10'}`}>
                  {selectedFile ? <Check className="text-primary animate-in zoom-in-50" size={32} /> : <FileIcon className="text-white/10 group-hover:text-primary transition-colors" size={32} strokeWidth={1} />}
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 truncate max-w-full px-6">{selectedFile ? selectedFile.name : t('selectFile')}</span>
                  <input id="asset-file" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <LinkIcon size={18} />
                  </div>
                  <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-16 pr-6 text-[10px] md:text-xs font-black lowercase text-white focus:border-primary transition-all outline-none shadow-inner" placeholder="https://..." />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Tags</label>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {['scene', 'ae', 'am', 'lut', 'overlay', 'other'].map((tag) => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all ${tags.includes(tag) ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>{t(`tags.${tag}`)}</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isUploading || uploadSuccess} className={`w-full py-3.5 md:py-4.5 rounded-xl md:rounded-[2rem] font-black text-[9px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${uploadSuccess ? 'bg-green-500 text-white' : 'bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-primary/20'}`}>
              {isUploading ? <Loader2 className="animate-spin" size={16} /> : uploadSuccess ? <Check size={16} /> : <Upload size={16} />}
              {uploadSuccess ? t('uploadSuccess') : t('upload').toUpperCase()}
            </button>
          </form>
        </div>
      </main>

      {isCropping && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-2xl aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10">
            <Cropper image={image!} crop={crop} zoom={zoom} aspect={16 / 9} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
          </div>
          <div className="mt-8 flex gap-4 w-full max-w-2xl">
            <button onClick={() => setIsCropping(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest">{t('cancel')}</button>
            <button onClick={saveCroppedImage} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest">{t('save')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
