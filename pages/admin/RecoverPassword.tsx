import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { SEOHelper } from '../../components/SEOHelper';

const { useNavigate, Link } = RouterDom;

export const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Formulate redirect URL for the hosted domain pmartinsimob.com.br (or local dev url if testing there)
      const redirectUrl = window.location.origin + '/admin/reset-password';
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setMessage('Link de recuperação enviado com sucesso! Verifique sua caixa de entrada e spam.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 py-12">
      <SEOHelper 
        title="Recuperar Senha - Painel Administrativo" 
        description="Recupere o acesso ao painel de gerenciamento imobiliário do corretor Paulo Martins." 
      />

      <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-400 mb-4 border border-gold-400/20">
            <KeyRound size={20} />
          </div>
          <h1 className="text-2xl font-serif text-white">Recuperar Senha</h1>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Insira o seu endereço de e-mail cadastrado e enviaremos um link seguro para você redefinir a sua senha no domínio pmartinsimob.com.br.
          </p>
        </div>

        <form onSubmit={handleRecover} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-medium">E-mail Cadastrado</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seuemail@provedor.com"
                required
                className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center bg-red-500/10 py-3 rounded-lg border border-red-500/10">
              {error}
            </p>
          )}
          {message && (
            <p className="text-emerald-400 text-xs text-center bg-emerald-500/10 py-3 rounded-lg border border-emerald-500/10 px-4 leading-relaxed">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-3.5 rounded-lg transition-all uppercase tracking-widest text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link 
            to="/admin/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 text-sm transition-all"
          >
            <ArrowLeft size={14} /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};
