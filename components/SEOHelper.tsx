
import React, { useEffect } from 'react';

interface SEOHelperProps {
  title: string;
  description?: string;
}

export const SEOHelper: React.FC<SEOHelperProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = `${title} | Paulo Martins – Brasília`;
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
};
