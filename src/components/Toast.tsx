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
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" />,
    error: <AlertCircle className="text-red-500" />,
    info: <Info className="text-primary" />
  };

  const colors = {
    success: 'border-green-500/20 bg-green-500/5',
    error: 'border-red-500/20 bg-red-500/5',
    info: 'border-primary/20 bg-primary/5'
  };

  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-500 ${colors[type]}`}>
      {icons[type]}
      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-40 hover:opacity-100"><X size={16} /></button>
    </div>
  );
};
