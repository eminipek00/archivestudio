"use client";

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  return { toast, showToast, hideToast: () => setToast(null) };
};

export const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 3 saniye sonra kaybolma animasyonunu başlat
    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    // Animasyon bittikten sonra (500ms) bileşeni tamamen kaldır
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={16} />,
    error: <AlertCircle className="text-red-500" size={16} />,
    info: <Info className="text-primary" size={16} />
  };

  const colors = {
    success: 'border-green-500/20 bg-black/95 shadow-green-500/10',
    error: 'border-red-500/20 bg-black/95 shadow-red-500/10',
    info: 'border-primary/20 bg-black/95 shadow-primary/10'
  };

  return (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[10000] flex items-center justify-center p-4 pointer-events-none w-full max-w-sm transition-all duration-500 ease-in-out ${isLeaving ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-2xl border shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-500 w-full ${colors[type]}`}>
            {icons[type]}
            <span className="text-[9px] font-black uppercase tracking-widest text-white italic flex-1">{message}</span>
            <button onClick={() => { setIsLeaving(true); setTimeout(onClose, 500); }} className="opacity-30 hover:opacity-100 transition-opacity">
                <X size={14} className="text-white" />
            </button>
        </div>
    </div>
  );
};
