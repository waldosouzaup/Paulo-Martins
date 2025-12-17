import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Info */}
            <div>
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">Entre em Contato</h1>
                <p className="text-gray-400 text-lg font-light mb-12">
                    Estamos prontos para atender você com a exclusividade e atenção que merece. Agende uma visita ou solicite mais informações.
                </p>

                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">Telefone / WhatsApp</h3>
                            <a href="https://wa.me/5561991176958" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold-400 transition-colors block">
                                +55 (61) 9 9117-6958
                            </a>
                            <p className="text-gray-500 text-sm mt-1">Seg - Sex, 9h às 19h</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">Email</h3>
                            <p className="text-gray-400">contato@paulomartins.com</p>
                            <p className="text-gray-500 text-sm mt-1">Respondemos em até 24h</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">Escritório</h3>
                            <p className="text-gray-400">SHIS QL 10, Lago Sul</p>
                            <p className="text-gray-400">Brasília, DF - Brasil</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 shadow-xl">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Nome</label>
                            <input type="text" className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Seu nome completo" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Telefone</label>
                            <input type="tel" className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="(61) 90000-0000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email</label>
                        <input type="email" className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Mensagem</label>
                        <textarea rows={4} className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors" placeholder="Estou interessado em..." />
                    </div>
                    <button type="button" className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-4 rounded-lg transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(197,160,40,0.2)]">
                        Enviar Mensagem
                    </button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
};