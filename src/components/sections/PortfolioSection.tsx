'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Loader2 } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'studio', label: 'Shooting' },
  { id: 'exterieur', label: 'Graduation' },
  { id: 'evenement', label: 'Événement' },
  { id: 'produit', label: 'Produit' },
];

// Fallback portfolio items (existing public/ images)
const fallbackItems = [
  { id: 'f1', src: '/portfolio-studio-1.jpg', category: 'studio', title: 'Portrait Studio', gradient: 'from-amber-900/40 to-stone-900/60' },
  { id: 'f2', src: '/portfolio-outdoor-1.jpg', category: 'exterieur', title: 'Portrait Extérieur', gradient: 'from-orange-900/40 to-stone-900/60' },
  { id: 'f3', src: '/portfolio-event-1.jpg', category: 'evenement', title: 'Événement', gradient: 'from-red-900/40 to-stone-900/60' },
  { id: 'f4', src: '/portfolio-product-1.jpg', category: 'produit', title: 'Photo Produit', gradient: 'from-yellow-900/40 to-stone-900/60' },
  { id: 'f5', src: '/portfolio-studio-2.jpg', category: 'studio', title: 'Fashion Editorial', gradient: 'from-amber-900/40 to-neutral-900/60' },
  { id: 'f6', src: '/portfolio-outdoor-2.jpg', category: 'exterieur', title: 'Mariage', gradient: 'from-rose-900/40 to-stone-900/60' },
];

interface PortfolioPhoto {
  id: string;
  title: string | null;
  description: string | null;
  category: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioItem {
  id: string;
  src: string;
  category: string;
  title: string;
  gradient?: string;
}

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/photos');
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Build portfolio items from API photos or fallback
  const portfolioItems: PortfolioItem[] = (() => {
    if (photos.length > 0) {
      return photos.map((photo) => ({
        id: photo.id,
        src: photo.imageUrl,
        category: photo.category,
        title: photo.title || photo.category,
      }));
    }
    // Use fallback if no photos in DB
    return fallbackItems.map((item) => ({
      ...item,
    }));
  })();

  const filteredItems =
    activeFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d12] to-[#0a0a0f]" />

      <div
        ref={sectionRef}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-amber-500 text-sm font-semibold uppercase tracking-widest">
            Notre travail
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-white">
            Nos <span className="text-gold-gradient">Réalisations</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Découvrez une sélection de nos meilleurs projets photo et vidéo.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeFilter === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveFilter(cat.id)}
              className={
                activeFilter === cat.id
                  ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full px-5'
                  : 'border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/50 rounded-full px-5'
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Portfolio grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-neutral-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-amber-500/50" />
            </div>
            <p className="text-neutral-300 text-lg font-medium">
              Bientôt de nouvelles réalisations...
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              Nous préparons notre galerie pour vous montrer notre meilleur travail.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(item)}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br');
                      const gradient = item.gradient || 'from-amber-900/40 to-stone-900/60';
                      parent.classList.add(gradient);
                      parent.innerHTML = `
                        <div class="absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center">
                          <span class="text-white/30 text-lg font-medium">${item.title}</span>
                        </div>
                      `;
                    }
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                  <div className="p-4 sm:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                    <p className="text-amber-400 text-sm capitalize">
                      {item.category}
                    </p>
                  </div>
                </div>

                {/* Corner icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-amber-500/90 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
