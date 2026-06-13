import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

const { Link } = RouterDom;

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('lgpd_cookie_consent');
    if (!consent) {
      // Small delay for a smooth introduction effect after page loads
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lgpd_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('lgpd_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 bg-dark-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out md:right-4 flex flex-col gap-4 animate-fade-in"
    >
      <div className="flex gap-3 items-start">
        <div className="p-2 bg-gold-600/10 rounded-lg text-gold-400 shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-white font-serif text-sm font-medium tracking-wide">Privacidade e Cookies (LGPD)</h4>
          <p className="text-gray-400 text-xs leading-relaxed font-light">
            Usamos cookies e tecnologias semelhantes para melhorar a sua experiência de navegação, personalizar conteúdos e analisar o tráfego em nosso site. Ao prosseguir, você concorda de acordo com a nossa{' '}
            <Link to="/privacy" className="text-gold-400 hover:text-gold-300 underline font-medium transition-colors">
              Política de Privacidade
            </Link>.
          </p>
        </div>
        <button 
          id="close-cookie-banner"
          onClick={handleDecline} 
          className="text-gray-500 hover:text-white transition-colors cursor-pointer self-start p-1"
          aria-label="Recusar e fechar"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
        <button
          id="cookie-decline-button"
          onClick={handleDecline}
          className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-white px-3 py-2 transition-all cursor-pointer"
        >
          Recusar
        </button>
        <button
          id="cookie-accept-button"
          onClick={handleAccept}
          className="bg-gold-600 hover:bg-gold-500 text-white text-[10px] uppercase tracking-widest font-bold py-2 px-4 rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(197,160,40,0.15)]"
        >
          Aceitar Cookies
        </button>
      </div>
    </div>
  );
};
