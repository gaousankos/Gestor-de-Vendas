import React, { useState, useMemo } from 'react';
import type { CalculatedCommission, Salesperson } from '../types';
import { CommissionStatus } from '../types';
import Button from './common/Button';
import CommissionStatusBadge from './common/CommissionStatusBadge';

interface CommissionListProps {
  commissions: CalculatedCommission[];
  salespeople: Salesperson[];
  onAdd: () => void;
  onEdit: (commission: CalculatedCommission) => void;
  onDelete: (commissionId: string) => void;
}

const CommissionList: React.FC<CommissionListProps> = ({ commissions, salespeople, onAdd, onEdit, onDelete }) => {
  const [consultantFilter, setConsultantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const consultantMatch = consultantFilter === 'all' || c.consultant === consultantFilter;
      const statusMatch = statusFilter === 'all' || c.status === statusFilter;
      return consultantMatch && statusMatch;
    });
  }, [commissions, consultantFilter, statusFilter]);
  
  const totals = useMemo(() => {
    return filteredCommissions.reduce((acc, c) => {
        acc.totalOrderValue += c.orderValue;
        acc.totalCommissionValue += c.commissionValue;
        return acc;
    }, { totalOrderValue: 0, totalCommissionValue: 0});
  }, [filteredCommissions]);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-shrink-0">Gestão de Comissões</h2>
        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
           <select
            value={consultantFilter}
            onChange={(e) => setConsultantFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-blue-500 bg-white dark:bg-slate-700"
          >
            <option value="all">Todos Consultores</option>
            {salespeople.map(sp => (
              <option key={sp.name} value={sp.name}>{sp.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-blue-500 bg-white dark:bg-slate-700"
          >
            <option value="all">Todos Status</option>
            {Object.values(CommissionStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button onClick={onAdd}>Nova Comissão</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Cód. Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Consultor</th>
              <th scope="col" className="px-6 py-3 text-right">Valor Pedido</th>
              <th scope="col" className="px-6 py-3 text-center">% Comissão</th>
              <th scope="col" className="px-6 py-3 text-right">Valor Comissão</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">Data Pagamento</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.map(c => (
              <tr key={c.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{c.orderId}</td>
                <td className="px-6 py-4">{c.customerName}</td>
                <td className="px-6 py-4 hidden md:table-cell">{c.consultant}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">{c.orderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{(c.commissionRate * 100).toFixed(2)}%</td>
                <td className="px-6 py-4 text-right whitespace-nowrap font-semibold text-green-600 dark:text-green-400">{c.commissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-center">
                  <CommissionStatusBadge status={c.status} />
                </td>
                <td className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">{c.paymentDate ? new Date(c.paymentDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                  <button onClick={() => onEdit(c)} className="font-medium text-yellow-600 dark:text-yellow-400 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => onDelete(c.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
           <tfoot className="bg-gray-100 dark:bg-slate-700">
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <th scope="row" colSpan={3} className="px-6 py-3 text-base text-right">Totais</th>
                    <td className="px-6 py-3 text-right">{totals.totalOrderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td colSpan={1}></td>
                    <td className="px-6 py-3 text-right">{totals.totalCommissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td colSpan={3}></td>
                </tr>
            </tfoot>
        </table>
        {filteredCommissions.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhuma comissão encontrada.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionList;
