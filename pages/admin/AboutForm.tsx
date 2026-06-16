import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { ArrowLeft, Save, Upload, Loader2, Info, Database, Sparkles, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SEOHelper } from '../../components/SEOHelper';

const { useNavigate } = RouterDom;

interface AboutData {
  id: string;
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
  id: 'about-us',
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

export const AboutForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSqlHelp, setShowSqlHelp] = useState(false);

  // Load existing about data from Supabase, or fall back to default
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('about_page')
          .select('*')
          .eq('id', 'about-us')
          .maybeSingle();

        if (error) {
          console.warn('Erro ao carregar tabela about_page, usando dados padrão. Talvez a tabela precise ser criada:', error);
          // Don't show full page error because we have stable defaults
        } else if (data) {
          setFormData({
            id: data.id || 'about-us',
            title: data.title || '',
            content: data.content || '',
            image_url: data.image_url || '',
            stat1_title: data.stat1_title || '',
            stat1_value: data.stat1_value || '',
            stat2_title: data.stat2_title || '',
            stat2_value: data.stat2_value || '',
            stat3_title: data.stat3_title || '',
            stat3_value: data.stat3_value || '',
            stat4_title: data.stat4_title || '',
            stat4_value: data.stat4_value || ''
          });
        }
      } catch (err) {
        console.error('Erro desconhecido ao carregar sobre:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    setMessage('');

    try {
      // Auto-create bucket 'fotos' just in case
      try {
        await supabase.storage.createBucket('fotos', { public: true });
      } catch (err) {
        console.log('Bucket already exists or user has no create rights:', err);
      }

      const fileExt = file.name.split('.').pop();
      const rawFileName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueId = Math.random().toString(36).substring(2, 11);
      const fileName = `about_${rawFileName}_${uniqueId}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        throw new Error(
          `Falha no upload: ${uploadError.message}. Certifique-se de que o bucket 'fotos' existe, é público e possui as políticas RLS configuradas no Supabase.`
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('fotos')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setMessage('Imagem enviada e atualizada com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar a imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      // Check if table exists by doing upsert
      const { error: saveError } = await supabase
        .from('about_page')
        .upsert({
          id: 'about-us',
          title: formData.title.trim(),
          content: formData.content.trim(),
          image_url: formData.image_url.trim(),
          stat1_title: formData.stat1_title.trim(),
          stat1_value: formData.stat1_value.trim(),
          stat2_title: formData.stat2_title.trim(),
          stat2_value: formData.stat2_value.trim(),
          stat3_title: formData.stat3_title.trim(),
          stat3_value: formData.stat3_value.trim(),
          stat4_title: formData.stat4_title.trim(),
          stat4_value: formData.stat4_value.trim()
        });

      if (saveError) {
        // Highly descriptive error message in case table is missing
        if (saveError.code === '42P01') {
          throw new Error('A tabela "about_page" não existe no seu banco de dados Supabase. Veja as instruções SQL abaixo na página de como criá-la rapidamente em seu painel!');
        }
        throw saveError;
      }

      setMessage('Página "Sobre" atualizada com sucesso no banco de dados!');
    } catch (err: any) {
      console.error('Erro ao salvar página sobre:', err);
      setError(err.message || 'Erro ao salvar as informações.');
    } finally {
      setSaving(false);
    }
  };

  const sqlCode = `-- Execute este comando SQL em seu Painel do Supabase -> SQL Editor para criar a tabela
CREATE TABLE IF NOT EXISTS about_page (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stat1_title TEXT,
  stat1_value TEXT,
  stat2_title TEXT,
  stat2_value TEXT,
  stat3_title TEXT,
  stat3_value TEXT,
  stat4_title TEXT,
  stat4_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Opcional)
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público e admin autenticado
CREATE POLICY "Permitir leitura pública" ON about_page FOR SELECT TO public USING (true);
CREATE POLICY "Permitir tudo a usuários autenticados" ON about_page FOR ALL TO authenticated USING (true);
`;

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <SEOHelper title="Editar Sobre o Corretor" description="Gerencie as informações da biografia do corretor no painel administrativo." />
      
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Painel
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-white">Editar Página 'Sobre'</h1>
            <p className="text-gray-400 text-sm mt-1">Gerencie a biografia do corretor Paulo Martins e os destaques</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlHelp(!showSqlHelp)}
            className="flex items-center gap-2 text-xs border border-white/10 text-gray-400 hover:text-gold-400 px-4 py-2 rounded-lg hover:border-gold-500/30 transition-all self-start md:self-auto bg-dark-900"
          >
            <Database size={14} /> 
            {showSqlHelp ? 'Ocultar Código SQL' : 'Configuração Supabase SQL'}
          </button>
        </div>

        {/* SQL Help Box if expanded */}
        {showSqlHelp && (
          <div className="bg-dark-900 border border-gold-600/20 p-6 rounded-xl mb-8 animate-fade-in space-y-4">
            <h3 className="text-white font-serif flex items-center gap-2 text-md">
              <Database size={18} className="text-gold-400" />
              Instruções de Inicialização de Tabela no Supabase
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Caso você receba um erro ao salvar indicando que a tabela não existe, copie o código SQL abaixo, vá para o seu painel do <strong>Supabase (supabase.com)</strong>, selecione o seu projeto imobiliário, clique em <strong>SQL Editor</strong>, clique em <strong>New Query</strong>, cole este código e clique em <strong>Run</strong>:
            </p>
            <pre className="bg-dark-950 border border-white/5 p-4 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto select-all max-h-60 leading-relaxed">
              {sqlCode}
            </pre>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-gold-500 mx-auto mb-4" size={32} />
            <p className="text-gray-400 text-sm">Carregando dados da biografia...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="bg-dark-900 border border-white/5 p-8 rounded-xl space-y-6 shadow-2xl">
              
              {/* Form Messages */}
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
                    <strong>Erro de Tabela ou Permissão:</strong>
                  </div>
                  <span className="leading-relaxed pl-7">{error}</span>
                  {!showSqlHelp && (
                    <button 
                      type="button" 
                      onClick={() => setShowSqlHelp(true)}
                      className="text-gold-400 hover:underline text-xs flex items-center gap-1 mt-1 pl-7"
                    >
                      Ver instruções passo a passo para criar a tabela no Supabase &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Título Principal da Página</label>
                <input 
                  required 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" 
                  placeholder="Ex: Conheça Paulo Martins" 
                />
              </div>

              {/* Image Input and Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Caminho da Imagem (URL/Link)</label>
                    <input 
                      required 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleChange} 
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" 
                      placeholder="https://..." 
                    />
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-white text-xs font-semibold block">Fazer Upload de Nova Foto</span>
                      <span className="text-gray-400 text-xs block">Vincular arquivo de retrato diretamente da sua galeria</span>
                    </div>
                    <label className="bg-gold-600 hover:bg-gold-500 hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          Selecionar Arquivo
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploadingImage} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="block text-gray-400 text-xs uppercase tracking-widest mb-2 self-start font-semibold">Visualização</span>
                  <div className="relative border border-white/10 rounded-lg overflow-hidden bg-white/5 aspect-[3/4] w-full max-w-[150px] flex items-center justify-center">
                    {formData.image_url ? (
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=300&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <span className="text-gray-600 text-xs">Sem Imagem</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Biography Text Area */}
              <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Texto da Biografia (Use parágrafos separados por pular linha)</label>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">Você pode criar múltiplos parágrafos simplesmente pressionando 'Enter' duas vezes para separar o texto no site final.</p>
                <textarea 
                  required 
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange} 
                  rows={8} 
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors font-light leading-relaxed text-sm" 
                  placeholder="Conte um pouco sobre sua carreira, creci e conquistas..." 
                />
              </div>

              {/* Stats Highlight (4 grids) */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="text-white font-serif text-md flex items-center gap-2">
                  <Sparkles size={16} className="text-gold-400" />
                  Destaques e Métricas da Grade
                </h4>
                <p className="text-xs text-gray-400">Personalize os 4 itens em blocos destacados que mostram o CRECI, local de atuação e garantias.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stat 1 */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                    <span className="text-gold-400 text-xs uppercase font-semibold">Bloco 1</span>
                    <div className="space-y-2">
                      <input 
                        required 
                        name="stat1_title" 
                        value={formData.stat1_title} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Rótulo (Ex: CRECI)" 
                      />
                      <input 
                        required 
                        name="stat1_value" 
                        value={formData.stat1_value} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Valor/Descrição (Ex: 28.844)" 
                      />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                    <span className="text-gold-400 text-xs uppercase font-semibold">Bloco 2</span>
                    <div className="space-y-2">
                      <input 
                        required 
                        name="stat2_title" 
                        value={formData.stat2_title} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Rótulo (Ex: Brasília)" 
                      />
                      <input 
                        required 
                        name="stat2_value" 
                        value={formData.stat2_value} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Valor/Descrição (Ex: Atuação Exclusiva)" 
                      />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                    <span className="text-gold-400 text-xs uppercase font-semibold">Bloco 3</span>
                    <div className="space-y-2">
                      <input 
                        required 
                        name="stat3_title" 
                        value={formData.stat3_title} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Rótulo (Ex: Suporte)" 
                      />
                      <input 
                        required 
                        name="stat3_value" 
                        value={formData.stat3_value} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Valor/Descrição (Ex: Personalizado)" 
                      />
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-lg space-y-3">
                    <span className="text-gold-400 text-xs uppercase font-semibold">Bloco 4</span>
                    <div className="space-y-2">
                      <input 
                        required 
                        name="stat4_title" 
                        value={formData.stat4_title} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Rótulo (Ex: Segurança)" 
                      />
                      <input 
                        required 
                        name="stat4_value" 
                        value={formData.stat4_value} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Valor/Descrição (Ex: Total na Negociação)" 
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={saving || uploadingImage}
                className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70 cursor-pointer text-sm font-bold uppercase tracking-wider"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={18} />
                    Salvando Dados no Supabase...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Página Sobre
                  </>
                )}
              </button>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};
