import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';
import { formatPropertyTag, slugify } from '../lib/utils';
import { BedDouble, Car, Scaling, ArrowRight, MapPin, Award, Clock, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const { Link } = RouterDom;

// Helper to calculate time left until the last day of the current month (end of "Imóvel do Mês" cycle)
const getTargetTimeOfCurrentMonth = () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return target.getTime();
};

export const FeaturedProperty: React.FC = () => {
  const { properties, loading } = useProperties();

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetTime = getTargetTimeOfCurrentMonth();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  // Find a suitable property to display. 
  // Order of preference:
  // 1. Property explicitly marked as is_featured by the admin
  // 2. Property explicitly tagged or having "destaque", "exclusivo" or "mês" in the tag/title
  // 3. The first property available in the list
  // 4. Fallback luxury mock property if database is empty or loading
  let featured: Property | null = null;

  if (!loading && properties.length > 0) {
    featured = properties.find(p => p.is_featured === true) || properties.find(p => 
      p.tag?.toLowerCase().includes('destaque') || 
      p.tag?.toLowerCase().includes('exclusiv') ||
      p.title?.toLowerCase().includes('mês') ||
      p.tag?.toLowerCase().includes('mês')
    ) || properties[0];
  }

  // Deluxe mock fallback property details (guarantees a magnificent layout even if database is empty)
  const fallbackProperty: Property = {
    id: properties[0]?.id || 'fallback-featured',
    title: 'Mansão Suspensa de Altíssimo Padrão no Noroeste',
    location: 'SQNW 311, Setor Noroeste, Brasília - DF',
    price: 'R$ 4.890.000',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    beds: '4',
    parking: '4',
    area: '340 m²',
    tag: 'DESTAQUE DO MÊS',
    description: 'Uma obra-prima da arquitetura contemporânea no Setor Noroeste. Cobertura linear espetacular que redefine o conceito de luxo em Brasília. Conta com piscina privativa com borda infinita, espaço gourmet integrado revestido em mármore calacatta importado da Itália, automação residencial completa de última geração, aspiração central, esquadrias com isolamento acústico premium e uma vista panorâmica permanente e desobstruída direto para o esplêndido Parque Burle Marx.',
    features: ['Piscina Privativa Climatizada', 'Automação Residencial Completa', 'Vista Permanente para o Parque', 'Mármore Calacatta Clássico', '4 Suítes Completas', 'Aspiração Central integrada']
  };

  const propertyToShow = featured || fallbackProperty;
  const isFallback = !featured;

  // Slideshow States and Handlers
  const slideshowImages = propertyToShow.images && propertyToShow.images.length > 0
    ? propertyToShow.images
    : (propertyToShow.imageUrl ? [propertyToShow.imageUrl] : []);

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Reset active index when selected property changes
  useEffect(() => {
    setCurrentImgIdx(0);
  }, [propertyToShow.id]);

  // Slideshow auto-rotation interval
  useEffect(() => {
    if (slideshowImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % slideshowImages.length);
    }, 5500); // changes smoothly every 5.5 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Render a clean structural placeholder if the database is in a loading state and we have no fallback
  return (
    <section id="featured-property-section" className="py-24 px-6 bg-[#030303] relative overflow-hidden">
      {/* Visual Ambient Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-700/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-gold-600/10 border border-gold-600/30 px-3.5 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase text-gold-400 font-bold">
            <Award size={12} className="animate-pulse" />
            Curadoria Especial
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
            Imóvel do Mês
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Nossa escolha mensal de residências que reúnem design arquitetônico incomparável, localização prestigiada e sofisticação em todos os detalhes.
          </p>
          <div className="h-0.5 w-16 bg-gold-500/50 mx-auto mt-4 rounded-full" />
        </div>

        {/* Featured Card Wrapper */}
        <motion.div 
          id="featured-container-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-dark-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-gold-500/20 transition-all duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Image Gallery Column */}
            <div className="lg:col-span-7 relative h-[380px] md:h-[460px] lg:h-auto overflow-hidden group">
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={currentImgIdx}
                  src={slideshowImages[currentImgIdx]} 
                  alt={`${propertyToShow.title} - Imagem ${currentImgIdx + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-10" />
              
              {/* Slideshow dot indicators - right-aligned vertically */}
              {slideshowImages.length > 1 && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/5">
                  {slideshowImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                        currentImgIdx === idx 
                          ? 'bg-gold-400 h-5' 
                          : 'bg-white/30 hover:bg-white/70'
                      }`}
                      aria-label={`Ir para imagem ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Feature Tags / Overlays */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <span id="featured-tag-badge" className="bg-gold-600 border border-gold-500/20 text-white text-[10px] font-extrabold px-3 py-1.5 rounded shadow-lg uppercase tracking-widest">
                  {formatPropertyTag(propertyToShow.tag)}
                </span>
                {isFallback && (
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 text-gold-400 text-[9px] font-medium px-2.5 py-1 rounded tracking-wider uppercase">
                    Exclusividade Demonstrativa
                  </span>
                )}
              </div>

            </div>

            {/* Spec Details & Text Column */}
            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-dark-900/60 relative">
              <div className="space-y-6">
                
                {/* Meta details */}
                <div className="space-y-2">
                  <h3 id="featured-title" className="text-2xl md:text-3.5xl font-serif text-white leading-tight font-medium tracking-wide">
                    {propertyToShow.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin size={15} className="text-gold-500 mr-2 shrink-0" />
                    {propertyToShow.location}
                  </div>
                </div>

                {/* Urgent Countdown Timer */}
                <div id="featured-countdown-banner" className="bg-gradient-to-r from-gold-600/15 to-transparent border-l-2 border-gold-500 p-4 rounded-r-xl shadow-[0_4px_20px_rgba(197,160,40,0.08)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: Highlight for Days & Opportunity */}
                  <div className="flex items-center gap-3">
                    {/* Highlighted Days badge */}
                    <div className="bg-gold-500 text-black px-3.5 py-2 rounded-xl flex flex-col items-center justify-center shadow-lg shadow-gold-500/10 shrink-0">
                      <span className="text-2xl font-serif font-black tracking-tight leading-none">
                        {String(timeLeft.days).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider font-sans leading-none mt-1">
                        Dias
                      </span>
                    </div>

                    {/* Highly highlighted "OPORTUNIDADE" badge and text */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-red-600 text-white font-black text-[10px] tracking-widest px-2.5 py-0.5 rounded shadow-[0_0_15px_rgba(220,38,38,0.4)] uppercase font-mono animate-pulse inline-block">
                          OPORTUNIDADE
                        </span>
                      </div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-medium leading-tight">
                        Condições Especiais Restantes
                      </p>
                    </div>
                  </div>

                  {/* Right: Sleek Digital Timer (HH:MM:SS) without bottom labels */}
                  <div className="flex items-center gap-1.5 bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 backdrop-blur-sm self-start sm:self-auto">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider font-bold mr-1">Tempo:</span>
                    
                    {/* Hour value */}
                    <div className="text-center">
                      <span className="text-sm font-serif text-white font-bold tracking-tight">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <span className="text-gold-500 font-bold mx-0.5 animate-pulse">:</span>
                    
                    {/* Minute value */}
                    <div className="text-center">
                      <span className="text-sm font-serif text-white font-bold tracking-tight">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <span className="text-gold-500 font-bold mx-0.5 animate-pulse">:</span>
                    
                    {/* Second value */}
                    <div className="text-center">
                      <span className="text-sm font-serif text-gold-400 font-bold tracking-tight">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Specs (Grid) */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/5 font-sans">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Dormitórios</p>
                    <p className="text-[13px] font-medium text-gray-200 flex items-center gap-1.5 tracking-wide">
                      <BedDouble size={14} className="text-gold-500 shrink-0" />
                      {propertyToShow.beds} {Number(propertyToShow.beds) === 1 ? 'Suíte' : 'Suítes'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Vagas</p>
                    <p className="text-[13px] font-medium text-gray-200 flex items-center gap-1.5 tracking-wide">
                      <Car size={14} className="text-gold-500 shrink-0" />
                      {propertyToShow.parking} {Number(propertyToShow.parking) === 1 ? 'Vaga' : 'Vagas'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Área Útil</p>
                    <p className="text-[13px] font-medium text-gray-200 flex items-center gap-1.5 tracking-wide">
                      <Scaling size={14} className="text-gold-500 shrink-0" />
                      {propertyToShow.area}
                    </p>
                  </div>
                </div>

                {/* Description snippet */}
                <p id="featured-desc" className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
                  {propertyToShow.brief_desc_home || propertyToShow.description}
                </p>

              </div>

              {/* Call to Action (CTA) */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <Link
                  id="featured-details-button"
                  to={isFallback ? '/properties' : `/${propertyToShow.slug || slugify(propertyToShow.title)}`}
                  className="w-full sm:w-auto bg-gold-600 hover:bg-gold-500 text-white font-medium text-xs uppercase tracking-widest py-3.5 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(197,160,40,0.15)] hover:shadow-[0_8px_25px_rgba(197,160,40,0.25)] border border-transparent hover:-translate-y-0.5 text-center"
                >
                  {isFallback ? 'Explorar Portfólio' : 'Ver Detalhes do Imóvel'}
                  <ArrowRight size={14} className="animate-pulse" />
                </Link>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
