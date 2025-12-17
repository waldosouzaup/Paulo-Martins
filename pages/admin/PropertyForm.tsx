import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { Property } from '../../types';

export const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Check for ID param
  const { addProperty, updateProperty, properties } = useProperties();
  
  const isEditMode = !!id;

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
    if (isEditMode && id) {
        const propertyToEdit = properties.find(p => p.id === id);
        if (propertyToEdit) {
            setFormData({
                title: propertyToEdit.title,
                location: propertyToEdit.location,
                price: propertyToEdit.price,
                imageUrl: propertyToEdit.imageUrl,
                beds: String(propertyToEdit.beds),
                parking: String(propertyToEdit.parking),
                area: propertyToEdit.area,
                tag: propertyToEdit.tag,
                description: propertyToEdit.description || '',
                featuresString: propertyToEdit.features ? propertyToEdit.features.join(', ') : '',
                imagesString: propertyToEdit.images ? propertyToEdit.images.join(', ') : '',
                purpose: propertyToEdit.purpose || 'Venda',
                type: propertyToEdit.type || 'Casa',
                city: propertyToEdit.city || 'Brasília',
                videoUrl: propertyToEdit.videoUrl || ''
            });
        }
    }
  }, [isEditMode, id, properties]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData: Property = {
        id: isEditMode && id ? id : crypto.randomUUID(),
        title: formData.title,
        location: formData.location,
        price: formData.price,
        imageUrl: formData.imageUrl,
        beds: formData.beds,
        parking: formData.parking,
        area: formData.area,
        tag: formData.tag,
        description: formData.description,
        features: formData.featuresString.split(',').map(s => s.trim()).filter(s => s !== ''),
        images: formData.imagesString.split(',').map(s => s.trim()).filter(s => s !== ''),
        purpose: formData.purpose,
        type: formData.type,
        city: formData.city,
        videoUrl: formData.videoUrl
    };
    
    // If no extra images provided, use main image as first extra
    if (propertyData.images?.length === 0) {
        propertyData.images = [propertyData.imageUrl];
    }

    if (isEditMode) {
        updateProperty(propertyData);
    } else {
        addProperty(propertyData);
    }
    
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
            <ArrowLeft size={20} className="mr-2" /> Voltar
        </button>

        <h1 className="text-3xl font-serif text-white mb-8">
            {isEditMode ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-dark-900 border border-white/5 p-8 rounded-xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Título</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: Mansão no Lago Sul" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Preço</label>
                    <input required name="price" value={formData.price} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: R$ 5.000.000" />
                </div>
            </div>

            {/* New Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Finalidade</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Venda">Venda</option>
                        <option value="Aluguel">Aluguel</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Tipo de Imóvel</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none">
                        <option value="Casa">Casa</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Mansão">Mansão</option>
                        <option value="Lote/Terreno">Lote/Terreno</option>
                        <option value="Loft">Loft</option>
                        <option value="Comercial">Comercial</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Cidade</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: Brasília" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Localização (Bairro/Detalhe)</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: Lago Sul QL 10" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Tag</label>
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
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Quartos/Suítes</label>
                    <input required name="beds" value={formData.beds} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: 4 Suítes" />
                </div>
                <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Vagas</label>
                    <input required name="parking" value={formData.parking} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: 4 Vagas" />
                </div>
                 <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Área</label>
                    <input required name="area" value={formData.area} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Ex: 500m²" />
                </div>
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Imagem Principal (URL)</label>
                <input required name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="https://..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Link do Vídeo (YouTube, Vimeo ou Tour Virtual)</label>
                <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="https://www.youtube.com/watch?v=..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Imagens Adicionais (URLs separadas por vírgula)</label>
                <textarea name="imagesString" value={formData.imagesString} onChange={handleChange} rows={3} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="https://..., https://..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Descrição</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Descrição detalhada do imóvel..." />
            </div>

            <div>
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Características (Separadas por vírgula)</label>
                <input name="featuresString" value={formData.featuresString} onChange={handleChange} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none" placeholder="Piscina, Churrasqueira, Vista Livre..." />
            </div>

            <button type="submit" className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(197,160,40,0.2)]">
                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </button>

        </form>
      </div>
    </div>
  );
};