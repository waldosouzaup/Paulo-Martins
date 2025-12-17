import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, Check, Heart, ArrowLeft, Share2, X, ChevronLeft, ChevronRight, PlayCircle, ExternalLink } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { properties } = useProperties();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = properties.find(p => p.id === id);

  // Derive gallery images: prefer the array, fallback to single image
  // Slice to max 8 images for the grid display
  const allImages = property 
    ? (property.images && property.images.length > 0 ? property.images : [property.imageUrl]) 
    : [];
  
  const displayImages = allImages.slice(0, 8);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!lightboxOpen) return;
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        if (e.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  if (!property) {
    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
            <h2 className="text-2xl text-white mb-4">Imóvel não encontrado</h2>
            <Link to="/properties" className="text-gold-400 hover:text-white transition-colors">Voltar para a lista</Link>
        </div>
    )
  }

  const toggleFavorite = () => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const openLightbox = (index: number) => {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Helper to get embed URL for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1];
        }
        
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        if (videoId && !isNaN(Number(videoId))) {
            return `https://player.vimeo.com/video/${videoId}`;
        }
    }

    return null;
  };

  const embedUrl = property.videoUrl ? getEmbedUrl(property.videoUrl) : null;

  return (
    <div className="bg-dark-950 min-h-screen pb-20">
      
      {/* Header Image */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(0)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent pointer-events-none"></div>
        
        {/* Navigation & Actions */}
        <div className="absolute top-24 left-0 right-0 px-6 max-w-7xl mx-auto flex justify-between items-start z-10">
            <Link to="/properties" className="bg-black/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-gold-600 transition-colors">
                <ArrowLeft size={24} />
            </Link>
            <div className="flex gap-3">
                <button 
                    onClick={toggleFavorite}
                    className={`bg-black/30 backdrop-blur-md p-3 rounded-full hover:bg-gold-600 transition-colors ${isFavorite(property.id) ? 'text-gold-400' : 'text-white'}`}
                >
                    <Heart size={24} className={isFavorite(property.id) ? "fill-gold-400" : ""} />
                </button>
                <button className="bg-black/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-gold-600 transition-colors">
                    <Share2 size={24} />
                </button>
            </div>
        </div>

        {/* Title Block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 pointer-events-none">
            <div className="max-w-7xl mx-auto">
                <div className="inline-block bg-gold-600 text-white text-xs font-bold px-3 py-1 rounded mb-4 tracking-widest">
                    {property.tag}
                </div>
                <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 max-w-4xl leading-tight">
                    {property.title}
                </h1>
                <div className="flex items-center text-gray-300 text-lg">
                    <MapPin size={20} className="text-gold-400 mr-2" />
                    {property.location}
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            
            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8 mb-8">
                <div className="flex flex-col items-center justify-center p-4 bg-dark-900 rounded-lg">
                    <BedDouble size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.beds}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-dark-900 rounded-lg">
                    <Car size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.parking}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-dark-900 rounded-lg">
                    <Scaling size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.area}</span>
                </div>
            </div>

            {/* Description */}
            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Sobre o Imóvel</h2>
                <p className="text-gray-400 leading-relaxed text-lg font-light">
                    {property.description || 'Uma oportunidade única de viver com elegância e conforto. Este imóvel oferece acabamentos de altíssimo padrão, localização privilegiada e todo o conforto que sua família merece.'}
                </p>
            </div>

            {/* Features List */}
            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(property.features || ['Piscina', 'Segurança 24h', 'Ar Condicionado', 'Varanda Gourmet']).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-gold-900/30 flex items-center justify-center mr-3">
                                <Check size={14} className="text-gold-400" />
                            </div>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            {property.videoUrl && (
                <div className="mb-12">
                    <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-2">
                        <PlayCircle className="text-gold-400" />
                        Vídeo & Tour Virtual
                    </h2>
                    <div className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden p-2">
                         {embedUrl ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                                <iframe 
                                    src={embedUrl} 
                                    title={`Vídeo do imóvel: ${property.title}`} 
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                         ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <p className="text-gray-300 mb-6">Explore os detalhes deste imóvel através de nosso tour exclusivo.</p>
                                <a 
                                    href={property.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-gold-600 hover:bg-gold-500 text-white font-medium px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(197,160,40,0.3)] hover:shadow-[0_0_30px_rgba(197,160,40,0.5)]"
                                >
                                    <ExternalLink size={18} />
                                    Acessar Tour Virtual / Vídeo
                                </a>
                            </div>
                         )}
                    </div>
                </div>
            )}

            {/* Gallery Grid (Max 8 photos) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-white font-serif">Galeria</h2>
                    {allImages.length > 8 && (
                        <span className="text-sm text-gray-400">
                            Mostrando 8 de {allImages.length} fotos
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="relative group aspect-[16/10] overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                            onClick={() => openLightbox(idx)}
                        >
                            <img 
                                src={img} 
                                alt={`View ${idx}`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </div>

          </div>

          {/* Right Column: Agent / Contact */}
          <div className="lg:col-span-1">
            <div className="bg-dark-900 border border-white/5 rounded-2xl p-6 sticky top-32">
                
                {/* Changed: Persuasive Title instead of Price */}
                <div className="mb-8 border-b border-white/5 pb-6">
                    <h3 className="text-2xl text-gold-400 font-serif mb-2 leading-tight">Interessado nesta exclusividade?</h3>
                    <p className="text-gray-400 font-light text-sm">
                        Entre em contato para consultar valores e agendar sua visita privativa.
                    </p>
                </div>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                        <img src="https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png" alt="Corretor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="text-white font-medium">Paulo Martins</div>
                        <div className="text-gold-600 text-xs uppercase tracking-wider">Corretor de Imóveis</div>
                    </div>
                </div>

                <form className="space-y-4">
                    <input type="text" placeholder="Seu Nome" className="w-full bg-dark-950 border border-white/10 rounded px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                    <input type="email" placeholder="Seu Email" className="w-full bg-dark-950 border border-white/10 rounded px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                    <input type="tel" placeholder="Seu Telefone" className="w-full bg-dark-950 border border-white/10 rounded px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                    <textarea rows={3} placeholder="Olá, gostaria de mais informações sobre este imóvel..." className="w-full bg-dark-950 border border-white/10 rounded px-4 py-3 text-white focus:border-gold-500 focus:outline-none"></textarea>
                    
                    <button type="button" className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-3 rounded transition-all uppercase tracking-widest text-sm">
                        Agendar Visita
                    </button>
                     <a 
                        href={`https://wa.me/5561991176958?text=Olá, gostaria de mais informações sobre o imóvel ${property.title}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full border border-white/20 hover:border-white text-white font-medium py-3 rounded transition-all uppercase tracking-widest text-sm flex items-center justify-center"
                     >
                        Whatsapp
                    </a>
                </form>
            </div>
          </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightboxOpen(false)}
        >
            <button 
                onClick={() => setLightboxOpen(false)} 
                className="absolute top-4 right-4 text-white hover:text-gold-400 p-2 z-20 transition-colors"
            >
                <X size={32} />
            </button>
            
            <button 
                onClick={prevImage} 
                className="absolute left-4 text-white hover:text-gold-400 p-4 z-20 transition-colors hover:bg-white/5 rounded-full hidden md:block"
            >
                <ChevronLeft size={48} />
            </button>

            <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col items-center">
                <img 
                    src={allImages[currentImageIndex]} 
                    alt={`Full screen view ${currentImageIndex + 1}`} 
                    className="max-h-[85vh] max-w-full object-contain select-none shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
                <div className="mt-4 text-white/50 text-sm font-medium tracking-widest">
                    {currentImageIndex + 1} / {allImages.length}
                </div>
            </div>

            <button 
                onClick={nextImage} 
                className="absolute right-4 text-white hover:text-gold-400 p-4 z-20 transition-colors hover:bg-white/5 rounded-full hidden md:block"
            >
                <ChevronRight size={48} />
            </button>
        </div>
      )}
    </div>
  );
};