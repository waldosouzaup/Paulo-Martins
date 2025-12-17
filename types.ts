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
}

export interface NavItem {
  label: string;
  path: string;
}