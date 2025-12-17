import React, { useState } from 'react';
// Fix: Use namespace import to resolve "no exported member" errors from react-router-dom
import * as RouterDom from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const { useNavigate } = RouterDom;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) throw error;
            setMessage('Conta criada! Verifique seu email para confirmar.');
            setIsSignUp(false);
        } else {
            const { error } = await login(email, password);
            if (error) throw error;
            navigate('/admin/dashboard');
        }
    } catch (err: any) {
        setError(err.message || 'Erro ao processar solicitação');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gold-400 mb-4">
                <Lock size={20} />
            </div>
            <h1 className="text-2xl font-serif text-white">
                {isSignUp ? 'Criar Conta' : 'Área Administrativa'}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
                {isSignUp ? 'Preencha os dados abaixo' : 'Entre com suas credenciais'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                </div>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                />
            </div>
          </div>
          <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                </div>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center bg-green-500/10 py-2 rounded">{message}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-600 hover:bg-gold-500 text-white font-medium py-3 rounded-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
                className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
            >
                {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
            </button>
        </div>
      </div>
    </div>
  );
};