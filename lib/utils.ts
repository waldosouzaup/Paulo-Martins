/**
 * Formata as tags dos imóveis para exibição correta e amigável (ex: "Novo", "Lançamento", etc).
 */
export const formatPropertyTag = (tag: string): string => {
  if (!tag) return '';
  const cleanTag = tag.trim().toUpperCase();
  
  switch (cleanTag) {
    case 'NOVO':
      return 'Novo';
    case 'LANCAMENTO':
    case 'LANÇAMENTO':
    case 'LANCAMENTOS':
    case 'LANÇAMENTOS':
      return 'Lançamento';
    case 'PREMIUM':
      return 'Premium';
    case 'EXCLUSIVO':
      return 'Exclusivo';
    case 'OPORTUNIDADE':
      return 'Oportunidade';
    case 'PRONTO':
      return 'Pronto';
    default:
      // Converte para Capitalize Case (primeira letra maiúscula, resto minúscula de cada palavra)
      return tag
        .toLowerCase()
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  }
};

/**
 * Converte um texto arbitrário em um slug amigável para URLs.
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // divide caracteres com acentos em partes separadas
    .replace(/[\u0300-\u036f]/g, '') // remove a parte do acento
    .replace(/[^\w\s-]/g, '') // remove caracteres que não sejam letras, números ou hifen/espaço
    .replace(/\s+/g, '-') // converte espaços em hifens
    .replace(/-+/g, '-') // remove hifens repetidos
    .trim();
};

