import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  project: string;
}

export const GoogleReviews: React.FC = () => {
  const { language } = useLanguage();

  const reviews: Review[] = [
    {
      name: "Marcos de Souza",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      date: language === 'en' ? "2 weeks ago" : language === 'es' ? "Hace 2 semanas" : "Há 2 semanas",
      comment: language === 'en' 
        ? "Excellent service! Paulo Martins is highly professional, transparent, and attentive. Guided the entire negotiation of our penthouse with absolute legal security." 
        : language === 'es'
        ? "¡Excelente servicio! Paulo Martins é extremadamente profesional, transparente y atento. Dirigió toda la negociación de nuestro ático con absoluta seguridad jurídica."
        : "Excelente atendimento! O Paulo Martins é extremamente profissional, transparente e atencioso. Conduziu toda a negociação da nossa cobertura no Noroeste com total segurança jurídica.",
      project: "Cobertura Noroeste"
    },
    {
      name: "Amanda Rodrigues",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      date: language === 'en' ? "1 month ago" : language === 'es' ? "Hace 1 mes" : "Há 1 mês",
      comment: language === 'en'
        ? "I bought an apartment in Águas Claras with Paulo's advisory and highly recommend him. He deeply understands the Brasília market, and his tips were key to making a great deal."
        : language === 'es'
        ? "Compré un apartamento en Águas Claras con la asesoría de Paulo y lo recomiendo altamente. Conoce muy bien el mercado de Brasilia, y sus consejos fueron clave."
        : "Comprei um apartamento em Águas Claras com a assessoria do Paulo e recomendo a todos. Ele entende muito do mercado de Brasília, as dicas foram fundamentais para fazermos um ótimo negócio.",
      project: "Apartamento Águas Claras"
    },
    {
      name: "Dr. Roberto Mendes",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      date: language === 'en' ? "3 months ago" : language === 'es' ? "Hace 3 meses" : "Há 3 meses",
      comment: language === 'en'
        ? "High-end consultative advisory service. Paulo demonstrated solid market knowledge and impeccable ethics in the acquisition of our commercial office spaces."
        : language === 'es'
        ? "Servicio de asesoramiento consultivo de alta gama. Paulo demostró un sólido conocimiento del mercado y una ética impecable en la adquisición de nuestras oficinas."
        : "Atendimento consultivo diferenciado de alto padrão. O Paulo demonstrou grande conhecimento de mercado e ética impecável na aquisição de nossas salas comerciais. Altamente recomendado!",
      project: "Salas Comerciais Asa Sul"
    },
    {
      name: "Patrícia Rezende",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      date: language === 'en' ? "2 months ago" : language === 'es' ? "Hace 2 meses" : "Há 2 meses",
      comment: language === 'en'
        ? "Excellent professional! Extremely patient in understanding our family's profile and finding the perfect house in Lago Sul. Guided us through all documentation smoothly."
        : language === 'es'
        ? "¡Excelente profesional! Muy paciente para entender el perfil de nuestra familia y encontrar la casa perfecta en Lago Sul. Condujo todo el proceso de manera impecable."
        : "Excelente profissional! Muito paciente para entender o perfil da minha família e encontrar a casa perfeita no Lago Sul. Todo o processo de documentação do CRECI foi muito bem amparado.",
      project: "Casa Lago Sul"
    }
  ];

  return (
    <section className="bg-dark-950 py-24 px-6 border-b border-white/5 relative overflow-hidden" id="google-reviews-section">
      {/* Background glow effects */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-gold-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Core Ranking Header Card */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {language === 'en' ? "Verified Google Reviews" : language === 'es' ? "Opiniones verificadas de Google" : "Avaliações Reais no Google"}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              {language === 'en' ? "What our clients say" : language === 'es' ? "Lo que dicen nuestros clientes" : "O que dizem os nossos clientes"}
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl font-light">
              {language === 'en' 
                ? "Transparency and commitment result in client satisfaction. Read honest opinions directly from Google Business Profile."
                : language === 'es'
                ? "La transparencia y el compromiso dan como resultado la satisfacción del cliente. Lea opiniones reales directo de Google."
                : "A transparência e o compromisso resultam na satisfação de quem realiza o sonho do imóvel ideal conosco."}
            </p>
          </div>

          {/* Consolidated google score */}
          <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-2xl flex items-center gap-6 md:self-stretch min-w-[280px]">
            <div className="text-center">
              <p className="text-4xl font-bold text-white tracking-tight">5.0</p>
              <div className="flex gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 font-mono">
                {language === 'en' ? "Google Rating" : language === 'es' ? "Rating de Google" : "Nota no Google"}
              </p>
            </div>
            
            <div className="h-12 w-px bg-white/5"></div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-white uppercase tracking-wider font-sans bg-white/5 px-2 py-0.5 rounded border border-white/5">Google</span>
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400 flex items-center justify-center text-[7px] text-black font-extrabold">&#10003;</span>
              </div>
              <p className="text-xs text-gray-400 font-light">
                {language === 'en' ? "Excellent based on client reviews" : language === 'es' ? "Excelente según comentarios" : "Excelente com base nas avaliações"}
              </p>
              <a 
                href="https://share.google/NNUU9Rw2bQp5D37fU" 
                target="_blank" 
                rel="noopener noreferrer" 
                referrerPolicy="no-referrer"
                className="text-gold-400 font-mono text-[10px] hover:underline flex items-center gap-1 transition-all"
              >
                {language === 'en' ? "View Official Profile" : language === 'es' ? "Ver Perfil Oficial" : "Ver Perfil Oficial"} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Testimonials Grid block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, idx) => (
            <div 
              key={idx} 
              className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-gold-500/20 group hover:translate-y-[-2px] relative"
            >
              {/* Star line & quote icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} className="fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <MessageSquare size={14} className="text-white/10 group-hover:text-gold-500/20 transition-colors" />
              </div>

              {/* Review Text */}
              <p className="text-gray-300 text-[13px] leading-relaxed font-light flex-1 mb-6 italic">
                "{review.comment}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{review.name}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5 flex items-center gap-1.5 font-mono">
                    <span>{review.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-gold-400">{review.project}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link to Google Business Reviews */}
        <div className="mt-16 text-center">
          <a 
            href="https://share.google/NNUU9Rw2bQp5D37fU" 
            target="_blank" 
            rel="noopener noreferrer" 
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0c0c0c] border border-white/10 text-gray-300 hover:text-white hover:border-gold-500/30 font-medium text-sm transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_30px_rgba(197,160,40,0.05)] cursor-pointer"
          >
            <span className="text-[14px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-400 to-yellow-500 mr-1 select-none">G</span>
            {language === 'en' ? "Read more reviews on Google" : language === 'es' ? "Leer más comentarios en Google" : "Ler mais avaliações no Google"}
          </a>
        </div>

      </div>
    </section>
  );
};
