import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PACOYABAKH - Photo & Vidéo Professionnelles au Sénégal",
  description:
    "Studio photo et vidéo professionnel basé au Sénégal. Shooting photo, vidéographie, événementiel et création de contenu. Réservez votre session dès maintenant.",
  keywords: [
    "photographe Sénégal",
    "vidéaste Sénégal",
    "photo professionnelle",
    "shooting photo Dakar",
    "PACOYABAKH",
    "photographe événementiel",
    "vidéo professionnelle",
  ],
  authors: [{ name: "PACOYABAKH" }],
  icons: {
    icon: "/pwa-icon-192.png",
    apple: "/pwa-icon-192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "PACOYABAKH - Photo & Vidéo Professionnelles",
    description:
      "Photo ou vidéo, dis-moi simplement ton besoin. Je m'occupe du reste.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PacoYaBakh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
