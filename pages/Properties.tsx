
import React, { useState, useEffect, useMemo } from 'react';
import { PropertyGrid } from '../components/PropertyGrid';
import { PropertyAlerts } from '../components/PropertyAlerts';
import { useProperties } from '../context/PropertyContext';
import { SearchX, HelpCircle } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';

const { useSearchParams, Link } = RouterDom;

export const Properties: React.FC = () => {
  const { properties } = useProperties();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchParams] = useSearchParams();

  // Dynamic filters generation based on available properties
  const filters = useMemo(() => {
    const locations = new Set<string>();
    
    properties.forEach(prop => {
        if (prop.location) {
            // Split string to handle "Neighborhood, City" or "City, State" formats
            const parts = prop.location.split(',').map(part => part.trim());
            
            // Try to find the most specific part (Neighborhood) filtering out common city names if present in a compound string
            // This ensures "Noroeste, Brasília" becomes "Noroeste" in the filter, but "Valparaíso" stays "Valparaíso"
            const specificLocation = parts.find(part => 
                !['brasília', 'brasilia', 'df', 'distrito federal'].includes(part.toLowerCase())
            );

            // If a specific part is found, use it. Otherwise use the first part (e.g., if location is just "Brasília")
            if (specificLocation) {
                locations.add(specificLocation);
            } else if (parts.length > 0) {
                locations.add(parts[0]);
            }
        }
    });

    return ['Todos', ...Array.from(locations).sort()];
  }, [properties]);

  // Check if there is an active search from URL
  const hasUrlSearch = searchParams.toString().length > 0;

  useEffect(() => {
    // If user searched via URL, we can reset the "Quick Filter" tabs or handle them differently.
    // For now, we keep "Todos" as default if URL params exist to allow the specific URL search to take precedence.
    if (hasUrlSearch) {
        setActiveFilter('Todos');
    }
  }, [hasUrlSearch]);

  const filteredProperties = properties.filter(prop => {
    // 1. Filter by Quick Tabs (Buttons)
    // Only apply if not 'Todos'
    if (activeFilter !== 'Todos') {
        if (!prop.location?.toLowerCase().includes(activeFilter.toLowerCase())) {
            return false;
        }
    }

    // 2. Filter by URL Parameters (from Home Search)
    const purposeParam = searchParams.get('purpose');
    const typeParam = searchParams.get('type');
    const cityParam = searchParams.get('city');
    const queryParam = searchParams.get('query');

    // Strict check for Purpose (Venda/Aluguel)
    if (purposeParam && prop.purpose !== purposeParam) {
        return false;
    }

    // Strict check for Type (Casa, Mansão, etc)
    if (typeParam && prop.type !== typeParam) {
        return false;
    }

    // Partial check for City (e.g. searching 'Brasília' matches 'Brasília, DF')
    if (cityParam && !prop.city?.toLowerCase().includes(cityParam.toLowerCase())) {
        return false;
    }

    // Text Search (Title, Location, Description)
    if (queryParam) {
        const lowerQuery = queryParam.toLowerCase();
        const matchesQuery = 
            prop.title.toLowerCase().includes(lowerQuery) ||
            prop.location.toLowerCase().includes(lowerQuery) ||
            (prop.description && prop.description.toLowerCase().includes(lowerQuery));
        
        if (!matchesQuery) return false;
    }

    return true;
  });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                {hasUrlSearch ? 'Resultado da Busca' : 'Nossos Imóveis'}
            </h1>
            <p className="text-gray-400 font-light">
                {hasUrlSearch 
                    ? `Encontramos ${filteredProperties.length} imóveis com seus critérios.`
                    : 'Confira as melhores oportunidades'}
            </p>
        </div>
        
        {/* Filters - Only show if not doing a specific deep search, or allow user to reset */}
        <div className="flex flex-wrap gap-4 mb-12">
            {filters.map((filter) => (
                <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2 rounded-full border text-sm transition-all ${
                        activeFilter === filter 
                        ? 'bg-gold-600 border-gold-600 text-white' 
                        : 'border-white/10 text-gray-400 hover:border-gold-400 hover:text-gold-400'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>

        {filteredProperties.length === 0 ? (
            <div className="bg-dark-900 border border-white/5 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-gold-400/10 rounded-full text-gold-400 mb-6 border border-gold-400/20">
                    <SearchX size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white mb-3">Nenhum Imóvel Encontrado</h3>
                <p className="text-gray-400 font-light text-xs sm:text-sm mb-6 leading-relaxed">
                    Não encontramos propriedades correspondentes aos filtros selecionados neste momento. Redefina seus filtros ou use nosso Radar de Alertas abaixo para ser notificado assim que algo correspondente estiver disponível.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => { setActiveFilter('Todos'); }} 
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                        Limpar Filtros
                    </button>
                    <Link 
                        to="/contact" 
                        className="px-5 py-2.5 bg-gold-600 hover:bg-gold-500 rounded-xl text-xs font-semibold text-white transition-all shadow-lg shadow-gold-600/10"
                    >
                        Falar com Consultor
                    </Link>
                </div>
            </div>
        ) : (
            <PropertyGrid showTitle={false} properties={filteredProperties} />
        )}

        <div className="mt-24 border-t border-white/5 pt-16">
            <PropertyAlerts />
        </div>
      </div>
    </div>
  );
};
