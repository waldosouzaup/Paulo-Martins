import React, { useEffect, useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { Home, Compass, Loader2 } from 'lucide-react';
import { SEOHelper } from '../components/SEOHelper';

const { useNavigate } = RouterDom;

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-dark-950 px-4 py-20 relative overflow-hidden">
      <SEOHelper title="Página Não Encontrada - Paulo Martins Imóveis" description="A página que você está procurando não existe ou foi movida." />
      
      {/* Decorative gradient shadows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8 p-8 bg-black/30 border border-white/5 backdrop-blur-md rounded-2xl">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-dark-900 border-2 border-gold-400 rounded-full flex items-center justify-center text-gold-400 animate-pulse">
              <Compass size={40} className="animate-[spin_8s_linear_infinite]" />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono">
              404
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif text-white tracking-wide">Página Não Encontrada</h1>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Ops! O endereço inserido não foi encontrado ou o imóvel pode ter sido atualizado. Não se preocupe, estamos aqui para guiar você de volta ao seu caminho.
          </p>
        </div>

        <div className="py-4 border-t border-b border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-center gap-3">
          <Loader2 className="animate-spin text-gold-500" size={16} />
          <p className="text-xs text-gray-400">
            Redirecionando para a página principal em <span className="text-gold-400 font-bold font-mono text-sm">{countdown}</span> segundos...
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gold-600 hover:bg-gold-500 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(197,160,40,0.15)]"
          >
            <Home size={14} />
            Ir para a Home
          </button>
        </div>
      </div>
    </div>
  );
};
