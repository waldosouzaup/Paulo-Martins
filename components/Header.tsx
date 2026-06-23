
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, Check } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { useLanguage, LanguageType } from '../context/LanguageContext';

const { Link, useLocation } = RouterDom;

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.properties'), path: '/properties' },
    { label: t('nav.favorites'), path: '/favorites' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = !desktopDropdownRef.current || !desktopDropdownRef.current.contains(target);
      const isOutsideMobile = !mobileDropdownRef.current || !mobileDropdownRef.current.contains(target);
      if (isOutsideDesktop && isOutsideMobile) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: LanguageType) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== '/' ? 'bg-dark-900/95 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col group">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-serif text-gold-400 font-bold tracking-tighter group-hover:text-gold-300 transition-colors">PM</span>
            <div className="flex flex-col leading-none border-l border-white/20 pl-3">
              <span className="text-sm font-bold tracking-widest uppercase text-white group-hover:text-gray-200 transition-colors">Paulo Martins</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                {language === 'en' ? 'Real Estate Consulting' : language === 'es' ? 'Consultoría Inmobiliaria' : 'Corretor de Imóveis'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 border border-white/5">
            {navItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                    ? 'bg-white/10 text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                >
                {item.label}
                </Link>
            ))}
            </div>

            {/* Language Selector Desktop */}
            <div className="relative ml-2 text-left" ref={desktopDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-gold-500/10 hover:border-gold-500/30 transition-all duration-300"
                aria-label="Selecionar idioma"
              >
                <Globe size={14} className="text-gold-400" />
                <span>{language}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { code: 'pt', label: 'Português' },
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as LanguageType)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-xs text-left transition-colors ${
                        language === lang.code 
                          ? 'bg-gold-500/10 text-gold-400 font-medium' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && <Check size={12} className="text-gold-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Language Selector Mobile Toggle Icon */}
          <div className="relative text-left" ref={mobileDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-2 rounded-full text-gray-300 bg-white/5 border border-white/10"
              aria-label="Idioma"
            >
              <Globe size={18} className="text-gold-400" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                {[
                  { code: 'pt', label: 'Português' },
                  { code: 'en', label: 'English' },
                  { code: 'es', label: 'Español' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as LanguageType)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left ${
                      language === lang.code ? 'bg-gold-500/10 text-gold-400 font-medium' : 'text-gray-300'
                    }`}
                  >
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="text-white p-2 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-dark-900 border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl">
           {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium ${
                location.pathname === item.path ? 'text-gold-400 bg-white/5' : 'text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
