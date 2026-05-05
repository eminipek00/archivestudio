"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/utils/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Send, Loader2, Clock, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SupportPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }
      setUser(authUser);
      setIsAdmin(authUser.email === 'ipekmuhammetemin@gmail.com');
      fetchTickets(authUser.email === 'ipekmuhammetemin@gmail.com');
    };
    checkUser();
  }, [supabase, router]);

  const fetchTickets = async (adminMode: boolean) => {
    setFetching(true);
    let query = supabase.from('tickets').select('*, profiles:user_id(username, avatar_url)');
    
    if (!adminMode) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) query = query.eq('user_id', user.id);
    }

    const { data } = await query.order('created_at', { ascending: false });
    if (data) setTickets(data);
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message || !user) return;
    
    setLoading(true);
    const { error } = await supabase.from('tickets').insert({
      user_id: user.id,
      subject,
      message
    });

    if (error) {
      alert(error.message);
    } else {
      setSubject('');
      setMessage('');
      fetchTickets(isAdmin);
    }
    setLoading(false);
  };

  const deleteTicket = async (id: string) => {
      if (!confirm('Emin misiniz?')) return;
      await supabase.from('tickets').delete().eq('id', id);
      fetchTickets(isAdmin);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center pt-28 pb-8 no-scrollbar overflow-hidden">
        <div className="w-full max-w-4xl px-4 flex flex-col md:flex-row gap-6 h-full overflow-hidden">
          
          {/* TICKET FORM */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-card border border-border-custom p-6 rounded-[2.5rem] shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><MessageSquare size={20} /></div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{t('support.title')}</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">{t('support.subject')}</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t('support.placeholderSubject')} className="w-full bg-[#111] border border-border-custom rounded-2xl py-3 px-5 text-xs font-bold text-white outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">{t('support.message')}</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder={t('support.placeholderMessage')} className="w-full bg-[#111] border border-border-custom rounded-2xl py-3 px-5 text-xs font-bold text-white outline-none focus:border-primary/50 transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all">
                        {loading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} {t('support.submit')}
                    </button>
                </form>
            </div>
          </div>

          {/* TICKETS LIST */}
          <div className="flex-grow flex flex-col bg-card border border-border-custom rounded-[3rem] shadow-xl overflow-hidden text-left">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl text-white/40"><Clock size={18} /></div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">{isAdmin ? t('support.allTickets') : t('support.myTickets')}</h3>
                </div>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-white/40">{tickets.length} {t('support.total')}</span>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 no-scrollbar space-y-4">
                {fetching ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : tickets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/10 opacity-20">
                        <MessageSquare size={48} />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest">{t('support.noTickets')}</p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-[#111] border border-white/5 p-5 rounded-[2rem] hover:border-primary/20 transition-all group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                                        <h4 className="text-xs font-black text-white uppercase italic">{ticket.subject}</h4>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium leading-relaxed">{ticket.message}</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </span>
                                        {isAdmin && (
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest truncate max-w-[100px]">
                                                BY @{ticket.profiles?.username || 'user'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button onClick={() => deleteTicket(ticket.id)} className="p-2 text-white/5 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-black border-t border-border-custom py-2 px-6 flex items-center justify-between text-[8px] font-black uppercase text-white/30 italic shrink-0">
          <span>sytexarchive support</span>
          <p>&copy; {new Date().getFullYear()} sytexarchive</p>
      </footer>
    </div>
  );
};

export default SupportPage;
