
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, X, ChevronLeft, ChevronRight, MessageCircle, Video, PlayCircle, Check } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { SEOHelper } from '../components/SEOHelper';

const { useParams } = RouterDom;

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties } = useProperties();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = properties.find(p => p.id === id);

  if (!property) return null;

  const allImages = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  // Helper para converter URLs normais de vídeo em URLs de incorporação (embed)
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Suporte para YouTube (vários formatos)
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    }
    
    // Suporte para Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  // Configuração do WhatsApp
  const whatsappNumber = "5561991176958";
  const message = `Estou acessando o site e gostaria de mais informações sobre o imóvel: ${property.title}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-dark-950 min-h-screen pb-20">
      <SEOHelper title={property.title} />
      
      <div className="relative h-[60vh] md:h-[70vh]">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover cursor-pointer" 
          onClick={() => {
            setCurrentImageIndex(0);
            setLightboxOpen(true);
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <span className="bg-gold-600 text-white text-[10px] font-bold px-3 py-1 rounded mb-4 inline-block uppercase tracking-widest">{property.tag}</span>
                <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-300"><MapPin size={18} className="text-gold-400 mr-2" />{property.location}</div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Características em Cards Estilizados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 border-y border-white/5 py-12">
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-gold-600/30 transition-all duration-300">
                    <BedDouble size={28} className="text-gold-400 mb-4" />
                    <span className="text-white font-bold text-lg md:text-xl leading-tight">
                        {property.beds}
                    </span>
                </div>
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-gold-600/30 transition-all duration-300">
                    <Car size={28} className="text-gold-400 mb-4" />
                    <span className="text-white font-bold text-lg md:text-xl leading-tight">
                        {property.parking}
                    </span>
                </div>
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-gold-600/30 transition-all duration-300">
                    <Scaling size={28} className="text-gold-400 mb-4" />
                    <span className="text-white font-bold text-lg md:text-xl leading-tight">
                        {property.area}
                    </span>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-4">Sobre o Imóvel</h2>
                <p className="text-gray-400 leading-relaxed font-light whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Nova Seção: Diferenciais / Características (Features) */}
            {property.features && property.features.length > 0 && (
              <div className="mb-12">
                  <h2 className="text-2xl text-white font-serif mb-6">Diferenciais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 bg-white/5 p-8 rounded-2xl border border-white/5">
                      {property.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-300">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-600/20 flex items-center justify-center">
                                  <Check size={12} className="text-gold-400" />
                              </div>
                              <span className="text-sm font-light tracking-wide">{feature}</span>
                          </div>
                      ))}
                  </div>
              </div>
            )}

            {/* Vídeo Incorporado */}
            {property.videoUrl && (
              <div className="mb-12">
                  <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
                    <Video size={24} className="text-gold-400" />
                    Tour em Vídeo
                  </h2>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-dark-900 border border-white/5 shadow-2xl">
                      <iframe 
                        src={getEmbedUrl(property.videoUrl)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={`Tour Virtual - ${property.title}`}
                        frameBorder="0"
                      ></iframe>
                  </div>
              </div>
            )}

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Galeria de Fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allImages.slice(0, 8).map((img, idx) => (
                        <div 
                          key={idx} 
                          className="aspect-square overflow-hidden rounded-xl cursor-pointer group border border-white/5" 
                          onClick={() => {
                            setCurrentImageIndex(idx); 
                            setLightboxOpen(true);
                          }}
                        >
                            <img 
                              src={img} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                              alt={`Foto ${idx + 1} - ${property.title}`} 
                            />
                        </div>
                    ))}
                </div>
                {allImages.length > 8 && (
                  <button 
                    onClick={() => {
                        setCurrentImageIndex(8);
                        setLightboxOpen(true);
                    }}
                    className="text-gold-400 text-sm mt-4 w-full text-center py-4 border border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest font-medium"
                  >
                    Ver mais {allImages.length - 8} fotos na galeria
                  </button>
                )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 sticky top-32 text-center shadow-2xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                
                <h3 className="text-xl text-white font-serif mb-4">Tem Interesse?</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Fale diretamente comigo para tirar suas dúvidas ou agendar uma visita exclusiva a este imóvel.
                </p>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.15)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.3)] hover:-translate-y-1"
                >
                  <MessageCircle size={22} />
                  <span className="text-xs uppercase tracking-widest">Conversar Agora</span>
                </a>
                
                <div className="mt-8 pt-8 border-t border-white/5">
                   <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">Consultoria Exclusiva</p>
                   <p className="text-gold-400 font-bold mt-1 uppercase tracking-widest text-xs">Paulo Martins</p>
                </div>
            </div>
          </aside>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img src={allImages[currentImageIndex]} className="max-h-full max-w-full object-contain select-none" alt="Ampliada" />
              
              <button 
                className="absolute right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110]" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setCurrentImageIndex((p) => (p + 1) % allImages.length);
                }}
              >
                <ChevronRight size={48}/>
              </button>
              
              <button 
                className="absolute left-4 md:left-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110]" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length);
                }}
              >
                <ChevronLeft size={48}/>
              </button>
              
              <button 
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110]" 
                onClick={() => setLightboxOpen(false)}
              >
                <X size={32}/>
              </button>

              <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm font-light tracking-widest">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
        </div>
      )}
    </div>
  );
};
