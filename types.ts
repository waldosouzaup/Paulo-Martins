export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  images?: string[]; // Extra images for details page
  beds: number | string;
  parking: number | string;
  area: string;
  tag: string;
  description?: string;
  features?: string[];
  // New fields
  purpose?: string; // Venda ou Aluguel
  type?: string;    // Casa, Apartamento, etc.
  city?: string;    // Cidade
  videoUrl?: string; // URL do vídeo (YouTube, Vimeo, etc)
  is_featured?: boolean; // Imóvel do Mês
  slug?: string; // Slug amigável da URL para o imóvel
  floorPlanUrl?: string; // URL da planta baixa do imóvel
  floorPlans?: FloorPlan[]; // Novas plantas de imóvel (até 5 plantas com descrição)
  brief_desc_home?: string; // Descrição breve home usado no destaque do mês
  nearby_school?: string;
  nearby_university?: string;
  nearby_shopping?: string;
  nearby_restaurant?: string;
  nearby_hospital?: string;
  nearby_banks?: string;
  nearby_supermarkets?: string;
  nearby_gyms?: string;
  nearby_bakeries?: string;
  nearby_transport?: string;
  faqs?: PropertyFAQ[]; // Perguntas e respostas frequentes para este imóvel
  virtualTourUrl?: string; // URL ou embed do tour virtual 360º
  virtualTours?: VirtualTour[]; // Múltiplos ambientes de tour virtual 360º
  seoTitle?: string; // Título SEO customizado
  seoDescription?: string; // Descrição SEO customizada
  seoImageUrl?: string; // Imagem SEO de compartilhamento customizada
  address?: string; // Endereço do imóvel
  datasheetUrl?: string; // Link/arquivo da ficha técnica completa (Upload ou Link)
  display_order?: number; // Ordem que os imóveis cadastrados devem aparecer
}

export interface FloorPlan {
  url: string;
  description: string;
}

export interface VirtualTour {
  title: string;
  url: string;
}

export interface PropertyFAQ {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  path: string;
}