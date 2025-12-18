
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
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
          onClick={() => setLightboxOpen(true)} 
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
                <p className="text-gray-400 leading-relaxed font-light">{property.description}</p>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Galeria</h2>
                <div className="grid grid-cols-2 gap-4">
                    {allImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-video overflow-hidden rounded-xl cursor-pointer" onClick={() => {setCurrentImageIndex(idx); setLightboxOpen(true);}}>
                            <img src={img} className="w-full h-full object-cover hover:scale-105 transition-all" alt={`Galeria ${idx}`} />
                        </div>
                    ))}
                </div>
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
            <img src={allImages[currentImageIndex]} className="max-h-[85vh] max-w-full object-contain" alt="Fullscreen" />
            <button className="absolute right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors" onClick={(e) => {e.stopPropagation(); setCurrentImageIndex((p) => (p + 1) % allImages.length);}}><ChevronRight size={48}/></button>
            <button className="absolute left-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors" onClick={(e) => {e.stopPropagation(); setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length);}}><ChevronLeft size={48}/></button>
            <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setLightboxOpen(false)}><X size={32}/></button>
        </div>
      )}
    </div>
  );
};
