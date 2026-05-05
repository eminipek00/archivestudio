import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/utils/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sytex Archive | Professional Digital Assets & Creative Presets",
  description: "Download professional scene packages, sound effects, overlays, and transitions. The ultimate archive for creative editors and digital artists.",
  keywords: ["Sytex Archive", "Digital Assets", "Video Editing", "Presets", "After Effects", "Alight Motion", "Sound Effects", "Overlays"],
  authors: [{ name: "Muhammet Emin İpek" }],
  openGraph: {
    title: "Sytex Archive",
    description: "The professional digital asset archive.",
    url: "https://sytexarchive.vercel.app",
    siteName: "Sytex Archive",
    images: [{ url: "/logo.png" }],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.className} bg-black text-white no-scrollbar`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
