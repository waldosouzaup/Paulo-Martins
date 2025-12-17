
import React, { useEffect } from 'react';
import { Instagram } from 'lucide-react';
import * as RouterDom from 'react-router-dom';

const { Link } = RouterDom;

export const Footer: React.FC = () => {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Paulo Martins Imóveis",
      "image": "https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png",
      "@id": "https://pmartinsimob.com.br",
      "url": "https://pmartinsimob.com.br",
      "telephone": "+5561991176958",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Brasília",
        "addressRegion": "DF",
        "addressCountry": "BR"
      },
      "priceRange": "$$$$"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }, []);

  return (
    <footer className="bg-dark-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-serif text-gold-400 font-bold tracking-tighter">PM</span>
              <div className="flex flex-col leading-none border-l border-white/20 pl-3">
                <span className="text-sm font-bold tracking-widest uppercase text-white">Paulo Martins</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">CRECI 28.844</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Especialista em mercado imobiliário de alto padrão. Atendimento personalizado para compra e venda de imóveis em Brasília.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-medium mb-6">Institucional</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Início</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">Sobre Paulo Martins</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-medium mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/properties" className="hover:text-gold-400 transition-colors">Todos os Imóveis</Link></li>
              <li><Link to="/properties?city=Brasília" className="hover:text-gold-400 transition-colors">Imóveis em Brasília</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-medium mb-6">Contatos</h4>
            <ul className="space-y-3 text-sm text-gray-400 mb-6">
              <li>Brasília, DF</li>
              <li><a href="https://wa.me/5561991176958" target="_blank" className="hover:text-gold-400 transition-colors">+55 (61) 9 9117-6958</a></li>
            </ul>
            <div className="flex gap-4">
               <a href="https://wa.me/5561991176958" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold-400 hover:bg-gold-600 hover:text-white transition-all">
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold-400 hover:bg-gold-600 hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2026 Paulo Martins Corretor. Imóveis de Luxo em Brasília.</p>
          <p>Criado por <a href="https://www.linkedin.com/in/waldoeller/" target="_blank" className="hover:text-gold-400 transition-colors">Waldo Eller</a></p>
        </div>
      </div>
    </footer>
  );
};
