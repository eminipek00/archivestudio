import { sendVerificationEmail } from "@/utils/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email ve token gerekli" }, { status: 400 });
    }

    const result = await sendVerificationEmail(email, token);

    if (result.success) {
      return NextResponse.json({ message: "Doğrulama e-postası başarıyla gönderildi" });
    } else {
      console.error("Resend Error:", result.error);
      return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
