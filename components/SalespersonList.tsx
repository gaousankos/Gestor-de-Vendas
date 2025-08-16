import React from 'react';
import type { Salesperson } from '../types';
import Button from './common/Button';

interface SalespersonListProps {
  salespeople: Salesperson[];
  onEdit: (salesperson: Salesperson) => void;
  onDelete: (salespersonId: string) => void;
  onAdd: () => void;
}

const SalespersonList: React.FC<SalespersonListProps> = ({ salespeople, onEdit, onDelete, onAdd }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestão de Consultores</h2>
        <Button onClick={onAdd}>Novo Consultor</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Unidade de Negócio</th>
              <th scope="col" className="px-6 py-3">Nível</th>
              <th scope="col" className="px-6 py-3">Data de Admissão</th>
              <th scope="col" className="px-6 py-3 text-right">Meta de Vendas</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {salespeople.map(sp => (
              <tr key={sp.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{sp.name}</td>
                <td className="px-6 py-4">{sp.businessUnit}</td>
                <td className="px-6 py-4">{sp.level}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sp.hireDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap font-semibold">{sp.salesGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                  <button onClick={() => onEdit(sp)} className="font-medium text-yellow-600 dark:text-yellow-400 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => onDelete(sp.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {salespeople.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhum consultor cadastrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalespersonList;
