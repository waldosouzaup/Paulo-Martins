
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/utils';

type ConnectionStatus = 'checking' | 'online' | 'offline';

export interface TrackingSettings {
  id: string;
  google_tag_id: string;
  meta_pixel_id: string;
  head_scripts: string;
  body_scripts: string;
  home_hero_image: string;
  whatsapp_number?: string;
  instagram_link?: string;
  broker_image?: string;
  show_google_reviews?: boolean;
}

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  connectionStatus: ConnectionStatus;
  addProperty: (property: Property) => Promise<boolean>;
  updateProperty: (property: Property) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
  checkConnection: () => Promise<ConnectionStatus>;
  trackingSettings: TrackingSettings | null;
  refreshTrackingSettings: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [trackingSettings, setTrackingSettings] = useState<TrackingSettings | null>(null);

  const fetchTrackingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('tracking_settings')
        .select('*')
        .eq('id', 'global-tracking')
        .maybeSingle();

      if (error) {
        console.warn('Erro ao buscar tracking_settings:', error);
      }
      
      const current = data || {};
      
      let finalShowReviews = true;
      const cachedReviewsFallback = localStorage.getItem('show_google_reviews_fallback');
      if (cachedReviewsFallback !== null) {
        finalShowReviews = cachedReviewsFallback === 'true';
      } else if (current.show_google_reviews !== undefined && current.show_google_reviews !== null) {
        finalShowReviews = !!current.show_google_reviews;
      }

      setTrackingSettings({
        id: current.id || 'global-tracking',
        google_tag_id: current.google_tag_id || '',
        meta_pixel_id: current.meta_pixel_id || '',
        head_scripts: current.head_scripts || '',
        body_scripts: current.body_scripts || '',
        home_hero_image: current.home_hero_image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
        whatsapp_number: current.whatsapp_number || '5561991176958',
        instagram_link: current.instagram_link || '#',
        broker_image: current.broker_image || 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png',
        show_google_reviews: finalShowReviews
      });
    } catch (err) {
      console.error('Falha geral ao buscar tracking_settings:', err);
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedProperties: Property[] = data.map((item: any) => {
          let parsedTours: any[] = [];
          let rawTourUrl = item.virtual_tour_url || '';
          let simpleUrl = '';
          
          if (rawTourUrl.trim().startsWith('[')) {
            try {
              parsedTours = JSON.parse(rawTourUrl);
              if (parsedTours.length > 0) {
                simpleUrl = parsedTours[0].url || '';
              }
            } catch (e) {
              console.error('Failed to parse virtual tours JSON:', e);
              simpleUrl = rawTourUrl;
            }
          } else {
            simpleUrl = rawTourUrl;
            if (simpleUrl) {
              parsedTours = [{ title: 'Principal', url: simpleUrl }];
            }
          }

          return {
            id: String(item.id),
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
            videoUrl: item.video_url || '',
            is_featured: !!item.is_featured,
            slug: item.slug || (item.title ? slugify(item.title) : ''),
            floorPlanUrl: item.floor_plan_url || '',
            floorPlans: item.floor_plans || [],
            brief_desc_home: item.brief_desc_home || '',
            nearby_school: item.nearby_school || '',
            nearby_university: item.nearby_university || '',
            nearby_shopping: item.nearby_shopping || '',
            nearby_restaurant: item.nearby_restaurant || '',
            nearby_hospital: item.nearby_hospital || '',
            nearby_banks: item.nearby_banks || '',
            nearby_supermarkets: item.nearby_supermarkets || '',
            nearby_gyms: item.nearby_gyms || '',
            nearby_bakeries: item.nearby_bakeries || '',
            nearby_transport: item.nearby_transport || '',
            faqs: item.faqs || [],
            virtualTourUrl: simpleUrl,
            virtualTours: parsedTours,
            seoTitle: item.seo_title || '',
            seoDescription: item.seo_description || '',
            seoImageUrl: item.seo_image_url || '',
            address: item.address || '',
            datasheetUrl: item.datasheet_url || '',
            display_order: item.display_order !== undefined && item.display_order !== null ? Number(item.display_order) : 0
          };
        });

        // Ordenar os imóveis em memória pelo display_order de forma dinâmica e segura:
        // Imóveis com display_order positivo (> 0) aparecem no topo, ordenados de forma crescente (1, 2, 3...)
        // Imóveis com display_order <= 0 (ou sem ordem definida) ficam por último, mantendo a ordenação original por data de cadastro
        mappedProperties.sort((a, b) => {
          const orderA = a.display_order || 0;
          const orderB = b.display_order || 0;
          
          if (orderA > 0 && orderB > 0) {
            return orderA - orderB;
          }
          if (orderA > 0) return -1;
          if (orderB > 0) return 1;
          return 0; // mantém a ordem padrão de criação por data
        });

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
    fetchTrackingSettings();
  }, []);

  const handleError = (title: string, error: any) => {
    console.error(title, error);
    const message = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    alert(`${title}:\n\n${message}`);
  };

  const extractMissingColumn = (errorMessage: string): string | null => {
    if (!errorMessage) return null;
    const patterns = [
      /Could not find the '([^']+)' column/i,
      /column "([^"]+)" of relation/i,
      /column "([^"]+)" does not exist/i,
      /column '([^']+)' does not exist/i,
      /column "([^"]+)"/i,
      /column '([^']+)'/i
    ];
    for (const pattern of patterns) {
      const match = errorMessage.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handlePropDbError = (title: string, error: any) => {
    console.error(title, error);
    if (error && (error.code === '42703' || String(error.message || '').includes('is_featured') || String(error.message || '').includes('column') || String(error.message || '').includes('brief_desc_home') || String(error.message || '').includes('slug') || String(error.message || '').includes('floor_plan_url') || String(error.message || '').includes('floor_plans') || String(error.message || '').includes('faqs') || String(error.message || '').includes('virtual_tour_url') || String(error.message || '').includes('seo_title') || String(error.message || '').includes('seo_description') || String(error.message || '').includes('seo_image_url') || String(error.message || '').includes('nearby_banks') || String(error.message || '').includes('nearby_supermarkets') || String(error.message || '').includes('nearby_gyms') || String(error.message || '').includes('nearby_bakeries') || String(error.message || '').includes('nearby_transport') || String(error.message || '').includes('address') || String(error.message || '').includes('datasheet_url') || String(error.message || '').includes('display_order'))) {
      alert(`Erro: Algumas novas colunas estão faltando na sua tabela "properties".\n\nPor favor, execute o seguinte comando no SQL Editor do seu painel Supabase para atualizá-la:\n\nALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS address TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS datasheet_url TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plan_url TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '[]'::jsonb;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS brief_desc_home TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_school TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_university TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_shopping TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_restaurant TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_hospital TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_banks TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_supermarkets TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_gyms TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_bakeries TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_transport TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_title TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_description TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS seo_image_url TEXT;\nALTER TABLE properties ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;\n\nDepois salve o imóvel novamente!`);
      return;
    }
    const message = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    alert(`${title}:\n\n${message}`);
  };

  const addProperty = async (property: Property): Promise<boolean> => {
    const dbProperty: Record<string, any> = {
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
      video_url: property.videoUrl,
      is_featured: property.is_featured || false,
      slug: property.slug || (property.title ? slugify(property.title) : ''),
      floor_plan_url: property.floorPlanUrl || '',
      floor_plans: property.floorPlans || [],
      brief_desc_home: property.brief_desc_home || '',
      nearby_school: property.nearby_school || '',
      nearby_university: property.nearby_university || '',
      nearby_shopping: property.nearby_shopping || '',
      nearby_restaurant: property.nearby_restaurant || '',
      nearby_hospital: property.nearby_hospital || '',
      nearby_banks: property.nearby_banks || '',
      nearby_supermarkets: property.nearby_supermarkets || '',
      nearby_gyms: property.nearby_gyms || '',
      nearby_bakeries: property.nearby_bakeries || '',
      nearby_transport: property.nearby_transport || '',
      faqs: property.faqs || [],
      virtual_tour_url: property.virtualTours && property.virtualTours.length > 0
        ? JSON.stringify(property.virtualTours)
        : (property.virtualTourUrl || ''),
      seo_title: property.seoTitle || '',
      seo_description: property.seoDescription || '',
      seo_image_url: property.seoImageUrl || '',
      address: property.address || '',
      datasheet_url: property.datasheetUrl || '',
      display_order: property.display_order || 0
    };

    if (property.is_featured) {
      const { error: resetError } = await supabase.from('properties').update({ is_featured: false }).neq('id', property.id);
      if (resetError) {
        if (resetError.code === '42703' || String(resetError.message || '').includes('is_featured')) {
          handlePropDbError('Erro ao cadastrar imóvel', resetError);
          return false;
        }
      }
    }

    let payload = { ...dbProperty };
    let success = false;
    let attempts = 0;
    const maxAttempts = 15;

    while (!success && attempts < maxAttempts) {
      const { error } = await supabase.from('properties').insert([payload]);
      if (error) {
        const errorMsg = error.message || '';
        const isMissingColError = error.code === '42703' || 
                                  error.code === 'PGRST204' || 
                                  errorMsg.includes('column') || 
                                  errorMsg.includes('does not exist') || 
                                  errorMsg.includes('schema cache');
        if (isMissingColError) {
          const missingCol = extractMissingColumn(errorMsg) || 
                             ['seo_description', 'seo_title', 'seo_image_url', 'virtual_tour_url', 'brief_desc_home', 'floor_plan_url', 'floor_plans', 'faqs', 'nearby_school', 'nearby_university', 'nearby_shopping', 'nearby_restaurant', 'nearby_hospital', 'nearby_banks', 'nearby_supermarkets', 'nearby_gyms', 'nearby_bakeries', 'nearby_transport', 'address', 'datasheet_url', 'is_featured', 'slug', 'display_order'].find(col => errorMsg.includes(col));
          
          if (missingCol && missingCol in payload) {
            console.warn(`[Self-Healing Add] Removendo coluna inexistente '${missingCol}' do payload e tentando novamente.`);
            delete payload[missingCol];
            attempts++;
            continue;
          }
        }
        
        handlePropDbError('Erro ao cadastrar imóvel', error);
        return false;
      }
      success = true;
    }
    
    await fetchProperties();
    return true;
  };

  const updateProperty = async (property: Property): Promise<boolean> => {
    const dbProperty: Record<string, any> = {
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
        video_url: property.videoUrl,
        is_featured: property.is_featured || false,
        slug: property.slug || (property.title ? slugify(property.title) : ''),
        floor_plan_url: property.floorPlanUrl || '',
        floor_plans: property.floorPlans || [],
        brief_desc_home: property.brief_desc_home || '',
        nearby_school: property.nearby_school || '',
        nearby_university: property.nearby_university || '',
        nearby_shopping: property.nearby_shopping || '',
        nearby_restaurant: property.nearby_restaurant || '',
        nearby_hospital: property.nearby_hospital || '',
        nearby_banks: property.nearby_banks || '',
        nearby_supermarkets: property.nearby_supermarkets || '',
        nearby_gyms: property.nearby_gyms || '',
        nearby_bakeries: property.nearby_bakeries || '',
        nearby_transport: property.nearby_transport || '',
        faqs: property.faqs || [],
        virtual_tour_url: property.virtualTours && property.virtualTours.length > 0
          ? JSON.stringify(property.virtualTours)
          : (property.virtualTourUrl || ''),
        seo_title: property.seoTitle || '',
        seo_description: property.seoDescription || '',
        seo_image_url: property.seoImageUrl || '',
        address: property.address || '',
        datasheet_url: property.datasheetUrl || '',
        display_order: property.display_order || 0
      };
  
      const numericId = !isNaN(Number(property.id)) ? Number(property.id) : null;
      const targetId = numericId !== null ? numericId : property.id;

      if (property.is_featured) {
        const { error: resetError } = await supabase.from('properties').update({ is_featured: false }).neq('id', targetId);
        if (resetError) {
          if (resetError.code === '42703' || String(resetError.message || '').includes('is_featured')) {
            handlePropDbError('Erro ao atualizar imóvel', resetError);
            return false;
          }
        }
      }

      console.log(`[PropertyContext] Atualizando imóvel. ID original: ${property.id}, ID tratado: ${targetId}`);
      
      let payload = { ...dbProperty };
      let success = false;
      let attempts = 0;
      const maxAttempts = 15;

      while (!success && attempts < maxAttempts) {
        let updateResult = await supabase
          .from('properties')
          .update(payload)
          .eq('id', targetId)
          .select();
        
        // Fallback: se o ID era convertido pra numérico mas não encontrou linhas ou deu erro, tenta com o ID original como string
        if ((updateResult.error || !updateResult.data || updateResult.data.length === 0) && numericId !== null && !(updateResult.error && (updateResult.error.code === '42703' || updateResult.error.code === 'PGRST204'))) {
          console.warn(`[PropertyContext] Atualização com ID numérico não alterou registros. Tentando como String: ${property.id}`);
          updateResult = await supabase
            .from('properties')
            .update(payload)
            .eq('id', property.id)
            .select();
        }
        
        if (updateResult.error) {
          const errorMsg = updateResult.error.message || '';
          const isMissingColError = updateResult.error.code === '42703' || 
                                    updateResult.error.code === 'PGRST204' || 
                                    errorMsg.includes('column') || 
                                    errorMsg.includes('does not exist') || 
                                    errorMsg.includes('schema cache');
          if (isMissingColError) {
            const missingCol = extractMissingColumn(errorMsg) || 
                               ['seo_description', 'seo_title', 'seo_image_url', 'virtual_tour_url', 'brief_desc_home', 'floor_plan_url', 'floor_plans', 'faqs', 'nearby_school', 'nearby_university', 'nearby_shopping', 'nearby_restaurant', 'nearby_hospital', 'nearby_banks', 'nearby_supermarkets', 'nearby_gyms', 'nearby_bakeries', 'nearby_transport', 'address', 'datasheet_url', 'is_featured', 'slug', 'display_order'].find(col => errorMsg.includes(col));
            
            if (missingCol && missingCol in payload) {
              console.warn(`[Self-Healing Update] Removendo coluna inexistente '${missingCol}' do payload de update e tentando novamente.`);
              delete payload[missingCol];
              attempts++;
              continue;
            }
          }
          
          handlePropDbError('Erro ao atualizar imóvel', updateResult.error);
          return false;
        }
        
        if (!updateResult.data || updateResult.data.length === 0) {
          console.warn(`[PropertyContext] Nenhum registro de imóvel foi afetado pela atualização do ID: ${targetId}`);
          
          const fallbackRawResult = await supabase
            .from('properties')
            .update(payload)
            .eq('id', targetId);
            
          if (fallbackRawResult.error) {
            const errorMsg = fallbackRawResult.error.message || '';
            const isMissingColError = fallbackRawResult.error.code === '42703' || 
                                      fallbackRawResult.error.code === 'PGRST204' || 
                                      errorMsg.includes('column') || 
                                      errorMsg.includes('does not exist') || 
                                      errorMsg.includes('schema cache');
            if (isMissingColError) {
              const missingCol = extractMissingColumn(errorMsg) || 
                                 ['seo_description', 'seo_title', 'seo_image_url', 'virtual_tour_url', 'brief_desc_home', 'floor_plan_url', 'floor_plans', 'faqs', 'nearby_school', 'nearby_university', 'nearby_shopping', 'nearby_restaurant', 'nearby_hospital', 'nearby_banks', 'nearby_supermarkets', 'nearby_gyms', 'nearby_bakeries', 'nearby_transport', 'address', 'datasheet_url', 'is_featured', 'slug', 'display_order'].find(col => errorMsg.includes(col));
              
              if (missingCol && missingCol in payload) {
                console.warn(`[Self-Healing Update Fallback] Removendo coluna inexistente '${missingCol}' do payload e tentando novamente.`);
                delete payload[missingCol];
                attempts++;
                continue;
              }
            }
            
            handlePropDbError('Erro de fallback ao atualizar imóvel', fallbackRawResult.error);
            return false;
          }
        }
        
        success = true;
      }
      
      await fetchProperties();
      return true;
  };

  const deleteProperty = async (id: string) => {
    const numericId = !isNaN(Number(id)) ? Number(id) : null;
    const targetId = numericId !== null ? numericId : id;

    console.log(`[PropertyContext] Excluindo imóvel. ID original: ${id}, ID tratado: ${targetId}`);
    
    let { error } = await supabase.from('properties').delete().eq('id', targetId);
    
    if (error && numericId !== null) {
        console.warn(`[PropertyContext] Erro ao excluir com ID numérico. Tentando como String ID: ${id}`);
        const fallbackResult = await supabase.from('properties').delete().eq('id', id);
        error = fallbackResult.error;
    }

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
      checkConnection,
      trackingSettings,
      refreshTrackingSettings: fetchTrackingSettings
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
