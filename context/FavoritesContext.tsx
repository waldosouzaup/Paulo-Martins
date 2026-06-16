
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';

interface FavoritesContextType {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pm_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites from localStorage', e);
      }
    }
  }, []);

  // Set up synchronization with localStorage
  const saveFavorites = (newFavorites: Property[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('pm_favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  };

  const addFavorite = (property: Property) => {
    if (favorites.some((p) => p.id === property.id)) return;
    const updated = [...favorites, property];
    saveFavorites(updated);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((p) => p.id !== id);
    saveFavorites(updated);
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
