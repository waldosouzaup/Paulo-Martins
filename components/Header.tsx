import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

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
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuth();

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
        <div className="hidden md:flex items-center gap-2">
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

            {/* Icons Group */}
            <div className="flex items-center gap-1 ml-4 border-l border-white/10 pl-4">
                {/* Favorites Icon */}
                <Link to="/favorites" className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors">
                    <Heart size={20} />
                    {favorites.length > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-gold-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                            {favorites.length}
                        </span>
                    )}
                </Link>

                {/* Login/Admin Icon */}
                <Link 
                    to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} 
                    className={`p-2 transition-colors ${location.pathname.startsWith('/admin') ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'}`}
                    title={isAuthenticated ? "Painel Administrativo" : "Área do Corretor"}
                >
                    <User size={20} />
                </Link>
            </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
           <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                location.pathname === '/favorites' ? 'text-gold-400 bg-white/5' : 'text-gray-300'
              }`}
            >
              <Heart size={18} />
              Favoritos ({favorites.length})
            </Link>
            <div className="h-px bg-white/10 my-2"></div>
            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                location.pathname.startsWith('/admin') ? 'text-gold-400 bg-white/5' : 'text-gray-300'
              }`}
            >
              <User size={18} />
              {isAuthenticated ? "Painel Administrativo" : "Área do Corretor"}
            </Link>
        </div>
      )}
    </nav>
  );
};