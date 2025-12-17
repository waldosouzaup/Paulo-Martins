
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';

const { Link } = RouterDom;

export const Dashboard: React.FC = () => {
  const { properties, deleteProperty, connectionStatus, checkConnection, refreshProperties } = useProperties();
  const { logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTestConnection = async () => {
    setIsRefreshing(true);
    await checkConnection();
    await refreshProperties();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Status Bar */}
        <div className="mb-8 flex items-center justify-between bg-dark-900 border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">Status do Banco:</span>
                {connectionStatus === 'checking' || isRefreshing ? (
                    <div className="flex items-center gap-2 text-gold-400 text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Verificando...</span>
                    </div>
                ) : connectionStatus === 'online' ? (
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                        <CheckCircle size={16} />
                        <span>Conectado ao Supabase</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                        <XCircle size={16} />
                        <span>Erro de Conexão</span>
                    </div>
                )}
            </div>
            <button 
                onClick={handleTestConnection}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                title="Sincronizar dados"
            >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                Testar Conexão
            </button>
        </div>

        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-white">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie seus imóveis exclusivos</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin/new"
              className="bg-gold-600 hover:bg-gold-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(197,160,40,0.2)]"
            >
              <Plus size={18} /> Novo Imóvel
            </Link>
            <button
                onClick={logout}
                className="bg-dark-800 hover:bg-red-900/20 text-gray-300 hover:text-red-400 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <LogOut size={18} /> Sair
            </button>
          </div>
        </div>

        <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-6">Imóvel</th>
                <th className="p-6">Preço</th>
                <th className="p-6">Localização</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        className="w-12 h-12 rounded object-cover border border-white/10"
                      />
                      <span className="text-white font-medium truncate max-w-[200px]" title={prop.title}>{prop.title}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gold-400 font-medium">{prop.price}</td>
                  <td className="p-6 text-gray-400 text-sm">{prop.location}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/edit/${prop.id}`}
                          className="text-gray-500 hover:text-gold-400 transition-colors p-2"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if(window.confirm('Tem certeza que deseja excluir permanentemente este imóvel?')) {
                                deleteProperty(prop.id)
                            }
                          }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && !isRefreshing && (
            <div className="p-20 text-center">
                <p className="text-gray-500 mb-4">Nenhum imóvel cadastrado no banco de dados.</p>
                <Link to="/admin/new" className="text-gold-400 hover:underline">Cadastrar o primeiro imóvel</Link>
            </div>
          )}
          {isRefreshing && (
            <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin text-gold-600" />
                Sincronizando com o Supabase...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
