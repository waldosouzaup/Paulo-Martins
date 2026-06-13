
import React, { useEffect } from 'react';

interface SEOHelperProps {
  title: string;
  description?: string;
  image?: string;
  urlPath?: string;
}

export const SEOHelper: React.FC<SEOHelperProps> = ({ title, description, image, urlPath }) => {
  useEffect(() => {
    const fullTitle = `${title} | Paulo Martins – Brasília`;
    document.title = fullTitle;
    
    // Helper to select or automatically create meta tags
    const setMeta = (propertyType: 'name' | 'property', propertyValue: string, content: string) => {
      let meta = document.querySelector(`meta[${propertyType}="${propertyValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(propertyType, propertyValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    setMeta('property', 'og:title', fullTitle);
    setMeta('name', 'twitter:title', fullTitle);

    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    // Set canonical link dynamic mapping
    const currentLoc = window.location.origin + (urlPath || window.location.pathname + window.location.hash);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentLoc);
    setMeta('property', 'og:url', currentLoc);

  }, [title, description, image, urlPath]);

  return null;
};
