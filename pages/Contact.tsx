
import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const whatsappNumber = "5561991176958";
  const whatsappMessage = encodeURIComponent("Estou acessando o site e gostaria de mais informacoes");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Info Section */}
            <div className="animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-12">Entre em Contato</h1>
                
                <div className="space-y-10">
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Telefone</h3>
                            <a href={`tel:+${whatsappNumber}`} className="text-gray-300 text-lg hover:text-gold-400 transition-colors block">
                                +55 (61) 9 9117-6958
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Email Direto</h3>
                            <a href="mailto:contato@pmartinsimob.com.br" className="text-gray-300 text-lg hover:text-gold-400 transition-colors">
                              contato@pmartinsimob.com.br
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-inner group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Escritório</h3>
                            <p className="text-gray-300 text-lg">Brasília, DF</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp CTA Section */}
            <div className="bg-[#0c0c0c] p-10 md:p-12 rounded-3xl border border-white/5 shadow-2xl text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                
                <MessageCircle size={64} className="text-gold-400 mx-auto mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                
                <h2 className="text-3xl font-serif text-white mb-4">Atendimento Imediato</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  Prefere uma conversa rápida? Clique no botão abaixo para falar diretamente comigo agora mesmo pelo WhatsApp.
                </p>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(37,211,102,0.2)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.4)] hover:-translate-y-1 group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-lg uppercase tracking-widest">Conversar via WhatsApp</span>
                </a>
                
                <p className="mt-6 text-gray-500 text-xs">Resposta média em menos de 20 minutos.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
