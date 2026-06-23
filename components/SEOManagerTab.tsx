import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';
import { Search, Sparkles, Globe, Share2, Save, Image as ImageIcon, Loader2, Check, AlertCircle, Eye } from 'lucide-react';
import { slugify } from '../lib/utils';

export const SEOManagerTab: React.FC = () => {
  const { properties, updateProperty, refreshProperties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Form states
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoImageUrl, setSeoImageUrl] = useState('');
  
  // Action states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Filter properties based on search query
  const filteredProperties = properties.filter(prop => 
    prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set form values when selected property changes
  useEffect(() => {
    if (selectedProperty) {
      setSeoTitle(selectedProperty.seoTitle || '');
      setSeoDescription(selectedProperty.seoDescription || '');
      setSeoImageUrl(selectedProperty.seoImageUrl || '');
      setSaveStatus('idle');
      setStatusMessage('');
    } else if (filteredProperties.length > 0) {
      setSelectedProperty(filteredProperties[0]);
    }
  }, [selectedProperty, properties]);

  // Handle AI generation via backend Gemini API
  const handleGenerateAI = async () => {
    if (!selectedProperty) return;
    setIsGenerating(true);
    setSaveStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedProperty.title,
          description: selectedProperty.description || '',
          location: selectedProperty.location,
          beds: selectedProperty.beds || '',
          parking: selectedProperty.parking || '',
          area: selectedProperty.area || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      if (data.seoTitle) {
        setSeoTitle(data.seoTitle);
        setSeoDescription(data.seoDescription);
        setSaveStatus('success');
        setStatusMessage('Metadados otimizados gerados com IA!');
      }
    } catch (err: any) {
      console.error('Erro ao gerar metadados via IA:', err);
      setSaveStatus('error');
      setStatusMessage('Não foi possível conectar à IA. Verifique sua GEMINI_API_KEY.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save
  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    setStatusMessage('');

    const updatedProperty: Property = {
      ...selectedProperty,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      seoImageUrl: seoImageUrl.trim(),
    };

    try {
      const success = await updateProperty(updatedProperty);
      if (success) {
        setSaveStatus('success');
        setStatusMessage('Metadados de SEO atualizados com sucesso!');
        // Refresh properties to keep everything synced
        await refreshProperties();
      } else {
        setSaveStatus('error');
        setStatusMessage('Erro ao salvar as alterações no banco de dados.');
      }
    } catch (err: any) {
      console.error('Erro ao salvar SEO:', err);
      setSaveStatus('error');
      setStatusMessage(err.message || 'Ocorreu um erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to use main image as OG Image
  const handleUseMainImage = () => {
    if (selectedProperty) {
      setSeoImageUrl(selectedProperty.imageUrl);
    }
  };

  // Guidelines for Counters
  const titleLimit = 60;
  const descLimit = 160;

  return (
    <div id="seo-manager-tab" className="p-6 lg:p-8 space-y-8 bg-dark-900/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Property Selector */}
        <div className="lg:col-span-4 space-y-4 border-r border-white/5 lg:pr-8">
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-1">Selecionar Imóvel</h3>
            <p className="text-[10px] text-gray-400">Escolha um imóvel para gerenciar os metadados e tags de SEO.</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar imóvel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Properties List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-white/5 rounded-lg">
                Nenhum imóvel encontrado.
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = selectedProperty?.id === prop.id;
                return (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex gap-3 items-center ${
                      isSelected 
                        ? 'bg-gold-500/10 border-gold-500/50 text-white' 
                        : 'bg-white/[0.01] border-white/5 hover:border-white/15 text-gray-400 hover:text-white'
                    }`}
                  >
                    <img 
                      src={prop.imageUrl} 
                      alt={prop.title} 
                      className="w-10 h-10 rounded object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate leading-tight">{prop.title}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{prop.location}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {prop.seoTitle ? (
                          <span className="bg-green-500/10 text-green-400 text-[8px] font-mono uppercase font-bold px-1 py-0.2 rounded border border-green-500/20">
                            SEO Configurado
                          </span>
                        ) : (
                          <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-mono uppercase font-bold px-1 py-0.2 rounded border border-yellow-500/20">
                            Padrão
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: SEO Form & Previews */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProperty ? (
            <div className="space-y-6">
              
              {/* Header / Active Property Summary */}
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center gap-4 justify-between flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.title} 
                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] text-gold-400 font-mono tracking-widest uppercase">Propriedade em Edição</span>
                    <h4 className="text-white text-sm font-medium leading-snug">{selectedProperty.title}</h4>
                    <p className="text-gray-400 text-[10px]">{selectedProperty.location}</p>
                  </div>
                </div>
                
                {/* AI Generator Trigger */}
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-gold-600 to-amber-700 hover:from-gold-500 hover:to-amber-600 disabled:from-gray-800 disabled:to-gray-800 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-gold-500/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-200" />
                      <span>Otimizar com IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* State feedback message */}
              {saveStatus !== 'idle' && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
                  saveStatus === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {saveStatus === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Tabs Content: Form & Previews */}
              <form onSubmit={handleSaveSEO} className="space-y-6">
                
                {/* Inputs Fieldsets */}
                <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest block border-b border-white/5 pb-2">Metatags SEO</span>
                  
                  {/* SEO Title Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-300 text-xs font-semibold">Meta Título (Title Tag)</label>
                      <span className={`text-[10px] font-mono ${
                        seoTitle.length === 0 ? 'text-gray-500' :
                        seoTitle.length > titleLimit ? 'text-red-400 font-bold' : 'text-gray-400'
                      }`}>
                        {seoTitle.length}/{titleLimit} caracteres
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={`${selectedProperty.title} | Paulo Martins Consultoria Imobiliária`}
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                    <p className="text-[9px] text-gray-500">
                      Ideal para o buscador do Google. Recomenda-se manter abaixo de 60 caracteres para não ser truncado.
                    </p>
                  </div>

                  {/* SEO Description Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-300 text-xs font-semibold">Meta Descrição (Meta Description)</label>
                      <span className={`text-[10px] font-mono ${
                        seoDescription.length === 0 ? 'text-gray-500' :
                        seoDescription.length > descLimit ? 'text-red-400 font-bold' : 'text-gray-400'
                      }`}>
                        {seoDescription.length}/{descLimit} caracteres
                      </span>
                    </div>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={3}
                      placeholder={selectedProperty.description ? selectedProperty.description.slice(0, 150) + "..." : "Descreva os destaques exclusivos deste imóvel..."}
                      className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 font-light"
                    />
                    <p className="text-[9px] text-gray-500">
                      Resumo exibido abaixo do título nos resultados de busca. O limite recomendado é de 160 caracteres.
                    </p>
                  </div>

                  {/* OG Image Input */}
                  <div className="space-y-1.5">
                    <label className="text-gray-300 text-xs font-semibold block">Imagem de Compartilhamento (og:image)</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={seoImageUrl}
                        onChange={(e) => setSeoImageUrl(e.target.value)}
                        placeholder="https://sua-cdn.com/imagem-compartilhamento.jpg"
                        className="flex-grow bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                      <button
                        type="button"
                        onClick={handleUseMainImage}
                        className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-white/15 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                        title="Usar imagem principal do imóvel"
                      >
                        <ImageIcon size={13} />
                        Usar Foto Principal
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-500">
                      Link absoluto para a imagem de exibição em redes sociais (WhatsApp, LinkedIn, etc.). Deixe em branco para usar a imagem principal por padrão.
                    </p>
                  </div>
                </div>

                {/* Previews: Google & Social Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Google Search Preview */}
                  <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-3.5">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe size={11} className="text-blue-400" />
                      Visualização no Google
                    </span>
                    
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-1">
                      {/* URL */}
                      <div className="flex items-center text-[12px] text-[#202124] font-sans truncate">
                        <span>https://pmartinsimob.com.br</span>
                        <span className="text-[#5f6368] mx-1">›</span>
                        <span className="text-[#5f6368]">{selectedProperty.slug || slugify(selectedProperty.title)}</span>
                      </div>
                      
                      {/* Title */}
                      <h5 className="text-[20px] leading-tight text-[#1a0dab] hover:underline font-sans cursor-pointer truncate font-medium">
                        {seoTitle.trim() || `${selectedProperty.title} | Paulo Martins`}
                      </h5>
                      
                      {/* Description */}
                      <p className="text-[14px] leading-relaxed text-[#4d5156] font-sans break-words line-clamp-2">
                        {seoDescription.trim() || (selectedProperty.description 
                          ? selectedProperty.description.slice(0, 155) + "..." 
                          : "Confira detalhes deste espetacular imóvel exclusivo em Brasília com a consultoria Paulo Martins.")}
                      </p>
                    </div>
                  </div>

                  {/* Social Share Card Preview (WhatsApp / FB) */}
                  <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-3.5">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 size={11} className="text-green-400" />
                      Visualização em Redes Sociais
                    </span>

                    <div className="bg-[#121b22] border border-[#222d34] rounded-2xl overflow-hidden w-full max-w-[340px] mx-auto shadow-xl">
                      {/* Simulated preview image */}
                      <div className="relative aspect-[1.91/1] overflow-hidden bg-zinc-900 border-b border-[#222d34]">
                        <img 
                          src={seoImageUrl.trim() || selectedProperty.imageUrl} 
                          alt="SEO Card og:image" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white/75 uppercase tracking-widest font-mono">
                          {selectedProperty.area}
                        </div>
                      </div>

                      {/* Card Texts */}
                      <div className="p-3.5 bg-[#1f2c34] space-y-1">
                        <span className="text-[9px] text-[#8696a0] font-mono uppercase tracking-wider block">PMARTINSIMOB.COM.BR</span>
                        <h6 className="text-[12.5px] font-semibold text-white/95 leading-snug line-clamp-1">
                          {seoTitle.trim() || selectedProperty.title}
                        </h6>
                        <p className="text-[11px] text-[#8696a0] font-light leading-relaxed line-clamp-2">
                          {seoDescription.trim() || selectedProperty.description || "Oportunidade exclusiva de moradia premium em Brasília. Agende sua visita online."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit action */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 disabled:bg-gray-700 text-white text-xs px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-gold-500/10 active:scale-95 transition-all cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Salvando SEO...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Salvar Configurações de SEO</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-white/5 rounded-2xl h-[400px]">
              <Eye size={36} className="text-gray-600 mb-3 animate-pulse" />
              <p className="text-gray-400 text-sm">Carregando imóveis disponíveis...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
