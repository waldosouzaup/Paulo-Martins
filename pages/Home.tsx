
import React from 'react';
import { Hero } from '../components/Hero';
import { PropertyGrid } from '../components/PropertyGrid';
import { Features } from '../components/Features';
import { SEOHelper } from '../components/SEOHelper';

export const Home: React.FC = () => {
  return (
    <>
      <SEOHelper 
        title="Início" 
        description="Encontre os melhores imóveis em Brasília com Paulo Martins. Casas, apartamentos e coberturas exclusivas nas melhores localizações do Distrito Federal." 
      />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
        <h2 className="text-4xl md:text-6xl font-sans font-bold text-white text-center mb-4 tracking-tight">
          Imóveis em Brasília
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          Selecionamos as melhores oportunidades do Distrito Federal para clientes que buscam qualidade de vida, segurança e localização estratégica na capital.
        </p>
      </div>

      <PropertyGrid limit={4} showTitle={false} />
      
      <section className="bg-dark-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-gold-400 mb-6">Por que escolher Paulo Martins?</h2>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Com registro no CRECI 28.844, Paulo Martins oferece uma consultoria imobiliária de elite, focada na transparência e segurança jurídica para investidores e famílias que buscam residências de alta qualidade em Brasília.
            </p>
        </div>
      </section>

      <Features />
    </>
  );
};
