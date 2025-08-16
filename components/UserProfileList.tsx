import React from 'react';
import type { UserProfile } from '../types';
import Button from './common/Button';

interface UserProfileListProps {
  profiles: UserProfile[];
  onEdit: (profile: UserProfile) => void;
  onDelete: (profileId: string) => void;
  onAdd: () => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ profiles, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestão de Perfis de Usuário</h2>
        <Button onClick={onAdd}>Novo Perfil</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">E-mail</th>
              <th scope="col" className="px-6 py-3">Perfil de Acesso</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{profile.name}</td>
                <td className="px-6 py-4">{profile.email}</td>
                <td className="px-6 py-4">{profile.role}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                  <button onClick={() => onEdit(profile)} className="font-medium text-yellow-600 dark:text-yellow-400 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => onDelete(profile.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {profiles.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhum perfil de usuário cadastrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileList;
