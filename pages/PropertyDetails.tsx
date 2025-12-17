
import React, { useEffect, useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, Check, Heart, ArrowLeft, Share2, X, ChevronLeft, ChevronRight, PlayCircle, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { SEOHelper } from '../components/SEOHelper';
import { supabase } from '../lib/supabase';

const { useParams, Link } = RouterDom;

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { properties } = useProperties();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });

  const property = properties.find(p => p.id === id);

  useEffect(() => {
    if (property) {
      const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "image": property.imageUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.city,
          "addressRegion": "DF",
          "addressCountry": "BR"
        },
        "offers": {
          "@type": "Offer",
          "price": property.price.replace(/[^\d]/g, ''),
          "priceCurrency": "BRL"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      script.id = 'json-ld-property';
      document.head.appendChild(script);

      return () => {
        const oldScript = document.getElementById('json-ld-property');
        if (oldScript) oldScript.remove();
      };
    }
  }, [property]);

  const allImages = property 
    ? (property.images && property.images.length > 0 ? property.images : [property.imageUrl]) 
    : [];
  const displayImages = allImages.slice(0, 8);

  if (!property) return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
      <h2 className="text-2xl text-white mb-4">Imóvel não encontrado</h2>
      <Link to="/properties" className="text-gold-400 hover:text-white transition-colors">Voltar para a lista</Link>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      // 1. Salvar no Supabase
      const { error: sbError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.nome,
          phone: formData.telefone,
          email: formData.email,
          message: formData.mensagem,
          property_id: property.id,
          source: `Interesse: ${property.title}`
        }]);

      // 2. Notificar via Formspree (Removido o e-mail da URL que causa erro)
      const response = await fetch('https://formspree.io/f/upconversiondigital', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...formData, _subject: `Interesse: ${property.title}` })
      });

      if (response.ok || !sbError) {
        setFormStatus('success');
        setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
      } else {
        setFormStatus('error');
      }
    } catch { setFormStatus('error'); }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch?.[1]) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`;
    return url.includes('embed') ? url : null;
  };

  return (
    <div className="bg-dark-950 min-h-screen pb-20">
      <SEOHelper title={property.title} description={`Confira detalhes de ${property.title} em ${property.location}. ${property.description?.substring(0, 100)}...`} />
      
      <div className="relative h-[60vh] md:h-[70vh]">
        <img src={property.imageUrl} alt={`${property.title} - Fachada principal`} className="w-full h-full object-cover cursor-pointer" onClick={() => setLightboxOpen(true)} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="inline-block bg-gold-600 text-white text-xs font-bold px-3 py-1 rounded mb-4 tracking-widest uppercase">{property.tag}</div>
                <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 max-w-4xl leading-tight">{property.title}</h1>
                <div className="flex items-center text-gray-300 text-lg"><MapPin size={20} className="text-gold-400 mr-2" />{property.location}</div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8 mb-8">
                <div className="flex flex-col items-center p-4 bg-dark-900 rounded-lg">
                    <BedDouble size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.beds}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-dark-900 rounded-lg">
                    <Car size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.parking}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-dark-900 rounded-lg">
                    <Scaling size={24} className="text-gold-400 mb-2" />
                    <span className="text-white font-medium">{property.area}</span>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Descrição do Imóvel</h2>
                <p className="text-gray-400 leading-relaxed text-lg font-light whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-6">Diferenciais e Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features?.map((f, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                            <Check size={18} className="text-gold-400 mr-3" /> {f}
                        </div>
                    ))}
                </div>
            </div>

            {property.videoUrl && (
                <div className="mb-12">
                    <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-2"><PlayCircle className="text-gold-400" /> Vídeo do Imóvel</h2>
                    <div className="aspect-video bg-dark-900 rounded-2xl overflow-hidden border border-white/5">
                        <iframe src={getEmbedUrl(property.videoUrl) || ''} className="w-full h-full" allowFullScreen></iframe>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl text-white font-serif mb-6">Galeria de Fotos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayImages.map((img, idx) => (
                        <div key={idx} className="aspect-[16/10] overflow-hidden rounded-xl border border-white/5 cursor-pointer" onClick={() => {setCurrentImageIndex(idx); setLightboxOpen(true);}}>
                            <img src={img} alt={`${property.title} - Foto ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 sticky top-32">
                <h3 className="text-xl text-gold-400 font-serif mb-6">Solicitar Informações</h3>
                {formStatus === 'success' ? (
                  <div className="text-center py-8"><CheckCircle size={48} className="text-green-500 mx-auto mb-4" /><p className="text-white">Consulta enviada com sucesso!</p></div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Nome</label>
                      <input required name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Seu nome" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-gold-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email</label>
                      <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="seu@email.com" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-gold-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Telefone</label>
                      <input required name="telefone" value={formData.telefone} onChange={handleInputChange} type="tel" placeholder="(61) 9..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-gold-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mensagem</label>
                      <textarea required name="mensagem" value={formData.mensagem} onChange={handleInputChange} rows={4} placeholder="Tenho interesse neste imóvel..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-gold-500 outline-none resize-none" />
                    </div>

                    {formStatus === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle size={16} /> Erro ao enviar. Tente o WhatsApp.
                      </div>
                    )}

                    <button type="submit" disabled={formStatus === 'loading'} className="w-full bg-gold-600 hover:bg-gold-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition-all">
                        {formStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Agendar Visita'}
                    </button>
                    
                    <a href={`https://wa.me/5561991176958?text=Olá, tenho interesse no imóvel: ${property.title}`} target="_blank" className="block text-center text-xs text-gray-500 hover:text-gold-400 transition-colors mt-4">
                      Ou fale agora pelo WhatsApp
                    </a>
                  </form>
                )}
            </div>
          </aside>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <img src={allImages[currentImageIndex]} className="max-h-[90vh] max-w-full object-contain" />
            <button className="absolute right-4 text-white" onClick={(e) => {e.stopPropagation(); setCurrentImageIndex((p) => (p + 1) % allImages.length);}}><ChevronRight size={48}/></button>
            <button className="absolute left-4 text-white" onClick={(e) => {e.stopPropagation(); setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length);}}><ChevronLeft size={48}/></button>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxOpen(false)}><X size={32}/></button>
        </div>
      )}
    </div>
  );
};
