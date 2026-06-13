import React, { useState, useEffect } from 'react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { Property } from '../../types';
import { supabase } from '../../lib/supabase';

const { useNavigate, useParams } = RouterDom;

export const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addProperty, updateProperty, properties } = useProperties();
  
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState<{ [key: number]: boolean }>({});

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    imageUrl: '',
    beds: '',
    parking: '',
    area: '',
    tag: 'NOVO',
    description: '',
    featuresString: '', 
    purpose: 'Venda',
    type: 'Casa',
    city: 'Brasília',
    videoUrl: ''
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && id && properties.length > 0) {
        const propertyToEdit = properties.find(p => p.id === id);
        if (propertyToEdit) {
            setFormData({
                title: propertyToEdit.title ?? '',
                location: propertyToEdit.location ?? '',
                price: propertyToEdit.price ?? '',
                imageUrl: propertyToEdit.imageUrl ?? '',
                beds: String(propertyToEdit.beds ?? ''),
                parking: String(propertyToEdit.parking ?? ''),
                area: propertyToEdit.area ?? '',
                tag: propertyToEdit.tag ?? 'NOVO',
                description: propertyToEdit.description ?? '',
                featuresString: propertyToEdit.features ? propertyToEdit.features.join(', ') : '',
                purpose: propertyToEdit.purpose ?? 'Venda',
                type: propertyToEdit.type ?? 'Casa',
                city: propertyToEdit.city ?? 'Brasília',
                videoUrl: propertyToEdit.videoUrl ?? ''
            });
            setGalleryImages(propertyToEdit.images || []);
        }
    }
  }, [isEditMode, id, properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    // Try auto-creating public bucket 'properties'
    try {
      await supabase.storage.createBucket('properties', { public: true });
    } catch (e) {
      console.log('Bucket already exists or missing permissions to create:', e);
    }

    const fileExt = file.name.split('.').pop();
    const rawFileName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const fileName = `properties/${rawFileName}_${uniqueId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('properties')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (error) {
      throw new Error(
        `Falha no upload: ${error.message}. ` +
        `Certifique-se de que o bucket 'properties' está criado e público no Supabase Storage.`
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleMainImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (err: any) {
      console.error(err);
      alert(`Erro: ${err.message || 'Falha no upload da imagem.'}`);
    } finally {
      setMainImageUploading(false);
    }
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGalleryUploading(prev => ({ ...prev, [index]: true }));
    try {
      const publicUrl = await uploadImageToSupabase(file);
      const updatedGallery = [...galleryImages];
      updatedGallery[index] = publicUrl;
      setGalleryImages(updatedGallery);
    } catch (err: any) {
      console.error(err);
      alert(`Erro: ${err.message || 'Falha no upload da imagem da galeria.'}`);
    } finally {
      setGalleryUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const addGallerySlot = () => {
    setGalleryImages(prev => [...prev, '']);
  };

  const removeGallerySlot = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGalleryUrlChange = (value: string, index: number) => {
    const updatedGallery = [...galleryImages];
    updatedGallery[index] = value;
    setGalleryImages(updatedGallery);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.imageUrl.trim()) {
      alert("Por favor, adicione uma imagem principal (via URL ou upload) para o imóvel.");
      return;
    }

    setIsSubmitting(true);
    
    try {
        const featuresArray = formData.featuresString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const filteredGallery = galleryImages
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        // Se não houver galeria, usa a imagem principal
        const finalImages = filteredGallery.length > 0 ? filteredGallery : [formData.imageUrl.trim()];

        const propertyData: Property = {
            id: isEditMode && id ? id : crypto.randomUUID(),
            title: formData.title.trim(),
            location: formData.location.trim(),
            price: formData.price.trim(),
            imageUrl: formData.imageUrl.trim(),
            beds: formData.beds.trim(),
            parking: formData.parking.trim(),
            area: formData.area.trim(),
            tag: formData.tag,
            description: formData.description.trim(),
            features: featuresArray,
            images: finalImages,
            purpose: formData.purpose,
            type: formData.type,
            city: formData.city.trim(),
            videoUrl: formData.videoUrl.trim()
        };
        
        let success = false;
        if (isEditMode) {
            success = await updateProperty(propertyData);
        } else {
            success = await addProperty(propertyData);
        }
        
        if (success) {
            navigate('/admin/dashboard');
        }
    } catch (err) {
        console.error("Erro no processamento do formulário:", err);
        alert("Ocorreu um erro ao preparar os dados. Verifique os campos.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
            <ArrowLeft size={20} className="mr-2" /> Voltar ao Painel
        </button>

        <h1 className="text-3xl font-serif text-white mb-8">
            {isEditMode ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-dark-900 border border-white/5 p-8 rounded-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Título do Imóvel</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Ex: Mansão no Lago Sul" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Preço</label>
                    <input required name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Ex: R$ 5.000.000" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Finalidade</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Venda">Venda</option>
                        <option value="Aluguel">Aluguel</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Cobertura">Cobertura</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Cidade</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Bairro / Localização</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Destaque (Tag)</label>
                    <select name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="NOVO">NOVO</option>
                        <option value="LANÇAMENTO">LANÇAMENTO</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="EXCLUSIVO">EXCLUSIVO</option>
                        <option value="OPORTUNIDADE">OPORTUNIDADE</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Quartos</label>
                    <input required name="beds" value={formData.beds} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Vagas</label>
                    <input required name="parking" value={formData.parking} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Área</label>
                    <input required name="area" value={formData.area} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
            </div>

            {/* Main Image Selection / Upload */}
            <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white text-xs font-semibold uppercase tracking-widest">Imagem Principal do Imóvel</span>
                    <span className="text-xs text-gray-500">Cadastre o caminho ou Faça o Upload</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-3 space-y-3">
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Caminho da Imagem (URL)</label>
                            <input 
                                required 
                                name="imageUrl" 
                                value={formData.imageUrl} 
                                onChange={handleChange} 
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none" 
                                placeholder="https://exemplo.com/casa.jpg" 
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs">ou</span>
                            <label className="bg-gold-600 hover:bg-gold-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                                {mainImageUploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={13} />
                                        Enviando para o Supabase...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={13} />
                                        Upload para Supabase Storage
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleMainImageFileChange} 
                                    disabled={mainImageUploading} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center border border-white/10 rounded overflow-hidden aspect-video bg-white/5 h-20 w-fit mx-auto md:mr-0">
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Principal Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                        ) : (
                            <span className="text-gray-600 text-[10px]">Sem visualização</span>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">URL de Vídeo ou Tour Virtual (Opcional)</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="YouTube, Vimeo ou Matterport..." />
            </div>

            {/* Image Gallery uploads and URLs Manager */}
            <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                        <span className="text-white text-xs font-semibold uppercase tracking-widest block">Galeria de Fotos do Imóvel</span>
                        <span className="text-[10px] text-gray-500">Adicione múltiplas imagens gerenciando o caminho ou enviando arquivos</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={addGallerySlot}
                        className="bg-dark-800 hover:bg-dark-750 text-gold-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus size={14} /> Adicionar Nova Foto
                    </button>
                </div>

                {galleryImages.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 border border-dashed border-white/5 rounded-lg flex flex-col items-center gap-2">
                        <ImageIcon size={24} className="text-gray-600" />
                        <p className="text-xs">Nenhuma foto adicionada à galeria. O slider usará a imagem principal por padrão.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                        {galleryImages.map((imgUrl, idx) => (
                            <div key={idx} className="bg-dark-950 border border-white/5 p-3 rounded-lg flex flex-col sm:flex-row items-center gap-4 hover:border-white/10 transition-colors">
                                <div className="aspect-video bg-white/5 border border-white/10 rounded w-16 h-12 flex items-center justify-center overflow-hidden shrink-0">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={`Galeria ${idx + 1}`} className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                                    ) : (
                                        <span className="text-gray-600 text-[9px]">Inserir URL</span>
                                    )}
                                </div>

                                <div className="flex-grow w-full space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            value={imgUrl} 
                                            onChange={(e) => handleGalleryUrlChange(e.target.value, idx)} 
                                            className="flex-grow bg-dark-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500" 
                                            placeholder="Caminho/URL da imagem..." 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeGallerySlot(idx)}
                                            className="text-gray-500 hover:text-red-400 p-2 shrink-0 transition-colors"
                                            title="Remover Imagem"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600 text-[10px] uppercase font-semibold">ou upload:</span>
                                        <label className="bg-dark-800 hover:bg-dark-750 text-[10px] text-gray-300 hover:text-gold-400 hover:border-gold-500/30 border border-white/15 px-3 py-1 rounded inline-flex items-center gap-1.5 cursor-pointer font-medium transition-all">
                                            {galleryUploading[idx] ? (
                                                <>
                                                    <Loader2 className="animate-spin text-gold-400" size={11} />
                                                    Enviando arquivo...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={11} />
                                                    Selecionar Arquivo
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => handleGalleryFileChange(e, idx)} 
                                                disabled={galleryUploading[idx]} 
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Descrição Detalhada</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none font-light text-sm" />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Características (Separadas por vírgula)</label>
                <input name="featuresString" value={formData.featuresString} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Piscina, Academia, Churrasqueira..." />
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || mainImageUploading || Object.values(galleryUploading).includes(true)}
                className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest font-bold text-xs"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin font-bold" size={20} />
                        Processando no Banco de Dados...
                    </>
                ) : (
                    isEditMode ? 'Confirmar Alterações' : 'Publicar Imóvel'
                )}
            </button>
        </form>
      </div>
    </div>
  );
};
