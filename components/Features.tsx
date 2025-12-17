import React from 'react';
import { SearchCheck, Home, UserCheck } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-dark-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Feature 1 */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-gold-600/30 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-full border border-gold-600/50 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
            <SearchCheck size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl text-white font-serif mb-3">Transparência & Integridade</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Oferecemos uma gestão transparente e íntegra, garantindo a segurança e tranquilidade que você merece em cada negociação.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-gold-600/30 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-full border border-gold-600/50 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
            <Home size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl text-white font-serif mb-3">Seu Imóvel Ideal</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Curadoria especializada para encontrar a propriedade que reflete seu estilo de vida e atende aos mais altos padrões de exigência.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-gold-600/30 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-full border border-gold-600/50 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-600 group-hover:text-white transition-all duration-300">
            <UserCheck size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl text-white font-serif mb-3">Assessoria Personalizada</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Acompanhamento exclusivo em todas as etapas, proporcionando uma experiência imobiliária única e sem complicações.
          </p>
        </div>

      </div>
    </section>
  );
};