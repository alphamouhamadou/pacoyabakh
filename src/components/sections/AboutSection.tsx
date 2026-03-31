'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Award,
  Clock,
  Heart,
  Star,
} from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Créativité',
    description:
      'Chaque projet est unique. Nous apportons une vision créative et originale à chaque shooting.',
  },
  {
    icon: Award,
    title: 'Professionnalisme',
    description:
      'Matériel professionnel, retouche soignée, livraison dans les délais. Toujours.',
  },
  {
    icon: Clock,
    title: 'Ponctualité',
    description:
      'Le temps c\'est de l\'or. Nous respectons nos engagements et nos délais de livraison.',
  },
];

const stats = [
  { number: '150+', label: 'Projets réalisés', icon: Star },
  { number: '100+', label: 'Clients satisfaits', icon: Heart },
  { number: '5+', label: 'Ans d\'expérience', icon: Award },
];

export function AboutSection() {
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
    <section id="about" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f15] to-[#0a0a0f]" />

      <div
        ref={sectionRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-amber-500 text-sm font-semibold uppercase tracking-widest">
            Qui sommes-nous
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-white">
            À propos de{' '}
            <span className="text-gold-gradient">PacoYaBakh</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Passionné de photo et vidéo depuis toujours, PacoYaBakh transforme
            chaque instant en un souvenir impérissable. Basé au Sénégal, nous
            offrons des services de qualité professionnelle pour tous vos
            besoins visuels.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="card-hover bg-[#141418] border border-neutral-800 rounded-2xl p-6 lg:p-8 text-center"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
                <value.icon className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{value.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center bg-gradient-to-b from-neutral-900/50 to-transparent rounded-2xl p-8 border border-neutral-800/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <stat.icon className="h-6 w-6 text-amber-500 mx-auto mb-3" />
              <div className="text-4xl sm:text-5xl font-black text-gold-gradient mb-2">
                {stat.number}
              </div>
              <p className="text-neutral-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
