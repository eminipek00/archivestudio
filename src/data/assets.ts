export interface Asset {
  id: string;
  title: string;
  category: string;
  type: string;
  image: string;
  author: string;
  authorAvatar: string;
}

export const assets: Asset[] = [
  {
    id: "1",
    title: "Retro 90s Sahne Paketi",
    category: "Sahne Paketleri",
    type: "AEP",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    author: "VisualVibes",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VV",
  },
  {
    id: "2",
    title: "Smooth Shake Preset",
    category: "After Effects",
    type: "FFX",
    image: "https://images.unsplash.com/photo-1492619334764-22ce53f9e091?auto=format&fit=crop&q=80&w=800",
    author: "MotionMaster",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MM",
  },
  {
    id: "3",
    title: "Cinematic LUT Collection",
    category: "LUT Paketleri",
    type: "CUBE",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    author: "ColorGradePro",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CGP",
  },
  {
    id: "4",
    title: "Dust & Scratches Overlay",
    category: "Overlay",
    type: "MP4",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    author: "ArchiveGuy",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AG",
  },
  {
    id: "5",
    title: "Minimal Title Animations",
    category: "After Effects",
    type: "MOGRT",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    author: "TypoZen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TZ",
  },
  {
    id: "6",
    title: "Cyberpunk Scene Pack",
    category: "Sahne Paketleri",
    type: "AEP",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800",
    author: "NeonEditor",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NE",
  },
];
