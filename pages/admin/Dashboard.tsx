
import React, { useState } from 'react';
import * as RouterDom from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit, RefreshCw, CheckCircle, XCircle, Loader2, Code, FileText, Bell, Mail, Filter, Globe } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SEOManagerTab } from '../../components/SEOManagerTab';

const { Link } = RouterDom;

export const Dashboard: React.FC = () => {
  const { properties, deleteProperty, connectionStatus, checkConnection, refreshProperties } = useProperties();
  const { logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [keepAliveData, setKeepAliveData] = useState<any>(null);
  const [loadingKeepAlive, setLoadingKeepAlive] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'alerts' | 'radar_config' | 'seo'>('properties');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // States para Configuração do Resend (Radar Exclusivo)
  const [resendApiKey, setResendApiKey] = useState('');
  const [resendSender, setResendSender] = useState('');
  const [resendSubject, setResendSubject] = useState('');
  const [resendTemplate, setResendTemplate] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState('');
  const [configError, setConfigError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const fetchAlertSettings = async () => {
    setLoadingConfig(true);
    setConfigError('');
    setConfigMessage('');
    try {
      const { data, error } = await supabase
        .from('alert_settings')
        .select('*')
        .eq('id', 'global-alerts-config')
        .maybeSingle();

      if (error) {
        if (error.code === '42P01') {
          throw new Error('A tabela alert_settings não existe no Supabase. Execute o script de migração SQL fornecido!');
        }
        throw error;
      }

      if (data) {
        setResendApiKey(data.resend_api_key || '');
        setResendSender(data.resend_email_sender || 'Paulo Martins Imóveis <radar@pmartinsimob.com.br>');
        setResendSubject(data.resend_email_subject || 'Nova oportunidade exclusiva para você: {{title}}');
        setResendTemplate(data.resend_email_template || '');
      }
    } catch (err: any) {
      console.error('Erro ao buscar configurações de alerta:', err);
      setConfigError(err.message || 'Erro ao carregar configurações de alertas.');
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleSaveAlertSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigError('');
    setConfigMessage('');

    try {
      const { error } = await supabase
        .from('alert_settings')
        .upsert({
          id: 'global-alerts-config',
          resend_api_key: resendApiKey.trim(),
          resend_email_sender: resendSender.trim(),
          resend_email_subject: resendSubject.trim(),
          resend_email_template: resendTemplate,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setConfigMessage('Configurações do Radar e Resend salvas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar as configurações do Radar:', err);
      setConfigError(err.message || 'Erro ao salvar as configurações.');
    } finally {
      setSavingConfig(false);
    }
  };

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const { data, error } = await supabase
        .from('property_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setAlerts(data || []);
    } catch (err: any) {
      console.warn('Erro ao buscar alertas do banco de dados, utilizando fallback local...', err);
      try {
        const localAlerts = JSON.parse(localStorage.getItem('local_property_alerts') || '[]');
        setAlerts(localAlerts);
      } catch (localErr) {
        setAlerts([]);
      }
    } finally {
      setLoadingAlerts(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este alerta?')) return;
    
    try {
      if (typeof alertId === 'string' && alertId.startsWith('local-')) {
        const localAlerts = JSON.parse(localStorage.getItem('local_property_alerts') || '[]');
        const updated = localAlerts.filter((a: any) => a.id !== alertId);
        localStorage.setItem('local_property_alerts', JSON.stringify(updated));
        setAlerts(updated);
        return;
      }
      
      const { error } = await supabase
        .from('property_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Falha ao excluir alerta:', err);
      alert('Erro ao excluir alerta');
    }
  };

  React.useEffect(() => {
    if (activeTab === 'alerts') {
      fetchAlerts();
    } else if (activeTab === 'radar_config') {
      fetchAlertSettings();
    }
  }, [activeTab]);

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
    <div className="min-h-screen bg-dark-950 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Status Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 border border-white/5 p-4 rounded-xl">
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
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                title="Sincronizar dados"
            >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                Testar Conexão
            </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">Painel Administrativo</h1>
            <p className="text-gray-400 text-sm sm:text-base">Gerencie seus imóveis exclusivos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2.5 sm:gap-3 w-full lg:w-auto">
            <Link
              to="/admin/tags"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-medium"
            >
              <Code size={16} className="text-gold-400" /> Tags & Rastreamento
            </Link>
            <Link
              to="/admin/alto-sobradinho"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-medium"
            >
              <FileText size={16} className="text-gold-400" /> Editar LP Alto Sobradinho
            </Link>
            <Link
              to="/admin/about"
              className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-medium"
            >
              <Edit size={16} className="text-gold-400" /> Editar Página 'Sobre'
            </Link>
            <Link
              to="/admin/new"
              className="bg-gold-600 hover:bg-gold-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(197,160,40,0.2)] text-xs sm:text-sm font-medium"
            >
              <Plus size={16} /> Novo Imóvel
            </Link>
             <button
               onClick={() => setActiveTab('radar_config')}
               className="bg-dark-800 hover:bg-dark-700 border border-white/10 hover:border-gold-500/50 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-xs sm:text-sm font-medium cursor-pointer"
             >
               <Mail size={16} className="text-gold-400" /> Configurar Resend
             </button>
             <button
                onClick={logout}
                className="bg-dark-800 hover:bg-red-900/20 text-gray-300 hover:text-red-400 border border-white/10 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm font-medium col-span-1 sm:col-span-2 md:col-span-1"
             >
                <LogOut size={16} /> Sair
             </button>
           </div>
         </div>

         {/* Tab Selection */}
         <div className="flex border-b border-white/5 mb-6 gap-2">
           <button
             onClick={() => setActiveTab('properties')}
             className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer ${
               activeTab === 'properties' 
                 ? 'border-gold-500 text-white font-bold text-shadow-sm' 
                 : 'border-transparent text-gray-500 hover:text-gray-300'
             }`}
           >
             Imóveis Cadastrados ({properties.length})
           </button>
           <button
             onClick={() => setActiveTab('alerts')}
             className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
               activeTab === 'alerts' 
                 ? 'border-gold-500 text-white font-bold text-shadow-sm' 
                 : 'border-transparent text-gray-500 hover:text-gray-300'
             }`}
           >
             <Bell size={12} className={activeTab === 'alerts' ? 'text-gold-400' : ''} />
             Radar de Alertas ({alerts.length})
           </button>
           <button
             onClick={() => setActiveTab('radar_config')}
             className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
               activeTab === 'radar_config' 
                 ? 'border-gold-500 text-white font-bold text-shadow-sm' 
                 : 'border-transparent text-gray-500 hover:text-gray-300'
             }`}
           >
             <Mail size={12} className={activeTab === 'radar_config' ? 'text-gold-400' : ''} />
             Config. do Radar/Resend
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'seo'
                  ? 'border-gold-500 text-white font-bold text-shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Globe size={12} className={activeTab === 'seo' ? 'text-gold-400' : ''} />
              Otimização de SEO
           </button>
         </div>

        <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          {activeTab === 'properties' ? (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-left hidden md:table">
                <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Imóvel</th>
                    <th className="p-6">Preço</th>
                    <th className="p-6">Localização</th>
                    <th className="p-6">Ordem</th>
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
                          <div className="flex flex-col">
                            <span className="text-white font-medium truncate max-w-[200px]" title={prop.title}>{prop.title}</span>
                            {prop.is_featured && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[9px] uppercase tracking-wider font-semibold text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded border border-gold-400/20 w-fit">
                                ★ Imóvel do Mês
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-gold-400 font-medium">{prop.price}</td>
                      <td className="p-6 text-gray-400 text-sm">{prop.location}</td>
                      <td className="p-6">
                        {prop.display_order && prop.display_order > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gold-400 bg-gold-400/10 border border-gold-400/20 px-2 py-0.5 rounded">
                            #{prop.display_order}
                          </span>
                        ) : (
                          <span className="text-gray-600 font-light text-xs font-mono">Padrão</span>
                        )}
                      </td>
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

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-white/5">
                {properties.map((prop) => (
                  <div key={prop.id} className="p-5 flex flex-col gap-4 hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-white font-medium text-base truncate" title={prop.title}>
                          {prop.title}
                        </span>
                        <span className="block text-gold-400 font-bold mt-1 text-sm">
                          {prop.price}
                        </span>
                        {prop.is_featured && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[9px] uppercase tracking-wider font-semibold text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded border border-gold-400/20">
                            ★ Imóvel do Mês
                          </span>
                        )}
                        {prop.display_order && prop.display_order > 0 ? (
                          <span className="inline-flex items-center gap-1.5 mt-2 text-[9px] uppercase tracking-wider font-semibold text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded border border-gold-400/20 ml-2">
                             Ordem: #{prop.display_order}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-gray-400 text-xs sm:text-sm bg-white/[0.02] p-3 rounded-lg border border-white/5 break-words">
                      <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold mb-0.5">Localização</span>
                      {prop.location}
                    </div>

                    <div className="flex justify-end items-center gap-3 pt-2 border-t border-white/[0.03]">
                      <Link
                        to={`/admin/edit/${prop.id}`}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#181818] border border-white/10 hover:border-gold-500/50 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
                      >
                        <Edit size={16} className="text-gold-400" />
                        Editar
                      </Link>
                      <button
                        onClick={() => {
                          if(window.confirm('Tem certeza que deseja excluir permanentemente este imóvel?')) {
                              deleteProperty(prop.id)
                          }
                        }}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 hover:border-red-500/40 text-red-400 px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {properties.length === 0 && !isRefreshing && (
                <div className="p-12 sm:p-20 text-center">
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhum imóvel cadastrado no banco de dados.</p>
                    <Link to="/admin/new" className="text-gold-400 hover:underline text-sm sm:text-base">Cadastrar o primeiro imóvel</Link>
                </div>
              )}
              {isRefreshing && (
                <div className="p-12 sm:p-20 text-center text-gray-500 flex flex-col items-center gap-3 text-sm sm:text-base">
                    <Loader2 size={32} className="animate-spin text-gold-600" />
                    Sincronizando com o Supabase...
                </div>
              )}
            </>
          ) : activeTab === 'alerts' ? (
            <>
              {/* Alertas View */}
              {loadingAlerts ? (
                <div className="p-12 sm:p-20 text-center text-gray-500 flex flex-col items-center gap-3 text-sm sm:text-base animate-pulse">
                  <Loader2 size={32} className="animate-spin text-gold-600" />
                  Carregando radares contratados...
                </div>
              ) : (
                <>
                  {/* Desktop Table View of Alerts */}
                  <table className="w-full text-left hidden md:table">
                    <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-6">Cliente (E-mail)</th>
                        <th className="p-6">Finalidade</th>
                        <th className="p-6">Tipo</th>
                        <th className="p-6">Preço Máx.</th>
                        <th className="p-6">Min. Quartos</th>
                        <th className="p-6">Localização</th>
                        <th className="p-6">Data</th>
                        <th className="p-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-white">
                      {alerts.map((al) => (
                        <tr key={al.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-2.5 font-medium">
                              <Mail size={14} className="text-gold-400 shrink-0" />
                              <span className="truncate max-w-[200px]" title={al.email}>{al.email}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                              al.purpose === 'Venda' ? 'bg-blue-500/10 text-blue-400' :
                              al.purpose === 'Aluguel' ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-gray-400'
                            }`}>
                              {al.purpose === 'Todos' ? 'Todas' : al.purpose}
                            </span>
                          </td>
                          <td className="p-6 text-gray-300 font-light">{al.type}</td>
                          <td className="p-6 text-gold-400 font-medium">
                            {al.max_price === 'Todos' ? 'Qualquer Valor' : `Até R$ ${(Number(al.max_price)/1000000).toFixed(1)}M`}
                          </td>
                          <td className="p-6 text-gray-300 font-light">{al.beds === 'Todos' ? 'Qualquer' : `${al.beds}+`}</td>
                          <td className="p-6 text-gray-300 font-light">{al.city}</td>
                          <td className="p-6 text-gray-500 font-mono text-[11px] font-light">
                            {al.created_at ? new Date(al.created_at).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="p-6 text-right">
                            <button
                              onClick={() => deleteAlert(al.id)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-2 cursor-pointer"
                              title="Excluir Alerta"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile Cards View of Alerts */}
                  <div className="block md:hidden divide-y divide-white/5 text-xs text-white">
                    {alerts.map((al) => (
                      <div key={al.id} className="p-5 space-y-3 hover:bg-white/[0.01] transition-colors relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2 font-medium">
                            <Mail size={14} className="text-gold-400 shrink-0" />
                            <span className="truncate max-w-[220px]" title={al.email}>{al.email}</span>
                          </div>
                          <button
                            onClick={() => deleteAlert(al.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Remover alerta"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[11px] bg-white/[0.02] p-3 rounded-xl border border-white/5">
                          <div>
                            <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Finalidade</span>
                            <span className="text-white">{al.purpose === 'Todos' ? 'Qualquer' : al.purpose}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Tipo Imóvel</span>
                            <span className="text-white">{al.type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Preço Máximo</span>
                            <span className="text-gold-400 font-medium">{al.max_price === 'Todos' ? 'Qualquer' : `R$ ${(Number(al.max_price)/1000000).toFixed(1)}M`}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Dormitórios</span>
                            <span className="text-white">{al.beds === 'Todos' ? 'Qualquer' : `${al.beds}+`}</span>
                          </div>
                          <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                            <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold mb-0.5">Localização</span>
                            <span className="text-white">{al.city}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-gray-500 font-mono text-right">
                          Criado em: {al.created_at ? new Date(al.created_at).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {alerts.length === 0 && (
                    <div className="p-12 sm:p-20 text-center text-gray-500 font-light">
                      Nenhum alerta cadastrado até o momento.
                    </div>
                  )}
                </>
              )}
            </>
          ) : activeTab === 'radar_config' ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-serif text-white">Configuração do Radar Exclusivo</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Defina suas credenciais do Resend e customize o template de e-mail que seus clientes receberão.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchAlertSettings}
                  disabled={loadingConfig}
                  className="flex items-center gap-2 text-xs bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer"
                >
                  <RefreshCw size={12} className={loadingConfig ? "animate-spin text-gold-400" : ""} />
                  Recarregar
                </button>
              </div>

              {loadingConfig ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
                  <Loader2 size={32} className="animate-spin text-gold-600" />
                  Carregando configurações...
                </div>
              ) : (
                <form onSubmit={handleSaveAlertSettings} className="space-y-6 text-sm text-gray-300">
                  {configMessage && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                      {configMessage}
                    </div>
                  )}

                  {configError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs space-y-2">
                      <p className="font-semibold">{configError}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Se a tabela `'alert_settings'` ainda não existir no banco de dados, certifique-se de executar o arquivo SQL fornecido para criá-la.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo: Resend API Key */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Chave de API do Resend</label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={resendApiKey}
                          onChange={(e) => setResendApiKey(e.target.value)}
                          placeholder="re_123456789..."
                          className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs cursor-pointer"
                        >
                          {showApiKey ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>

                    {/* Campo: Remetente do e-mail */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">E-mail Remetente (From)</label>
                      <input
                        type="text"
                        value={resendSender}
                        onChange={(e) => setResendSender(e.target.value)}
                        placeholder="Paulo Martins Imóveis <radar@pmartinsimob.com.br>"
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-xs"
                      />
                      <span className="text-[10px] text-gray-500 block">
                        Nota: Na conta gratuita do Resend, use o e-mail verificado da conta ou "onboarding@resend.dev".
                      </span>
                    </div>

                    {/* Campo: Assunto do e-mail */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Assunto do E-mail</label>
                      <input
                        type="text"
                        value={resendSubject}
                        onChange={(e) => setResendSubject(e.target.value)}
                        placeholder="Nova oportunidade exclusiva para você: {{title}}"
                        className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-xs"
                      />
                    </div>

                    {/* Campo: Template de e-mail */}
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Template do E-mail (HTML)</label>
                        <span className="text-[10px] text-gold-400 font-mono">Variáveis suportadas: {"{{title}}"}, {"{{location}}"}, {"{{price}}"}, {"{{beds}}"}, {"{{imageUrl}}"}, {"{{link}}"}</span>
                      </div>
                      <textarea
                        value={resendTemplate}
                        onChange={(e) => setResendTemplate(e.target.value)}
                        rows={16}
                        placeholder="Copie ou edite o código HTML do seu design de e-mail aqui..."
                        className="w-full bg-dark-950 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-gold-500 font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="bg-gold-600 hover:bg-gold-500 disabled:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {savingConfig ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Configurações"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <SEOManagerTab />
          )}
        </div>


      </div>
    </div>
  );
};
