
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProperties } from '../context/PropertyContext';
import { supabase } from '../lib/supabase';

const { useNavigate } = RouterDom;

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [purpose, setPurpose] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbHeroImage, setDbHeroImage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<(() => void) | null>(null);

  // Fetch customizable Hero Image from tracking_settings list
  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('tracking_settings')
          .select('home_hero_image')
          .eq('id', 'global-tracking')
          .maybeSingle();

        if (error) {
          console.warn('Erro ao ler tabela tracking_settings para hero image:', error);
        } else if (data && data.home_hero_image) {
          setDbHeroImage(data.home_hero_image);
        }
      } catch (err) {
        console.error('Falha geral ao buscar imagem hero customizada:', err);
      }
    };

    loadHeroImage();
  }, []);

  // Set up up to 3 slideshow images
  const defaultImages = [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop'
  ];

  const slideshowImages = useMemo(() => {
    const list = [...defaultImages];
    // Use the customizable hero image as first slide if set
    if (dbHeroImage) {
      list[0] = dbHeroImage;
    }
    // Leverage real luxury property photos for the secondary slides if available
    if (properties && properties.length > 0) {
      if (properties[0]?.imageUrl) list[1] = properties[0].imageUrl;
      if (properties[1]?.imageUrl) list[2] = properties[1].imageUrl;
    }
    return list;
  }, [dbHeroImage, properties]);

  // Handle slide transitions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);
  };

  // Keep ref updated to bypass closure in useEffect
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  // Slideshow auto-rotation (6 seconds)
  useEffect(() => {
    const play = () => {
      if (autoPlayRef.current) autoPlayRef.current();
    };
    const interval = setInterval(play, 6000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Extract unique cities from properties
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    properties.forEach(prop => {
        if (prop.city) {
            cities.add(prop.city.trim());
        }
    });
    return Array.from(cities).sort();
  }, [properties]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (purpose && purpose !== 'Finalidade') params.append('purpose', purpose);
    if (type && type !== 'Tipo de Imóvel') params.append('type', type);
    if (city && city !== 'Cidade') params.append('city', city);
    if (searchQuery) params.append('query', searchQuery);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen md:min-h-[110vh] flex flex-col justify-center items-center overflow-hidden bg-dark-950">
      {/* Background Image Slideshow with smooth crossfade motion */}
      <div className="absolute inset-0 z-0 bg-neutral-950 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentSlide}
            src={slideshowImages[currentSlide]}
            alt="Imóveis de Luxo em Brasília"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.45, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        {/* Gradient Overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent z-1"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-32 z-1"></div>
      </div>

      {/* Manual Slide Navigation Arrows */}
      <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-gold-500/80 hover:text-black border border-white/10 text-white/70 hover:scale-105 pointer-events-auto flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer"
          title="Slide Anterior"
          id="hero-prev-slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-gold-500/80 hover:text-black border border-white/10 text-white/70 hover:scale-105 pointer-events-auto flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer"
          title="Próximo Slide"
          id="hero-next-slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Editorial Numbered Dots Navigation */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-4">
        {slideshowImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group flex items-center gap-2 focus:outline-none cursor-pointer"
            id={`hero-slide-indicator-${index}`}
            title={`Alternar para imagem ${index + 1}`}
          >
            <span className={`text-[10px] md:text-xs font-mono tracking-widest transition-all duration-300 ${currentSlide === index ? 'text-gold-400 font-bold' : 'text-white/40'}`}>
              0{index + 1}
            </span>
            <div className={`h-[2px] transition-all duration-500 rounded-full ${currentSlide === index ? 'w-8 md:w-10 bg-gold-400' : 'w-2 md:w-3 bg-white/20 group-hover:bg-white/40'}`}></div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-16 md:mt-10">
        
        {/* Hero Text */}
        <div className="mb-8 md:mb-16 max-w-3xl animate-fade-in-up">
          <h1 className="text-[2.6rem] md:text-7xl font-sans font-bold text-white leading-tight mb-4 md:mb-6">
            Os Melhores Imóveis <br />
            <span className="text-white/90">da Região de Brasília</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 font-light tracking-wide border-l-2 border-gold-500 pl-4">
            Para morar ou investir, temos a melhor opção para você
          </p>
        </div>

        {/* Search Widget */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 max-w-5xl shadow-2xl shadow-black/50 transform md:translate-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Dropdown 1: Tipo de Imóvel */}
            <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-400">
                <ChevronDown size={16} />
              </div>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer hover:bg-white/10 text-sm"
              >
                <option className="bg-dark-900" value="">Tipo de Imóvel</option>
                <option className="bg-dark-900" value="Casa">Casa</option>
                <option className="bg-dark-900" value="Apartamento">Apartamento</option>
                <option className="bg-dark-900" value="Cobertura">Cobertura</option>
              </select>
            </div>

             {/* Dropdown 2: Cidade */}
             <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-400">
                <ChevronDown size={16} />
              </div>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer hover:bg-white/10 text-sm"
              >
                <option className="bg-dark-900" value="">Cidade</option>
                {availableCities.map(c => (
                    <option key={c} className="bg-dark-900" value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Button */}
            <div className="md:col-span-4">
              <button 
                onClick={handleSearch}
                className="w-full h-12 md:h-14 bg-gold-600 hover:bg-gold-500 text-white font-medium rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(197,160,40,0.3)] hover:shadow-[0_0_30px_rgba(197,160,40,0.5)] flex items-center justify-center gap-2"
              >
                Buscar Imóveis
              </button>
            </div>

            {/* Search Input Row */}
            <div className="md:col-span-12 mt-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Busque por palavra-chave, código ou localização..."
                        className="w-full h-10 md:h-12 bg-transparent border-b border-white/10 text-white pl-12 focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-500 font-light text-sm"
                    />
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
