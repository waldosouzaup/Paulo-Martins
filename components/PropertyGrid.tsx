import React, { useState, useEffect } from 'react';
import { BedDouble, Car, Scaling, Heart } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { Property } from '../types';
import { formatPropertyTag, slugify } from '../lib/utils';

const { Link } = RouterDom;

interface PropertyGridProps {
  limit?: number;
  showTitle?: boolean;
  properties?: Property[];
}

const PropertyCard: React.FC<{ prop: Property }> = ({ prop }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { language, translateDynamic, t } = useLanguage();
  
  const [translatedTitle, setTranslatedTitle] = useState(prop.title);
  const [translatedLocation, setTranslatedLocation] = useState(prop.location);

  useEffect(() => {
    setTranslatedTitle(prop.title);
    setTranslatedLocation(prop.location);

    if (language === 'pt') return;

    let isMounted = true;
    const translateCard = async () => {
      try {
        const [tit, loc] = await Promise.all([
          translateDynamic(prop.title, `grid_${prop.id}_title`),
          translateDynamic(prop.location, `grid_${prop.id}_location`)
        ]);
        if (isMounted) {
          setTranslatedTitle(tit);
          setTranslatedLocation(loc);
        }
      } catch (err) {
        console.error("Card translation error:", err);
      }
    };
    translateCard();
    return () => { isMounted = false; };
  }, [language, prop.id, prop.title, prop.location]);

  const urlSlug = prop.slug || (prop.title ? slugify(prop.title) : prop.id);

  return (
    <Link 
      to={`/${urlSlug}`} 
      className="group relative bg-dark-900 border border-white/5 rounded-xl overflow-hidden hover:border-gold-600/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(176,141,32,0.1)] flex flex-col transform hover:-translate-y-1.5 hover:scale-[1.02]"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={prop.imageUrl} 
          alt={translatedTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
        
        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const isFav = isFavorite(prop.id);
            if (isFav) {
              removeFavorite(prop.id);
            } else {
              addFavorite(prop);
            }
          }}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-gold-400 hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
          title={isFavorite(prop.id) ? t("favorites.remove") || "Remover dos favoritos" : t("favorites.add") || "Salvar nos favoritos"}
        >
          <Heart size={16} className={`${isFavorite(prop.id) ? 'fill-gold-500 text-gold-500' : 'text-white'}`} />
        </button>

        {/* Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-gold-600/30 px-3 py-1 rounded text-[10px] tracking-widest uppercase text-gold-400 font-semibold font-mono">
          {formatPropertyTag(prop.tag)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-white font-medium text-lg leading-snug mb-2 line-clamp-2 h-14 group-hover:text-gold-400 transition-colors font-serif">
          {translatedTitle}
        </h3>
        <div className="flex items-center text-gray-400 text-xs mb-6 uppercase tracking-wider font-sans">
          <span className="text-gold-600 mr-2">📍</span>
          {translatedLocation}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-center text-gray-400 text-xs">
            <BedDouble size={14} className="mr-2 text-gold-600" />
            <span className="truncate">{prop.beds} {t("label.beds_short") || "Qts"}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs">
            <Car size={14} className="mr-2 text-gold-600" />
            <span className="truncate">{prop.parking} {t("label.parking_short") || "Vagas"}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs col-span-2 font-mono">
            <Scaling size={14} className="mr-2 text-gold-600" />
            <span>{prop.area}</span>
          </div>
        </div>

        {/* Button */}
        <div className="w-full py-3 border border-white/10 rounded text-center text-gold-400 text-sm uppercase tracking-widest group-hover:bg-gold-600 group-hover:text-white group-hover:border-gold-600 transition-all duration-300 font-semibold font-sans">
          {t('label.details') || 'Ver Detalhes'}
        </div>
      </div>
    </Link>
  );
};

export const PropertyGrid: React.FC<PropertyGridProps> = ({ limit, showTitle = true, properties: customProperties }) => {
  const { properties: contextProperties } = useProperties(); 
  const { t } = useLanguage();
  
  let displayedProperties = customProperties || contextProperties;
  
  if (limit) {
    displayedProperties = displayedProperties.slice(0, limit);
  }

  return (
    <section className="py-24 px-6 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gold-400 mb-4">{t('grid.exclusives') || 'Oportunidades Exclusivas'}</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto opacity-50"></div>
          </div>
        )}

        {displayedProperties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-400 text-lg">{t('grid.no_properties') || 'Nenhum imóvel encontrado.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProperties.map((prop) => (
              <PropertyCard prop={prop} key={prop.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
