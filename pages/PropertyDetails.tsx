
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { BedDouble, Car, Scaling, MapPin, X, ChevronLeft, ChevronRight, MessageCircle, Video, PlayCircle, Check, Share2, Linkedin, Mail, Link, CheckCheck, Printer, School, GraduationCap, ShoppingBag, Utensils, HeartPulse, HelpCircle, ChevronDown, ChevronUp, Heart, Download, Loader2, Compass, Landmark, Store, Dumbbell, Coffee, Bus } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { SEOHelper } from '../components/SEOHelper';
import { formatPropertyTag, slugify } from '../lib/utils';
import { NotFound } from './NotFound';
import { jsPDF } from 'jspdf';

const { useParams } = RouterDom;

const imageToBase64 = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timeout = setTimeout(() => {
      resolve(null);
    }, 4500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
          return;
        }
      } catch (e) {
        console.error('Error drawing image to canvas:', e);
      }
      resolve(null);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null);
    };
    img.src = url;
  });
};

export const PropertyDetails: React.FC = () => {
  const { id, idOrSlug } = useParams<{ id?: string; idOrSlug?: string }>();
  const { properties, trackingSettings } = useProperties();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);
  const [floorPlanLightboxOpen, setFloorPlanLightboxOpen] = useState(false);
  const [activeVirtualTourIndex, setActiveVirtualTourIndex] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const identifier = id || idOrSlug;

  const property = properties.find(p => 
    String(p.id) === String(identifier) || 
    p.slug === identifier || 
    (p.title && slugify(p.title) === identifier)
  );

  if (!property) return <NotFound />;

  // Default FAQs for luxury real estate
  const defaultFaqs = [
    {
      question: "Qual o processo para realizar uma visita ao imóvel?",
      answer: "As visitas são realizadas com exclusividade sob agendamento prévio. Você será acompanhado pelo corretor Paulo Martins, que apresentará de forma guiada todos os detalhes técnicos, estruturais e de acabamento da propriedade."
    },
    {
      question: "É possível realizar financiamento bancário ou consórcio?",
      answer: "Sim, nossos imóveis de alto padrão possuem toda a documentação rigorosamente em dia, permitindo financiamento direto com qualquer grande instituição financeira ou o uso de cartas contempladas de consórcio."
    },
    {
      question: "A assessoria jurídica para a escritura está inclusa?",
      answer: "Sim, oferecemos suporte jurídica completo e assessoria cartorária integral durante todo o fluxo da transação de compra, desde a elaboração do compromisso até a lavratura da escritura definitiva."
    }
  ];

  const displayFaqs = property.faqs && property.faqs.length > 0 ? property.faqs : defaultFaqs;

  const parseNearbyItems = (text?: string): string[] => {
    if (!text) return [];
    
    let rawItems: string[] = [];
    if (text.includes('\n')) {
      rawItems = text.split('\n');
    } else if (text.includes(';')) {
      rawItems = text.split(';');
    } else {
      rawItems = text.split(',');
    }
    
    return rawItems
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const renderNearbyContent = (text: string) => {
    const items = parseNearbyItems(text);
    if (items.length === 0) return null;
    if (items.length === 1) {
      return <p className="text-white text-sm font-medium leading-relaxed">{items[0]}</p>;
    }
    return (
      <ul className="space-y-2 mt-2 pl-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-white text-sm font-medium leading-relaxed group">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0 transition-all duration-300 group-hover:scale-125" />
            <span className="text-gray-200 group-hover:text-white transition-colors duration-200">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const hasNearbyInfo = !!(
    property.nearby_school ||
    property.nearby_university ||
    property.nearby_shopping ||
    property.nearby_restaurant ||
    property.nearby_hospital ||
    property.nearby_banks ||
    property.nearby_supermarkets ||
    property.nearby_gyms ||
    property.nearby_bakeries ||
    property.nearby_transport
  );

  const allImages = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  const displayFloorPlans = property.floorPlans && property.floorPlans.length > 0
    ? property.floorPlans
    : (property.floorPlanUrl ? [{ url: property.floorPlanUrl, description: 'Planta do Imóvel' }] : []);

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

  // Helper para obter URL correta do Tour Virtual 360°
  const getVirtualTourEmbedUrl = (url: string) => {
    if (!url) return '';
    // Se já for um iframe, extrair o src
    if (url.includes('<iframe')) {
      const srcMatch = url.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }
    
    // Matterport format: m=xxxx
    if (url.includes('matterport.com') && !url.includes('play.matterport.com') && !url.includes('/show/?m=')) {
      const mMatch = url.match(/[?&]m=([a-zA-Z0-9_-]+)/);
      if (mMatch && mMatch[1]) {
        return `https://my.matterport.com/show/?m=${mMatch[1]}`;
      }
    }

    // Kuula format: collection
    if (url.includes('kuula.co') && !url.includes('/share/')) {
      const collectionMatch = url.match(/(?:kuula\.co\/post\/|kuula\.co\/share\/collection\/|kuula\.co\/share\/|kuula\.co\/explore\/collection\/|kuula\.co\/)([a-zA-Z0-9_-]+)/);
      if (collectionMatch && collectionMatch[1]) {
        return `https://kuula.co/share/collection/${collectionMatch[1]}?fs=1&vr=1&sd=1&thumbs=1`;
      }
    }

    return url;
  };

  // Share Configurations
  const propertySlug = property.slug || (property.title ? slugify(property.title) : property.id);
  const shareUrl = `${window.location.origin}/#/${propertySlug}`;
  const shareTitle = `Confira este excelente imóvel: ${property.title}`;

  // Configuração do WhatsApp
  const whatsappNumber = trackingSettings?.whatsapp_number ? trackingSettings.whatsapp_number.replace(/\D/g, '') : "5561991176958";
  const message = `Olá! Gostaria de receber mais informações sobre o imóvel *${property.title}*.\n\nVeja no link: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`;
  const shareLinkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const shareEmail = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareTitle + '\n\nVeja os detalhes aqui:\n' + shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!property) return;
    if (property.datasheetUrl) {
      window.open(property.datasheetUrl, '_blank');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- PAGE 1: HEADER DESIGN ---
      // Luxury dark header block
      doc.setFillColor(12, 12, 12);
      doc.rect(0, 0, 210, 42, 'F');

      // Golden elegant accent bar inside the header
      doc.setFillColor(197, 160, 40);
      doc.rect(0, 42, 210, 2, 'F');

      // Left Header: Branded luxury name
      doc.setTextColor(197, 160, 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text("PAULO MARTINS", 15, 18);

      doc.setTextColor(160, 160, 160);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text("CONSULTORIA IMOBILIÁRIA EXCLUSIVA", 15, 24);

      // Right Header: Contacts / Dynamic Date
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(8.5);
      doc.text("contato@pmartinsimob.com.br", 195, 17, { align: "right" });
      const displayWhat = trackingSettings?.whatsapp_number || "(61) 99117-6958";
      doc.text(`WhatsApp: ${displayWhat}`, 195, 22, { align: "right" });
      doc.text(`Ficha técnica emitida em: ${new Date().toLocaleDateString('pt-BR')}`, 195, 27, { align: "right" });

      // Start content below header
      let currentY = 56;

      // Property Title
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const wrappedTitle = doc.splitTextToSize(property.title || "", 180);
      doc.text(wrappedTitle, 15, currentY);
      currentY += (wrappedTitle.length * 6.5) + 3;

      // Location Info
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(80, 80, 80);
      doc.text(`Localização: ${property.location || 'Brasília, DF'}`, 15, currentY);
      currentY += 5;

      // Price Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(197, 160, 40);
      const purposeLabel = property.purpose === 'rent' ? 'Locação' : 'Venda';
      doc.text(`${purposeLabel} • ${property.price || 'Preço Sob Consulta'}`, 15, currentY);
      currentY += 8;

      // Divider line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.4);
      doc.line(15, currentY, 195, currentY);
      currentY += 8;

      // Render Primary Photo
      const mainImageUrl = property.imageUrl || (allImages && allImages[0]);
      if (mainImageUrl) {
        try {
          const base64Img = await imageToBase64(mainImageUrl);
          if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 15, currentY, 180, 95);
            currentY += 102;
          }
        } catch (imageErr) {
          console.error("Could not add primary photo to PDF:", imageErr);
        }
      }

      // Details Grid
      doc.setFillColor(248, 248, 248);
      doc.setDrawColor(230, 230, 230);
      doc.roundedRect(15, currentY, 180, 16, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      
      const spaceColWidth = 60;
      doc.text(`Dormitórios: ${property.beds || 'N/A'}`, 15 + 10, currentY + 10.5);
      doc.text(`Vagas / Garagem: ${property.parking || 'N/A'}`, 15 + spaceColWidth + 5, currentY + 10.5);
      doc.text(`Área Privativa: ${property.area || 'N/A'}`, 15 + (spaceColWidth * 2) + 5, currentY + 10.5);
      currentY += 25;

      // "Sobre o Imóvel" Header
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text("Descrição do Imóvel", 15, currentY);
      currentY += 7;

      // Description Text wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      
      const splitDescription = doc.splitTextToSize(property.description || "Nenhuma descrição detalhada disponível.", 180);
      
      const printableBottom = 275;
      const spaceRemainingOnPage1 = printableBottom - currentY;
      const linesThatFitOnPage1 = Math.floor(spaceRemainingOnPage1 / 5);

      if (splitDescription.length > linesThatFitOnPage1 && linesThatFitOnPage1 > 1) {
        const page1Lines = splitDescription.slice(0, linesThatFitOnPage1);
        doc.text(page1Lines, 15, currentY);

        doc.addPage();
        
        doc.setFillColor(12, 12, 12);
        doc.rect(0, 0, 210, 12, 'F');
        doc.setFillColor(197, 160, 40);
        doc.rect(0, 12, 210, 1.5, 'F');

        currentY = 24;

        const page2Lines = splitDescription.slice(linesThatFitOnPage1);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        doc.text(page2Lines, 15, currentY);
        currentY += (page2Lines.length * 5) + 12;
      } else {
        if (spaceRemainingOnPage1 < 25) {
          doc.addPage();
          doc.setFillColor(12, 12, 12);
          doc.rect(0, 0, 210, 12, 'F');
          doc.setFillColor(197, 160, 40);
          doc.rect(0, 12, 210, 1.5, 'F');
          currentY = 24;
        }

        doc.text(splitDescription, 15, currentY);
        currentY += (splitDescription.length * 5) + 12;
      }

      // "Diferenciais"
      if (property.features && property.features.length > 0) {
        if (printableBottom - currentY < 35) {
          doc.addPage();
          doc.setFillColor(12, 12, 12);
          doc.rect(0, 0, 210, 12, 'F');
          doc.setFillColor(197, 160, 40);
          doc.rect(0, 12, 210, 1.5, 'F');
          currentY = 24;
        }

        doc.setTextColor(20, 20, 20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text("Diferenciais do Imóvel", 15, currentY);
        currentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(70, 70, 70);

        const half = Math.ceil(property.features.length / 2);
        for (let i = 0; i < property.features.length; i++) {
          const isLeftColumn = i < half;
          const colX = isLeftColumn ? 22 : 112;
          const indexInCol = isLeftColumn ? i : (i - half);
          const itemY = currentY + (indexInCol * 6.5);

          doc.setFillColor(197, 160, 40);
          doc.circle(colX - 4, itemY - 1.2, 1.2, 'F');

          const wrappedFeat = doc.splitTextToSize(property.features[i], 80);
          doc.text(wrappedFeat, colX, itemY);
        }

        currentY += (half * 6.5) + 12;
      }

      // Add a footer overlay on all created pages
      const totalPages = doc.getNumberOfPages();
      for (let pIdx = 1; pIdx <= totalPages; pIdx++) {
        doc.setPage(pIdx);

        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.4);
        doc.line(15, 285, 195, 285);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text("Paulo Martins Imóveis Autônomos • Brasília, DF | Telefone: (61) 99117-6958", 15, 290);
        
        doc.text(`Página ${pIdx} de ${totalPages}`, 195, 290, { align: "right" });
      }

      const pTitle = property.title ? property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "imovel";
      const proposedFilename = `Ficha_Imovel_${pTitle}.pdf`;
      doc.save(proposedFilename);
    } catch (pdfErr) {
      console.error("Failed to compile or issue PDF:", pdfErr);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-dark-950 min-h-screen pb-20 print:bg-white text-white print:text-black">
      {/* Container visual da Web (Oculto na Impressão) */}
      <div className="print:hidden">
        <SEOHelper 
          title={property.seoTitle || property.title} 
          description={property.seoDescription || (property.description ? property.description.slice(0, 160) + '...' : `Confira os detalhes de ${property.title} com o corretor Paulo Martins.`)} 
          image={property.seoImageUrl || property.imageUrl}
          urlPath={`/#/${propertySlug}`}
        />
      
      <div className="relative h-[60vh] md:h-[70vh] group/hero overflow-hidden bg-black">
        {/* Back to listing button aligned with content grid */}
        <div className="absolute top-24 left-0 right-0 px-6 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <RouterDom.Link 
              to="/properties"
              className="inline-flex items-center gap-2 bg-black/60 hover:bg-gold-500 text-white hover:text-black hover:border-transparent px-4 py-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 font-medium text-xs tracking-wider uppercase shadow-lg hover:scale-105 cursor-pointer"
              id="back-to-listing-btn"
            >
              <ChevronLeft size={14} />
              Voltar para listagem
            </RouterDom.Link>

            <button 
              onClick={() => {
                const isFav = isFavorite(property.id);
                if (isFav) {
                  removeFavorite(property.id);
                } else {
                  addFavorite(property);
                }
              }}
              className="inline-flex items-center gap-2 bg-black/60 hover:bg-white text-white hover:text-black hover:border-transparent px-4 py-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 font-medium text-xs tracking-wider uppercase shadow-lg hover:scale-105 cursor-pointer active:scale-95"
              title={isFavorite(property.id) ? "Remover dos favoritos" : "Salvar nos favoritos"}
            >
              <Heart size={14} className={isFavorite(property.id) ? "fill-gold-500 text-gold-500" : "text-white"} />
              <span className="hidden sm:inline">{isFavorite(property.id) ? "Favoritado" : "Salvar"}</span>
            </button>
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
                    <span className="text-white font-medium text-sm md:text-base leading-tight tracking-wide">
                        {property.beds}
                    </span>
                </div>
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-gold-600/30 transition-all duration-300">
                    <Car size={28} className="text-gold-400 mb-4" />
                    <span className="text-white font-medium text-sm md:text-base leading-tight tracking-wide">
                        {property.parking}
                    </span>
                </div>
                <div className="bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-gold-600/30 transition-all duration-300">
                    <Scaling size={28} className="text-gold-400 mb-4" />
                    <span className="text-white font-medium text-sm md:text-base leading-tight tracking-wide">
                        {property.area}
                    </span>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl text-white font-serif mb-4">Sobre o Imóvel</h2>
                <p className="text-gray-400 leading-relaxed font-light whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Nova Seção: Endereço */}
            {property.address && (
              <div className="mb-12">
                  <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
                      <MapPin size={24} className="text-gold-400" />
                      Endereço
                  </h2>
                  <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin size={18} className="text-gold-400" />
                      </div>
                      <div>
                          <p className="text-white text-base font-light leading-relaxed whitespace-pre-wrap">{property.address}</p>
                          <span className="text-xs text-gray-500 leading-relaxed block mt-1 tracking-wider uppercase font-semibold">
                              {property.location ? `${property.location}` : ''}
                              {property.city ? ` • ${property.city}` : ''}
                          </span>
                      </div>
                  </div>
              </div>
            )}

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

            {/* Nova Seção: Proximidades */}
            {hasNearbyInfo && (
              <div className="mb-12">
                  <h2 className="text-2xl text-white font-serif mb-6">Proximidades</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {property.nearby_school && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <School size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Escola</span>
                              </div>
                              {renderNearbyContent(property.nearby_school)}
                          </div>
                      )}
                      
                      {property.nearby_university && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <GraduationCap size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Faculdade</span>
                              </div>
                              {renderNearbyContent(property.nearby_university)}
                          </div>
                      )}
                      
                      {property.nearby_shopping && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <ShoppingBag size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Shopping</span>
                              </div>
                              {renderNearbyContent(property.nearby_shopping)}
                          </div>
                      )}
                      
                      {property.nearby_restaurant && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Utensils size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Restaurantes</span>
                              </div>
                              {renderNearbyContent(property.nearby_restaurant)}
                          </div>
                      )}
                      
                      {property.nearby_hospital && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <HeartPulse size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Hospitais</span>
                              </div>
                              {renderNearbyContent(property.nearby_hospital)}
                          </div>
                      )}
                      
                      {property.nearby_banks && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Landmark size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Bancos</span>
                              </div>
                              {renderNearbyContent(property.nearby_banks)}
                          </div>
                      )}

                      {property.nearby_supermarkets && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Store size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Supermercados</span>
                              </div>
                              {renderNearbyContent(property.nearby_supermarkets)}
                          </div>
                      )}

                      {property.nearby_gyms && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Dumbbell size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Academias</span>
                              </div>
                              {renderNearbyContent(property.nearby_gyms)}
                          </div>
                      )}

                      {property.nearby_bakeries && (
                          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Coffee size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Padarias</span>
                              </div>
                              {renderNearbyContent(property.nearby_bakeries)}
                          </div>
                      )}

                      {property.nearby_transport && (
                          <div className="bg-[#0c0c0c] border border-[#ffffff]/5 p-6 rounded-xl hover:border-gold-600/30 transition-all duration-300">
                              <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-gold-600/10 flex items-center justify-center">
                                      <Bus size={16} className="text-gold-400" />
                                  </div>
                                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Transporte</span>
                              </div>
                              {renderNearbyContent(property.nearby_transport)}
                          </div>
                      )}
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

            {/* Tour Virtual 360° */}
            {((property.virtualTours && property.virtualTours.length > 0) || property.virtualTourUrl) && (
              <div className="mb-12">
                  <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
                    <Compass size={24} className="text-gold-400" />
                    Tour Virtual 360°
                  </h2>
                  
                  {/* Se houver múltiplos ambientes cadastrados */}
                  {property.virtualTours && property.virtualTours.length > 1 ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                        {property.virtualTours.map((tour, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveVirtualTourIndex(idx)}
                            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                              activeVirtualTourIndex === idx
                                ? 'bg-gold-600 text-white shadow-[0_4px_12px_rgba(197,160,40,0.2)]'
                                : 'bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                            }`}
                          >
                            {tour.title || `Ambiente ${idx+1}`}
                          </button>
                        ))}
                      </div>
                      
                      {property.virtualTours[activeVirtualTourIndex] && (
                        <div className="relative h-[450px] md:h-auto md:aspect-video w-full overflow-hidden rounded-2xl bg-dark-900 border border-white/5 shadow-2xl">
                          <iframe 
                            src={getVirtualTourEmbedUrl(property.virtualTours[activeVirtualTourIndex].url)}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title={`${property.virtualTours[activeVirtualTourIndex].title || 'Ambiente'} - Tour Virtual 360`}
                            frameBorder="0"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback para tour único */
                    <div className="relative h-[450px] md:h-auto md:aspect-video w-full overflow-hidden rounded-2xl bg-dark-900 border border-white/5 shadow-2xl">
                      <iframe 
                        src={getVirtualTourEmbedUrl(property.virtualTours && property.virtualTours.length === 1 ? property.virtualTours[0].url : property.virtualTourUrl!)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={`Tour Virtual 360 - ${property.title}`}
                        frameBorder="0"
                      ></iframe>
                    </div>
                  )}
              </div>
            )}


            {/* Planta do Imóvel */}
            {((property.floorPlans && property.floorPlans.length > 0) || property.floorPlanUrl) && (
              <div className="mb-12" id="property-floor-plan-sec">
                  <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
                    <Scaling size={24} className="text-gold-400" />
                    Planta do Imóvel (Planta Baixa)
                  </h2>
                  
                  {/* Se houver mais de 1 planta cadastrada, renderiza as abas */}
                  {property.floorPlans && property.floorPlans.length > 1 ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                        {property.floorPlans.map((plan, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveFloorPlanIndex(idx)}
                            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                              activeFloorPlanIndex === idx
                                ? 'bg-gold-600 text-white shadow-[0_4px_12px_rgba(197,160,40,0.2)]'
                                : 'bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                            }`}
                          >
                            {plan.description || `Planta #${idx + 1}`}
                          </button>
                        ))}
                      </div>
                      
                      {property.floorPlans[activeFloorPlanIndex] && (
                        <div className="bg-[#0c0c0c] border border-[#d4af37]/10 p-6 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-gold-600/20 transition-all duration-350">
                          <img 
                            src={property.floorPlans[activeFloorPlanIndex].url} 
                            alt={property.floorPlans[activeFloorPlanIndex].description || `Planta ${activeFloorPlanIndex + 1}`} 
                            className="max-h-[500px] w-auto object-contain rounded-xl hover:scale-[1.02] active:scale-[0.98] cursor-zoom-in transition-all duration-300" 
                            id="property-floor-plan-img"
                            title="Clique para ampliar a planta"
                            onClick={() => {
                              setActiveFloorPlanIndex(activeFloorPlanIndex);
                              setFloorPlanLightboxOpen(true);
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-4 font-light text-center">
                            {property.floorPlans[activeFloorPlanIndex].description || `Planta baixa do imóvel.`}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback para visualização de planta única ou legado */
                    <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-gold-600/20 transition-all duration-300">
                      <img 
                        src={(property.floorPlans && property.floorPlans[0]) ? property.floorPlans[0].url : (property.floorPlanUrl || '')} 
                        alt={`Planta para ${property.title}`} 
                        className="max-h-[500px] w-auto object-contain rounded-xl hover:scale-[1.02] active:scale-[0.98] cursor-zoom-in transition-all duration-300" 
                        id="property-floor-plan-img"
                        title="Clique para ampliar a planta"
                        onClick={() => {
                          setActiveFloorPlanIndex(0);
                          setFloorPlanLightboxOpen(true);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-4 font-light text-center">
                        {(property.floorPlans && property.floorPlans[0]?.description) || 'Esboço em corte horizontal e planta técnica simplificada do imóvel.'}
                      </p>
                    </div>
                  )}
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


            {/* Seção Perguntas Frequentes (FAQs) */}
            <div className="mb-12" id="property-faqs-section">
                <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
                  <HelpCircle size={24} className="text-gold-400" />
                  Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                  {displayFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                          isOpen 
                            ? 'bg-[#121212]/30 border-gold-500/35 shadow-[0_5px_15px_rgba(197,160,40,0.05)]' 
                            : 'bg-[#0c0c0c] border-white/5 hover:border-white/10 hover:bg-[#121212]/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none"
                        >
                          <span className="text-sm md:text-base font-semibold text-white tracking-wide">{faq.question}</span>
                          <span className="shrink-0 p-1 bg-white/5 rounded-full text-gold-400 transition-transform duration-300">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        </button>
                        <div 
                          className={`transition-all duration-300 ease-in-out ${
                            isOpen ? 'max-h-[300px] border-t border-white/5' : 'max-h-0'
                          } overflow-hidden`}
                        >
                          <div className="px-6 py-5">
                            <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 sticky top-32 text-center shadow-2xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                


                <h3 className="text-xl text-white font-serif mb-4">Tem Interesse?</h3>
                <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-2 border-gold-500/30 shadow-[0_0_20px_rgba(191,160,84,0.15)] bg-dark-900 group-hover:border-gold-500/60 transition-all duration-300">
                  <img 
                    src={trackingSettings?.broker_image || "https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png"} 
                    alt="Paulo Martins" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0c0c0c] rounded-full animate-pulse" title="Disponível"></div>
                </div>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Fale diretamente comigo para tirar suas dúvidas ou agendar uma visita exclusiva a este imóvel.
                </p>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#1cbd50] hover:from-[#2bdc6e] hover:to-[#22c356] text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(37,211,102,0.35)] hover:shadow-[0_0_45px_rgba(37,211,102,0.6)] hover:-translate-y-1 hover:scale-[1.02] ring-4 ring-[#25D366]/20"
                >
                  <MessageCircle size={24} className="animate-pulse" />
                  <span className="text-sm uppercase tracking-wider">Conversar Agora</span>
                </a>

                {/* Botão para Salvar Ficha Técnica do Imóvel (PDF) */}
                <button
                  id="save-sheet-button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="mt-4 inline-flex items-center justify-center gap-3 w-full bg-gold-600 hover:bg-gold-500 disabled:bg-gold-700/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-gold-600/10 hover:shadow-gold-600/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs uppercase tracking-widest"
                  title={property.datasheetUrl ? "Baixar Ficha Técnica Cadastrada" : "Exportar Ficha Técnica em PDF"}
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Gerando Ficha...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {property.datasheetUrl ? 'Baixar Ficha Completa' : 'Salvar Ficha (PDF)'}
                    </>
                  )}
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

      {floorPlanLightboxOpen && displayFloorPlans.length > 0 && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none" 
          onClick={() => setFloorPlanLightboxOpen(false)}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              
              {/* Imagem Ampliada */}
              <div className="max-h-[80vh] max-w-full flex items-center justify-center flex-1">
                <img 
                  src={displayFloorPlans[activeFloorPlanIndex]?.url} 
                  className="max-h-[75vh] max-w-full object-contain pointer-events-auto rounded-lg shadow-2xl" 
                  alt={displayFloorPlans[activeFloorPlanIndex]?.description || "Planta do Imóvel Ampliada"} 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Botões de Navegação Anterior / Próximo (só se houver mais de 1 planta) */}
              {displayFloorPlans.length > 1 && (
                <>
                  <button 
                    className="absolute right-4 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110] cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setActiveFloorPlanIndex((p) => (p + 1) % displayFloorPlans.length);
                    }}
                  >
                    <ChevronRight size={48}/>
                  </button>
                  
                  <button 
                    className="absolute left-4 md:left-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110] cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setActiveFloorPlanIndex((p) => (p - 1 + displayFloorPlans.length) % displayFloorPlans.length);
                    }}
                  >
                    <ChevronLeft size={48}/>
                  </button>
                </>
              )}
              
              {/* Botão Fechar */}
              <button 
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110] cursor-pointer" 
                onClick={() => setFloorPlanLightboxOpen(false)}
              >
                <X size={32}/>
              </button>

              {/* Legenda/Footer da planta em destaque */}
              <div className="absolute bottom-8 left-4 right-4 text-center space-y-2 pointer-events-none">
                {displayFloorPlans[activeFloorPlanIndex]?.description && (
                  <p className="text-gold-400 font-serif text-sm md:text-base tracking-wide drop-shadow-md">
                    {displayFloorPlans[activeFloorPlanIndex].description}
                  </p>
                )}
                {displayFloorPlans.length > 1 && (
                  <div className="text-white/60 text-xs font-mono tracking-widest uppercase">
                    Planta {activeFloorPlanIndex + 1} de {displayFloorPlans.length}
                  </div>
                )}
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
