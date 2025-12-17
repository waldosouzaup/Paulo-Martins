
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
        description="Encontre imóveis de luxo em Brasília com Paulo Martins. Mansões, apartamentos e coberturas exclusivas nas melhores localizações como Asa Sul e Lago Sul." 
      />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <h2 className="text-3xl md:text-5xl font-serif text-white text-center mb-2">Imóveis de Luxo em Brasília</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Selectionamos as propriedades mais exclusivas do Distrito Federal para clientes que não abrem mão de sofisticação e localização privilegiada.
        </p>
      </div>

      <PropertyGrid limit={4} showTitle={false} />
      
      <section className="bg-dark-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-gold-400 mb-6">Por que escolher Paulo Martins?</h2>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Com registro no CRECI 28.844, Paulo Martins oferece uma consultoria imobiliária de elite, focada na transparência e segurança jurídica para investidores e famílias que buscam residências de alto padrão em Brasília.
            </p>
        </div>
      </section>

      <Features />
    </>
  );
};
