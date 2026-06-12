import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface AboutData {
  title: string;
  content: string;
  image_url: string;
  stat1_title: string;
  stat1_value: string;
  stat2_title: string;
  stat2_value: string;
  stat3_title: string;
  stat3_value: string;
  stat4_title: string;
  stat4_value: string;
}

const DEFAULT_ABOUT: AboutData = {
  title: 'Conheça Paulo Martins',
  content: `Olá, me chamo Paulo Martins, sou corretor de imóveis licenciado (CRECI 28.844) e atuo com foco exclusivo na venda de imóveis em Brasília – DF.\n\nCom compromisso, transparência e atenção aos detalhes, ajudo meus clientes a encontrarem as melhores oportunidades do mercado, sempre com o objetivo de oferecer um atendimento personalizado, ágil e seguro em cada etapa da negociação.\n\nSe você está em busca de um imóvel novo, pronto para morar ou em lançamento, estou à disposição para apresentar opções que se encaixam no seu perfil e acompanhar todo o processo com total suporte.\n\nConte comigo para tornar sua conquista imobiliária mais simples, clara e segura.`,
  image_url: 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png',
  stat1_title: 'CRECI',
  stat1_value: '28.844',
  stat2_title: 'Brasília',
  stat2_value: 'Atuação Exclusiva',
  stat3_title: 'Suporte',
  stat3_value: 'Personalizado',
  stat4_title: 'Segurança',
  stat4_value: 'Total na Negociação'
};

export const About: React.FC = () => {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data: dbData, error } = await supabase
          .from('about_page')
          .select('*')
          .eq('id', 'about-us')
          .maybeSingle();

        if (error) {
          console.error('Supabase error reading about_page:', error);
        } else if (dbData) {
          setData({
            title: dbData.title || DEFAULT_ABOUT.title,
            content: dbData.content || DEFAULT_ABOUT.content,
            image_url: dbData.image_url || DEFAULT_ABOUT.image_url,
            stat1_title: dbData.stat1_title || DEFAULT_ABOUT.stat1_title,
            stat1_value: dbData.stat1_value || DEFAULT_ABOUT.stat1_value,
            stat2_title: dbData.stat2_title || DEFAULT_ABOUT.stat2_title,
            stat2_value: dbData.stat2_value || DEFAULT_ABOUT.stat2_value,
            stat3_title: dbData.stat3_title || DEFAULT_ABOUT.stat3_title,
            stat3_value: dbData.stat3_value || DEFAULT_ABOUT.stat3_value,
            stat4_title: dbData.stat4_title || DEFAULT_ABOUT.stat4_title,
            stat4_value: dbData.stat4_value || DEFAULT_ABOUT.stat4_value
          });
        }
      } catch (err) {
        console.error('Falha ao consultar tabela about_page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();

    // Set up Realtime channel subscription for the About page
    const channel = supabase
      .channel('about_page_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_page',
          filter: 'id=eq.about-us'
        },
        (payload) => {
          console.log('Realtime update received for About Us:', payload);
          if (payload.new && Object.keys(payload.new).length > 0) {
            const dbData = payload.new;
            setData({
              title: dbData.title || DEFAULT_ABOUT.title,
              content: dbData.content || DEFAULT_ABOUT.content,
              image_url: dbData.image_url || DEFAULT_ABOUT.image_url,
              stat1_title: dbData.stat1_title || DEFAULT_ABOUT.stat1_title,
              stat1_value: dbData.stat1_value || DEFAULT_ABOUT.stat1_value,
              stat2_title: dbData.stat2_title || DEFAULT_ABOUT.stat2_title,
              stat2_value: dbData.stat2_value || DEFAULT_ABOUT.stat2_value,
              stat3_title: dbData.stat3_title || DEFAULT_ABOUT.stat3_title,
              stat3_value: dbData.stat3_value || DEFAULT_ABOUT.stat3_value,
              stat4_title: dbData.stat4_title || DEFAULT_ABOUT.stat4_title,
              stat4_value: dbData.stat4_value || DEFAULT_ABOUT.stat4_value
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Split content by two or more newlines to generate paragraphs
  const paragraphs = data.content
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-gold-500" size={32} />
            <p className="text-gray-400 text-sm">Carregando história...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-wide">{data.title}</h1>
              <div className="h-1 w-24 bg-gold-600 mx-auto rounded-full"></div>
            </div>

            {/* Story Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
              <div className="relative flex justify-center md:justify-end animate-fade-in">
                {/* Professional Portrait */}
                <img 
                  src={data.image_url} 
                  alt="Corretor Paulo Martins" 
                  className="rounded-xl shadow-2xl shadow-gold-900/10 object-cover aspect-[3/4] w-full max-w-md border border-white/5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_ABOUT.image_url;
                  }}
                />
              </div>
              <div className="md:pl-8 animate-fade-in">
                <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg text-justify md:text-left">
                  {paragraphs.map((para, index) => {
                    // Styled border for last paragraph
                    if (index === paragraphs.length - 1) {
                      return (
                        <p key={index} className="text-white font-medium border-l-4 border-gold-600 pl-4 py-1 mt-8">
                          {para}
                        </p>
                      );
                    }
                    return (
                      <p key={index}>
                        {/* Highlights specific phrases in the first paragraph */}
                        {index === 0 ? (
                          <>
                            Olá, me chamo <strong className="text-white font-medium">Paulo Martins</strong>, sou corretor de imóveis licenciado <span className="text-gold-400 whitespace-nowrap">(CRECI 28.844)</span> e atuo com foco exclusivo na venda de imóveis em Brasília – DF.
                          </>
                        ) : (
                          para
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stats / Highlights - Font size reduced by 4% (2xl -> 1.44rem, 3xl -> 1.8rem) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-white/5 animate-fade-in">
              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {data.stat1_title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {data.stat1_value}
                </div>
              </div>
              
              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {data.stat2_title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {data.stat2_value}
                </div>
              </div>

              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {data.stat3_title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {data.stat3_value}
                </div>
              </div>

              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {data.stat4_title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {data.stat4_value}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
