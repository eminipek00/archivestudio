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
    success: <CheckCircle2 className="text-green-500" size={18} />,
    error: <AlertCircle className="text-red-500" size={18} />,
    info: <Info className="text-primary" size={18} />
  };

  const colors = {
    success: 'border-green-500/20 bg-black/90 shadow-green-500/20',
    error: 'border-red-500/20 bg-black/90 shadow-red-500/20',
    info: 'border-primary/20 bg-black/90 shadow-primary/20'
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300 ${colors[type]}`}>
            {icons[type]}
            <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{message}</span>
            <div className="w-[1px] h-4 bg-white/10 ml-2" />
            <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity ml-1">
                <X size={14} className="text-white" />
            </button>
        </div>
    </div>
  );
};
