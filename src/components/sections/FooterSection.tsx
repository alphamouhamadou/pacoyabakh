'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Lock,
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+221 78 168 31 39',
    href: 'https://wa.me/221781683139',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'bosspaco3@gmail.com',
    href: 'mailto:bosspaco3@gmail.com',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@pacoyabakh',
    href: 'https://www.instagram.com/paco_ya_bakh/',
  },
  {
    icon: MessageCircle,
    label: 'TikTok',
    value: '@pacoyabakh',
    href: 'https://www.tiktok.com/@pacoyabakh?_r=1&_t=ZS-959LimvRy7d',
  },
];

export function FooterSection({
  onAdminClick,
}: {
  onAdminClick?: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer id="contact" className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] to-[#050508]" />

      <div
        ref={sectionRef}
        className={`relative transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Contact section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-amber-500 text-sm font-semibold uppercase tracking-widest">
              Parlons de ton projet
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-white">
              <span className="text-gold-gradient">Contact</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-lg">
              Une question, un projet ? N&apos;hésite pas à nous contacter.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-4 bg-[#141418] border border-neutral-800 rounded-xl p-5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <info.icon className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider">
                    {info.label}
                  </p>
                  <p className="text-white font-medium group-hover:text-amber-400 transition-colors">
                    {info.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gold-gradient">PACO</span>
                <span className="text-white">YABAKH</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm text-center">
              © 2024 PacoYaBakh. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/paco_ya_bakh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-amber-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@pacoyabakh?_r=1&_t=ZS-959LimvRy7d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-amber-400 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              {onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="text-neutral-700 hover:text-neutral-400 transition-colors"
                  title="Administration"
                >
                  <Lock className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
