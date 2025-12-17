
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabase';

type ConnectionStatus = 'checking' | 'online' | 'offline';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  connectionStatus: ConnectionStatus;
  addProperty: (property: Property) => Promise<boolean>;
  updateProperty: (property: Property) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
  checkConnection: () => Promise<ConnectionStatus>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedProperties: Property[] = data.map((item: any) => ({
          id: item.id,
          title: item.title || '',
          location: item.location || '',
          price: item.price || '',
          imageUrl: item.image_url || '',
          images: item.images || [],
          beds: item.beds || '',
          parking: item.parking || '',
          area: item.area || '',
          tag: item.tag || 'NOVO',
          description: item.description || '',
          features: item.features || [],
          purpose: item.purpose || 'Venda',
          type: item.type || 'Casa',
          city: item.city || 'Brasília',
          videoUrl: item.video_url || ''
        }));
        setProperties(mappedProperties);
        setConnectionStatus('online');
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      setConnectionStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async (): Promise<ConnectionStatus> => {
    setConnectionStatus('checking');
    try {
      // Tenta uma operação simples de leitura
      const { error } = await supabase.from('properties').select('id').limit(1);
      if (error) throw error;
      setConnectionStatus('online');
      return 'online';
    } catch (err) {
      console.error('Falha na verificação de conexão:', err);
      setConnectionStatus('offline');
      return 'offline';
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleError = (title: string, error: any) => {
    console.error(title, error);
    const message = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    alert(`${title}:\n\n${message}`);
  };

  const addProperty = async (property: Property): Promise<boolean> => {
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

    const { error } = await supabase.from('properties').insert([dbProperty]);
    
    if (error) {
      handleError('Erro ao cadastrar imóvel', error);
      return false;
    }
    
    await fetchProperties();
    return true;
  };

  const updateProperty = async (property: Property): Promise<boolean> => {
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
        handleError('Erro ao atualizar imóvel', error);
        return false;
      }
      
      await fetchProperties();
      return true;
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
        handleError('Erro ao excluir imóvel', error);
    } else {
        setProperties((prev) => prev.filter(p => p.id !== id));
    }
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      loading, 
      connectionStatus,
      addProperty, 
      updateProperty, 
      deleteProperty, 
      refreshProperties: fetchProperties,
      checkConnection 
    }}>
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
