
import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
      // 1. Tentar salvar no Supabase (Garante que o lead não seja perdido)
      // Nota: Certifique-se de que a tabela 'contacts' existe no seu Supabase
      const { error: sbError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.nome,
          phone: formData.telefone,
          email: formData.email,
          message: formData.mensagem,
          source: 'Pagina de Contato'
        }]);

      // 2. Tentar enviar via Formspree (Para notificação por e-mail)
      // Substitua o ID abaixo pelo ID correto do seu formulário no Formspree quando tiver um
      const response = await fetch('https://formspree.io/f/upconversiondigital', { // Nota: Removido o e-mail da URL que causava erro
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

      // Se salvou no banco, consideramos sucesso mesmo que o e-mail (Formspree) falhe por falta de configuração de ID
      if (response.ok || !sbError) {
        setStatus('success');
        setFormData({ nome: '', telefone: '', email: '', mensagem: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Erro na submissão:", error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Info Section */}
            <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-12">Entre em Contato</h1>
                
                <div className="space-y-10">
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

            {/* Form Section - Updated to match screenshot style */}
            <div className="bg-[#0c0c0c] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 relative z-10">
                    <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
                    <h3 className="text-3xl text-white font-serif mb-4">Mensagem Enviada!</h3>
                    <p className="text-gray-400 mb-10 text-lg">Recebemos seus dados. Paulo Martins entrará em contato em breve.</p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="bg-white/5 hover:bg-white/10 text-gold-400 px-8 py-3 rounded-full transition-colors font-medium border border-white/10"
                    >
                      Enviar nova mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="block text-gray-500 text-[11px] uppercase tracking-[0.2em] font-bold">Nome Completo</label>
                              <input 
                                required 
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-black border border-white/10 rounded-xl px-5 py-5 text-white focus:border-gold-500 focus:outline-none transition-all placeholder-gray-800 text-lg" 
                                placeholder="Seu nome" 
                              />
                          </div>
                          <div className="space-y-3">
                              <label className="block text-gray-500 text-[11px] uppercase tracking-[0.2em] font-bold">Telefone</label>
                              <input 
                                required 
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                type="tel" 
                                className="w-full bg-black border border-white/10 rounded-xl px-5 py-5 text-white focus:border-gold-500 focus:outline-none transition-all placeholder-gray-800 text-lg" 
                                placeholder="(61) 90000-0000" 
                              />
                          </div>
                      </div>
                      <div className="space-y-3">
                          <label className="block text-gray-500 text-[11px] uppercase tracking-[0.2em] font-bold">Email</label>
                          <input 
                            required 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="w-full bg-[#1a1f26] border border-white/5 rounded-xl px-5 py-5 text-white focus:border-gold-500 focus:outline-none transition-all placeholder-gray-800 text-lg shadow-inner" 
                            placeholder="seuemail@exemplo.com" 
                          />
                      </div>
                      <div className="space-y-3">
                          <label className="block text-gray-500 text-[11px] uppercase tracking-[0.2em] font-bold">Sua Mensagem</label>
                          <textarea 
                            required 
                            name="mensagem"
                            value={formData.mensagem}
                            onChange={handleChange}
                            rows={4} 
                            className="w-full bg-black border border-white/10 rounded-xl px-5 py-5 text-white focus:border-gold-500 focus:outline-none transition-all placeholder-gray-800 resize-none text-lg" 
                            placeholder="Como podemos ajudar?" 
                          />
                      </div>
                      
                      {status === 'error' && (
                        <a 
                          href={`https://wa.me/5561991176958?text=Olá, tentei contato pelo site mas deu erro. Meu nome é ${formData.nome}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-red-400 text-sm bg-red-400/10 p-5 rounded-xl border border-red-400/20 hover:bg-red-400/20 transition-colors cursor-pointer"
                        >
                          <AlertCircle size={24} />
                          <div>
                            <p className="font-bold">Houve um erro técnico no envio.</p>
                            <p>Clique aqui para falar diretamente pelo WhatsApp.</p>
                          </div>
                        </a>
                      )}

                      <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="w-full bg-gold-600 hover:bg-gold-500 text-white font-bold py-5 rounded-xl transition-all duration-500 uppercase tracking-[0.25em] text-sm shadow-[0_10px_30px_rgba(197,160,40,0.25)] flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          'Enviar Mensagem'
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
