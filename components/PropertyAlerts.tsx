import React, { useState } from 'react';
import { Mail, Settings, Check, Sparkles, Loader2, RefreshCw, Eye, Tag, MapPin, DollarSign, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PropertyAlertsProps {
  onSaved?: () => void;
}

export const PropertyAlerts: React.FC<PropertyAlertsProps> = ({ onSaved }) => {
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Todos');
  const [type, setType] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState('Todos');
  const [beds, setBeds] = useState('Todos');
  const [city, setCity] = useState('Todos');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');
    setIsFallback(false);

    const alertData = {
      email: email.trim(),
      purpose,
      type,
      max_price: maxPrice,
      beds,
      city,
      created_at: new Date().toISOString()
    };

    try {
      // 1. Attempt to save to Supabase
      const { error } = await supabase.from('property_alerts').insert([alertData]);

      if (error) {
        // Check if table does not exist
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          throw new Error('TABLE_MISSING');
        }
        throw error;
      }

      setStatus('success');
      setMessage('Seu alerta de imóvel foi criado com sucesso! Você receberá um e-mail com as melhores opções assim que correspondências forem publicadas.');
      if (onSaved) onSaved();
      resetForm();
    } catch (err: any) {
      console.warn('Supabase insertion failed or table missing. Falling back to local state:', err);
      
      // Fallback: Save to LocalStorage
      try {
        const localAlerts = JSON.parse(localStorage.getItem('local_property_alerts') || '[]');
        localAlerts.push({
          id: `local-${Date.now()}`,
          ...alertData
        });
        localStorage.setItem('local_property_alerts', JSON.stringify(localAlerts));
        
        setIsFallback(true);
        setStatus('success');
        setMessage('Seu alerta foi salvo localmente com sucesso! (Nota: O painel Supabase precisa da tabela "property_alerts" configurada para notificações globais de e-mail).');
        if (onSaved) onSaved();
        resetForm();
      } catch (localErr) {
        setStatus('error');
        setMessage('Erro ao salvar as preferências do seu alerta. Tente novamente mais tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    // Keep preference filters as is so user can easily adjust or review what they signed up for
  };

  return (
    <div className="bg-dark-900/40 backdrop-blur-md border border-white/5 hover:border-gold-500/20 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-gold-400/15 border border-gold-400/20 px-3 py-1 rounded-full text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Bell size={12} className="animate-pulse" /> Radar Exclusivo
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-white">Criar Alerta de Imóveis</h3>
          <p className="text-gray-400 font-light text-xs sm:text-sm max-w-md">
            Receba notificações em primeira mão assim que um imóvel aderente às suas preferências de alto padrão for cadastrado.
          </p>
        </div>
        {/* Reciprocating spacing for alignment without the icon */}
      </div>

      <form onSubmit={handleSubscribe} className="space-y-6">
        {/* Preference Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Purpose */}
          <div className="space-y-1.5Col">
            <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Finalidade</label>
            <select 
              value={purpose} 
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="Todos">Todas</option>
              <option value="Venda">Venda</option>
              <option value="Aluguel">Aluguel / Locação</option>
            </select>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Tipo de Imóvel</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="Todos">Todos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Mansão">Mansão</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Terreno">Terreno</option>
            </select>
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Preço Máximo</label>
            <select 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="Todos">Qualquer Valor</option>
              <option value="1000000">Até R$ 1,0 Milhão</option>
              <option value="2500000">Até R$ 2,5 Milhões</option>
              <option value="5000000">Até R$ 5,0 Milhões</option>
              <option value="10000000">Até R$ 10,0 Milhões</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Mín. Quartos</label>
            <select 
              value={beds} 
              onChange={(e) => setBeds(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="Todos">Qualquer Qtd.</option>
              <option value="1">1+ Suítes/Quartos</option>
              <option value="2">2+ Suítes/Quartos</option>
              <option value="3">3+ Suítes/Quartos</option>
              <option value="4">4+ Suítes/Quartos</option>
              <option value="5">5+ Suítes/Quartos</option>
            </select>
          </div>

          {/* Location / City */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Localização</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="Todos">Qualquer Região</option>
              <option value="Lago Sul">Lago Sul</option>
              <option value="Lago Norte">Lago Norte</option>
              <option value="Noroeste">Noroeste</option>
              <option value="Asa Sul">Asa Sul</option>
              <option value="Asa Norte">Asa Norte</option>
              <option value="Sudoeste">Sudoeste</option>
              <option value="Park Way">Park Way</option>
            </select>
          </div>

        </div>

        {/* Email registration and submit button */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu melhor e-mail para receber alertas"
              className="w-full bg-dark-950/60 border border-white/10 hover:border-white/20 focus:border-gold-500 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder-gray-500 font-light"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-gold-600 hover:bg-gold-500 disabled:bg-gold-700/50 text-white font-semibold text-xs uppercase tracking-widest sm:px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(197,160,40,0.15)] hover:shadow-[0_4px_25px_rgba(197,160,40,0.25)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Criando Radar...
              </>
            ) : (
              <>
                <Bell size={14} /> Ativar Alertas
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm flex items-start gap-3">
            <div className="bg-green-500/20 p-1.5 rounded-lg shrink-0 mt-0.5">
              <Check size={14} />
            </div>
            <div>
              <p className="font-semibold text-white">Alerta Configurado!</p>
              <p className="mt-1 leading-relaxed font-light">{message}</p>
              {isFallback && (
                <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 text-[11px] text-gray-400">
                  <p className="font-medium text-gold-400 opacity-90 uppercase tracking-wider flex items-center gap-1">
                    <Settings size={10} /> Desenvolvedor / Administrador:
                  </p>
                  <p>Para persistir em nuvem permanentemente, adicione o script SQL fornecido no rodapé da página ou atualize o Supabase.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm leading-relaxed font-light">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
