
import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    mensagem: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/upconversiondigital@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Novo Contato via Site: ${formData.nome}`
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nome: '', telefone: '', email: '', mensagem: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Info Section - Styled to match reference image */}
            <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-12">Entre em Contato</h1>
                
                <div className="space-y-10">
                    {/* Phone/WhatsApp */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Telefone / WhatsApp</h3>
                            <a href="https://wa.me/5561991176958" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-lg hover:text-gold-400 transition-colors block">
                                +55 (61) 9 9117-6958
                            </a>
                            <p className="text-gray-500 font-medium mt-1">Seg - Dom, 7h às 20h</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Email</h3>
                            <a href="mailto:contato@pmartinsimob.com.br" className="text-gray-300 text-lg hover:text-gold-400 transition-colors">
                              contato@pmartinsimob.com.br
                            </a>
                            <p className="text-gray-500 font-medium mt-1">Respondemos em até 24h</p>
                        </div>
                    </div>

                    {/* Office */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Escritório</h3>
                            <p className="text-gray-300 text-lg">Brasília, DF - Brasil</p>
                        </div>
                    </div>
                </div>
                
                <p className="mt-16 text-gray-500 font-light max-w-sm border-l-2 border-gold-600 pl-4 italic">
                    "Atendimento personalizado para quem busca o extraordinário em cada metro quadrado."
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-dark-900 p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-600/5 rounded-full blur-3xl"></div>
                
                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 relative z-10">
                    <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
                    <h3 className="text-3xl text-white font-serif mb-4">Mensagem Enviada!</h3>
                    <p className="text-gray-400 mb-10 text-lg">Obrigado pelo seu interesse. Retornaremos o contato em breve com toda a atenção necessária.</p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="bg-white/5 hover:bg-white/10 text-gold-400 px-8 py-3 rounded-full transition-colors font-medium border border-white/10"
                    >
                      Enviar nova mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Nome Completo</label>
                              <input 
                                required 
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-dark-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder-gray-700" 
                                placeholder="Como podemos chamá-lo?" 
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Telefone</label>
                              <input 
                                required 
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                type="tel" 
                                className="w-full bg-dark-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder-gray-700" 
                                placeholder="(61) 90000-0000" 
                              />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Email</label>
                          <input 
                            required 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="w-full bg-dark-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder-gray-700" 
                            placeholder="exemplo@luxo.com.br" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Sua Mensagem</label>
                          <textarea 
                            required 
                            name="mensagem"
                            value={formData.mensagem}
                            onChange={handleChange}
                            rows={5} 
                            className="w-full bg-dark-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder-gray-700 resize-none" 
                            placeholder="Conte-nos como podemos ajudar você a encontrar seu novo lar..." 
                          />
                      </div>
                      
                      {status === 'error' && (
                        <div className="flex items-center gap-3 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                          <AlertCircle size={20} />
                          Houve um erro técnico. Por favor, tente novamente ou use o WhatsApp.
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="w-full bg-gold-600 hover:bg-gold-500 text-white font-bold py-5 rounded-xl transition-all duration-500 uppercase tracking-[0.25em] text-xs shadow-[0_10px_30px_rgba(197,160,40,0.25)] hover:shadow-[0_15px_40px_rgba(197,160,40,0.35)] disabled:opacity-50 flex items-center justify-center gap-3 group"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            Enviar Mensagem
                            <div className="w-2 h-2 rounded-full bg-white opacity-40 group-hover:scale-150 transition-transform"></div>
                          </>
                        )}
                      </button>
                  </form>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
