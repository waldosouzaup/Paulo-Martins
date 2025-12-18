
import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Conheça Paulo Martins</h1>
            <div className="h-1 w-24 bg-gold-600 mx-auto rounded-full"></div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative flex justify-center md:justify-end">
                {/* Professional Portrait */}
                <img 
                    src="https://pmartinsimob.com.br/wp-content/uploads/2025/09/paulo_martins2.png" 
                    alt="Paulo Martins" 
                    className="rounded-xl shadow-2xl shadow-gold-900/10 object-cover aspect-[3/4] w-full max-w-md border border-white/5"
                />
            </div>
            <div className="md:pl-8">
                <div className="space-y-6 text-gray-300 font-light leading-relaxed text-lg text-justify md:text-left">
                    <p>
                        Olá, me chamo <strong className="text-white font-medium">Paulo Martins</strong>, sou corretor de imóveis licenciado <span className="text-gold-400 whitespace-nowrap">(CRECI 28.844)</span> e atuo com foco exclusivo na venda de imóveis em Brasília – DF.
                    </p>
                    <p>
                        Com compromisso, transparência e atenção aos detalhes, ajudo meus clientes a encontrarem as melhores oportunidades do mercado, sempre com o objetivo de oferecer um atendimento personalizado, ágil e seguro em cada etapa da negociação.
                    </p>
                    <p>
                        Se você está em busca de um imóvel novo, pronto para morar ou em lançamento, estou à disposição para apresentar opções que se encaixam no seu perfil e acompanhar todo o processo com total suporte.
                    </p>
                    <p className="text-white font-medium border-l-4 border-gold-600 pl-4 py-1 mt-8">
                        Conte comigo para tornar sua conquista imobiliária mais simples, clara e segura.
                    </p>
                </div>
            </div>
        </div>

        {/* Stats / Highlights - Font size reduced by 4% (2xl -> 1.44rem, 3xl -> 1.8rem) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-white/5">
            <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">CRECI</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">28.844</div>
            </div>
            <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">Brasília</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Atuação Exclusiva</div>
            </div>
            <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">Suporte</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Personalizado</div>
            </div>
            <div className="text-center group hover:bg-white/5 p-4 rounded-lg transition-colors">
                <div className="text-[1.44rem] md:text-[1.8rem] font-serif text-white mb-2 group-hover:text-gold-400 transition-colors">Segurança</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Total na Negociação</div>
            </div>
        </div>
      </div>
    </div>
  );
};
