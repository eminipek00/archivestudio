export type Language = 'tr' | 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ru' | 'zh' | 'ja' | 'pt';

export const translations: Record<Language, any> = {
  tr: {
    heroTitle: "Editörler İçin Premium Dijital Arşiv",
    heroSub: "Profesyonel editörler için seçilmiş en kaliteli kaynaklar.",
    upload: "Yükle",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    admin: "sytexarchive Admin",
    editor: "sytexarchive Editör",
    footer: "Tüm hakları saklıdır.",
    footerSub: "Profesyonel Editörler İçin Premium Kaynaklar.",
    changePassword: "Şifre Değiştir",
    deleteAccount: "Hesabı Sil",
    allFiles: "Tüm Dosyalar",
    categories: "Kategoriler",
    pricing: "Premium",
    searchPlaceholder: "Sahne paketleri, ses efektleri, geçişler ara...",
    tags: {
      all: "Tümü",
      scene: "Sahne Paketleri",
      ae: "After Effects",
      am: "Alight Motion",
      lut: "LUT Paketleri",
      overlay: "Overlay"
    }
  },
  en: {
    heroTitle: "Premium Digital Archive for Editors",
    heroSub: "Top quality resources curated for professional editors.",
    upload: "Upload",
    login: "Login",
    register: "Register",
    admin: "sytexarchive Admin",
    editor: "sytexarchive Editor",
    footer: "All rights reserved.",
    footerSub: "Premium Resources for Professional Editors.",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    allFiles: "All Files",
    categories: "Categories",
    pricing: "Premium",
    searchPlaceholder: "Search scene packs, sfx, transitions...",
    tags: {
      all: "All",
      scene: "Scene Packs",
      ae: "After Effects",
      am: "Alight Motion",
      lut: "LUT Packs",
      overlay: "Overlay"
    }
  }
  // Diğer diller de benzer şekilde güncellenecek...
};
