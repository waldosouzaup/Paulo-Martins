
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

const { useNavigate } = RouterDom;

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [purpose, setPurpose] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique cities from properties
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    properties.forEach(prop => {
        if (prop.city) {
            cities.add(prop.city.trim());
        }
    });
    return Array.from(cities).sort();
  }, [properties]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (purpose && purpose !== 'Finalidade') params.append('purpose', purpose);
    if (type && type !== 'Tipo de Imóvel') params.append('type', type);
    if (city && city !== 'Cidade') params.append('city', city);
    if (searchQuery) params.append('query', searchQuery);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen md:min-h-[110vh] flex flex-col justify-center items-center overflow-hidden bg-dark-950">
      {/* Background Image - Updated to a more stable Brasília High-Res Image (Catedral) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1599427303058-f16cb9fc8568?q=80&w=2070&auto=format&fit=crop"
          alt="Brasília - Arquitetura Icônica"
          loading="eager"
          className="w-full h-full object-cover object-center scale-105 opacity-50"
        />
        {/* Gradient Overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-32"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-16 md:mt-10">
        
        {/* Hero Text */}
        <div className="mb-8 md:mb-16 max-w-3xl animate-fade-in-up">
          <h1 className="text-[2.6rem] md:text-7xl font-sans font-bold text-white leading-tight mb-4 md:mb-6">
            Os Melhores Imóveis <br />
            <span className="text-white/90">da Região de Brasília</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 font-light tracking-wide border-l-2 border-gold-500 pl-4">
            Para morar ou investir, temos a melhor opção para você
          </p>
        </div>

        {/* Search Widget */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 max-w-5xl shadow-2xl shadow-black/50 transform md:translate-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Dropdown 1: Finalidade */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-400">
                <ChevronDown size={16} />
              </div>
              <select 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer hover:bg-white/10 text-sm"
              >
                <option className="bg-dark-900" value="">Finalidade</option>
                <option className="bg-dark-900" value="Venda">Comprar</option>
                <option className="bg-dark-900" value="Aluguel">Alugar</option>
              </select>
            </div>

            {/* Dropdown 2: Tipo de Imóvel */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-400">
                <ChevronDown size={16} />
              </div>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer hover:bg-white/10 text-sm"
              >
                <option className="bg-dark-900" value="">Tipo de Imóvel</option>
                <option className="bg-dark-900" value="Casa">Casa</option>
                <option className="bg-dark-900" value="Apartamento">Apartamento</option>
                <option className="bg-dark-900" value="Cobertura">Cobertura</option>
              </select>
            </div>

             {/* Dropdown 3: Cidade */}
             <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-400">
                <ChevronDown size={16} />
              </div>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer hover:bg-white/10 text-sm"
              >
                <option className="bg-dark-900" value="">Cidade</option>
                {availableCities.map(c => (
                    <option key={c} className="bg-dark-900" value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Button */}
            <div className="md:col-span-3">
              <button 
                onClick={handleSearch}
                className="w-full h-12 md:h-14 bg-gold-600 hover:bg-gold-500 text-white font-medium rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(197,160,40,0.3)] hover:shadow-[0_0_30px_rgba(197,160,40,0.5)] flex items-center justify-center gap-2"
              >
                Buscar Imóveis
              </button>
            </div>

            {/* Search Input Row */}
            <div className="md:col-span-12 mt-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Busque por palavra-chave, código ou localização..."
                        className="w-full h-10 md:h-12 bg-transparent border-b border-white/10 text-white pl-12 focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-500 font-light text-sm"
                    />
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
