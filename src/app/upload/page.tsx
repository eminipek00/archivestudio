"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import { Upload, X, Check, Loader2, Image as ImageIcon, Link as LinkIcon, FileText, Plus, Info, Search, Heart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/utils/LanguageContext';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';

const ADMIN_EMAIL = 'ipekmuhammetemin@gmail.com';

const UploadPage = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [fileUrl, setFileUrl] = useState('');
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
      if (!authUser) {
        router.push('/login');
        return;
      }
      setUser(authUser);
      
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (profileData) setProfile(profileData);
      setLoading(false);
    };
    checkUser();
  }, [supabase, router]);

  const onCropComplete = useCallback((_croppedArea: any, pixelCrop: any) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const saveCroppedImage = async () => {
    try {
      if (!image || !croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setCoverPreview(URL.createObjectURL(croppedImage));
      
      // Convert Blob to File
      const file = new File([croppedImage], "cover.jpg", { type: "image/jpeg" });
      setCoverImage(file);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !fileUrl || !user) return;

    setIsUploading(true);
    try {
      let cover_url = '';
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('asset-covers')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('asset-covers')
          .getPublicUrl(filePath);
        
        cover_url = data.publicUrl;
      }

      const { error } = await supabase.from('assets').insert({
        title,
        category,
        tags,
        file_url: fileUrl,
        cover_url,
        author_id: user.id,
        downloads: 0,
        likes: 0,
        views: 0
      });

      if (error) throw error;
      setUploadSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  if (loading) return <div className="h-screen w-full bg-background flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-32 md:pb-12 px-4 md:px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
              {t('uploadAsset')}
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
              Sytex Archive Premium Dashboard
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* COVER IMAGE */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                {t('coverImage')} <span className="text-primary/40 italic">({t('optional')})</span>
              </label>
              <div 
                className="relative aspect-video rounded-[2rem] border-2 border-dashed border-white/10 hover:border-primary/50 bg-[#0a0a0a] transition-all overflow-hidden group cursor-pointer"
                onClick={() => document.getElementById('cover-input')?.click()}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                    <ImageIcon size={40} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase mt-4 tracking-widest">{t('selectFile')}</span>
                  </div>
                )}
                <input id="cover-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            {/* TITLE & CATEGORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('assetTitle')}</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest text-white focus:border-primary transition-all outline-none"
                  placeholder="MY NEW EDIT PACK..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{t('categories')}</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-widest text-white focus:border-primary transition-all outline-none appearance-none"
                >
                  <option value="">{t('all')}</option>
                  <option value="scene">SCENE</option>
                  <option value="ae">AFTER EFFECTS</option>
                  <option value="am">ALIGHT MOTION</option>
                  <option value="lut">LUTS</option>
                  <option value="overlay">OVERLAY</option>
                </select>
              </div>
            </div>

            {/* FILE URL */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Asset {t('link')}</label>
              <div className="relative">
                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="url" 
                  value={fileUrl} 
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-xs font-black lowercase text-white focus:border-primary transition-all outline-none"
                  placeholder="https://mega.nz/file/..."
                />
              </div>
            </div>

            {/* TAGS */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {['scene', 'ae', 'am', 'lut', 'overlay', 'other'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      tags.includes(tag) 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                        : 'bg-white/5 text-white/30 hover:bg-white/10'
                    }`}
                  >
                    {t(`tags.${tag}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isUploading || uploadSuccess}
              className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                uploadSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-primary/20'
              }`}
            >
              {isUploading ? <Loader2 className="animate-spin" /> : uploadSuccess ? <Check /> : <Upload />}
              {uploadSuccess ? t('uploadSuccess') : t('upload').toUpperCase()}
            </button>
          </form>
        </div>
      </main>

      {/* CROP MODAL */}
      {isCropping && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-2xl aspect-video bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10">
            <Cropper
              image={image!}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
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
