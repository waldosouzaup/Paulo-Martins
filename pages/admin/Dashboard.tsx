import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit } from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { properties, deleteProperty } = useProperties();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-white">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie seus imóveis exclusivos</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin/new"
              className="bg-gold-600 hover:bg-gold-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
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

        <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden">
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
                        className="w-12 h-12 rounded object-cover"
                      />
                      <span className="text-white font-medium">{prop.title}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gold-400">{prop.price}</td>
                  <td className="p-6 text-gray-400">{prop.location}</td>
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
                            if(window.confirm('Tem certeza que deseja excluir?')) {
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
          {properties.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                Nenhum imóvel cadastrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};