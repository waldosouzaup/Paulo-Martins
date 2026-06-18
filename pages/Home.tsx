
import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturedProperty } from '../components/FeaturedProperty';
import { PropertyGrid } from '../components/PropertyGrid';
import { Features } from '../components/Features';
import { SEOHelper } from '../components/SEOHelper';
import { PropertyAlerts } from '../components/PropertyAlerts';
import { GoogleReviews } from '../components/GoogleReviews';
import { useProperties } from '../context/PropertyContext';
import { Award, ShieldCheck, Star } from 'lucide-react';

export const Home: React.FC = () => {
  const { trackingSettings } = useProperties();
  const brokerImg = trackingSettings?.broker_image || 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png';

  return (
    <>
      <SEOHelper 
        title="" 
        description="Encontre os melhores imóveis em Brasília com Paulo Martins. Casas, apartamentos e coberturas exclusivas nas melhores localizações do Distrito Federal." 
        image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=630&q=80"
        urlPath="/"
      />
      <Hero />
      
      <FeaturedProperty />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-white text-center mb-4 tracking-tight">
          Imóveis em Brasília
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          Selecionamos as melhores oportunidades do Distrito Federal para clientes que buscam qualidade de vida, segurança e localização estratégica na capital.
        </p>
      </div>

      <PropertyGrid limit={4} showTitle={false} />
      
      <section className="bg-dark-900 py-24 px-6 border-y border-white/5 relative overflow-hidden">
        {/* Subtle glowing gold background effect */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-600/5 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Broker Photo Container */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-[340px] md:max-w-sm">
                {/* Decorative border frame */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-b from-gold-500/20 via-transparent to-gold-500/20 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image layer */}
                <div className="relative bg-dark-950/80 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.01] hover:border-gold-500/30">
                  <img 
                    src={brokerImg} 
                    alt="Paulo Martins - Corretor de Imóveis" 
                    className="w-full h-auto object-cover max-h-[480px] bg-dark-950/40 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle luxurious overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent"></div>
                  
                  {/* Embedded Credentials Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-dark-900/90 backdrop-blur-md border border-white/5 py-3 px-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-white font-serif text-sm font-semibold">Paulo Martins</p>
                      <p className="text-gold-400 text-[10px] uppercase tracking-wider font-mono">CRECI DF: 28.844</p>
                    </div>
                    <Award size={20} className="text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory Content block */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest">
                <Star size={12} className="fill-gold-400" /> Consultor Imobiliário de Brasília
              </span>
              
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                Por que escolher <br className="hidden md:inline" />
                <span className="text-gold-400">Paulo Martins?</span>
              </h2>
              
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                Com uma trajetória marcada pela excelência e o registro profissional <strong>CRECI 28.844</strong>, assessoro investidores e famílias exigentes a realizarem aquisições imobiliárias seguras e bem-sucedidas nas regiões mais nobres de Brasília e Distrito Federal.
              </p>

              <div className="h-px bg-white/5 my-4"></div>

              {/* Value Propositions columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400 mt-1 shrink-0">
                    <ShieldCheck size={12} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-0.5">Segurança Jurídica</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">Análise detalhada de toda a documentação para uma transação 100% segura.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400 mt-1 shrink-0">
                    <ShieldCheck size={12} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-0.5">Foco Exclusivo</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">Atendimento personalizado focado em entender suas exatas necessidades.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {trackingSettings?.show_google_reviews !== false && <GoogleReviews />}

      <section className="py-20 px-6 bg-dark-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Radar de Imóveis Exclusivos</h2>
            <p className="text-gray-400 font-light max-w-xl mx-auto text-sm">
              Não encontrou o que procura? Configure suas preferências em 10 segundos e seja alertado assim que uma oportunidade perfeita der entrada no catálogo de Paulo Martins.
            </p>
          </div>
          <PropertyAlerts />
        </div>
      </section>

      <Features />
    </>
  );
};
