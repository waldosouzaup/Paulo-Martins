import React, { useState, useEffect } from 'react';
import { SEOHelper } from '../components/SEOHelper';
import { supabase } from '../lib/supabase';
import { 
  Home as HomeIcon, 
  Compass, 
  ShieldCheck, 
  Trees, 
  MapPin, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  MessageSquare, 
  Users, 
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeDollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const AltoSobradinho: React.FC = () => {
  // Database states
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch configs from Supabase and listen to real-time changes
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data, error } = await supabase
          .from('alto_sobradinho_page')
          .select('*')
          .eq('id', 'alto-sobradinho')
          .maybeSingle();

        if (error) {
          console.error('Supabase error reading alto_sobradinho_page:', error);
        } else if (data) {
          setDbData(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar conteúdo da LP:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();

    // Set up Realtime channel subscription to auto-sync modifications without refreshing
    const channel = supabase
      .channel('alto_sobradinho_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alto_sobradinho_page',
          filter: 'id=eq.alto-sobradinho'
        },
        (payload) => {
          console.log('Realtime update received for Alto Sobradinho LP:', payload);
          if (payload.new && Object.keys(payload.new).length > 0) {
            setDbData(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helpers to resolve configs or use defaults
  const getVal = (field: string, defaultVal: string) => {
    return (dbData && dbData[field]) ? dbData[field] : defaultVal;
  };

  const getList = (field: string, defaultVal: any) => {
    if (!dbData || !dbData[field]) return defaultVal;
    try {
      return typeof dbData[field] === 'string' ? JSON.parse(dbData[field]) : dbData[field];
    } catch (e) {
      console.error('Erro ao ler lista do banco:', e);
      return defaultVal;
    }
  };

  // Gallery states
  const [activeTab, setActiveTab] = useState<'apartamento' | 'lazer' | 'implatacao'>('apartamento');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);

  // Reset active photo index when activeTab changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [activeTab]);

  // Accordion FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    interesse: 'Quero receber fotos e tabela',
    newsletter: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Simple simulator states
  const [rendaFamiliar, setRendaFamiliar] = useState<number>(3500);

  // Resolve All Dynamic Fields
  const heroTitle = getVal('hero_title', 'Seu Novo Horizonte <br /> Tem Vista Privilegiada');
  const heroSubtitle = getVal('hero_subtitle', 'Chegou a hora de morar com elegância e sofisticação em Sobradinho. Apartamentos de 2 quartos com ELEVADOR no ponto mais nobre da cidade, com varanda gourmet, área de lazer estilo Resort e financiamento facilitado.');
  const heroImage = getVal('hero_image', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80');
  const tagBadge = getVal('tag_badge', 'Novo Lançamento de Alto Padrão');

  const stat1Value = getVal('stat1_value', 'Torres com');
  const stat1Title = getVal('stat1_title', 'Elevador');
  const stat2Value = getVal('stat2_value', 'Sacada Gourmet');
  const stat2Title = getVal('stat2_title', 'Ou Quintal Garden');
  const stat3Value = getVal('stat3_value', 'Lazer Club');
  const stat3Title = getVal('stat3_title', '100% Equipado');

  const highlight1Title = getVal('highlight1_title', 'Varanda Gourmet & Jardim');
  const highlight1Desc = getVal('highlight1_desc', 'Opções com sacada integrada garantindo fluxo de vento e luz ou o exclusivo espaço Garden para criar pets e cultivar o seu jardim ao ar livre.');
  const highlight2Title = getVal('highlight2_title', 'Torres com Elevador');
  const highlight2Desc = getVal('highlight2_desc', 'Diga adeus ao esforço de carregar compras por escadas. Comodidade absoluta em todas as torres para sua família usufruir todos as áreas.');
  const highlight3Title = getVal('highlight3_title', 'Segurança 24 horas');
  const highlight3Desc = getVal('highlight3_desc', 'Guarita de controle avançada em condomínio fechado com monitoramento e circuito inteligente para descanso total das suas noites.');
  const highlight4Title = getVal('highlight4_title', 'Pontal do Horizonte');
  const highlight4Desc = getVal('highlight4_desc', 'Uma das melhores e mais deslumbrantes vistas panorâmicas da região norte do Distrito Federal. Ar puro e sossego do planalto central.');

  const leisureText = getVal('leisure_text', 'Não há nada melhor do que reunir amigos para um churrasco no final de semana ou dar um mergulho refrescante sem sair do condomínio. No Residencial Alto do Horizonte, sua qualidade de vida atinge um padrão luxuoso com áreas comuns completas, entregues totalmente mobiliadas e decoradas.');
  const leisureImage = getVal('leisure_image', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80');
  const leisureBulletsString = getVal('leisure_bullets', 'Piscinas Adulto & Infantil, Quiosques de Churrasqueiras, Salão de Festas Mobiliado, Academia Equipada, Quadra Esportiva Completa, Playground & Brinquedoteca, Espaço Pet Privativo, Praças e Boulevard Verde');
  const leisureBullets = leisureBulletsString.split(',').map((it: string) => it.trim());

  const locationText = getVal('location_text', 'Sobradinho é sinônimo de viver com qualidade de vida inigualável. O ponto mais alto da cidade traz vento fresco constante do cerrado, segurança de nível excelente e proximidade de toda a conveniência de comércios que sua rotina exige.');
  const locationImage = getVal('location_image', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80');

  const whatsappNumber = getVal('whatsapp_number', '5561998522204');
  const whatsappTextLead = getVal('whatsapp_text_lead', 'Olá Paulo Martins, estou interessado no Residencial Alto do Horizonte (Alto Sobradinho). Gostaria de simular crédito!');
  const brokerImage = getVal('broker_image', 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png');

  const faqs = getList('faq_items', [
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
  ]);

  const gallery = {
    apartamento: getList('gallery_apartamento', [
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
      },
    ]),
    lazer: getList('gallery_lazer', [
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
    ]),
    implatacao: getList('gallery_implatacao', [
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
    ])
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentGalleryItems = gallery[activeTab];
      if (!currentGalleryItems || currentGalleryItems.length === 0) return;

      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev + 1) % currentGalleryItems.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) => (prev - 1 + currentGalleryItems.length) % currentGalleryItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeTab, dbData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending data and opening personalized WhatsApp
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      const parsedTextLead = whatsappTextLead.replace('Residencial Alto do Horizonte', `Residencial Alto do Horizonte. Meu nome é *${formData.nome}*. WhatsApp: ${formData.whatsapp}, E-mail: ${formData.email}. Interesse: ${formData.interesse}`);
      const encodedText = encodeURIComponent(parsedTextLead);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      
      // Delay to let the submit screen render beautiful checkmark
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 800);
    }, 1200);
  };

  // Safe estimates based on standard MCMV simulator metrics
  const simularSubsidio = () => {
    if (rendaFamiliar <= 2000) return 'Até R$ 55.000,00';
    if (rendaFamiliar <= 3000) return 'Até R$ 42.000,00';
    if (rendaFamiliar <= 4500) return 'Até R$ 25.000,00';
    if (rendaFamiliar <= 6000) return 'Até R$ 12.000,00';
    return 'Sob Consulta (SBPE)';
  };

  const simularParcela = () => {
    const prestacao = rendaFamiliar * 0.3; // 30% rule of commitment
    return `A partir de R$ ${prestacao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="pt-20 bg-dark-950 text-white min-h-screen">
      <SEOHelper 
        title={heroTitle ? `${heroTitle.replace(/<br\s*\/?>/gi, ' ')} - Residencial Alto do Horizonte` : "Alto Sobradinho - Residencial Alto do Horizonte"} 
        description={heroSubtitle || "Conheça o Residencial Alto do Horizonte em Sobradinho. Lindos apartamentos de 2 quartos com elevador, varanda gourmet, lazer resort e a qualidade Paulo Martins."} 
        image={heroImage}
        urlPath="/alto-sobradinho"
      />

      {/* --- HERO PREMIUM --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16" id="topo">
        {/* Background Overlay styling for immersive visual */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Residencial Alto do Horizonte" 
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              {tagBadge}
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight">
              {heroTitle.includes('<br />') ? (
                <>
                  {heroTitle.split('<br />')[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-200">
                    {heroTitle.split('<br />')[1]}
                  </span>
                </>
              ) : heroTitle.includes('<br>') ? (
                <>
                  {heroTitle.split('<br>')[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-200">
                    {heroTitle.split('<br>')[1]}
                  </span>
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-amber-200">
                  {heroTitle}
                </span>
              )}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#simulacao"
                className="px-8 py-4 bg-gold-400 hover:bg-gold-500 text-black text-center font-bold tracking-wider uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 flex items-center justify-center gap-2"
              >
                Simular Financiamento <ArrowRight size={18} />
              </a>
              <a 
                href="#leisure" 
                className="px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-gold-400/50 text-center font-bold tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Conhecer Lazer completo
              </a>
            </div>

            {/* Micro Highlights Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5 text-gray-300">
              <div>
                <span className="block text-xl md:text-2xl font-serif font-bold text-gold-400">{stat1Value}</span>
                <span className="text-xs uppercase tracking-widest text-gray-400">{stat1Title}</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-xl md:text-2xl font-serif font-bold text-gold-400">{stat2Value}</span>
                <span className="text-xs uppercase tracking-widest text-gray-400">{stat2Title}</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-xl md:text-2xl font-serif font-bold text-gold-400">{stat3Value}</span>
                <span className="text-xs uppercase tracking-widest text-gray-400">{stat3Title}</span>
              </div>
            </div>
          </div>

          {/* Quick VIP Presentation Form Card */}
          <div className="lg:col-span-5 bg-dark-900/90 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-2.5xl space-y-6" id="formulario-topo">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-white">Receba Tabela Exclusiva</h3>
              <p className="text-xs text-gray-400 mt-1">Preencha seus dados reais para contato direto do corretor Paulo Martins</p>
            </div>

            {submitted ? (
              <div className="bg-white/[0.02] border border-gold-400/20 rounded-xl p-8 text-center space-y-4 py-16">
                <div className="w-16 h-16 bg-gold-400/10 rounded-full flex items-center justify-center mx-auto text-gold-400 border border-gold-400/30">
                  <Check size={32} />
                </div>
                <h4 className="text-xl font-serif text-white">Excelente escolha!</h4>
                <p className="text-sm text-gray-400">Você está sendo redirecionado para o WhatsApp VIP do corretor Paulo Martins para enviar sua ficha.</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-gold-400 animate-pulse rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Seu Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Carlos Albuquerque" 
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:bg-black/60 transition-all text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">WhatsApp / Telefone</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Ex: (61) 99999-9999" 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:bg-black/60 transition-all text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">E-mail</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ex: seuemail@provedor.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:bg-black/60 transition-all text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.1">Qual o seu interesse principal?</label>
                  <select 
                    value={formData.interesse}
                    onChange={(e) => setFormData({...formData, interesse: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:bg-black/60 text-gray-300 transition-all"
                  >
                    <option value="Quero receber fotos e tabela">Quero receber fotos e tabela</option>
                    <option value="Desejo fazer uma simulação Caixa">Desejo fazer uma simulação Caixa</option>
                    <option value="Quero agendar uma visita presencial">Quero agendar uma visita presencial</option>
                    <option value="Falar diretamente com Paulo Martins">Falar diretamente com Paulo Martins</option>
                  </select>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input 
                    type="checkbox" 
                    id="consentCheck"
                    required
                    defaultChecked
                    className="mt-1 rounded border-white/10 text-gold-500 accent-gold-500 cursor-pointer"
                  />
                  <label htmlFor="consentCheck" className="text-[10px] text-gray-400 leading-snug cursor-pointer">
                    Autorizo o corretor Paulo Martins (CRECI 28.844) a fazer contato para tratamento de dados sobre o imóvel Residencial Alto do Horizonte.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 mt-4 bg-gold-400 hover:bg-gold-500 disabled:bg-gold-400/40 text-black font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Processando envio...' : 'Quero Garantir Meu Desconto'}
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- INFRASTRUCTURE & HIGHLIGHTS OF OVERVIEW --- */}
      <section className="py-24 bg-dark-900 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">CONCEPÇÃO E CONFORTO EXCLUSIVOS</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">Viver Bem no Ponto mais Alto de Sobradinho</h2>
            <div className="h-1 w-16 bg-gold-600 mx-auto rounded-full mt-4"></div>
            <p className="text-gray-300 font-light leading-relaxed text-base pt-2">
              Esqueça de tudo que você já viu sobre apartamentos na região. O <strong className="text-white font-medium">Residencial Alto do Horizonte</strong> foi projetado para elevar o patamar de bem-estar. Unindo engenharia de ponta pela Riva Incorporadora com a assessoria premium de Paulo Martins, você conquista o melhor endereço da cidade.
            </p>
          </div>

          {/* Grid structure of highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dark-950 p-6 rounded-xl border border-white/5 space-y-4 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all duration-300">
                <Compass size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">{highlight1Title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {highlight1Desc}
              </p>
            </div>

            <div className="bg-dark-950 p-6 rounded-xl border border-white/5 space-y-4 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all duration-300">
                <HomeIcon size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">{highlight2Title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {highlight2Desc}
              </p>
            </div>

            <div className="bg-dark-950 p-6 rounded-xl border border-white/5 space-y-4 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all duration-300">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">{highlight3Title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {highlight3Desc}
              </p>
            </div>

            <div className="bg-dark-950 p-6 rounded-xl border border-white/5 space-y-4 hover:border-gold-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-400 group-hover:text-black transition-all duration-300">
                <Trees size={22} />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">{highlight4Title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {highlight4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRESETS AND INTERACTIVE PLANT SHOWCASE / GALLERY --- */}
      <section className="py-24 bg-dark-950" id="galeria">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">VISUAIS SENSACIONAIS</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Galeria de Ilustrações & Conceitos</h2>
              <div className="h-1 w-16 bg-gold-600 rounded-full mt-2"></div>
            </div>

            {/* Gallery interactive tabs selection */}
            <div className="flex flex-wrap gap-2.5 bg-dark-900 border border-white/5 p-1.5 rounded-xl self-start">
              <button 
                onClick={() => setActiveTab('apartamento')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'apartamento' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Os Apartamentos
              </button>
              <button 
                onClick={() => setActiveTab('lazer')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'lazer' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Clube de Lazer
              </button>
              <button 
                onClick={() => setActiveTab('implatacao')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'implatacao' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Fachada & Segurança
              </button>
            </div>
          </div>

          {/* Active category sliding block */}
          {gallery[activeTab] && gallery[activeTab].length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Main spotlight container */}
              <div 
                onClick={() => {
                  setLightboxIdx(activePhotoIdx);
                  setLightboxOpen(true);
                }}
                className="lg:col-span-8 overflow-hidden rounded-2xl border border-white/5 relative aspect-video cursor-pointer group/main-photo" 
                id="main-gallery-view"
                title="Clique para abrir em tela cheia"
              >
                <img 
                  src={gallery[activeTab][activePhotoIdx]?.url} 
                  alt={gallery[activeTab][activePhotoIdx]?.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/main-photo:scale-105"
                />
                
                {/* Visual hover cue for zoom */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/main-photo:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-dark-950/90 border border-gold-400/30 px-5 py-3 rounded-xl flex items-center gap-2 text-gold-400 shadow-xl transform scale-90 group-hover/main-photo:scale-100 transition-all duration-300">
                    <Maximize2 size={18} className="animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-bold font-sans">Visualizar em Tela Cheia</span>
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                  <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold bg-gold-400/10 self-start px-2 py-0.5 rounded border border-gold-400/20 mb-2">
                    {activeTab === 'apartamento' ? 'Apartamento' : activeTab === 'lazer' ? 'Lazer Resort' : 'Fachada & Implantação'}
                  </span>
                  <h3 className="text-lg md:text-xl font-serif text-white">{gallery[activeTab][activePhotoIdx]?.title}</h3>
                  <p className="text-sm text-gray-300 mt-1 max-w-xl font-light">{gallery[activeTab][activePhotoIdx]?.desc}</p>
                </div>
              </div>

              {/* Right stack column layout */}
              <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
                {gallery[activeTab].map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`bg-dark-900 border p-4 flex gap-4 items-center transition-all duration-300 group cursor-pointer rounded-xl ${
                      activePhotoIdx === idx 
                        ? 'border-gold-500 shadow-[0_0_20px_rgba(197,160,40,0.15)] bg-dark-850' 
                        : 'border-white/5 hover:border-gold-400/30'
                    }`}
                  >
                    <div className="relative overflow-hidden w-20 h-20 rounded-lg shrink-0 border border-white/10">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {activePhotoIdx === idx && (
                        <div className="absolute inset-0 bg-gold-500/10 flex items-center justify-center">
                          <div className="p-1 bg-gold-500 text-black rounded-full scale-90">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-serif text-sm transition-colors duration-200 ${activePhotoIdx === idx ? 'text-gold-400 font-bold' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- RESORT CLUB LEISURE LIFE SYNOPSIS --- */}
      <section className="py-24 bg-dark-900 border-y border-white/5" id="leisure">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">ESTILO RESORT RESIDENCIAL</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Privilégios de um Verdadeiro Clube de Lazer Privativo</h2>
              <div className="h-1 w-16 bg-gold-600 rounded-full"></div>
              <p className="text-gray-300 font-light leading-relaxed text-base pt-2 text-justify">
                {leisureText}
              </p>

              {/* Leisure check list bullet items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {leisureBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm text-gray-200">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative max-w-lg w-full">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-500 to-amber-300 rounded-2xl blur opacity-30"></div>
                <img 
                  src={leisureImage} 
                  alt="Piscinas e Lazer do Residencial Alto do Horizonte" 
                  className="rounded-2xl shadow-2xl relative z-10 border border-white/10 aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PREMIUM INVESTMENT ANALYSIS & DYNAMIC APP SIMULATOR --- */}
      <section className="py-24 bg-dark-950" id="simulacao">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">FACILIDADE NA ENTRADA</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">Simulador Dinâmico de Subsídio e Parcelas</h2>
            <div className="h-1 w-16 bg-gold-600 mx-auto rounded-full mt-4"></div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Descubra na hora uma estimativa de quanto o governo federal pode te dar de desconto (subsídio) pelo programa Minha Casa Minha Vida e como ficaria o valor inicial aproximado de suas parcelas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="simulator-block">
            {/* Range selector column */}
            <div className="lg:col-span-6 bg-dark-900 border border-white/5 p-8 rounded-2xl space-y-6 flex flex-col justify-center">
              <div className="text-left">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <BadgeDollarSign size={20} className="text-gold-400" />
                  Renda Bruta Familiar Mensal
                </h3>
                <p className="text-xs text-gray-400 mt-1">Soma do holerite (contracheque) de todas as pessoas que vão compor a escritura do imóvel</p>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-sm">Sua Renda Bruta:</span>
                  <span className="text-2xl font-bold font-serif text-gold-400">R$ {rendaFamiliar.toLocaleString('pt-BR')},00</span>
                </div>

                <input 
                  type="range" 
                  min={1800}
                  max={12000}
                  step={100}
                  value={rendaFamiliar}
                  onChange={(e) => setRendaFamiliar(Number(e.target.value))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-gold-400 focus:outline-none"
                />

                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  <span>R$ 1.800</span>
                  <span>R$ 5.000</span>
                  <span>R$ 8.000</span>
                  <span>R$ 12.000</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 bg-white/[0.01] border border-white/5 p-4 rounded-lg">
                💡 <strong className="text-white">Dica do Paulo Martins:</strong> Se a sua renda estiver no teto do programa Minha Casa Minha Vida, você pode ter descontos fantásticos e juros simbólicos a partir de 4,25% ao ano!
              </div>
            </div>

            {/* Display calculations box */}
            <div className="lg:col-span-6 bg-gradient-to-br from-gold-900/10 to-transparent border border-gold-400/10 p-8 rounded-2xl flex flex-col justify-between space-y-8 relative">
              <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-gold-400/10 border border-gold-400/20 text-gold-400 rounded">Estimativa Caixa</div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-400 block">Subsídio Estimado (Desconto do Governo)</span>
                  <div className="text-3xl md:text-4xl font-serif font-bold text-emerald-400 mt-1">{simularSubsidio()}</div>
                  <span className="text-[11px] text-gray-400 mt-1 block">Este valor é descontado diretamente do saldo devedor do imóvel Caixa.</span>
                </div>

                <div className="h-px bg-white/5"></div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-gray-400 block">Parcela Mensal Simulada (Média)</span>
                  <div className="text-2xl font-serif font-bold text-white mt-1">{simularParcela()}</div>
                  <span className="text-[11px] text-gray-400 mt-1 block">Taxação calculada por tabela SAC ou Price dependendo de sua ficha de crédito.</span>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href="#formulario-topo"
                  className="w-full py-4 bg-gold-400 hover:bg-gold-500 text-black text-center font-bold uppercase tracking-wider rounded-lg transition-all duration-300 block shadow-lg hover:shadow-gold-500/10"
                >
                  Fazer My Ficha Oficial no WhatsApp <ArrowRight size={16} className="inline ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DETAILS & LOCATION HIGHLIGHTS --- */}
      <section className="py-24 bg-dark-900 border-y border-white/5" id="maps-info">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-gold-500 to-amber-700 rounded-3xl blur opacity-20"></div>
            <img 
              src={locationImage} 
              alt="Localização Sobradinho Residencial Alto do Horizonte" 
              className="rounded-3xl border border-white/10 object-cover aspect-[4/5] shadow-2.5xl relative z-10 w-full"
            />
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">PROXIMIDADE E ACESSO EXPRESSO</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Privilégio de Estar Perto do Centro de Sobradinho</h2>
              <div className="h-1 w-16 bg-gold-600 rounded-full mt-2"></div>
            </div>

            <p className="text-gray-300 font-light leading-relaxed text-base text-justify">
              {locationText}
            </p>

            {/* Travel metrics block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start gap-3">
                <MapPin className="text-gold-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm font-serif">Comércio Completo</h4>
                  <p className="text-xs text-gray-400 mt-1">Supermercados, bancos e farmácias renomadas a 3 minutos do apartamento.</p>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start gap-3">
                <MapPin className="text-gold-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm font-serif">A 15 Minutos do Plano</h4>
                  <p className="text-xs text-gray-400 mt-1">Via com acesso rápido em linha reta direto para Asa Norte de Brasília.</p>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start gap-3">
                <MapPin className="text-gold-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm font-serif">Colégios Reconhecidos</h4>
                  <p className="text-xs text-gray-400 mt-1">Ótima malha de escolas de alto nível para as crianças estudarem de forma segura.</p>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start gap-3">
                <MapPin className="text-gold-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-white font-medium text-sm font-serif">Áreas Verdes Preservadas</h4>
                  <p className="text-xs text-gray-400 mt-1">Ar limpo e puro proporcionado por parques ecológicos e bosques vizinhos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE FAQ ACCORDION --- */}
      <section className="py-24 bg-dark-950" id="perguntas">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase block">DÚVIDAS FREQUENTES</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">Esclarecimentos Rápidos</h2>
            <div className="h-1 w-16 bg-gold-600 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <div 
                key={index}
                className="border border-white/5 rounded-xl bg-dark-900 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif text-white font-medium text-base md:text-lg focus:outline-none hover:bg-white/[0.02]"
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp size={20} className="text-gold-400 shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gold-400 shrink-0" />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-6 pt-2 text-gray-300 font-light text-sm md:text-base border-t border-white/[0.03] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXQUISITE VIP FOOT CONTACT FOOTER BANNER --- */}
      <section className="py-20 bg-gradient-to-t from-dark-900 to-dark-950 border-t border-white/5" id="vip-broker-line">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-dark-900 to-black/80 rounded-3xl p-8 md:p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 max-w-2xl text-center md:text-left">
              <img 
                src={brokerImage} 
                alt="Corretor Paulo Martins" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gold-400 bg-dark-800"
              />
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold bg-gold-400/10 px-2.5 py-1 rounded">Corretor Licenciado Exclusive</span>
                <h3 className="text-2xl font-serif text-white">Paulo Martins</h3>
                <p className="text-sm font-mono text-gray-400">CRECI 28.844 – Distrito Federal</p>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  "Meu compromisso é encontrar o imóvel perfeito, simular taxas sob medida na Caixa e garantir total transparência jurídica no seu contrato. Você merece o melhor."
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto shrink-0">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá Paulo, gostaria de agendar uma reunião online para conhecer os detalhes do Residencial Alto do Horizonte.")}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-600/10"
              >
                <MessageSquare size={16} /> Falar WhatsApp
              </a>
              <a 
                href={`tel:${whatsappNumber}`}
                className="px-6 py-4 bg-transparent border border-white/10 hover:border-gold-400/50 hover:bg-white/5 rounded-lg text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall size={16} /> Telefonar Agendamento
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxOpen && gallery[activeTab] && gallery[activeTab].length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar with metadata and Close button */}
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-6 z-10">
            <div className="text-left">
              <span className="text-gold-400 font-sans text-[10px] uppercase tracking-widest block font-bold mb-1">
                {activeTab === 'apartamento' ? 'Apartamento' : activeTab === 'lazer' ? 'Lazer Resort' : 'Fachada & Implantação'}
              </span>
              <h4 className="text-white text-sm md:text-base font-serif font-medium">
                {gallery[activeTab][lightboxIdx]?.title}
              </h4>
            </div>
            
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-gold-400/50 text-gray-300 hover:text-white transition-all bg-black/40 cursor-pointer shadow-lg flex items-center justify-center"
              title="Fechar (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Arrows & Main Image */}
          <div className="relative w-full max-w-5xl px-4 flex items-center justify-center h-[60vh] md:h-[65vh]">
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev - 1 + gallery[activeTab].length) % gallery[activeTab].length);
              }}
              className="absolute left-4 md:left-6 p-2.5 md:p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold-400 hover:scale-105 text-white hover:text-black hover:bg-gold-400 transition-all cursor-pointer z-20 shadow-lg"
              title="Anterior (Seta Esquerda)"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Interactive Zoomable Photo */}
            <div 
              className="relative max-h-full max-w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[activeTab][lightboxIdx]?.url}
                alt={gallery[activeTab][lightboxIdx]?.title}
                className="max-h-[60vh] md:max-h-[65vh] max-w-[85vw] md:max-w-[75vw] lg:max-w-4xl object-contain rounded-lg border border-white/10 shadow-2xl transition-all duration-300 select-none"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev + 1) % gallery[activeTab].length);
              }}
              className="absolute right-4 md:right-6 p-2.5 md:p-3 rounded-full bg-white/5 border border-white/10 hover:border-gold-400 hover:scale-105 text-white hover:text-black hover:bg-gold-400 transition-all cursor-pointer z-20 shadow-lg"
              title="Próxima (Seta Direita)"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Slide Description and Thumbnails Strip */}
          <div 
            className="w-full max-w-3xl px-6 text-center space-y-4 pt-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed max-w-xl mx-auto drop-shadow-sm min-h-[40px]">
              {gallery[activeTab][lightboxIdx]?.desc}
            </p>

            {/* Index Counter */}
            <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
              Foto {lightboxIdx + 1} de {gallery[activeTab].length}
            </div>

            {/* Horizontal Mini Thumbnail strip */}
            <div className="flex justify-center gap-2.5 pt-2 flex-wrap">
              {gallery[activeTab].map((item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`relative w-12 h-9 md:w-16 md:h-11 rounded-md overflow-hidden border transition-all duration-300 cursor-pointer ${
                    lightboxIdx === idx
                      ? 'border-gold-400 scale-105 shadow-[0_0_10px_rgba(197,160,40,0.4)] opacity-100'
                      : 'border-white/10 hover:border-white/30 opacity-40 hover:opacity-75'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
