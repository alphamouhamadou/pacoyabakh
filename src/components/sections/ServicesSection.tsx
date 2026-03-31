'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Camera, Video, Film } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    icon: Camera,
    title: 'Photographie',
    description: 'Des images qui parlent, des souvenirs qui durent',
    features: [
      'Portraits professionnels',
      'Shooting studio & extérieur',
      'Événements & mariages',
    ],
  },
  {
    icon: Video,
    title: 'Vidéographie',
    description: 'Des vidéos qui captent l\'émotion et le mouvement',
    features: [
      'Clips & teasers',
      'Vidéos événementielles',
      'Contenu réseaux sociaux',
    ],
  },
  {
    icon: Film,
    title: 'Photos + Vidéo',
    description: 'Le combo parfait pour ne rien manquer',
    features: [
      'Couverture complète',
      'Pack premium',
      'Rapport qualité-prix imbattable',
    ],
  },
];

export function ServicesSection() {
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

  const handleBookNow = () => {
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#0a0a0f] relative">
      {/* Subtle background */}
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
            Ce que nous offrons
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-white">
            Nos <span className="text-gold-gradient">Services</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Du concept à la livraison, nous transformons vos idées en images
            qui marquent les esprits.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="card-hover bg-[#141418] border-neutral-800 rounded-2xl cursor-pointer group"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={handleBookNow}
            >
              <CardContent className="p-6 lg:p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <service.icon className="h-7 w-7 text-amber-500" />
                </div>

                {/* Title & description */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm text-neutral-300 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="mt-6 text-amber-500 text-sm font-semibold group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  Réserver
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
