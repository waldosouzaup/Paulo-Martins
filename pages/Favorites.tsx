import React from 'react';
import { PropertyGrid } from '../components/PropertyGrid';
import { useFavorites } from '../context/FavoritesContext';

export const Favorites: React.FC = () => {
    const { favorites } = useFavorites();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Seus Favoritos</h1>
            <p className="text-gray-400 font-light">
                {favorites.length > 0 
                    ? `Você selecionou ${favorites.length} imóveis exclusivos.` 
                    : "Você ainda não salvou nenhum imóvel."}
            </p>
        </div>

        {/* Fix: PropertyGrid does not have filterFavorites prop. Passing favorites directly to properties prop. */}
        <PropertyGrid showTitle={false} properties={favorites} />
      </div>
    </div>
  );
};