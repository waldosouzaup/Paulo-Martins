
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, X, ChevronLeft, ChevronRight, MessageCircle, Video, PlayCircle, Check, Share2, Linkedin, Mail, Link, CheckCheck, Printer } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { SEOHelper } from '../components/SEOHelper';
import { formatPropertyTag } from '../lib/utils';

const { useParams } = RouterDom;

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, trackingSettings } = useProperties();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

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
  const whatsappNumber = trackingSettings?.whatsapp_number ? trackingSettings.whatsapp_number.replace(/\D/g, '') : "5561991176958";
  const message = `Estou acessando o site e gostaria de mais informações sobre o imóvel: ${property.title}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Share Configurations
  const shareUrl = `${window.location.origin}/#/property/${property.id}`;
  const shareTitle = `Confira este excelente imóvel: ${property.title}`;
  
  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`;
  const shareLinkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const shareEmail = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareTitle + '\n\nVeja os detalhes aqui:\n' + shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-dark-950 min-h-screen pb-20 print:bg-white text-white print:text-black">
      {/* Container visual da Web (Oculto na Impressão) */}
      <div className="print:hidden">
        <SEOHelper 
          title={property.title} 
        description={property.description ? property.description.slice(0, 160) + '...' : `Confira os detalhes de ${property.title} com o corretor Paulo Martins.`} 
        image={property.imageUrl}
        urlPath={`/#/property/${property.id}`}
      />
      
      <div className="relative h-[60vh] md:h-[70vh] group/hero overflow-hidden bg-black">
        {/* Back to listing button aligned with content grid */}
        <div className="absolute top-24 left-0 right-0 px-6 z-20">
          <div className="max-w-7xl mx-auto">
            <RouterDom.Link 
              to="/properties"
              className="inline-flex items-center gap-2 bg-black/60 hover:bg-gold-500 text-white hover:text-black hover:border-transparent px-4 py-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 font-medium text-xs tracking-wider uppercase shadow-lg hover:scale-105 cursor-pointer"
              id="back-to-listing-btn"
            >
              <ChevronLeft size={14} />
              Voltar para listagem
            </RouterDom.Link>
          </div>
        </div>
        {/* Main Hero Image */}
        <img 
          src={allImages[heroImageIndex]} 
          alt={property.title} 
          className="w-full h-full object-cover cursor-pointer transition-all duration-700 ease-out hover:scale-[1.02]" 
          onClick={() => {
            setCurrentImageIndex(heroImageIndex);
            setLightboxOpen(true);
          }} 
        />
        
        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-black/20 to-black/30 pointer-events-none"></div>

        {/* Carousel Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button 
              id="hero-carousel-prev"
              onClick={(e) => {
                e.stopPropagation();
                setHeroImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-[#c5a028] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg group-hover/hero:translate-x-1 lg:opacity-0 lg:group-hover/hero:opacity-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              id="hero-carousel-next"
              onClick={(e) => {
                e.stopPropagation();
                setHeroImageIndex((prev) => (prev + 1) % allImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 hover:bg-[#c5a028] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg group-hover/hero:-translate-x-1 lg:opacity-0 lg:group-hover/hero:opacity-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Info & Badges aligned with design */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:pb-12 pointer-events-none z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <span className="bg-gold-600 text-white text-[10px] font-bold px-3 py-1 rounded mb-4 inline-block uppercase tracking-widest pointer-events-auto shadow-md">
                      {formatPropertyTag(property.tag)}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 drop-shadow-md">{property.title}</h1>
                    <div className="flex items-center text-gray-300"><MapPin size={18} className="text-gold-400 mr-2 flex-shrink-0" />{property.location}</div>
                </div>
                {allImages.length > 1 && (
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-gold-400 font-medium tracking-wider align-middle self-start md:self-auto pointer-events-auto">
                    {heroImageIndex + 1} / {allImages.length}
                  </span>
                )}
            </div>
        </div>
      </div>

      {/* Hero Carousel Thumbnails */}
      {allImages.length > 1 && (
        <div id="hero-carousel-thumbnails" className="bg-[#080808] border-b border-white/5 py-4 px-6 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gold-600/50 scrollbar-track-transparent">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                id={`hero-thumbnail-${idx}`}
                onClick={() => setHeroImageIndex(idx)}
                className={`relative aspect-[16/10] w-20 md:w-28 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer shadow-md ${
                  heroImageIndex === idx 
                    ? 'border-gold-500 scale-95 ring-2 ring-gold-500/30' 
                    : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                }`}
              >
                <img src={img} className="w-full h-full object-cover pointer-events-none" alt={`Miniatura ${idx + 1}`} />
                <div className={`absolute inset-0 ${heroImageIndex === idx ? 'bg-transparent' : 'bg-black/20 hover:bg-transparent'} transition-colors duration-200`} />
              </button>
            ))}
          </div>
        </div>
      )}

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

                {/* Botão para Imprimir Ficha Técnica do Imóvel */}
                <button
                  id="print-sheet-button"
                  onClick={() => window.print()}
                  className="mt-4 inline-flex items-center justify-center gap-3 w-full bg-transparent hover:bg-white/[0.04] text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/60 font-medium py-3.5 rounded-2xl transition-all duration-300 shadow-md cursor-pointer"
                  title="Gerar PDF ou Imprimir Ficha"
                >
                  <Printer size={16} />
                  <span className="text-xs uppercase tracking-widest">Imprimir Ficha</span>
                </button>

                {/* Compartilhamento de Redes Sociais */}
                <div className="mt-6 pt-6 border-t border-white/5 text-left">
                  <p className="text-gray-400 text-xs font-medium tracking-wide mb-3 flex items-center gap-2">
                    <Share2 size={14} className="text-gold-400" />
                    Compartilhar Imóvel
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {/* WhatsApp */}
                    <a
                      id="share-whatsapp"
                      href={shareWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-gray-300 hover:text-[#25D366] transition-all group/share"
                      title="Compartilhar no WhatsApp"
                    >
                      <MessageCircle size={18} className="transition-transform duration-200 group-hover/share:scale-110" />
                      <span className="text-[9px] uppercase tracking-wide mt-1.5 opacity-60 group-hover/share:opacity-100">WhatsApp</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      id="share-linkedin"
                      href={shareLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-gray-300 hover:text-[#0077b5] transition-all group/share"
                      title="Compartilhar no LinkedIn"
                    >
                      <Linkedin size={18} className="transition-transform duration-200 group-hover/share:scale-110" />
                      <span className="text-[9px] uppercase tracking-wide mt-1.5 opacity-60 group-hover/share:opacity-100">LinkedIn</span>
                    </a>

                    {/* E-mail */}
                    <a
                      id="share-email"
                      href={shareEmail}
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-gray-300 hover:text-gold-400 transition-all group/share"
                      title="Compartilhar por E-mail"
                    >
                      <Mail size={18} className="transition-transform duration-200 group-hover/share:scale-110" />
                      <span className="text-[9px] uppercase tracking-wide mt-1.5 opacity-60 group-hover/share:opacity-100">E-mail</span>
                    </a>

                    {/* Copiar Link */}
                    <button
                      id="share-copy-link"
                      onClick={handleCopyLink}
                      className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 text-gray-300 hover:text-gold-400 transition-all group/share cursor-pointer"
                      title="Copiar Link para Área de Transferência"
                    >
                      {copied ? (
                        <CheckCheck size={18} className="text-[#25D366] transition-transform duration-200 scale-110" />
                      ) : (
                        <Link size={18} className="transition-transform duration-200 group-hover/share:scale-110" />
                      )}
                      <span className={`text-[9px] uppercase tracking-wide mt-1.5 ${copied ? 'text-[#25D366]' : 'opacity-60'} group-hover/share:opacity-100`}>
                        {copied ? 'Copiado!' : 'Copiar'}
                      </span>
                    </button>
                  </div>
                </div>
                
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

      {/* Versão Exclusiva para Impressão / PDF */}
      <div className="hidden print:block bg-white text-black p-8 font-sans max-w-4xl mx-auto">
        {/* Cabeçalho do Relatório */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-slate-950 leading-none tracking-tight">PAULO MARTINS</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#a37e17] uppercase mt-1 font-bold">Consultoria Imobiliária de Alto Padrão</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">Ficha Técnica do Imóvel</p>
            <p className="text-[10px] text-slate-500 font-mono">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="mb-6">
          <div className="mb-3">
            <span className="bg-slate-100 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded inline-block uppercase tracking-wider mb-2 border border-slate-200">
              {formatPropertyTag(property.tag)}
            </span>
            <h2 className="text-2xl font-serif text-slate-950 font-bold">{property.title}</h2>
          </div>
          <p className="text-xs text-slate-700 flex items-center gap-1.5 font-light">
            <MapPin size={12} className="text-slate-500 shrink-0" />
            {property.location}
          </p>
        </div>

        {/* Imagem Principal */}
        <div className="mb-8 rounded-xl overflow-hidden border border-slate-300 shadow-sm max-h-[350px]">
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-[350px] object-cover" 
          />
        </div>

        {/* Grade de Especificações Técnicas */}
        <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-200 mb-8">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold mb-1">Dormitórios</p>
            <p className="text-base font-bold text-slate-800 flex items-center justify-center gap-2">
              <BedDouble size={16} className="text-[#a37e17]" />
              {property.beds} {Number(property.beds) === 1 ? 'Suíte' : 'Suítes'}
            </p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold mb-1">Vagas de Garagem</p>
            <p className="text-base font-bold text-slate-800 flex items-center justify-center gap-2">
              <Car size={16} className="text-[#a37e17]" />
              {property.parking} {Number(property.parking) === 1 ? 'Vaga' : 'Vagas'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold mb-1">Área Privativa</p>
            <p className="text-base font-bold text-slate-800 flex items-center justify-center gap-2">
              <Scaling size={16} className="text-[#a37e17]" />
              {property.area}
            </p>
          </div>
        </div>

        {/* Descrição Longa */}
        <div className="mb-8">
          <h3 className="text-base font-serif text-slate-950 font-semibold border-b border-slate-200 pb-2 mb-4">Descrição do Imóvel</h3>
          <p className="text-slate-800 leading-relaxed text-xs whitespace-pre-wrap font-light">
            {property.description}
          </p>
        </div>

        {/* Características e Diferenciais */}
        {property.features && property.features.length > 0 && (
          <div className="mb-10 page-break-inside-avoid">
            <h3 className="text-base font-serif text-slate-950 font-semibold border-b border-slate-200 pb-2 mb-4">Diferenciais da Residência</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-800">
                  <Check size={12} className="text-[#a37e17] shrink-0" />
                  <span className="text-[11px] font-light tracking-wide">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé de Encerramento e Contato */}
        <div className="mt-12 pt-8 border-t-2 border-slate-900 flex justify-between items-center page-break-inside-avoid text-xs text-slate-600">
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">Paulo Martins Corretor de Imóveis</p>
            <p className="font-light mt-0.5">Atendimento Exclusivo sob Agendamento</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-900">Telefone / WhatsApp: (61) 99117-6958</p>
            <p className="font-light mt-0.5 text-[10px]">paulomartinscorretor.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );
};
