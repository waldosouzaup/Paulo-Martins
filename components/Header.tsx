
import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { NavItem } from '../types';

const { Link, useLocation } = RouterDom;

const navItems: NavItem[] = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/about' },
  { label: 'Imóveis', path: '/properties' },
  { label: 'Contato', path: '/contact' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Corretor de Imóveis</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 border border-white/5">
            {navItems.map((item) => (
                <Link
                key={item.label}
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

            {/* Admin Icon Desktop */}
            <Link 
              to="/admin/dashboard" 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-600/50 hover:bg-white/5 transition-all duration-300"
              title="Painel Administrativo"
            >
              <User size={18} />
            </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Admin Icon Mobile */}
          <Link 
            to="/admin/dashboard" 
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400"
            title="Painel Administrativo"
          >
            <User size={16} />
          </Link>

          <button 
            className="text-white"
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
              key={item.label}
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
