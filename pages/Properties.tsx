import React, { useState, useEffect, useMemo } from 'react';
import { PropertyGrid } from '../components/PropertyGrid';
import { useProperties } from '../context/PropertyContext';
import { useSearchParams } from 'react-router-dom';

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
                {hasUrlSearch ? 'Resultado da Busca' : 'Nossa Coleção'}
            </h1>
            <p className="text-gray-400 font-light">
                {hasUrlSearch 
                    ? `Encontramos ${filteredProperties.length} imóveis com seus critérios.`
                    : 'Explore nossa seleção exclusiva de imóveis de alto padrão.'}
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

        <PropertyGrid showTitle={false} properties={filteredProperties} />
      </div>
    </div>
  );
};