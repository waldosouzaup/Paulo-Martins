import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabase';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Property) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Map snake_case DB fields to camelCase TS interface
        const mappedProperties: Property[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.location,
          price: item.price,
          imageUrl: item.image_url, // DB column mapping
          images: item.images,
          beds: item.beds,
          parking: item.parking,
          area: item.area,
          tag: item.tag,
          description: item.description,
          features: item.features,
          purpose: item.purpose,
          type: item.type,
          city: item.city,
          videoUrl: item.video_url
        }));
        setProperties(mappedProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Property) => {
    // Map camelCase to snake_case for DB
    const dbProperty = {
      title: property.title,
      location: property.location,
      price: property.price,
      image_url: property.imageUrl,
      images: property.images,
      beds: property.beds,
      parking: property.parking,
      area: property.area,
      tag: property.tag,
      description: property.description,
      features: property.features,
      purpose: property.purpose,
      type: property.type,
      city: property.city,
      video_url: property.videoUrl
    };

    const { data, error } = await supabase.from('properties').insert([dbProperty]).select();
    
    if (error) {
      console.error('Error adding property:', error);
      alert('Erro ao adicionar imóvel.');
    } else if (data) {
       // Optimistic update or refetch
       fetchProperties();
    }
  };

  const updateProperty = async (property: Property) => {
    const dbProperty = {
        title: property.title,
        location: property.location,
        price: property.price,
        image_url: property.imageUrl,
        images: property.images,
        beds: property.beds,
        parking: property.parking,
        area: property.area,
        tag: property.tag,
        description: property.description,
        features: property.features,
        purpose: property.purpose,
        type: property.type,
        city: property.city,
        video_url: property.videoUrl
      };
  
      const { error } = await supabase
        .from('properties')
        .update(dbProperty)
        .eq('id', property.id);
      
      if (error) {
        console.error('Error updating property:', error);
        alert('Erro ao atualizar imóvel.');
      } else {
        fetchProperties();
      }
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
        console.error('Error deleting property:', error);
        alert('Erro ao excluir imóvel.');
    } else {
        setProperties((prev) => prev.filter(p => p.id !== id));
    }
  };

  return (
    <PropertyContext.Provider value={{ properties, loading, addProperty, updateProperty, deleteProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};