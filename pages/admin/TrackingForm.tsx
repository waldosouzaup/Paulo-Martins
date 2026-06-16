import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Database, Check, AlertCircle, Code, Shield, Image as ImageIcon, Phone, Instagram } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SEOHelper } from '../../components/SEOHelper';
import { useProperties } from '../../context/PropertyContext';

const { useNavigate } = RouterDom;

interface TrackingData {
  id: string;
  google_tag_id: string;
  meta_pixel_id: string;
  head_scripts: string;
  body_scripts: string;
  home_hero_image: string;
  whatsapp_number?: string;
  instagram_link?: string;
}

const DEFAULT_TRACKING: TrackingData = {
  id: 'global-tracking',
  google_tag_id: '',
  meta_pixel_id: '',
  head_scripts: '',
  body_scripts: '',
  home_hero_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
  whatsapp_number: '5561991176958',
  instagram_link: 'https://www.instagram.com/paulomartins_imoveis/'
};

export const TrackingForm: React.FC = () => {
  const navigate = useNavigate();
  const { refreshTrackingSettings } = useProperties();
  const [formData, setFormData] = useState<TrackingData>(DEFAULT_TRACKING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSqlHelp, setShowSqlHelp] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load existing tracking configuration from Supabase
  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        const { data, error } = await supabase
          .from('tracking_settings')
          .select('*')
          .eq('id', 'global-tracking')
          .maybeSingle();

        if (error) {
          console.warn('Erro ao carregar tabela tracking_settings. Usando valores padrão:', error);
        } else if (data) {
          setFormData({
            id: data.id || 'global-tracking',
            google_tag_id: data.google_tag_id || '',
            meta_pixel_id: data.meta_pixel_id || '',
            head_scripts: data.head_scripts || '',
            body_scripts: data.body_scripts || '',
            home_hero_image: data.home_hero_image || DEFAULT_TRACKING.home_hero_image,
            whatsapp_number: data.whatsapp_number || DEFAULT_TRACKING.whatsapp_number,
            instagram_link: data.instagram_link || DEFAULT_TRACKING.instagram_link,
            broker_image: data.broker_image || DEFAULT_TRACKING.broker_image
          });
        }
      } catch (err) {
        console.error('Erro desconhecido ao carregar configurações de rastreamento:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [uploadingBrokerImage, setUploadingBrokerImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'home_hero_image' | 'broker_image' = 'home_hero_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetField === 'broker_image') {
      setUploadingBrokerImage(true);
    } else {
      setUploadingImage(true);
    }
    
    setError('');
    setMessage('');

    try {
      // Auto-create bucket 'fotos' just in case
      try {
        await supabase.storage.createBucket('fotos', { public: true });
      } catch (err) {
        console.log('Bucket already exists or has duplicate rights:', err);
      }

      const fileExt = file.name.split('.').pop();
      const rawFileName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueId = Math.random().toString(36).substring(2, 11);
      const fileName = `${targetField}_${rawFileName}_${uniqueId}.${fileExt}`;

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

      setFormData(prev => ({ ...prev, [targetField]: publicUrl }));
      setMessage(targetField === 'broker_image' ? 'Foto do corretor enviada com sucesso!' : 'Imagem do Hero enviada com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar a imagem.');
    } finally {
      if (targetField === 'broker_image') {
        setUploadingBrokerImage(false);
      } else {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { error: saveError } = await supabase
        .from('tracking_settings')
        .upsert({
          id: 'global-tracking',
          google_tag_id: formData.google_tag_id.trim(),
          meta_pixel_id: formData.meta_pixel_id.trim(),
          head_scripts: formData.head_scripts.trim(),
          body_scripts: formData.body_scripts.trim(),
          home_hero_image: formData.home_hero_image.trim(),
          whatsapp_number: formData.whatsapp_number ? formData.whatsapp_number.trim() : '5561991176958',
          instagram_link: formData.instagram_link ? formData.instagram_link.trim() : 'https://www.instagram.com/paulomartins_imoveis/',
          broker_image: formData.broker_image ? formData.broker_image.trim() : 'https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png'
        });

      if (saveError) {
        if (saveError.code === '42P01') {
          throw new Error('A tabela "tracking_settings" não existe no seu banco de dados Supabase. Execute o comando SQL em seu painel para criá-la!');
        }
        if (saveError.code === '42703') {
          throw new Error('Uma ou mais colunas de contato estão faltando na sua tabela "tracking_settings" (como "home_hero_image", "whatsapp_number", "instagram_link" ou "broker_image"). Execute o seguinte comando no SQL Editor do seu Supabase para adicioná-las:\n\nALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS home_hero_image TEXT;\nALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;\nALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS instagram_link TEXT;\nALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS broker_image TEXT;');
        }
        throw saveError;
      }

      await refreshTrackingSettings();
      setMessage('Configurações salvas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      setError(err.message || 'Erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  const sqlCode = `-- Execute este comando SQL em seu Painel do Supabase -> SQL Editor para criar ou atualizar a tabela de tags
CREATE TABLE IF NOT EXISTS tracking_settings (
  id TEXT PRIMARY KEY,
  google_tag_id TEXT,
  meta_pixel_id TEXT,
  head_scripts TEXT,
  body_scripts TEXT,
  home_hero_image TEXT,
  whatsapp_number TEXT,
  instagram_link TEXT,
  broker_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Se a tabela já existia e faltam os novos campos, execute:
ALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS home_hero_image TEXT;
ALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS instagram_link TEXT;
ALTER TABLE tracking_settings ADD COLUMN IF NOT EXISTS broker_image TEXT;

-- Habilitar RLS (Opcional)
ALTER TABLE tracking_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para scripts rodarem no site, e admin autenticado para gerenciar
CREATE POLICY "Permitir leitura pública de rastreamento" ON tracking_settings FOR SELECT TO public USING (true);
CREATE POLICY "Permitir tudo para administradores autenticados" ON tracking_settings FOR ALL TO authenticated USING (true);
`;

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <SEOHelper title="Administrar Tags e Rastreamento" description="Gerencie scripts do Google Analytics, Meta Pixel, GTM e tags personalizadas." />

      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Painel
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-white">Tags de Rastreamento</h1>
            <p className="text-gray-400 text-sm mt-1">Gerencie scripts do Google Analytics, Meta Pixel, GTM e tags personalizadas</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlHelp(!showSqlHelp)}
            className="flex items-center gap-2 text-xs border border-white/10 text-gray-400 hover:text-gold-400 px-4 py-2 rounded-lg hover:border-gold-500/30 transition-all bg-dark-900 self-start md:self-auto"
          >
            <Database size={14} /> 
            {showSqlHelp ? 'Ocultar código SQL' : 'Configuração Supabase SQL'}
          </button>
        </div>

        {showSqlHelp && (
          <div className="bg-dark-900 border border-gold-600/20 p-6 rounded-xl mb-8 animate-fade-in space-y-4">
            <h3 className="text-white font-serif flex items-center gap-2 text-md">
              <Database size={18} className="text-gold-400" />
              Tabela de Configurações no Supabase
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Copie o código SQL abaixo, vá para o seu painel do <strong>Supabase</strong>, clique em <strong>SQL Editor</strong>, crie uma <strong>New Query</strong>, cole este código e clique em <strong>Run</strong>:
            </p>
            <pre className="bg-dark-950 border border-white/5 p-4 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto select-all max-h-60 leading-relaxed">
              {sqlCode}
            </pre>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-gold-500 mx-auto mb-4" size={32} />
            <p className="text-gray-400 text-sm">Carregando dados de rastreamento...</p>
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
                  <div className="flex items-center gap-3 border-b border-red-500/10 pb-2 mb-1">
                    <AlertCircle size={18} />
                    <strong>Erro de Banco de Dados:</strong>
                  </div>
                  <span className="leading-relaxed">{error}</span>
                  {!showSqlHelp && (
                    <button 
                      type="button" 
                      onClick={() => setShowSqlHelp(true)}
                      className="text-gold-400 hover:underline text-xs flex items-center gap-1 mt-1 font-semibold"
                    >
                      Ver instruções passo a passo para criar a tabela no Supabase &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Imagem do Hero Principal */}
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-gold-400" />
                  Imagem do Hero Principal (Página Inicial)
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Defina a imagem de fundo em destaque que aparece no cabeçalho imersivo da página principal. Você pode fazer o upload ou colocar o caminho (URL) de uma imagem externa.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Caminho da Imagem (URL)</label>
                      <input 
                        name="home_hero_image" 
                        value={formData.home_hero_image} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500" 
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="bg-dark-800 hover:bg-dark-700 text-[11px] text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10 transition-all flex items-center gap-1.5">
                        {uploadingImage ? (
                          <>
                            <Loader2 className="animate-spin text-gold-400" size={11} />
                            Enviando...
                          </>
                        ) : 'Upload Nova Foto'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'home_hero_image')} 
                          disabled={uploadingImage} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-gray-500 text-[10px]">Recomendado: formato paisagem e alta resolução (ex: Unsplash)</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-24 md:h-28 rounded-lg overflow-hidden border border-white/10 bg-dark-950 flex items-center justify-center shadow-inner relative group">
                      {formData.home_hero_image ? (
                        <>
                          <img src={formData.home_hero_image} className="w-full h-full object-cover" alt="Hero Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium">Pré-visualização</div>
                        </>
                      ) : (
                        <span className="text-gray-500 text-xs">Sem foto</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Foto do Corretor */}
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-gold-400" />
                  Foto do Corretor (Sessão "Por que escolher Paulo Martins")
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Defina a imagem do corretor em destaque que aparece no bloco "Por que escolher Paulo Martins?" na página inicial. Você pode fazer o upload de uma imagem ou colocar o caminho (URL) de uma imagem existente.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">Caminho da Imagem do Corretor (URL)</label>
                      <input 
                        name="broker_image" 
                        value={formData.broker_image || ''} 
                        onChange={handleChange} 
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500" 
                        placeholder="Ex: https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="bg-dark-800 hover:bg-dark-700 text-[11px] text-white font-bold py-1.5 px-3 rounded cursor-pointer border border-white/10 transition-all flex items-center gap-1.5">
                        {uploadingBrokerImage ? (
                          <>
                            <Loader2 className="animate-spin text-gold-400" size={11} />
                            Enviando...
                          </>
                        ) : 'Upload Nova Foto'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, 'broker_image')} 
                          disabled={uploadingBrokerImage} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-gray-500 text-[10px]">Recomendado: formato retrato com fundo transparente ou neutro</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-24 md:h-28 rounded-lg overflow-hidden border border-white/10 bg-dark-950 flex items-center justify-center shadow-inner relative group">
                      {formData.broker_image ? (
                        <>
                          <img src={formData.broker_image} className="w-full h-full object-cover" alt="Broker Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium">Pré-visualização</div>
                        </>
                      ) : (
                        <span className="text-gray-500 text-xs">Sem foto</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contatos e Botões do Rodapé */}
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
                  <Phone size={18} className="text-gold-400" />
                  Contatos & Botões do Rodapé
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Personalize os canais de atendimento direto e de redes sociais que são exibidos globalmente nos rodapés e botões de contato do site.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp de Contato */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Número do WhatsApp (Contato Principal)</label>
                    <input 
                      name="whatsapp_number" 
                      value={formData.whatsapp_number || ''} 
                      onChange={handleChange} 
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm" 
                      placeholder="Ex: 5561991176958" 
                    />
                    <span className="text-[10px] text-gray-500 mt-1.5 block">Insira apenas números com DDD (Ex: 5561991176958).</span>
                  </div>

                  {/* Instagram Link */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Link do Instagram (Rede Social)</label>
                    <input 
                      name="instagram_link" 
                      value={formData.instagram_link || ''} 
                      onChange={handleChange} 
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm" 
                      placeholder="Ex: https://www.instagram.com/paulomartins_imoveis/" 
                    />
                    <span className="text-[10px] text-gray-500 mt-1.5 block">Link completo para abrir sua conta do Instagram.</span>
                  </div>
                </div>
              </div>

              {/* Fast Integrations (ID-based) */}
              <div className="border-b border-white/5 pb-6">
                <h3 className="text-white font-serif text-lg mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-gold-400" />
                  Integrações Prontas (Opcional)
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Insira apenas o ID correspondente aos seus serviços para que o applet injete os carregamentos padrões automaticamente para você.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Google Analytics ID */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Google Analytics / Google Tag (Measurement ID)</label>
                    <input 
                      name="google_tag_id" 
                      value={formData.google_tag_id} 
                      onChange={handleChange} 
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm" 
                      placeholder="Ex: G-XXXXXXXXXX" 
                    />
                    <span className="text-[10px] text-gray-500 mt-1.5 block">Seu ID de métricas que começa com G- ou AW-</span>
                  </div>

                  {/* Meta Pixel ID */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Meta Pixel ID (Facebook Pixel)</label>
                    <input 
                      name="meta_pixel_id" 
                      value={formData.meta_pixel_id} 
                      onChange={handleChange} 
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm" 
                      placeholder="Ex: 123456789012345" 
                    />
                    <span className="text-[10px] text-gray-500 mt-1.5 block">Apenas o código numérico do Pixel de rastreamento do Facebook</span>
                  </div>
                </div>
              </div>

              {/* Custom Script Blocks (Raw HTML Input) */}
              <div className="space-y-6 pt-2">
                <h3 className="text-white font-serif text-lg flex items-center gap-2">
                  <Code size={18} className="text-gold-400" />
                  Códigos de Rastreamento customizados (HTML / Script)
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Tem um script de chat online (JivoChat, RD Station), Hotjar, TikTok Pixel, Pinterest Tag ou código inteiro do Google Tag Manager? Cole os blocos completos abaixo começando com <code>&lt;script&gt;</code> e encerrando com <code>&lt;/script&gt;</code>.
                </p>

                {/* Head Scripts */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-300 text-xs uppercase tracking-widest font-semibold">Injetar no Cabeçalho (Head) - Antes de &lt;/head&gt;</label>
                    <span className="text-[10px] bg-dark-950 px-2 py-0.5 rounded border border-white/5 text-gray-400 font-mono">HTML / SCRIPT</span>
                  </div>
                  <textarea 
                    name="head_scripts" 
                    value={formData.head_scripts} 
                    onChange={handleChange} 
                    rows={8} 
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:border-gold-500 focus:outline-none transition-colors font-mono text-xs leading-relaxed" 
                    placeholder="<!-- Exemplo de Tags do Cabeçalho -->&#10;<script>&#10;  console.log('Script carregado no Head');&#10;</script>" 
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Ideal para carregar códigos assíncronos principais e tags de verificação.</span>
                </div>

                {/* Body Scripts */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-300 text-xs uppercase tracking-widest font-semibold">Injetar no Corpo (Body) - Antes de &lt;/body&gt;</label>
                    <span className="text-[10px] bg-dark-950 px-2 py-0.5 rounded border border-white/5 text-gray-400 font-mono">HTML / SCRIPT / NOSCRIPT</span>
                  </div>
                  <textarea 
                    name="body_scripts" 
                    value={formData.body_scripts} 
                    onChange={handleChange} 
                    rows={8} 
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:border-gold-500 focus:outline-none transition-colors font-mono text-xs leading-relaxed" 
                    placeholder="<!-- Exemplo de Noscripts, Iframes ou Bots de Suporte -->&#10;<noscript>&#10;  <iframe src='...' height='0' width='0' style='display:none;visibility:hidden'></iframe>&#10;</noscript>" 
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Ideal para tags de backup (&lt;noscript&gt;), ferramentas de bate-papo comercial ou modais flutuantes.</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70 cursor-pointer text-sm font-bold uppercase tracking-wider"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={18} />
                    Salvando Configurações no Supabase...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Tags e Rastreamento
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
