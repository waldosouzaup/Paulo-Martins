import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { translateDynamic, language } = useLanguage();

  const [translatedTitle, setTranslatedTitle] = useState(data.title);
  const [translatedContent, setTranslatedContent] = useState(data.content);
  const [translatedStat1Title, setTranslatedStat1Title] = useState(data.stat1_title);
  const [translatedStat2Title, setTranslatedStat2Title] = useState(data.stat2_title);
  const [translatedStat3Title, setTranslatedStat3Title] = useState(data.stat3_title);
  const [translatedStat4Title, setTranslatedStat4Title] = useState(data.stat4_title);
  const [translatedStat1Value, setTranslatedStat1Value] = useState(data.stat1_value);
  const [translatedStat2Value, setTranslatedStat2Value] = useState(data.stat2_value);
  const [translatedStat3Value, setTranslatedStat3Value] = useState(data.stat3_value);
  const [translatedStat4Value, setTranslatedStat4Value] = useState(data.stat4_value);

  // Translate static loader
  const loaderText = language === 'en' ? 'Loading story...' : language === 'es' ? 'Cargando historia...' : 'Carregando história...';

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

  useEffect(() => {
    setTranslatedTitle(data.title);
    setTranslatedContent(data.content);
    setTranslatedStat1Title(data.stat1_title);
    setTranslatedStat2Title(data.stat2_title);
    setTranslatedStat3Title(data.stat3_title);
    setTranslatedStat4Title(data.stat4_title);
    setTranslatedStat1Value(data.stat1_value);
    setTranslatedStat2Value(data.stat2_value);
    setTranslatedStat3Value(data.stat3_value);
    setTranslatedStat4Value(data.stat4_value);

    if (language === 'pt') return;

    let isMounted = true;
    const translateAll = async () => {
      try {
        const [tTitle, tContent, ts1Title, ts2Title, ts3Title, ts4Title, ts1Val, ts2Val, ts3Val, ts4Val] = await Promise.all([
          translateDynamic(data.title, `about_title_${language}`),
          translateDynamic(data.content, `about_content_${language}`),
          translateDynamic(data.stat1_title, `about_s1t_${language}`),
          translateDynamic(data.stat2_title, `about_s2t_${language}`),
          translateDynamic(data.stat3_title, `about_s3t_${language}`),
          translateDynamic(data.stat4_title, `about_s4t_${language}`),
          translateDynamic(data.stat1_value, `about_s1v_${language}`),
          translateDynamic(data.stat2_value, `about_s2v_${language}`),
          translateDynamic(data.stat3_value, `about_s3v_${language}`),
          translateDynamic(data.stat4_value, `about_s4v_${language}`)
        ]);

        if (isMounted) {
          setTranslatedTitle(tTitle);
          setTranslatedContent(tContent);
          setTranslatedStat1Title(ts1Title);
          setTranslatedStat2Title(ts2Title);
          setTranslatedStat3Title(ts3Title);
          setTranslatedStat4Title(ts4Title);
          setTranslatedStat1Value(ts1Val);
          setTranslatedStat2Value(ts2Val);
          setTranslatedStat3Value(ts3Val);
          setTranslatedStat4Value(ts4Val);
        }
      } catch (err) {
        console.error("About translation failed:", err);
      }
    };

    translateAll();
    return () => {
      isMounted = false;
    };
  }, [data, language]);

  // Split content by two or more newlines to generate paragraphs
  const paragraphs = translatedContent
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-gold-500" size={32} />
            <p className="text-gray-400 text-sm">{loaderText}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-wide">{translatedTitle}</h1>
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
                        {index === 0 && language === 'pt' ? (
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
                  {translatedStat1Title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {translatedStat1Value}
                </div>
              </div>
              
              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {translatedStat2Title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {translatedStat2Value}
                </div>
              </div>

              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {translatedStat3Title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {translatedStat3Value}
                </div>
              </div>

              <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">
                  {translatedStat4Title}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  {translatedStat4Value}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
