import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageType = 'pt' | 'en' | 'es';

export const translations: Record<LanguageType, Record<string, string>> = {
  pt: {
    // Nav
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.properties": "Imóveis",
    "nav.estate": "Alto Sobradinho",
    "nav.contact": "Contato",
    "nav.favorites": "Favoritos",
    // Hero & Search
    "hero.title": "Encontre o imóvel dos seus sonhos em Brasília",
    "hero.subtitle": "Casas, apartamentos e coberturas exclusivas nas melhores localizações do Distrito Federal.",
    "search.placeholder": "Buscar por localização, tipo, qts...",
    "search.all": "Todos",
    "search.type": "Tipo de Imóvel",
    "search.purpose": "Finalidade",
    "search.beds": "Dormitórios",
    "search.price": "Preço Máximo",
    "search.button": "Buscar",
    // Labels
    "label.beds": "Dormitórios",
    "label.beds_short": "Qts",
    "label.parking": "Vagas",
    "label.parking_short": "Vagas",
    "label.area": "Área",
    "label.details": "Ver Detalhes",
    "label.featured": "Destaque do Mês",
    "label.sale": "Venda",
    "label.rent": "Locação",
    "label.back": "Voltar",
    "label.contact": "Contato",
    "label.address": "Endereço",
    "label.nearby": "Proximidades",
    "label.features": "Diferenciais",
    "label.floorplans": "Plantas Disponíveis",
    "label.faq": "Perguntas Frequentes",
    "label.virtualtour": "Tour Virtual 360",
    "label.download_datasheet": "Baixar Ficha Técnica (PDF)",
    "label.whatsapp_alert": "Receber Alertas de Imóveis",
    // Contact panel
    "contact.title": "Vamos conversar sobre o seu próximo imóvel",
    "contact.subtitle": "Fale comigo para tirar suas dúvidas ou agendar uma visita exclusiva.",
    "contact.button": "Fale Conosco no WhatsApp",
    "contact.title_main": "Fale com Paulo Martins",
    "contact.immediate": "Atendimento Imediato",
    "contact.form_title": "Envie uma Mensagem",
    "contact.name": "Nome",
    "contact.phone": "Telefone / WhatsApp",
    "contact.email": "E-mail",
    "contact.message": "Mensagem",
    "contact.send": "Enviar Mensagem",
    "contact.success": "Mensagem enviada com sucesso!",
    // Favorites
    "favorites.title": "Seus Imóveis Favoritos",
    "favorites.empty": "Você ainda não salvou nenhum imóvel como favorito.",
    // Cookie Consent
    "cookie.text": "Este site usa cookies para garantir que você obtenha a melhor experiência.",
    "cookie.accept": "Aceitar",
    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.creci": "CRECI-DF: 12345",
    "footer.dev": "Paulo Martins Consultoria Imobiliária."
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.properties": "Properties",
    "nav.estate": "Alto Sobradinho",
    "nav.contact": "Contact",
    "nav.favorites": "Favorites",
    // Hero & Search
    "hero.title": "Find your dream property in Brasília",
    "hero.subtitle": "Exclusive houses, apartments, and penthouses in the best locations of the Federal District.",
    "search.placeholder": "Search by location, type, bedrooms...",
    "search.all": "All",
    "search.type": "Property Type",
    "search.purpose": "Purpose",
    "search.beds": "Bedrooms",
    "search.price": "Max Price",
    "search.button": "Search",
    // Labels
    "label.beds": "Bedrooms",
    "label.beds_short": "Beds",
    "label.parking": "Parking",
    "label.parking_short": "Cars",
    "label.area": "Area",
    "label.details": "View Details",
    "label.featured": "Featured of the Month",
    "label.sale": "For Sale",
    "label.rent": "For Rent",
    "label.back": "Back",
    "label.contact": "Contact",
    "label.address": "Address",
    "label.nearby": "Nearby Places",
    "label.features": "Features",
    "label.floorplans": "Available Floor Plans",
    "label.faq": "Frequently Asked Questions",
    "label.virtualtour": "360 Virtual Tour",
    "label.download_datasheet": "Download Datasheet (PDF)",
    "label.whatsapp_alert": "Receive Property Alerts",
    // Contact panel
    "contact.title": "Let's talk about your next property",
    "contact.subtitle": "Speak with me to answer your questions or schedule an exclusive visit.",
    "contact.button": "Contact Us on WhatsApp",
    "contact.title_main": "Talk to Paulo Martins",
    "contact.immediate": "Immediate Service",
    "contact.form_title": "Send a Message",
    "contact.name": "Name",
    "contact.phone": "Phone / WhatsApp",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.success": "Message sent successfully!",
    // Favorites
    "favorites.title": "Your Favorite Properties",
    "favorites.empty": "You haven't saved any favorite properties yet.",
    // Cookie Consent
    "cookie.text": "This website uses cookies to ensure you get the best experience on our website.",
    "cookie.accept": "Accept",
    // Footer
    "footer.rights": "All rights reserved.",
    "footer.creci": "CRECI-DF: 12345",
    "footer.dev": "Paulo Martins Real Estate Consulting."
  },
  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.about": "Sobre Mí",
    "nav.properties": "Propiedades",
    "nav.estate": "Alto Sobradinho",
    "nav.contact": "Contacto",
    "nav.favorites": "Favoritos",
    // Hero & Search
    "hero.title": "Encuentre la propiedad de sus sueños en Brasilia",
    "hero.subtitle": "Casas, apartamentos y áticos exclusivos en las mejores ubicaciones del Distrito Federal.",
    "search.placeholder": "Buscar por ubicación, tipo, dormitorios...",
    "search.all": "Todos",
    "search.type": "Tipo de Propiedad",
    "search.purpose": "Propósito",
    "search.beds": "Dormitorios",
    "search.price": "Precio Máximo",
    "search.button": "Buscar",
    // Labels
    "label.beds": "Dormitorios",
    "label.beds_short": "Dorm.",
    "label.parking": "Garajes",
    "label.parking_short": "Coches",
    "label.area": "Área",
    "label.details": "Ver Detalles",
    "label.featured": "Destacado del Mes",
    "label.sale": "Venta",
    "label.rent": "Alquiler",
    "label.back": "Volver",
    "label.contact": "Contacto",
    "label.address": "Dirección",
    "label.nearby": "Alrededores",
    "label.features": "Diferenciales",
    "label.floorplans": "Planos Disponibles",
    "label.faq": "Preguntas Frecuentes",
    "label.virtualtour": "Tour Virtual 360",
    "label.download_datasheet": "Descargar Ficha Técnica (PDF)",
    "label.whatsapp_alert": "Recibir Alertas de Propiedades",
    // Contact panel
    "contact.title": "Hablemos de su próxima propiedad",
    "contact.subtitle": "Hable conmigo para resolver sus dudas o programar una visita exclusiva.",
    "contact.button": "Contáctenos en WhatsApp",
    "contact.title_main": "Hable con Paulo Martins",
    "contact.immediate": "Atención Inmediata",
    "contact.form_title": "Enviar un Mensaje",
    "contact.name": "Nombre",
    "contact.phone": "Teléfono / WhatsApp",
    "contact.email": "Correo electrónico",
    "contact.message": "Mensaje",
    "contact.send": "Enviar Mensaje",
    "contact.success": "¡Mensaje enviado con éxito!",
    // Favorites
    "favorites.title": "Sus Propiedades Favoritas",
    "favorites.empty": "Aún no ha guardado ninguna propiedad como favorita.",
    // Cookie Consent
    "cookie.text": "Este sitio web utiliza cookies para garantizar que obtenga la mejor experiencia.",
    "cookie.accept": "Aceptar",
    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.creci": "CRECI-DF: 12345",
    "footer.dev": "Paulo Martins Consultoría Inmobiliaria."
  }
};

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
  translateDynamic: (text: string | undefined, cacheKey?: string) => Promise<string>;
  translateList: (list: string[] | undefined, cacheKey?: string) => Promise<string[]>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Durable translations cache so we don't recall the backend repeatedly
const localCacheKey = 'pm_dynamic_translations_cache_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('pm_lang');
    return (saved === 'en' || saved === 'es' || saved === 'pt') ? saved : 'pt';
  });
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Load cache from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(localCacheKey);
      if (stored) {
        setCache(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not parse local translations cache", e);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('pm_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['pt']?.[key] || key;
  };

  const translateDynamic = async (text: string | undefined, cacheKey?: string): Promise<string> => {
    if (!text) return '';
    if (language === 'pt') return text;

    const uniqueKey = `${language}:${cacheKey || text}`;
    if (cache[uniqueKey]) {
      return cache[uniqueKey];
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to: language })
      });
      if (res.ok) {
        const data = await res.json();
        const translationValue = data.translation || text;
        
        // Update both memory state and localStorage cache
        setCache(prev => {
          const updated = { ...prev, [uniqueKey]: translationValue };
          localStorage.setItem(localCacheKey, JSON.stringify(updated));
          return updated;
        });
        
        return translationValue;
      }
    } catch (err) {
      console.error("Translation request failed", err);
    } finally {
      setIsTranslating(false);
    }
    return text;
  };

  const translateList = async (list: string[] | undefined, cacheKey?: string): Promise<string[]> => {
    if (!list || list.length === 0) return [];
    if (language === 'pt') return list;

    // Check if entire list can be retrieved from cache
    const results: string[] = [];
    const missingIndices: number[] = [];
    const missingTexts: string[] = [];

    list.forEach((item, idx) => {
      const uniqueKey = `${language}:${cacheKey ? `${cacheKey}_item_${idx}` : item}`;
      if (cache[uniqueKey]) {
        results[idx] = cache[uniqueKey];
      } else {
        missingIndices.push(idx);
        missingTexts.push(item);
      }
    });

    if (missingTexts.length === 0) {
      return results;
    }

    try {
      setIsTranslating(true);
      const res = await fetch('/api/translate-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: missingTexts, to: language })
      });
      if (res.ok) {
        const data = await res.json();
        const serverTranslations: string[] = data.translations || [];
        
        setCache(prev => {
          const updated = { ...prev };
          missingIndices.forEach((origIdx, sliceIdx) => {
            const translatedText = serverTranslations[sliceIdx] || missingTexts[sliceIdx];
            const item = list[origIdx];
            const uniqueKey = `${language}:${cacheKey ? `${cacheKey}_item_${origIdx}` : item}`;
            updated[uniqueKey] = translatedText;
            results[origIdx] = translatedText;
          });
          localStorage.setItem(localCacheKey, JSON.stringify(updated));
          return updated;
        });
      } else {
        // Fallback to original text for missing
        missingIndices.forEach((origIdx) => {
          results[origIdx] = list[origIdx];
        });
      }
    } catch (err) {
      console.error("List translation failed", err);
      missingIndices.forEach((origIdx) => {
        results[origIdx] = list[origIdx];
      });
    } finally {
      setIsTranslating(false);
    }

    // Ensure all items are populated
    for (let i = 0; i < list.length; i++) {
      if (!results[i]) results[i] = list[i];
    }

    return results;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateDynamic, translateList, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
