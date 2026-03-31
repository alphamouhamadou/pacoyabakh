'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { BookingSection } from '@/components/sections/BookingSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('⚠️ Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <BookingSection />
        <AboutSection />
        <FooterSection onAdminClick={() => setAdminOpen(true)} />
      </main>
      <WhatsAppButton />
      <PWAInstallPrompt />
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}
