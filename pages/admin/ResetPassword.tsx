import React, { useState, useEffect } from 'react';
import * as RouterDom from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { SEOHelper } from '../../components/SEOHelper';

const { useNavigate } = RouterDom;

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  
  const navigate = useNavigate();

  // Verify that the user actually has a valid recovery session
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasSession(true);
        } else {
          // If no session is found, let's wait a moment just in case Supabase is parsing the hash fragments
          setTimeout(async () => {
            const { data: { session: delayedSession } } = await supabase.auth.getSession();
            if (delayedSession) {
              setHasSession(true);
            } else {
              setHasSession(false);
            }
            setCheckingSession(false);
          }, 1500);
          return;
        }
        setCheckingSession(false);
      } catch (err) {
        setCheckingSession(false);
      }
    };

    checkActiveSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Digite novamente.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      // Wait some time then navigate to login
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir sua senha. Link expirado ou inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 py-12">
      <SEOHelper 
        title="Redefinir Senha - Painel Administrativo" 
        description="Defina uma nova senha de acesso seguro para o painel de gerenciamento imobiliário." 
      />

      <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-400 mb-4 border border-gold-400/20">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-serif text-white">Criar Nova Senha</h1>
          <p className="text-gray-400 text-sm mt-2">
            Insira sua nova senha forte para restabelecer o acesso ao site.
          </p>
        </div>

        {checkingSession ? (
          <div className="py-8 text-center" id="session-check-loading">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Validando link de recuperação...</p>
          </div>
        ) : success ? (
          <div className="bg-white/[0.02] border border-gold-400/20 rounded-xl p-6 text-center space-y-4 py-8" id="success-reset">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
              <Check size={24} />
            </div>
            <h4 className="text-lg font-serif text-white">Senha Alterada!</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sua senha foi redefinida com extremo sucesso. Redirecionando para a página de Login em instantes...
            </p>
          </div>
        ) : !hasSession ? (
          <div className="bg-white/[0.02] border border-red-500/20 rounded-xl p-6 text-center space-y-4 py-8" id="no-session-error">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400 border border-red-500/20">
              <ShieldAlert size={24} />
            </div>
            <h4 className="text-lg font-serif text-white">Link Expirado ou Inválido</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Não conseguimos encontrar uma sessão de redefinição ativa. Isso ocorre se o link já foi usado ou passou de 24 horas. Solite um novo link de recuperação.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/admin/recover-password')}
                className="px-4 py-2 bg-dark-800 hover:bg-black/40 border border-white/10 hover:border-gold-400 text-xs text-gold-400 rounded-lg transition-all"
              >
                Solicitar Novo E-mail
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-medium">Nova Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  required
                  className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-medium">Confirmar Nova Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua nova senha"
                  required
                  className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center bg-red-500/10 py-2.5 rounded-lg border border-red-500/10">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-3.5 rounded-lg transition-all uppercase tracking-widest text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Salvando Nova Senha...' : 'Salvar Nova Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
