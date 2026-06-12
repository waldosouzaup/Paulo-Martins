
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit, RefreshCw, CheckCircle, XCircle, Loader2, Code, FileText } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';

const { Link } = RouterDom;

export const Dashboard: React.FC = () => {
  const { properties, deleteProperty, connectionStatus, checkConnection, refreshProperties } = useProperties();
  const { logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [keepAliveData, setKeepAliveData] = useState<any>(null);
  const [loadingKeepAlive, setLoadingKeepAlive] = useState(false);

  const fetchKeepAliveStatus = async () => {
    setLoadingKeepAlive(true);
    try {
      const response = await fetch('/api/keep-alive');
      if (response.ok) {
        const data = await response.json();
        setKeepAliveData(data);
      }
    } catch (err) {
      console.error('Erro ao consultar status de keep-alive:', err);
    } finally {
      setLoadingKeepAlive(false);
    }
  };

  React.useEffect(() => {
    fetchKeepAliveStatus();
  }, []);

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
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/tags"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
            >
              <Code size={16} className="text-gold-400" /> Tags & Rastreamento
            </Link>
            <Link
              to="/admin/alto-sobradinho"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
            >
              <FileText size={16} className="text-gold-400" /> Editar LP Alto Sobradinho
            </Link>
            <Link
              to="/admin/about"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
            >
              <Edit size={16} className="text-gold-400" /> Editar Página 'Sobre'
            </Link>
            <Link
              to="/admin/new"
              className="bg-gold-600 hover:bg-gold-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(197,160,40,0.2)] text-sm"
            >
              <Plus size={16} /> Novo Imóvel
            </Link>
            <button
                onClick={logout}
                className="bg-dark-800 hover:bg-red-900/20 text-gray-300 hover:text-red-400 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
                <LogOut size={16} /> Sair
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

        {/* Painel Script Keep-Alive Supabase */}
        <div className="mt-12 bg-dark-900 border border-white/5 rounded-xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4 animate-fade-in" id="keep-alive-panel">
            <div>
              <h2 className="text-xl font-serif text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping"></span>
                Prevenção de Inatividade Supabase (Script Interno)
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Uma rotina integrada que consulta o banco a cada 12 horas para manter o servidor gratuito sempre ativo e evitar pausa.
              </p>
            </div>
            <button
              onClick={fetchKeepAliveStatus}
              disabled={loadingKeepAlive}
              id="btn-trigger-ping"
              className="px-4 py-2 bg-dark-800 hover:bg-dark-950 border border-white/10 rounded-lg text-xs text-gray-300 font-medium flex items-center gap-2 transition-all duration-200 self-start md:self-auto cursor-pointer hover:border-gold-400"
            >
              <RefreshCw size={14} className={loadingKeepAlive ? 'animate-spin text-gold-400' : ''} />
              Pingar / Atualizar Agora
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex flex-col justify-between" id="metric-interval">
              <span className="text-gray-400 text-xs uppercase tracking-wider">Intervalo da Rotina</span>
              <div className="text-xl font-medium text-white mt-1">A cada 12 horas</div>
              <span className="text-xs text-emerald-500 mt-2 flex items-center gap-1">✔ Ativo e Executando</span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex flex-col justify-between" id="metric-last-ping">
              <span className="text-gray-400 text-xs uppercase tracking-wider">Último Ping Realizado</span>
              <div className="text-sm font-mono text-gray-300 mt-1 truncate">
                {keepAliveData?.currentCheck?.timestamp
                  ? new Date(keepAliveData.currentCheck.timestamp).toLocaleString('pt-BR')
                  : 'Carregando...'}
              </div>
              <span className={`text-xs mt-2 flex items-center gap-1 ${keepAliveData?.status === 'success' ? 'text-emerald-500 font-medium' : 'text-yellow-400'}`}>
                {keepAliveData?.status === 'success' ? '● Sucesso: Banco Acordado' : '● Verificando status...'}
              </span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex flex-col justify-between" id="metric-query-result">
              <span className="text-gray-400 text-xs uppercase tracking-wider">Resultado da Query</span>
              <div className="text-sm font-medium text-gold-400 mt-1 truncate" title={keepAliveData?.currentCheck?.message}>
                {keepAliveData?.currentCheck?.message || 'Nenhuma resposta ainda...'}
              </div>
              <span className="text-xs text-gray-500 mt-2">Acesso direto ao schema properties</span>
            </div>
          </div>

          {/* Histórico Recente de Pings */}
          {keepAliveData?.history && keepAliveData.history.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/5" id="keep-alive-logs">
              <span className="text-gray-400 text-xs uppercase tracking-wider block mb-3 font-semibold">Histórico de Pings nesta sessão</span>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
                {keepAliveData.history.map((log: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.03] transition-colors" id={`log-item-${idx}`}>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                    <span className={log.success ? 'text-emerald-400' : 'text-red-400 font-medium'}>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
