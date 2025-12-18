
import React, { useEffect } from 'react';

interface SEOHelperProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export const SEOHelper: React.FC<SEOHelperProps> = ({ 
  title, 
  description, 
  image = 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png',
  type = 'website'
}) => {
  useEffect(() => {
    const fullTitle = `${title} | Paulo Martins – Brasília`;
    document.title = fullTitle;
    
    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, 'property');
      updateMeta('twitter:description', description, 'property');
    }

    updateMeta('og:title', fullTitle, 'property');
    updateMeta('twitter:title', fullTitle, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('twitter:image', image, 'property');
    updateMeta('og:type', type, 'property');

  }, [title, description, image, type]);

  return null;
};
