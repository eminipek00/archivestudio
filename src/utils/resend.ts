import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const data = await resend.emails.send({
      from: 'sytexarchive <noreply@sytexarchive.com>',
      to: [email],
      subject: 'sytexarchive Hesabını Doğrula',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #020617; color: white; border-radius: 20px;">
          <h1 style="color: #3b82f6; text-align: center;">SYTEXARCHIVE</h1>
          <p style="font-size: 18px; text-align: center;">Merhaba!</p>
          <p style="text-align: center;">sytexarchive hesabınızı doğrulamak için aşağıdaki kodu kullanın veya butona tıklayın.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?token=${token}" 
               style="background-color: #3b82f6; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px;">
               Hesabı Doğrula
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
