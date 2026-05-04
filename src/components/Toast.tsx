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
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-primary" size={24} />
  };

  const colors = {
    success: 'border-green-500/20 bg-black/90 shadow-green-500/10',
    error: 'border-red-500/20 bg-black/90 shadow-red-500/10',
    info: 'border-primary/20 bg-black/90 shadow-primary/10'
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className={`pointer-events-auto flex flex-col items-center gap-4 px-10 py-8 rounded-[3rem] border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in duration-500 text-center max-w-sm w-full ${colors[type]}`}>
            <div className="p-4 bg-muted rounded-2xl mb-2">
                {icons[type]}
            </div>
            <span className="text-sm font-black uppercase tracking-tighter italic text-white leading-tight">{message}</span>
            <button onClick={onClose} className="mt-2 text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors tracking-widest">KAPAT</button>
        </div>
    </div>
  );
};
