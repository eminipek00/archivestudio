import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // 1. Kodu kontrol et
    const { data, error } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Geçersiz kod' }, { status: 400 });
    }

    // 2. Kodu sil (Tek kullanımlık)
    await supabaseAdmin.from('verification_codes').delete().eq('id', data.id);

    // 3. Kullanıcıyı auth.users tablosunda doğrula
    // (EmailConfirmedAt alanını güncelleyerek gerçek doğrulama sağlıyoruz)
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const targetUser = userList.users.find(u => u.email === email);

    if (targetUser) {
      await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        email_confirm: true
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
