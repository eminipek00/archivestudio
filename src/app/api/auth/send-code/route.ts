import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // 1. 6 Haneli Rastgele Kod Üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Kodu Veritabanına Kaydet
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .eq('email', email); // Eski kodları temizle

    const { error: dbError } = await supabaseAdmin
      .from('verification_codes')
      .insert([{ email, code }]);

    if (dbError) throw dbError;

    // 3. Resend ile 'sytexarchive' Markalı Mail Gönder
    const { data, error: mailError } = await resend.emails.send({
      from: 'sytexarchive <onboarding@resend.dev>', // Kendi domainin varsa onu yazabilirsin
      to: [email],
      subject: `${code} - sytexarchive Doğrulama Kodun`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 450px; margin: 0 auto; padding: 40px; background-color: #020617; color: white; border-radius: 32px; border: 1px solid #1e293b; text-align: center;">
          <div style="display: inline-block; padding: 12px; background-color: #3b82f6; border-radius: 16px; margin-bottom: 24px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V20.9932C21 21.5501 20.5527 22 19.9918 22H4.00821C3.45131 22 3 21.5527 3 20.9932V8L11 3L21 8Z"></path><path d="M3 8L11 13L21 8"></path></svg>
          </div>
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -1px; margin: 0 0 8px 0; text-transform: uppercase;">SYTEXARCHIVE</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 32px;">Hesabını doğrulamak için aşağıdaki 6 haneli kodu kullan.</p>
          
          <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 20px; margin-bottom: 32px;">
            <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #3b82f6; font-family: monospace;">${code}</span>
          </div>
          
          <p style="color: #64748b; font-size: 12px;">Bu kod 10 dakika boyunca geçerlidir. Eğer bu işlemi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
        </div>
      `,
    });

    if (mailError) throw mailError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
