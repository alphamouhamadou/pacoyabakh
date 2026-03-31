'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const handleScroll = () => {
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="PACOYABAKH Studio"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 animate-fade-in-up`}
        >
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-2">
              <span className="text-gold-gradient">PACO</span>
              <span className="text-white">YABAKH</span>
            </h1>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Photo ou vidéo, dis-moi simplement ton besoin.
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl text-amber-400 font-medium mb-10">
            Je m&apos;occupe du reste.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleScroll}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-8 py-6 h-auto rounded-full transition-all hover:shadow-lg hover:shadow-amber-500/25"
            >
              Réserver mon shooting
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.querySelector('#portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-neutral-600 text-neutral-300 hover:text-amber-400 hover:border-amber-500/50 text-lg px-8 py-6 h-auto rounded-full transition-all"
            >
              Voir nos réalisations
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 animate-fade-in`}
        >
          <button
            onClick={handleScroll}
            className="flex flex-col items-center gap-2 text-neutral-500 hover:text-amber-400 transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Découvrir</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
