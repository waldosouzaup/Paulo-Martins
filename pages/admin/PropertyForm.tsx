import React, { useState, useEffect } from 'react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { Property, PropertyFAQ, VirtualTour } from '../../types';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../lib/utils';

const { useNavigate, useParams } = RouterDom;

export const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addProperty, updateProperty, properties } = useProperties();
  
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [floorPlanUploading, setFloorPlanUploading] = useState(false);
  const [datasheetUploading, setDatasheetUploading] = useState(false);
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
    videoUrl: '',
    is_featured: false,
    slug: '',
    floorPlanUrl: '',
    brief_desc_home: '',
    nearby_school: '',
    nearby_university: '',
    nearby_shopping: '',
    nearby_restaurant: '',
    nearby_hospital: '',
    nearby_banks: '',
    nearby_supermarkets: '',
    nearby_gyms: '',
    nearby_bakeries: '',
    nearby_transport: '',
    address: '',
    datasheetUrl: '',
    virtualTourUrl: '',
    seoTitle: '',
    seoDescription: '',
    seoImageUrl: ''
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [slugIsManuallyEdited, setSlugIsManuallyEdited] = useState(false);
  const [faqs, setFaqs] = useState<PropertyFAQ[]>([]);
  const [floorPlans, setFloorPlans] = useState<{ url: string; description: string }[]>([]);
  const [floorPlanUploadingIndex, setFloorPlanUploadingIndex] = useState<{ [key: number]: boolean }>({});
  const [virtualTours, setVirtualTours] = useState<VirtualTour[]>([]);

  const addVirtualTourSlot = () => {
    setVirtualTours(prev => [...prev, { title: '', url: '' }]);
  };

  const removeVirtualTourSlot = (index: number) => {
    setVirtualTours(prev => prev.filter((_, i) => i !== index));
  };

  const handleVirtualTourChange = (index: number, key: 'title' | 'url', value: string) => {
    setVirtualTours(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addFloorPlanSlot = () => {
    if (floorPlans.length >= 10) {
      alert("Você pode adicionar no máximo 10 plantas.");
      return;
    }
    setFloorPlans(prev => [...prev, { url: '', description: '' }]);
  };

  const removeFloorPlanSlot = (index: number) => {
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
  };

  const handleFloorPlanChange = (index: number, key: 'url' | 'description', value: string) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFloorPlanUploadingIndex(prev => ({ ...prev, [index]: true }));
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFloorPlans(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], url: publicUrl };
        return updated;
      });
    } catch (err: any) {
      console.error(err);
      alert(`Erro no upload da planta: ${err.message || 'Falha no upload.'}`);
    } finally {
      setFloorPlanUploadingIndex(prev => ({ ...prev, [index]: false }));
    }
  };

  const addFaqSlot = () => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  };

  const removeFaqSlot = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, key: 'question' | 'answer', value: string) => {
    setFaqs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  useEffect(() => {
    if (isEditMode && id && properties.length > 0) {
        const propertyToEdit = properties.find(p => String(p.id) === String(id));
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
                videoUrl: propertyToEdit.videoUrl ?? '',
                is_featured: !!propertyToEdit.is_featured,
                slug: propertyToEdit.slug ?? '',
                floorPlanUrl: propertyToEdit.floorPlanUrl ?? '',
                brief_desc_home: propertyToEdit.brief_desc_home ?? '',
                nearby_school: propertyToEdit.nearby_school ?? '',
                nearby_university: propertyToEdit.nearby_university ?? '',
                nearby_shopping: propertyToEdit.nearby_shopping ?? '',
                nearby_restaurant: propertyToEdit.nearby_restaurant ?? '',
                nearby_hospital: propertyToEdit.nearby_hospital ?? '',
                nearby_banks: propertyToEdit.nearby_banks ?? '',
                nearby_supermarkets: propertyToEdit.nearby_supermarkets ?? '',
                nearby_gyms: propertyToEdit.nearby_gyms ?? '',
                nearby_bakeries: propertyToEdit.nearby_bakeries ?? '',
                nearby_transport: propertyToEdit.nearby_transport ?? '',
                address: propertyToEdit.address ?? '',
                datasheetUrl: propertyToEdit.datasheetUrl ?? '',
                virtualTourUrl: propertyToEdit.virtualTourUrl ?? '',
                seoTitle: propertyToEdit.seoTitle ?? '',
                seoDescription: propertyToEdit.seoDescription ?? '',
                seoImageUrl: propertyToEdit.seoImageUrl ?? ''
            });
            setGalleryImages(propertyToEdit.images || []);
            setFaqs(propertyToEdit.faqs || []);
            
            const loadedFloorPlans = propertyToEdit.floorPlans && propertyToEdit.floorPlans.length > 0
              ? propertyToEdit.floorPlans
              : (propertyToEdit.floorPlanUrl ? [{ url: propertyToEdit.floorPlanUrl, description: 'Planta Principal' }] : []);
            setFloorPlans(loadedFloorPlans);

            const loadedVirtualTours = propertyToEdit.virtualTours && propertyToEdit.virtualTours.length > 0
              ? propertyToEdit.virtualTours
              : (propertyToEdit.virtualTourUrl ? [{ title: 'Principal', url: propertyToEdit.virtualTourUrl }] : []);
            setVirtualTours(loadedVirtualTours);

            if (propertyToEdit.slug) {
                setSlugIsManuallyEdited(true);
            }
        }
    }
  }, [isEditMode, id, properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'slug') {
      setSlugIsManuallyEdited(true);
      setFormData(prev => ({ ...prev, slug: slugify(value) }));
    } else {
      setFormData(prev => {
        const nextState = { ...prev, [name]: value };
        if (name === 'title' && !slugIsManuallyEdited && !isEditMode) {
          nextState.slug = slugify(value);
        }
        return nextState;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    // Try auto-creating public bucket 'fotos'
    try {
      await supabase.storage.createBucket('fotos', { public: true });
    } catch (e) {
      console.log('Bucket already exists or missing permissions to create:', e);
    }

    const fileExt = file.name.split('.').pop();
    const rawFileName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const fileName = `properties/${rawFileName}_${uniqueId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (error) {
      throw new Error(
        `Falha no upload: ${error.message}. ` +
        `Certifique-se de que o bucket 'fotos' está criado, público e com políticas de acesso (RLS) configuradas para inserção pública ou anônima no painel do Supabase.`
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fotos')
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

  const handleFloorPlanFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFloorPlanUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFormData(prev => ({ ...prev, floorPlanUrl: publicUrl }));
    } catch (err: any) {
      console.error(err);
      alert(`Erro: ${err.message || 'Falha no upload da planta.'}`);
    } finally {
      setFloorPlanUploading(false);
    }
  };

  const handleDatasheetFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDatasheetUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFormData(prev => ({ ...prev, datasheetUrl: publicUrl }));
    } catch (err: any) {
      console.error(err);
      alert(`Erro: ${err.message || 'Falha no upload do arquivo.'}`);
    } finally {
      setDatasheetUploading(false);
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

        const filteredFloorPlans = floorPlans
            .map(p => ({ url: p.url.trim(), description: p.description.trim() }))
            .filter(p => p.url.length > 0);

        const filteredVirtualTours = virtualTours
            .map(t => ({ title: t.title.trim(), url: t.url.trim() }))
            .filter(t => t.url.length > 0);

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
            videoUrl: formData.videoUrl.trim(),
            is_featured: formData.is_featured,
            slug: (formData.slug.trim() || slugify(formData.title.trim())),
            floorPlanUrl: filteredFloorPlans.length > 0 ? filteredFloorPlans[0].url : '',
            floorPlans: filteredFloorPlans,
            brief_desc_home: formData.brief_desc_home.trim(),
            nearby_school: formData.nearby_school.trim(),
            nearby_university: formData.nearby_university.trim(),
            nearby_shopping: formData.nearby_shopping.trim(),
            nearby_restaurant: formData.nearby_restaurant.trim(),
            nearby_hospital: formData.nearby_hospital.trim(),
            nearby_banks: formData.nearby_banks.trim(),
            nearby_supermarkets: formData.nearby_supermarkets.trim(),
            nearby_gyms: formData.nearby_gyms.trim(),
            nearby_bakeries: formData.nearby_bakeries.trim(),
            nearby_transport: formData.nearby_transport.trim(),
            address: formData.address.trim(),
            datasheetUrl: formData.datasheetUrl.trim(),
            virtualTourUrl: filteredVirtualTours.length > 0 ? filteredVirtualTours[0].url : formData.virtualTourUrl.trim(),
            virtualTours: filteredVirtualTours,
            seoTitle: formData.seoTitle.trim(),
            seoDescription: formData.seoDescription.trim(),
            seoImageUrl: formData.seoImageUrl.trim(),
            faqs: faqs
        };
        
        let success = false;
        if (isEditMode) {
            success = await updateProperty(propertyData);
        } else {
            success = await addProperty(propertyData);
            if (success) {
                // Dispara alertas por e-mail no Radar Exclusivo em segundo plano de forma assíncrona
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    const token = session?.access_token;
                    if (token) {
                        fetch('/api/send-alert-emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ property: propertyData })
                        })
                        .then(res => res.json())
                        .then(resData => {
                            console.log('[Radar] Resultado do disparo de e-mails:', resData);
                        })
                        .catch(err => {
                            console.error('[Radar] Falha ao acionar API de e-mails:', err);
                        });
                    }
                } catch (sessErr) {
                    console.warn('[Radar] Não foi possível carregar a sessão para acionar a API de e-mails:', sessErr);
                }
            }
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

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Bloco 1 - Dados do imovel */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 1</span>
                        Dados do Imóvel
                    </h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Título do Imóvel</label>
                        <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Ex: Mansão no Lago Sul" />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-1">
                            Slug da URL (Link Amigável)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500 text-sm select-none font-light">dominio.com/</span>
                            <input 
                                required 
                                name="slug" 
                                value={formData.slug} 
                                onChange={handleChange} 
                                className="w-full bg-dark-950 border border-white/10 rounded-lg pl-[110px] pr-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors text-sm font-semibold text-gold-400" 
                                placeholder="ex-mansao-no-lago-sul" 
                            />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">A URL amigável do imóvel gerada automaticamente a partir do título do imóvel. Pode ser editada livremente.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Cidade</label>
                            <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Bairro / Localização</label>
                            <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Destaque (Tag)</label>
                            <select name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                                <option value="NOVO">NOVO</option>
                                <option value="LANÇAMENTO">LANÇAMENTO</option>
                                <option value="EM OBRAS">EM OBRAS</option>
                                <option value="PREMIUM">PREMIUM</option>
                                <option value="EXCLUSIVO">EXCLUSIVO</option>
                                <option value="OPORTUNIDADE">OPORTUNIDADE</option>
                            </select>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                        <div className="border-b border-white/5 pb-2">
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Endereço do Imóvel</span>
                            <span className="text-[10px] text-gray-400">Cadastre o endereço completo para exibição na página de detalhes.</span>
                        </div>
                        <div>
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                rows={2} 
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none font-light text-sm" 
                                placeholder="Ex: SQN 208, Bloco F, Asa Norte, Brasília - DF"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Descrição Detalhada</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none font-light text-sm" />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">Características (Separadas por vírgula)</label>
                        <input name="featuresString" value={formData.featuresString} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Piscina, Academia, Churrasqueira..." />
                    </div>

                    {/* Imagem Principal do Imóvel */}
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

                    {/* Destaque Principal / Imóvel do Mês */}
                    <div className={`p-5 rounded-lg border transition-all duration-300 ${formData.is_featured ? 'bg-gold-500/10 border-gold-500/30' : 'bg-white/[0.01] border-white/5'} space-y-4`}>
                        <div className="flex items-start gap-4">
                            <input 
                                type="checkbox" 
                                name="is_featured" 
                                id="is_featured"
                                checked={formData.is_featured} 
                                onChange={handleCheckboxChange} 
                                className="mt-1 w-5 h-5 rounded border-white/10 text-gold-500 focus:ring-gold-500 focus:ring-offset-dark-950 bg-dark-950 accent-gold-500 cursor-pointer" 
                            />
                            <div className="space-y-1 cursor-pointer select-none flex-grow" onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}>
                                <label htmlFor="is_featured" className="block text-white font-serif text-sm font-semibold flex items-center gap-1.5 cursor-pointer">
                                    Definir como Imóvel do Mês (Destaque Principal)
                                </label>
                                <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                                    Marcar este imóvel fará com que ele seja exibido como o <strong>destaque principal ("Imóvel do Mês")</strong> no topo do site, com direito a cronômetro regressivo e curadoria especial. Apenas um imóvel pode assumir esse destaque por vez (outros serão desmarcados automaticamente no banco de dados).
                                </p>
                            </div>
                        </div>

                        {formData.is_featured && (
                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <label className="block text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">Descrição Breve para Home (Exclusivo para o Imóvel do Mês)</label>
                                <p className="text-[11px] text-gray-500 leading-relaxed pb-1">
                                    Esta descrição curta aparecerá diretamente na seção principal do site ("Imóvel do Mês"). É o texto de chamada ideal para reter atenção rapidamente.
                                </p>
                                <textarea 
                                    name="brief_desc_home" 
                                    value={formData.brief_desc_home} 
                                    onChange={handleChange} 
                                    rows={3} 
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none font-light text-xs" 
                                    placeholder="Ex: Cobertura tripla com piscina aquecida privativa, elevador interno, automatizada por voz, vista 360º livre e permanente..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Otimização de Metatags SEO (Dinâmicas) */}
                    <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                        <div className="border-b border-white/5 pb-2">
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Otimização SEO (Metatags de Compartilhamento)</span>
                            <span className="text-[10px] text-gray-400">Personalize o visual deste imóvel no Google, WhatsApp, Facebook e LinkedIn. Deixe em branco para usar as informações padrão do imóvel.</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Título SEO Customizado</label>
                                <input 
                                    name="seoTitle" 
                                    value={formData.seoTitle} 
                                    onChange={handleChange} 
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none" 
                                    placeholder={formData.title ? `${formData.title} | Paulo Martins` : "Ex: Luxuosa Mansão 5 Suítes no Lago Sul..."} 
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Descrição SEO Customizada</label>
                                <textarea 
                                    name="seoDescription" 
                                    value={formData.seoDescription} 
                                    onChange={handleChange} 
                                    rows={3}
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none font-light" 
                                    placeholder={formData.description ? formData.description.slice(0, 150) + "..." : "Ex: Viva com segurança e prestígio no melhor endereço de Brasília. Mansão em lote plano de 2.000m²..."} 
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Imagem de Compartilhamento SEO (OpenGraph)</label>
                                    <span className="text-[9px] text-gray-500">Deixe em branco para usar a imagem principal</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div className="md:col-span-3 space-y-3">
                                        <input 
                                            name="seoImageUrl" 
                                            value={formData.seoImageUrl} 
                                            onChange={handleChange} 
                                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none" 
                                            placeholder="https://exemplo.com/og-imagem.jpg" 
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center border border-white/10 rounded overflow-hidden aspect-video bg-white/5 h-12 w-fit mx-auto md:mr-0 shrink-0">
                                        {formData.seoImageUrl ? (
                                            <img src={formData.seoImageUrl} alt="SEO OG Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                                        ) : (formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt="Default Imagem Preview" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                                        ) : (
                                            <span className="text-gray-600 text-[9px]">S/ Imagem</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bloco 2 - Ficha Técnica Completa */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 2</span>
                        Ficha Técnica Completa & Planta Baixa
                    </h3>
                </div>

                {/* Ficha Técnica Card */}
                <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Arquivo/Link da Ficha Técnica</span>
                            <span className="text-[10px] text-gray-500 block mt-1 leading-relaxed font-light">Insira o link ou faça o upload do arquivo para download direto pelos clientes</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-3 space-y-3">
                            <div>
                                <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1 font-bold">Link da Ficha Técnica (URL ou Upload)</label>
                                <input 
                                    name="datasheetUrl" 
                                    value={formData.datasheetUrl} 
                                    onChange={handleChange} 
                                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none font-light" 
                                    placeholder="https://exemplo.com/ficha_completa.pdf" 
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-xs font-bold">ou</span>
                                <label className="bg-gold-600 hover:bg-gold-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    {datasheetUploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={13} />
                                            Enviando Arquivo...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={13} />
                                            Fazer Upload de Ficha (PDF/Imagem)
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="application/pdf,image/*" 
                                        onChange={handleDatasheetFileChange} 
                                        disabled={datasheetUploading} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center border border-white/10 rounded overflow-hidden p-3 bg-white/5 h-20 w-fit mx-auto md:mr-0 min-w-[120px]">
                            {formData.datasheetUrl ? (
                                <span className="text-emerald-400 text-[10px] font-bold uppercase text-center truncate max-w-[100px]">✓ Ficha Vinculada</span>
                            ) : (
                                <span className="text-gray-600 text-[10px] text-center font-light">Nenhuma Cadastrada</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Plantas do Imóvel (Planta Baixa) Card */}
                <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Plantas do Imóvel (Planta Baixa)</span>
                            <span className="text-[10px] text-gray-500">Adicione até 10 plantas diferentes com descrição detalhada (ex: 1º Pavimento, Cobertura, etc.)</span>
                        </div>
                        {floorPlans.length < 10 && (
                            <button 
                                type="button" 
                                onClick={addFloorPlanSlot}
                                className="bg-dark-800 hover:bg-dark-750 text-gold-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Plus size={14} /> Adicionar Planta
                            </button>
                        )}
                    </div>

                    {floorPlans.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 border border-dashed border-white/5 rounded-lg flex flex-col items-center gap-2">
                            <p className="text-xs font-light">Nenhuma planta cadastrada para este imóvel.</p>
                            <button 
                                type="button" 
                                onClick={addFloorPlanSlot}
                                className="text-xs text-gold-500 hover:underline"
                            >
                                Clique aqui para cadastrar a primeira planta
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                            {floorPlans.map((plan, idx) => {
                                const isUploading = !!floorPlanUploadingIndex[idx];
                                return (
                                    <div key={idx} className="bg-dark-950 border border-white/5 p-4 rounded-lg space-y-3 relative hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gold-400 text-[10px] uppercase font-bold tracking-wider">Planta #{idx + 1}</span>
                                            <button 
                                                type="button"
                                                onClick={() => removeFloorPlanSlot(idx)}
                                                className="text-gray-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                                                title="Remover Planta"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <div className="md:col-span-3 space-y-3">
                                                <div>
                                                    <label className="block text-gray-400 text-[9px] uppercase tracking-wider mb-1 font-semibold">Caminho da Planta (URL)</label>
                                                    <input 
                                                        value={plan.url} 
                                                        onChange={(e) => handleFloorPlanChange(idx, 'url', e.target.value)} 
                                                        className="w-full bg-dark-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500 font-light" 
                                                        placeholder="https://exemplo.com/planta1.jpg" 
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-gray-400 text-[9px] uppercase tracking-wider mb-1 font-semibold">Descrição / Nome da Planta</label>
                                                    <input 
                                                        value={plan.description} 
                                                        onChange={(e) => handleFloorPlanChange(idx, 'description', e.target.value)} 
                                                        className="w-full bg-dark-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500" 
                                                        placeholder="Ex: 1º Pavimento, Planta Unificada, Área de Lazer, etc." 
                                                    />
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-xs font-bold">ou</span>
                                                    <label className="bg-gold-600 hover:bg-gold-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                                        {isUploading ? (
                                                            <>
                                                                <Loader2 className="animate-spin" size={13} />
                                                                Enviando...
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
                                                            onChange={(e) => handleFloorPlanUpload(e, idx)} 
                                                            disabled={isUploading} 
                                                            className="hidden" 
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-center justify-center border border-white/10 rounded overflow-hidden aspect-video bg-white/5 h-20 w-fit mx-auto md:mr-0 animate-fade-in min-w-[120px]">
                                                {plan.url ? (
                                                    <img src={plan.url} alt={`Planta ${idx+1} Preview`} className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                                                ) : (
                                                    <span className="text-gray-600 text-[10px] font-light">Sem visualização</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bloco 3 - Tour Virtual */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 3</span>
                        Tour Virtual
                    </h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5">
                            🌐 Tour Virtual Único (Link Principal de Fallback)
                        </label>
                        <input 
                            name="virtualTourUrl" 
                            value={formData.virtualTourUrl} 
                            onChange={handleChange} 
                            className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none placeholder-gray-600 font-light" 
                            placeholder="Ex: https://kuula.co/share/collection/7Yxxx ou https://my.matterport.com/show/?m=xxx" 
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block font-light leading-relaxed">
                            Link único e padrão do Tour 360 (se não houver múltiplos ambientes abaixo).
                        </span>
                    </div>

                    {/* Múltiplos Ambientes */}
                    <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <div>
                                <span className="text-white text-xs font-semibold uppercase tracking-widest block">🌐 Múltiplos Ambientes de Tour Virtual 360°</span>
                                <span className="text-[10px] text-gray-500 font-light">Cadastre ambientes específicos do imóvel para navegação em abas (ex: Tour Decorado 2Q, 3Q, etc.)</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={addVirtualTourSlot}
                                className="bg-dark-800 hover:bg-dark-750 text-gold-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Plus size={14} /> Adicionar Novo Ambiente
                            </button>
                        </div>

                        {virtualTours.length === 0 ? (
                            <div className="text-center py-4 bg-dark-950/40 rounded-lg border border-dashed border-white/5 text-gray-500 text-xs space-y-2">
                                <p className="font-light">Nenhum ambiente de tour virtual independente cadastrado.</p>
                                {formData.virtualTourUrl ? (
                                    <p className="text-[10px] text-gray-505 font-light">Usando o link do Tour Único informado acima.</p>
                                ) : (
                                    <p className="text-[10px] text-gray-505 font-light">Clique em "Adicionar Novo Ambiente" para criar abas de tours distintos.</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {virtualTours.map((tour, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-3 p-3 bg-dark-950/60 rounded-lg border border-white/5 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Título do Ambiente ou Tour</label>
                                            <input 
                                                type="text" 
                                                value={tour.title} 
                                                onChange={(e) => handleVirtualTourChange(idx, 'title', e.target.value)}
                                                placeholder="Ex: Tour Decorado 2Q, Tour Decorado 3Q, Navegação Virtual" 
                                                className="w-full bg-dark-950 border border-white/10 rounded px-3 py-2 text-white focus:border-gold-500 focus:outline-none placeholder-gray-600 text-xs"
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">URL do Tour Virtual (Panoee, Kuula, Matterport, etc.)</label>
                                            <input 
                                                type="text" 
                                                value={tour.url} 
                                                onChange={(e) => handleVirtualTourChange(idx, 'url', e.target.value)}
                                                placeholder="Ex: https://my360tourvirtual.com.br/tour-virtual/..." 
                                                className="w-full bg-dark-950 border border-white/10 rounded px-3 py-2 text-white focus:border-gold-500 focus:outline-none placeholder-gray-600 text-xs"
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeVirtualTourSlot(idx)}
                                            className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded transition cursor-pointer self-start md:self-end"
                                            title="Remover Ambiente"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bloco 4 - Galeria de Fotos do Imóvel */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 4</span>
                        Galeria de Fotos do Imóvel
                    </h3>
                </div>

                <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Galeria de Fotos do Imóvel</span>
                            <span className="text-[10px] text-gray-500 font-light">Adicione múltiplas imagens gerenciando o caminho ou enviando arquivos</span>
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
                            <p className="text-xs font-light">Nenhuma foto adicionada à galeria. O slider usará a imagem principal por padrão.</p>
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
                                                className="text-gray-500 hover:text-red-400 p-2 shrink-0 transition-colors cursor-pointer"
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
            </div>

            {/* Bloco 5 - URL de Vídeo */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 5</span>
                        URL de Vídeo
                    </h3>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold font-bold">URL de Vídeo (Opcional)</label>
                    <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none placeholder-gray-605 font-light text-sm" placeholder="Ex: YouTube, Vimeo ou Matterport..." />
                </div>
            </div>

            {/* Bloco 6 - Proximidades & Conveniência */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 6</span>
                        Proximidades & Conveniência
                    </h3>
                </div>

                <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                    <div className="border-b border-white/5 pb-2">
                        <span className="text-white text-xs font-semibold uppercase tracking-widest block">Proximidades & Conveniência</span>
                        <span className="text-[10px] text-gray-500 block mt-1 leading-relaxed font-light">
                            Escreva os locais próximos. Para cadastrar <strong>múltiplos locais</strong>, digite cada um em uma linha ou separe por vírgulas/ponto-e-vírgulas (exemplo: Escola A na primeira linha, Escola B na segunda linha). Eles serão exibidos como uma lista elegante.
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🏠 Escolas mais próximas</label>
                            <textarea 
                                name="nearby_school" 
                                value={formData.nearby_school} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Colégio Anchieta&#10;EC 502 de Samambaia" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🎓 Faculdade / Universidade</label>
                            <textarea 
                                name="nearby_university" 
                                value={formData.nearby_university} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: IBMEC ou UnB (10 min)&#10;Faculdade Planalto" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🛍️ Shoppings</label>
                            <textarea 
                                name="nearby_shopping" 
                                value={formData.nearby_shopping} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: ParkShopping (8 min)&#10;Iguatemi Shopping" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🍽️ Restaurantes renomados</label>
                            <textarea 
                                name="nearby_restaurant" 
                                value={formData.nearby_restaurant} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Coco Bambu (5 min)&#10;Fogo de Chão" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🏥 Hospitais & Atendimento Médico</label>
                            <textarea 
                                name="nearby_hospital" 
                                value={formData.nearby_hospital} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Hospital Brasília (8 min)&#10;UBS 07 de Samambaia" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🏦 Bancos & Caixas Eletrônicos</label>
                            <textarea 
                                name="nearby_banks" 
                                value={formData.nearby_banks} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Banco do Brasil&#10;Itaú (3 min)" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🛒 Supermercados & Atacados</label>
                            <textarea 
                                name="nearby_supermarkets" 
                                value={formData.nearby_supermarkets} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Atacadão Dia a Dia&#10;Pão de Açúcar" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🏋️‍♂️ Academias de Ginástica</label>
                            <textarea 
                                name="nearby_gyms" 
                                value={formData.nearby_gyms} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Smart Fit (5 min)&#10;Bluefit" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🍞 Padarias & Confeitarias</label>
                            <textarea 
                                name="nearby_bakeries" 
                                value={formData.nearby_bakeries} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Panificadora Gourmet&#10;Preciosa Pães" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">🚌 Transporte Público & Integração</label>
                            <textarea 
                                name="nearby_transport" 
                                value={formData.nearby_transport} 
                                onChange={handleChange} 
                                rows={2}
                                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 font-light resize-none" 
                                placeholder="Ex: Estação de Metrô (5 min)&#10;Terminal de Ônibus" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bloco 7 - Perguntas Frequentes (FAQs) */}
            <div className="bg-dark-900 border border-white/5 p-6 rounded-2xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                    <h3 className="text-white text-base font-serif font-semibold tracking-wide flex items-center gap-2">
                        <span className="text-gold-500 font-mono text-xs px-2 py-0.5 rounded border border-gold-500/30 bg-gold-500/5">Bloco 7</span>
                        Perguntas Frequentes (FAQs)
                    </h3>
                </div>

                <div className="border border-white/5 p-5 rounded-lg bg-white/[0.01] space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                            <span className="text-white text-xs font-semibold uppercase tracking-widest block">Perguntas Frequentes (FAQs)</span>
                            <span className="text-[10px] text-gray-500">Adicione perguntas e respostas frequentes para ajudar compradores interessados</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={addFaqSlot}
                            className="bg-dark-800 hover:bg-dark-750 text-gold-400 hover:text-gold-300 border border-white/10 hover:border-gold-500/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                            <Plus size={14} /> Adicionar Pergunta
                        </button>
                    </div>

                    {faqs.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 border border-dashed border-white/5 rounded-lg flex flex-col items-center gap-2">
                            <p className="text-xs">Nenhuma pergunta frequente cadastrada para este imóvel.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-dark-950 border border-white/5 p-4 rounded-lg space-y-3 relative hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gold-400 text-[10px] uppercase font-bold tracking-wider">Pergunta #{idx + 1}</span>
                                        <button 
                                            type="button"
                                            onClick={() => removeFaqSlot(idx)}
                                            className="text-gray-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                                            title="Remover Pergunta"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-gray-400 text-[9px] uppercase tracking-wider mb-1 font-semibold">Pergunta</label>
                                            <input 
                                                required
                                                value={faq.question} 
                                                onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                                                className="w-full bg-dark-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500" 
                                                placeholder="Ex: Aceita financiamento ou permuta?" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-[9px] uppercase tracking-wider mb-1 font-semibold">Resposta</label>
                                            <textarea 
                                                required
                                                rows={2}
                                                value={faq.answer} 
                                                onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                                                className="w-full bg-dark-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500 font-light" 
                                                placeholder="Ex: Sim, este imóvel possui habite-se e aceitamos veículo de menor valor como parte do pagamento." 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || mainImageUploading || datasheetUploading || Object.values(floorPlanUploadingIndex).includes(true) || Object.values(galleryUploading).includes(true)}
                className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest font-bold text-xs cursor-pointer"
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
