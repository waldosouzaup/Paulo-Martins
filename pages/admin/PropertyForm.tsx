import React, { useState, useEffect } from 'react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { Property } from '../../types';

const { useNavigate, useParams } = RouterDom;

export const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addProperty, updateProperty, properties } = useProperties();
  
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    imagesString: '',
    purpose: 'Venda',
    type: 'Casa',
    city: 'Brasília',
    videoUrl: ''
  });

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
                imagesString: propertyToEdit.images ? propertyToEdit.images.join(', ') : '',
                purpose: propertyToEdit.purpose ?? 'Venda',
                type: propertyToEdit.type ?? 'Casa',
                city: propertyToEdit.city ?? 'Brasília',
                videoUrl: propertyToEdit.videoUrl ?? ''
            });
        }
    }
  }, [isEditMode, id, properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
        const featuresArray = formData.featuresString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const imagesArray = formData.imagesString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        // Se não houver galeria, usa a imagem principal
        const finalImages = imagesArray.length > 0 ? imagesArray : [formData.imageUrl.trim()];

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
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Título do Imóvel</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Ex: Mansão no Lago Sul" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Preço</label>
                    <input required name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Ex: R$ 5.000.000" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Finalidade</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Venda">Venda</option>
                        <option value="Aluguel">Aluguel</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Mansão">Mansão</option>
                        <option value="Lote/Terreno">Lote/Terreno</option>
                        <option value="Loft">Loft</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Cidade</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Bairro / Localização</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Destaque (Tag)</label>
                    <select name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="NOVO">NOVO</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="EXCLUSIVO">EXCLUSIVO</option>
                        <option value="OPORTUNIDADE">OPORTUNIDADE</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Quartos</label>
                    <input required name="beds" value={formData.beds} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Vagas</label>
                    <input required name="parking" value={formData.parking} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Área</label>
                    <input required name="area" value={formData.area} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">URL da Imagem Principal</label>
                <input required name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="https://..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">URL de Vídeo ou Tour Virtual (Opcional)</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="YouTube, Vimeo ou Matterport..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Galeria (URLs separadas por vírgula)</label>
                <textarea name="imagesString" value={formData.imagesString} onChange={handleChange} rows={3} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="URL1, URL2, URL3..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Descrição Detalhada</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Características (Separadas por vírgula)</label>
                <input name="featuresString" value={formData.featuresString} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Piscina, Academia, Churrasqueira..." />
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,40,0.2)] disabled:opacity-70"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
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