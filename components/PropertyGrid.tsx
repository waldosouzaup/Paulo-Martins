import React from 'react';
import { BedDouble, Car, Scaling, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { Property } from '../types';

interface PropertyGridProps {
  limit?: number;
  showTitle?: boolean;
  filterFavorites?: boolean;
  properties?: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ limit, showTitle = true, filterFavorites = false, properties: customProperties }) => {
  const { isFavorite, addFavorite, removeFavorite, favorites } = useFavorites();
  const { properties: contextProperties } = useProperties(); 
  
  let displayedProperties = customProperties || (filterFavorites ? favorites : contextProperties);
  
  if (limit) {
    displayedProperties = displayedProperties.slice(0, limit);
  }

  const toggleFavorite = (e: React.MouseEvent, prop: Property) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(prop.id)) {
      removeFavorite(prop.id);
    } else {
      addFavorite(prop);
    }
  };

  return (
    <section className="py-24 px-6 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gold-400 mb-4">Oportunidades Exclusivas</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto opacity-50"></div>
          </div>
        )}

        {displayedProperties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-400 text-lg">Nenhum imóvel encontrado.</p>
            {filterFavorites && (
                <Link to="/properties" className="inline-block mt-4 text-gold-400 hover:text-white transition-colors">
                    Ver todos os imóveis &rarr;
                </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProperties.map((prop) => (
              <Link to={`/property/${prop.id}`} key={prop.id} className="group relative bg-dark-900 border border-white/5 rounded-xl overflow-hidden hover:border-gold-600/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(176,141,32,0.1)] flex flex-col">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={prop.imageUrl} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-gold-600/30 px-3 py-1 rounded text-[10px] tracking-widest uppercase text-gold-400 font-semibold">
                    {prop.tag}
                  </div>

                  {/* Favorite Button */}
                   <button 
                    onClick={(e) => toggleFavorite(e, prop)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-gold-600/80 transition-all group/heart"
                   >
                     <Heart 
                        size={18} 
                        className={isFavorite(prop.id) ? "fill-gold-400 text-gold-400" : "text-white group-hover/heart:text-white"} 
                     />
                   </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-white font-medium text-lg leading-snug mb-2 line-clamp-2 h-14 group-hover:text-gold-400 transition-colors">
                    {prop.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs mb-6 uppercase tracking-wider">
                    <span className="text-gold-600 mr-2">📍</span>
                    {prop.location}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center text-gray-400 text-xs">
                      <BedDouble size={14} className="mr-2 text-gold-600" />
                      {prop.beds}
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Car size={14} className="mr-2 text-gold-600" />
                      {prop.parking}
                    </div>
                    <div className="flex items-center text-gray-400 text-xs col-span-2">
                      <Scaling size={14} className="mr-2 text-gold-600" />
                      {prop.area}
                    </div>
                  </div>

                  {/* Button */}
                  <div className="w-full py-3 border border-white/10 rounded text-center text-gold-400 text-sm uppercase tracking-widest group-hover:bg-gold-600 group-hover:text-white group-hover:border-gold-600 transition-all duration-300">
                    Ver Detalhes
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};