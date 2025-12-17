import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const { user } = useAuth();

  // Fetch favorites when user logs in
  useEffect(() => {
    if (user) {
        fetchFavorites();
    } else {
        setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    // Join favorites with properties table
    const { data, error } = await supabase
        .from('favorites')
        .select(`
            property_id,
            property:properties (*)
        `);

    if (error) {
        console.error('Error fetching favorites:', error);
        return;
    }

    if (data) {
        // Transform the nested response back to Property[]
        const mappedFavorites = data.map((item: any) => {
            const p = item.property;
            return {
                id: p.id,
                title: p.title,
                location: p.location,
                price: p.price,
                imageUrl: p.image_url,
                images: p.images,
                beds: p.beds,
                parking: p.parking,
                area: p.area,
                tag: p.tag,
                description: p.description,
                features: p.features,
                purpose: p.purpose,
                type: p.type,
                city: p.city
            } as Property;
        });
        setFavorites(mappedFavorites);
    }
  };

  const addFavorite = async (property: Property) => {
    if (!user) {
        alert("Faça login para salvar favoritos.");
        // Optional: Redirect to login
        return;
    }

    // Optimistic UI update
    setFavorites((prev) => [...prev, property]);

    const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, property_id: property.id }]);

    if (error) {
        console.error("Error adding favorite:", error);
        // Revert optimistic update
        setFavorites((prev) => prev.filter(p => p.id !== property.id));
    }
  };

  const removeFavorite = async (id: string) => {
    if (!user) return;

    // Optimistic UI update
    setFavorites((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: user.id, property_id: id });

    if (error) {
         console.error("Error removing favorite:", error);
         fetchFavorites(); // Revert/Refresh
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some((p) => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};