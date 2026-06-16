import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { 
  ArrowLeft, Save, Upload, Loader2, Database, Check, AlertCircle, 
  Sparkles, Layers, Image as ImageIcon, HelpCircle, Phone, Info
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SEOHelper } from '../../components/SEOHelper';

const { useNavigate } = RouterDom;

interface GalleryItem {
  url: string;
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface PageData {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  tag_badge: string;
  broker_image: string;
  
  stat1_title: string;
  stat1_value: string;
  stat2_title: string;
  stat2_value: string;
  stat3_title: string;
  stat3_value: string;
  
  highlight1_title: string;
  highlight1_desc: string;
  highlight2_title: string;
  highlight2_desc: string;
  highlight3_title: string;
  highlight3_desc: string;
  highlight4_title: string;
  highlight4_desc: string;

  leisure_text: string;
  leisure_bullets: string; // comma separated
  leisure_image: string;

  location_text: string;
  location_image: string;

  whatsapp_number: string;
  whatsapp_text_lead: string;

  gallery_apartamento: GalleryItem[];
  gallery_lazer: GalleryItem[];
  gallery_implatacao: GalleryItem[];
  faq_items: FaqItem[];
}

const DEFAULT_LP: PageData = {
  id: 'alto-sobradinho',
  hero_title: 'Seu Novo Horizonte <br /> Tem Vista Privilegiada',
  hero_subtitle: 'Chegou a hora de morar com elegância e sofisticação em Sobradinho. Apartamentos de 2 quartos com ELEVADOR no ponto mais nobre da cidade, com varanda gourmet, área de lazer estilo Resort e financiamento facilitado.',
  hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
  tag_badge: 'Novo Lançamento de Alto Padrão',
  
  stat1_title: 'Elevador',
  stat1_value: 'Torres com',
  stat2_title: 'Ou Quintal Garden',
  stat2_value: 'Sacada Gourmet',
  stat3_title: '100% Equipado',
  stat3_value: 'Lazer Club',
  
  highlight1_title: 'Varanda Gourmet & Jardim',
  highlight1_desc: 'Opção com sacada integrada garantindo fluxo de vento e luz ou o exclusivo espaço Garden para criar pets e cultivar o seu jardim ao ar livre.',
  
  highlight2_title: 'Torres com Elevador',
  highlight2_desc: 'Diga adeus ao esforço de carregar compras por escadas. Comodidade absoluta em todas as torres para sua família usufruir de todas as áreas.',
  
  highlight3_title: 'Segurança 24 horas',
  highlight3_desc: 'Guarita de controle avançada em condomínio fechado com monitoramento e circuito inteligente para descanso total das suas noites.',
  
  highlight4_title: 'Pontal do Horizonte',
  highlight4_desc: 'Uma das melhores e mais deslumbrantes vistas panorâmicas da região norte do Distrito Federal. Ar puro e sossego do planalto central.',

  leisure_text: 'Não há nada melhor do que reunir amigos para um churrasco no final de semana ou dar um mergulho refrescante sem sair do condomínio. No Residencial Alto do Horizonte, sua qualidade de vida atinge um padrão luxuoso com áreas comuns completas, entregues totalmente mobiliadas e decoradas.',
  leisure_image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
  leisure_bullets: 'Piscinas Adulto & Infantil, Quiosques de Churrasqueiras, Salão de Festas Mobiliado, Academia Equipada, Quadra Esportiva Completa, Playground & Brinquedoteca, Espaço Pet Privativo, Praças e Boulevard Verde',

  location_text: 'Sobradinho é sinônimo de viver com qualidade de vida inigualável. O ponto mais alto da cidade traz vento fresco constante do cerrado, segurança de nível excelente e proximidade de toda a conveniência de comércios que sua rotina exige.',
  location_image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',

  whatsapp_number: '5561998522204',
  whatsapp_text_lead: 'Olá Paulo Martins, estou interessado no Residencial Alto do Horizonte (Alto Sobradinho). Gostaria de simular crédito!',
  broker_image: 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png',

  gallery_apartamento: [
    {
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      title: "Sala de Estar Integrada",
      desc: "Ambientes desenhados para máximo conforto, luminosidade natural abundante e integração contemporânea."
    },
    {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      title: "Cozinha Funcional & Varanda",
      desc: "Conexão perfeita com a área gourmet para que seus momentos culinários sejam compartilhados."
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      title: "Quarto Principal Aconchegante",
      desc: "Uma suíte compacta com excelente circulação de ar, acabamento refinado e isolamento térmico."
    }
  ],
  gallery_lazer: [
    {
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      title: "Piscina Resort Climatizada",
      desc: "Piscinas adulto e infantil com deck molhado e solárium em um complexo de lazer completo."
    },
    {
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      title: "Fitness Center Moderno",
      desc: "Academia completa equipada para treinos de cardio e força sem precisar sair do seu condomínio."
    },
    {
      url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
      title: "Espaço Gourmet & Churrasqueiras",
      desc: "Quiosques luxuosos e equipados para fazer churrasco com amigos e familiares de forma privativa."
    }
  ],
  gallery_implatacao: [
    {
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      title: "Fachada & Portaria Suprema",
      desc: "Pórtico de entrada imponente com segurança monitorada e paisagismo integrado de alto padrão."
    },
    {
      url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
      title: "Áreas Verdes & Praças",
      desc: "Percursos pavimentados envoltos em generosa vegetação natural para caminhadas no fim de tarde."
    }
  ],
  faq_items: [
    {
      question: "Qual é a localização exata do Residencial Alto do Horizonte?",
      answer: "O empreendimento possui uma das localizações mais estratégicas e privilegiadas de Sobradinho, no ponto mais alto e com uma vista deslumbrante de todo o horizonte. Está situado em uma região totalmente pavimentada e segura, cercada de verde e com fácil acesso a escolas, supermercados, academias e comércios locais de Sobradinho, a poucos minutos do centro e da saída para o Plano Piloto."
    },
    {
      question: "As torres possuem elevador?",
      answer: "Sim! Este é um dos maiores diferenciais do Residencial Alto do Horizonte nesta categoria na região: todas as torres contam com elevadores de última geração, garantindo conforto integral, facilidade extrema na locomoção diária e excelente valorização para o seu imóvel."
    },
    {
      question: "Quais são as tipologias de apartamentos disponíveis?",
      answer: "Temos apartamentos super modernos de 2 quartos com acabamento premium e excelente aproveitamento de espaço. Você pode escolher entre unidades padrão com varanda gourmet, ideais para receber amigos, ou apartamentos Garden (com área privativa de quintal gramado), perfeitos para quem tem pets, plantas ou quer mais amplitude privativa ao ar livre."
    },
    {
      question: "Como funciona a simulação e o financiamento?",
      answer: "O financiamento é facilitado pela Caixa Econômica Federal. Podemos utilizar o seu saldo de FGTS como entrada ou parte do pagamento. O empreendimento conta com taxas de juros altamente reduzidas, subsídios significativos pelo programa Minha Casa Minha Vida (MCMV) ou SBPE, e o Paulo Martins fará toda a simulação sem custo para encontrar o formato ideal para o seu orçamento familiar."
    },
    {
      question: "É possível comprar com entrada parcelada?",
      answer: "Sim, absolutamente! Oferecemos planos de pagamento super flexíveis, com a possibilidade de parcelamento de parte da entrada diretamente com a construtora durante o período de obras. Realize sua simulação personalizada gratuita para montarmos o melhor fluxo sob medida."
    },
    {
      question: "O condomínio é fechado? Há guarita de segurança?",
      answer: "Sim, o Residencial Alto do Horizonte é um condomínio 100% fechado, equipado com guarita moderna para portaria e controle eletrônico de acesso 24h, circuito interno de monitoramento por câmeras de segurança e área totalmente protegida para a máxima paz de espírito de sua família."
    }
  ]
};

export const AltoSobradinhoForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'seções' | 'galerias' | 'faqs'>('hero');
  const [formData, setFormData] = useState<PageData>(DEFAULT_LP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [showSqlHelp, setShowSqlHelp] = useState(false);

  // Load existing configuration from Supabase
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data, error } = await supabase
          .from('alto_sobradinho_page')
          .select('*')
          .eq('id', 'alto-sobradinho')
          .maybeSingle();

        if (error) {
          console.warn('Erro ao ler a tabela alto_sobradinho_page, usando defaults:', error);
        } else if (data) {
          // Parse complex JSON lists
          const parseList = (val: any, fallback: any) => {
            if (!val) return fallback;
            try {
              return typeof val === 'string' ? JSON.parse(val) : val;
            } catch (e) {
              console.error('Falha ao parsear item JSON:', e);
              return fallback;
            }
          };

          setFormData({
            id: 'alto-sobradinho',
            hero_title: data.hero_title || DEFAULT_LP.hero_title,
            hero_subtitle: data.hero_subtitle || DEFAULT_LP.hero_subtitle,
            hero_image: data.hero_image || DEFAULT_LP.hero_image,
            tag_badge: data.tag_badge || DEFAULT_LP.tag_badge,
            
            stat1_title: data.stat1_title || DEFAULT_LP.stat1_title,
            stat1_value: data.stat1_value || DEFAULT_LP.stat1_value,
            stat2_title: data.stat2_title || DEFAULT_LP.stat2_title,
            stat2_value: data.stat2_value || DEFAULT_LP.stat2_value,
            stat3_title: data.stat3_title || DEFAULT_LP.stat3_title,
            stat3_value: data.stat3_value || DEFAULT_LP.stat3_value,
            
            highlight1_title: data.highlight1_title || DEFAULT_LP.highlight1_title,
            highlight1_desc: data.highlight1_desc || DEFAULT_LP.highlight1_desc,
            highlight2_title: data.highlight2_title || DEFAULT_LP.highlight2_title,
            highlight2_desc: data.highlight2_desc || DEFAULT_LP.highlight2_desc,
            highlight3_title: data.highlight3_title || DEFAULT_LP.highlight3_title,
            highlight3_desc: data.highlight3_desc || DEFAULT_LP.highlight3_desc,
            highlight4_title: data.highlight4_title || DEFAULT_LP.highlight4_title,
            highlight4_desc: data.highlight4_desc || DEFAULT_LP.highlight4_desc,

            leisure_text: data.leisure_text || DEFAULT_LP.leisure_text,
            leisure_bullets: data.leisure_bullets || DEFAULT_LP.leisure_bullets,
            leisure_image: data.leisure_image || DEFAULT_LP.leisure_image,

            location_text: data.location_text || DEFAULT_LP.location_text,
            location_image: data.location_image || DEFAULT_LP.location_image,

            whatsapp_number: data.whatsapp_number || DEFAULT_LP.whatsapp_number,
            whatsapp_text_lead: data.whatsapp_text_lead || DEFAULT_LP.whatsapp_text_lead,
            broker_image: data.broker_image || DEFAULT_LP.broker_image,

            gallery_apartamento: parseList(data.gallery_apartamento, DEFAULT_LP.gallery_apartamento),
            gallery_lazer: parseList(data.gallery_lazer, DEFAULT_LP.gallery_lazer),
            gallery_implatacao: parseList(data.gallery_implatacao, DEFAULT_LP.gallery_implatacao),
            faq_items: parseList(data.faq_items, DEFAULT_LP.faq_items)
          });
        }
      } catch (err) {
        console.error('Falha geral ao puxar dados da landing page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof PageData, indexUrl?: { category: 'gallery_apartamento' | 'gallery_lazer' | 'gallery_implatacao', idx: number }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const identifier = indexUrl ? `${indexUrl.category}_${indexUrl.idx}` : String(fieldName);
    setUploadingImage(identifier);
    setError('');
    setMessage('');

    try {
      try {
        await supabase.storage.createBucket('fotos', { public: true });
      } catch (err) {
        console.log('Bucket already exists:', err);
      }

      const fileExt = file.name.split('.').pop();
      const rawFileName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueId = Math.random().toString(36).substring(2, 11);
      const fileName = `lp_sobradinho_${rawFileName}_${uniqueId}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('fotos')
        .getPublicUrl(fileName);

      if (indexUrl) {
        const cat = indexUrl.category;
        const index = indexUrl.idx;
        setFormData(prev => {
          const list = [...(prev[cat] as GalleryItem[])];
          list[index] = { ...list[index], url: publicUrl };
          return { ...prev, [cat]: list };
        });
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: publicUrl }));
      }
      setMessage('Imagem enviada e aplicada!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao fazer upload da foto.');
    } finally {
      setUploadingImage(null);
    }
  };

  // Complex list utilities
  const handleFaqChange = (idx: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const list = [...prev.faq_items];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, faq_items: list };
    });
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq_items: [...prev.faq_items, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      faq_items: prev.faq_items.filter((_, i) => i !== idx)
    }));
  };

  // Gallery items management
  const handleGalleryItemChange = (cat: 'gallery_apartamento' | 'gallery_lazer' | 'gallery_implatacao', idx: number, field: 'url' | 'title' | 'desc', value: string) => {
    setFormData(prev => {
      const list = [...(prev[cat] as GalleryItem[])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, [cat]: list };
    });
  };

  const addGalleryItem = (cat: 'gallery_apartamento' | 'gallery_lazer' | 'gallery_implatacao') => {
    setFormData(prev => ({
      ...prev,
      [cat]: [...(prev[cat] as GalleryItem[]), { url: '', title: '', desc: '' }]
    }));
  };

  const removeGalleryItem = (cat: 'gallery_apartamento' | 'gallery_lazer' | 'gallery_implatacao', idx: number) => {
    setFormData(prev => ({
      ...prev,
      [cat]: (prev[cat] as GalleryItem[]).filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error: saveError } = await supabase
        .from('alto_sobradinho_page')
        .upsert({
          id: 'alto-sobradinho',
          hero_title: formData.hero_title.trim(),
          hero_subtitle: formData.hero_subtitle.trim(),
          hero_image: formData.hero_image.trim(),
          tag_badge: formData.tag_badge.trim(),
          
          stat1_title: formData.stat1_title.trim(),
          stat1_value: formData.stat1_value.trim(),
          stat2_title: formData.stat2_title.trim(),
          stat2_value: formData.stat2_value.trim(),
          stat3_title: formData.stat3_title.trim(),
          stat3_value: formData.stat3_value.trim(),
          
          highlight1_title: formData.highlight1_title.trim(),
          highlight1_desc: formData.highlight1_desc.trim(),
          highlight2_title: formData.highlight2_title.trim(),
          highlight2_desc: formData.highlight2_desc.trim(),
          highlight3_title: formData.highlight3_title.trim(),
          highlight3_desc: formData.highlight3_desc.trim(),
          highlight4_title: formData.highlight4_title.trim(),
          highlight4_desc: formData.highlight4_desc.trim(),

          leisure_text: formData.leisure_text.trim(),
          leisure_bullets: formData.leisure_bullets.trim(),
          leisure_image: formData.leisure_image.trim(),

          location_text: formData.location_text.trim(),
          location_image: formData.location_image.trim(),

          whatsapp_number: formData.whatsapp_number.trim(),
          whatsapp_text_lead: formData.whatsapp_text_lead.trim(),
          broker_image: formData.broker_image.trim(),

          gallery_apartamento: JSON.stringify(formData.gallery_apartamento),
          gallery_lazer: JSON.stringify(formData.gallery_lazer),
          gallery_implatacao: JSON.stringify(formData.gallery_implatacao),
          faq_items: JSON.stringify(formData.faq_items)
        });

      if (saveError) {
        if (saveError.code === '42P01') {
          throw new Error('A tabela "alto_sobradinho_page" não existe no Supabase. Execute o SQL abaixo para criá-la!');
        }
        if (saveError.code === '42703') {
          throw new Error('A coluna "broker_image" está faltando na sua tabela "alto_sobradinho_page". Execute o comando seguinte no SQL Editor do seu Supabase para criá-la:\n\nALTER TABLE alto_sobradinho_page ADD COLUMN IF NOT EXISTS broker_image TEXT;');
        }
        throw saveError;
      }

      setMessage('Landing Page "Alto Sobradinho" salva e atualizada com sucesso!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao gravar as configurações no banco.');
    } finally {
      setSaving(false);
    }
  };

  const sqlCode = `-- Crie a tabela alto_sobradinho_page no SQL Editor do seu Supabase
CREATE TABLE IF NOT EXISTS alto_sobradinho_page (
  id TEXT PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image TEXT,
  tag_badge TEXT,
  broker_image TEXT,
  
  stat1_title TEXT,
  stat1_value TEXT,
  stat2_title TEXT,
  stat2_value TEXT,
  stat3_title TEXT,
  stat3_value TEXT,
  
  highlight1_title TEXT,
  highlight1_desc TEXT,
  highlight2_title TEXT,
  highlight2_desc TEXT,
  highlight3_title TEXT,
  highlight3_desc TEXT,
  highlight4_title TEXT,
  highlight4_desc TEXT,

  leisure_text TEXT,
  leisure_bullets TEXT,
  leisure_image TEXT,

  location_text TEXT,
  location_image TEXT,
  
  whatsapp_number TEXT,
  whatsapp_text_lead TEXT,
  
  gallery_apartamento TEXT,
  gallery_lazer TEXT,
  gallery_implatacao TEXT,
  faq_items TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e criar políticas
ALTER TABLE alto_sobradinho_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura pública de sobradinho" ON alto_sobradinho_page FOR SELECT TO public USING (true);
CREATE POLICY "Permitir tudo a autenticados para sobradinho" ON alto_sobradinho_page FOR ALL TO authenticated USING (true);
`;

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <SEOHelper title="Administrar Landing Page Alto Sobradinho" description="Gerencie todo o conteúdo textual e imagens da landing page do Residencial Alto do Horizonte." />

      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Painel
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-white">Editar Landing Page Sobradinho</h1>
            <p className="text-gray-400 text-sm mt-1">Controle o conteúdo, depoimentos, fotos e simulações do Residencial Alto do Horizonte</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlHelp(!showSqlHelp)}
            className="flex items-center gap-2 text-xs border border-white/10 text-gray-400 hover:text-gold-400 px-4 py-2 rounded-lg bg-dark-900 transition-all self-start md:self-auto"
          >
            <Database size={14} /> 
            {showSqlHelp ? 'Ocultar código SQL' : 'Configuração Supabase SQL'}
          </button>
        </div>

        {showSqlHelp && (
          <div className="bg-dark-900 border border-gold-600/20 p-6 rounded-xl mb-8 animate-fade-in space-y-4">
            <h3 className="text-white font-serif flex items-center gap-2 text-md">
              <Database size={18} className="text-gold-400" />
              Tabela de Configuração da Landing Page
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Execute este código no Painel do Supabase &rarr; SQL Editor para inicializar a tabela se receber erros ao salvar:
            </p>
            <pre className="bg-dark-950 border border-white/5 p-4 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto select-all max-h-60 leading-relaxed">
              {sqlCode}
            </pre>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 mb-6 bg-dark-900 border border-white/5 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`px-5 py-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'hero' ? 'bg-gold-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Sparkles size={14} /> Hero e Destaques
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seções')}
            className={`px-5 py-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'seções' ? 'bg-gold-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Layers size={14} /> Seções e Lazer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('galerias')}
            className={`px-5 py-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'galerias' ? 'bg-gold-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <ImageIcon size={14} /> Galerias de Fotos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-5 py-3 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'faqs' ? 'bg-gold-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <HelpCircle size={14} /> Perguntas (FAQS)
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-gold-500 mx-auto mb-4" size={32} />
            <p className="text-gray-400 text-sm">Puxando dados da landing page...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="bg-dark-900 border border-white/5 p-8 rounded-xl shadow-2xl space-y-6">
              
              {/* Messages */}
              {message && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-center gap-3 text-sm">
                  <Check size={18} />
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    <strong>Aviso de Banco de Dados:</strong>
                  </div>
                  <span className="leading-relaxed">{error}</span>
                  {!showSqlHelp && (
                    <button 
                      type="button" 
                      onClick={() => setShowSqlHelp(true)}
                      className="text-gold-400 hover:underline text-xs flex items-center gap-1 mt-1 text-left"
                    >
                      Como criar esta tabela agora mesmo &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* TAB 1: HERO & METRICS */}
              {activeTab === 'hero' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="text-white text-md font-serif">Cabeçalho Principal & Hero</h3>
                    <p className="text-xs text-gray-400">Personalize o topo imersivo da página</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Tag de Destaque Flutuante</label>
                      <input name="tag_badge" value={formData.tag_badge} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm" placeholder="Ex: Novo Lançamento" />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Título Principal (Aceita &lt;br /&gt;)</label>
                      <input name="hero_title" value={formData.hero_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Subtítulo / Descrição da Chamada</label>
                    <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} rows={3} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm leading-relaxed" />
                  </div>

                  {/* Hero Background Image */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Foto de Fundo do Hero (Filtro Escuro Dinâmico)</label>
                      <input name="hero_image" value={formData.hero_image} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none mb-3" />
                      <div className="flex items-center gap-3">
                        <label className="bg-dark-800 hover:bg-dark-700 text-[11px] text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10">
                          {uploadingImage === 'hero_image' ? (
                            <span className="flex items-center gap-1"><Loader2 className="animate-spin" size={11} /> Carregando...</span>
                          ) : 'Upload Nova Foto'}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image')} disabled={uploadingImage === 'hero_image'} className="hidden" />
                        </label>
                        <span className="text-gray-500 text-[10px]">Ou cole qualquer imagem da Unsplash</span>
                      </div>
                    </div>
                  </div>

                  {/* Contacts and Leads */}
                  <div className="border-t border-white/5 pt-6 space-y-6">
                    <div className="border-b border-white/5 pb-2">
                      <h4 className="text-white text-sm uppercase tracking-wider flex items-center gap-2"><Phone size={14} className="text-gold-400" /> Gatilhos de Contato WhatsApp</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Número do WhatsApp (Com Código de País + DDD)</label>
                        <input name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm font-mono" placeholder="Ex: 5561998522204" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Mala Direta / WhatsApp Text Inicial</label>
                        <input name="whatsapp_text_lead" value={formData.whatsapp_text_lead} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Broker Image Configuration */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h4 className="text-white text-sm uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon size={14} className="text-gold-400" /> Foto do Corretor (Rodapé da Landing Page)
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Caminho da Foto do Corretor</label>
                          <input name="broker_image" value={formData.broker_image} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none" />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="bg-dark-800 hover:bg-dark-700 text-[10px] text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10">
                            {uploadingImage === 'broker_image' ? (
                              <span className="flex items-center gap-1"><Loader2 className="animate-spin" size={11} /> Processando...</span>
                            ) : 'Upload Nova Foto'}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'broker_image')} disabled={uploadingImage === 'broker_image'} className="hidden" />
                          </label>
                          <span className="text-gray-500 text-[10px]">Recomendado: foto em formato quadrado</span>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gold-400 bg-dark-800 flex items-center justify-center">
                          {formData.broker_image ? (
                            <img src={formData.broker_image} className="w-full h-full object-cover" alt="Corretor Preview" />
                          ) : (
                            <span className="text-gray-500 text-xs">Sem foto</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small Banner metrics (3 items) */}
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-white text-sm uppercase tracking-wider mb-4 font-semibold">Destaques da Faixa Hero (3 itens rápidos)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-black/25 p-4 rounded-lg border border-white/5 space-y-2">
                        <span className="text-gold-400 text-[10px] font-bold">ITEM 1</span>
                        <input name="stat1_value" value={formData.stat1_value} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white mb-1.5" placeholder="Título (Ex: Torres com)" />
                        <input name="stat1_title" value={formData.stat1_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white" placeholder="Rótulo (Ex: Elevador)" />
                      </div>
                      <div className="bg-black/25 p-4 rounded-lg border border-white/5 space-y-2">
                        <span className="text-gold-400 text-[10px] font-bold">ITEM 2</span>
                        <input name="stat2_value" value={formData.stat2_value} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white mb-1.5" placeholder="Título" />
                        <input name="stat2_title" value={formData.stat2_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white" placeholder="Rótulo" />
                      </div>
                      <div className="bg-black/25 p-4 rounded-lg border border-white/5 space-y-2">
                        <span className="text-gold-400 text-[10px] font-bold">ITEM 3</span>
                        <input name="stat3_value" value={formData.stat3_value} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white mb-1.5" placeholder="Título" />
                        <input name="stat3_title" value={formData.stat3_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/5 rounded px-2 py-1 text-xs text-white" placeholder="Rótulo" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SECTIONS & LAZER */}
              {activeTab === 'seções' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Highlights Grid (4 blocks) */}
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-white text-md font-serif">Abaixo do Hero: Grade de 4 Destaques</h3>
                      <p className="text-xs text-gray-400">Gerencie títulos e parágrafos rápidos</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Highlight 1 */}
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                        <span className="text-gold-400 text-xs font-bold uppercase">Bloco 1</span>
                        <input name="highlight1_title" value={formData.highlight1_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <textarea name="highlight1_desc" value={formData.highlight1_desc} onChange={handleChange} rows={2} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      {/* Highlight 2 */}
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                        <span className="text-gold-400 text-xs font-bold uppercase">Bloco 2</span>
                        <input name="highlight2_title" value={formData.highlight2_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <textarea name="highlight2_desc" value={formData.highlight2_desc} onChange={handleChange} rows={2} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      {/* Highlight 3 */}
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                        <span className="text-gold-400 text-xs font-bold uppercase">Bloco 3</span>
                        <input name="highlight3_title" value={formData.highlight3_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <textarea name="highlight3_desc" value={formData.highlight3_desc} onChange={handleChange} rows={2} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      {/* Highlight 4 */}
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                        <span className="text-gold-400 text-xs font-bold uppercase">Bloco 4</span>
                        <input name="highlight4_title" value={formData.highlight4_title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <textarea name="highlight4_desc" value={formData.highlight4_desc} onChange={handleChange} rows={2} className="w-full bg-dark-950 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* Resort / Club Lazer panel */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-white text-md font-serif">Seção Clube de Lazer</h3>
                      <p className="text-xs text-gray-400">Customize textos, facilidades do resort e foto correspondente</p>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Texto Explicativo Geral do Clube</label>
                      <textarea name="leisure_text" value={formData.leisure_text} onChange={handleChange} rows={4} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-light leading-relaxed text-gray-300" />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Facilidades / Marcadores do Clube (Separados por vírgula)</label>
                      <textarea name="leisure_bullets" value={formData.leisure_bullets} onChange={handleChange} rows={2} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-xs leading-relaxed font-mono" placeholder="Piscina, Academia, Quadras..." />
                      <span className="text-[10px] text-gray-500 mt-1 block">Cada item separado por vírgula se tornará um marcador com ícone verde na página.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Caminho da foto de Lazer</label>
                        <input name="leisure_image" value={formData.leisure_image} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none" />
                        <label className="bg-dark-800 hover:bg-dark-700 text-[10px] inline-block text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10 mt-2">
                          {uploadingImage === 'leisure_image' ? 'Processando...' : 'Carregar Nova Imagem'}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'leisure_image')} disabled={uploadingImage === 'leisure_image'} className="hidden" />
                        </label>
                      </div>
                      <div className="aspect-video bg-white/5 border border-white/10 rounded overflow-hidden max-w-xs justify-center mx-auto w-full h-[100px] flex items-center">
                        {formData.leisure_image && <img src={formData.leisure_image} className="w-full h-full object-cover" alt="Lazer Preview" />}
                      </div>
                    </div>
                  </div>

                  {/* Localização area */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-white text-md font-serif">Seção Localização & Proximidade</h3>
                      <p className="text-xs text-gray-400">Gerencie o depoimento e mapa ilustrativo da região de Sobradinho</p>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Descrição de Destaque para Localidade</label>
                      <textarea name="location_text" value={formData.location_text} onChange={handleChange} rows={3} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Caminho da foto de Localização</label>
                        <input name="location_image" value={formData.location_image} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none" />
                        <label className="bg-dark-800 hover:bg-dark-700 text-[10px] inline-block text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10 mt-2">
                          {uploadingImage === 'location_image' ? 'Processando...' : 'Carregar Nova Imagem'}
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'location_image')} disabled={uploadingImage === 'location_image'} className="hidden" />
                        </label>
                      </div>
                      <div className="aspect-video bg-white/5 border border-white/10 rounded overflow-hidden max-w-xs justify-center mx-auto w-full h-[100px] flex items-center">
                        {formData.location_image && <img src={formData.location_image} className="w-full h-full object-cover" alt="Localização Preview" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GALLERY SLIDERS */}
              {activeTab === 'galerias' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-white text-md font-serif">Galeria Tabulada de Fotos</h3>
                    <p className="text-xs text-gray-400 font-light">Controle os slides sob cada aba da galeria iterativa: Os Apartamentos, Clube de Lazer e Fachada/Segurança</p>
                  </div>

                  {/* GALLERY CATEGORY: APARTAMENTOS */}
                  <div className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={14} /> Aba 1: Os Apartamentos</span>
                      <button type="button" onClick={() => addGalleryItem('gallery_apartamento')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-dark-800 text-white hover:text-gold-400 border border-white/10 hover:border-gold-500/30">Adicionar Slide</button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {formData.gallery_apartamento.map((item, idx) => (
                        <div key={idx} className="bg-dark-950 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 relative border border-white/5 hover:border-white/10">
                          <button type="button" onClick={() => removeGalleryItem('gallery_apartamento', idx)} className="text-gray-500 hover:text-red-400 absolute top-2 right-2 text-xs font-bold">Remover</button>
                          <div className="w-20 h-16 bg-white/5 rounded border border-white/10 overflow-hidden shrink-0">
                            {item.url && <img src={item.url} className="w-full h-full object-cover" />}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow w-full">
                            <input value={item.title} onChange={(e) => handleGalleryItemChange('gallery_apartamento', idx, 'title', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Título do Slide" />
                            <input value={item.desc} onChange={(e) => handleGalleryItemChange('gallery_apartamento', idx, 'desc', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Breve descritivo..." />
                            <div className="space-y-1.5">
                              <input value={item.url} onChange={(e) => handleGalleryItemChange('gallery_apartamento', idx, 'url', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded px-2.5 py-1 text-[11px] text-white" placeholder="URL da foto" />
                              <label className="text-[9px] bg-dark-800 px-2 py-1 rounded inline-block cursor-pointer font-bold uppercase tracking-wider text-gray-300">
                                {uploadingImage === `gallery_apartamento_${idx}` ? 'Carregando...' : 'Fazer Upload'}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image', { category: 'gallery_apartamento', idx })} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GALLERY CATEGORY: LAZER */}
                  <div className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={14} /> Aba 2: Clube de Lazer</span>
                      <button type="button" onClick={() => addGalleryItem('gallery_lazer')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-dark-800 text-white hover:text-gold-400 border border-white/10 hover:border-gold-500/30">Adicionar Slide</button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {formData.gallery_lazer.map((item, idx) => (
                        <div key={idx} className="bg-dark-950 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 relative border border-white/5 hover:border-white/10">
                          <button type="button" onClick={() => removeGalleryItem('gallery_lazer', idx)} className="text-gray-500 hover:text-red-400 absolute top-2 right-2 text-xs font-bold">Remover</button>
                          <div className="w-20 h-16 bg-white/5 rounded border border-white/10 overflow-hidden shrink-0">
                            {item.url && <img src={item.url} className="w-full h-full object-cover" />}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow w-full">
                            <input value={item.title} onChange={(e) => handleGalleryItemChange('gallery_lazer', idx, 'title', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Título do Slide" />
                            <input value={item.desc} onChange={(e) => handleGalleryItemChange('gallery_lazer', idx, 'desc', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Breve descritivo..." />
                            <div className="space-y-1.5">
                              <input value={item.url} onChange={(e) => handleGalleryItemChange('gallery_lazer', idx, 'url', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded px-2.5 py-1 text-[11px] text-white" placeholder="URL da foto" />
                              <label className="text-[9px] bg-dark-800 px-2 py-1 rounded inline-block cursor-pointer font-bold uppercase tracking-wider text-gray-300">
                                {uploadingImage === `gallery_lazer_${idx}` ? 'Carregando...' : 'Fazer Upload'}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image', { category: 'gallery_lazer', idx })} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GALLERY CATEGORY: IMPLANTACAO / SECURITY */}
                  <div className="bg-black/30 border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><ImageIcon size={14} /> Aba 3: Fachada & Segurança</span>
                      <button type="button" onClick={() => addGalleryItem('gallery_implatacao')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-dark-800 text-white hover:text-gold-400 border border-white/10 hover:border-gold-500/30">Adicionar Slide</button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {formData.gallery_implatacao.map((item, idx) => (
                        <div key={idx} className="bg-dark-950 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 relative border border-white/5 hover:border-white/10">
                          <button type="button" onClick={() => removeGalleryItem('gallery_implatacao', idx)} className="text-gray-500 hover:text-red-400 absolute top-2 right-2 text-xs font-bold">Remover</button>
                          <div className="w-20 h-16 bg-white/5 rounded border border-white/10 overflow-hidden shrink-0">
                            {item.url && <img src={item.url} className="w-full h-full object-cover" />}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow w-full">
                            <input value={item.title} onChange={(e) => handleGalleryItemChange('gallery_implatacao', idx, 'title', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Título do Slide" />
                            <input value={item.desc} onChange={(e) => handleGalleryItemChange('gallery_implatacao', idx, 'desc', e.target.value)} className="bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white" placeholder="Breve descritivo..." />
                            <div className="space-y-1.5">
                              <input value={item.url} onChange={(e) => handleGalleryItemChange('gallery_implatacao', idx, 'url', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded px-2.5 py-1 text-[11px] text-white" placeholder="URL da foto" />
                              <label className="text-[9px] bg-dark-800 px-2 py-1 rounded inline-block cursor-pointer font-bold uppercase tracking-wider text-gray-300">
                                {uploadingImage === `gallery_implatacao_${idx}` ? 'Carregando...' : 'Fazer Upload'}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image', { category: 'gallery_implatacao', idx })} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ACCORDION FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-white text-md font-serif">Aba 4: Dúvidas Regulamentares (FAQ)</h3>
                      <p className="text-xs text-gray-400">Personalize o acordeão com esclarecimentos rápidos</p>
                    </div>
                    <button type="button" onClick={addFaq} className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-gold-600 font-bold hover:bg-gold-500 text-white transition-colors">Adicionar Nova Pergunta</button>
                  </div>

                  <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
                    {formData.faq_items.map((item, idx) => (
                      <div key={idx} className="bg-dark-950 p-5 rounded-xl border border-white/5 relative hover:border-gold-400/20 transition-all space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gold-400 font-serif text-xs uppercase font-bold tracking-wider">Acordeão #{idx + 1}</span>
                          <button type="button" onClick={() => removeFaq(idx)} className="text-red-400 text-xs hover:underline bg-red-950/20 px-2.5 py-1 rounded transition-colors font-medium">Deletar Item</button>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold">Pergunta formulada</label>
                          <input required value={item.question} onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-xs text-white" placeholder="Escreva a dúvida mais frequente dos clientes..." />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold">Resposta correspondente</label>
                          <textarea required value={item.answer} onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} rows={3} className="w-full bg-dark-900 border border-white/10 rounded px-3 py-2 text-xs text-white leading-relaxed font-light" placeholder="Forneça uma resposta rica, explicativa e profissional..." />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit panel */}
              <div className="border-t border-white/5 pt-6">
                <button 
                  type="submit" 
                  disabled={saving || uploadingImage !== null}
                  className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70 cursor-pointer text-sm font-bold uppercase tracking-wider"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin text-white" size={18} />
                      Sincronizando Conteúdo da Landing Page no Supabase...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Salvar Todas as Abas da Landing Page
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};
