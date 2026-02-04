import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

type SlideRoute = {
  filter?: string;      // ex: 'deals'
  category?: string;    // ex: 'Mode', 'Électronique', 'Maison'
  sub?: string;         // ex: 'Décoration' (sera envoyé en minuscule: 'decoration')
};

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  cta: string;
  route: SlideRoute;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Super Vente Flash',
    subtitle: "Jusqu'à -50% sur l'électronique",
    description: 'Profitez des meilleures offres sur les smartphones, laptops et accessoires.',
    image: 'https://images.unsplash.com/photo-1531297461136-82lwDe83a917?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-blue-600',
    cta: 'Acheter maintenant',
    route: { filter: 'deals', category: 'Électronique' },
  },
  {
    id: 2,
    title: 'Nouvelle Collection Mode',
    subtitle: 'Styles tendances pour 2024',
    description: 'Découvrez notre sélection exclusive de vêtements et accessoires.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-purple-600',
    cta: 'Voir la collection',
    route: { category: 'Mode' }, // Optionnel: route: { category: 'Mode', sub: 'Femmes' } si tu veux cibler la sous-catégorie Femmes
  },
  {
    id: 3,
    title: 'Maison & Décoration',
    subtitle: 'Rénovez votre intérieur',
    description: 'Tout pour une maison confortable et él��gante à petit prix.',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-[#FF6B00]',
    cta: 'Découvrir',
    route: { category: 'Maison', sub: 'Décoration' }, // ShopPage lira sub en minuscule: 'decoration'
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleCtaClick = () => {
    const route = slides[current].route;
    const params = new URLSearchParams();
    if (route.filter) params.set('filter', route.filter);
    if (route.category) params.set('category', route.category);
    if (route.sub) params.set('sub', route.sub.toLowerCase()); // ShopPage utilise subParam en minuscule
    const qs = params.toString();
    navigate(qs ? `/shop?${qs}` : '/shop');
  };

  return (
    <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg shadow-lg bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-white"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${slides[current].color}`}>
                  {slides[current].subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {slides[current].title}
                </h2>
                <p className="text-lg text-gray-200 mb-8">{slides[current].description}</p>
                <Button
                  size="lg"
                  className="bg-[#FF6B00] hover:bg-[#e66000] border-none text-white font-bold px-8"
                  onClick={handleCtaClick}
                  aria-label={slides[current].cta}
                >
                  {slides[current].cta}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-[#FF6B00] w-8' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}