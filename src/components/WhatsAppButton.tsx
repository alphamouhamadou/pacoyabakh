'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const whatsappNumber = '221781683139';
  const message = encodeURIComponent(
    "Bonjour 👋🏾 Je souhaite réserver un shooting photo/vidéo. Pouvez-vous m'en dire plus ?"
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:bg-[#20BA5A] transition-all hover:scale-110 animate-pulse-glow"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white fill-white" />
    </a>
  );
}
