import React, { useState, useMemo } from 'react';
import type { CalculatedOrder, Salesperson, UserProfile } from '../types';
import { UserRole, PaymentStatus } from '../types';
import StatusBadge from './common/StatusBadge';
import Button from './common/Button';

interface OrderListProps {
  orders: CalculatedOrder[];
  onSelectOrder: (orderId: string) => void;
  onNewOrder: () => void;
  currentUser: UserProfile;
  salespeople: Salesperson[];
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder, onNewOrder, currentUser, salespeople }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [consultantFilter, setConsultantFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchMatch = 
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.consultant.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || order.paymentStatus === statusFilter;
      const consultantMatch = consultantFilter === 'all' || order.consultant === consultantFilter;

      return searchMatch && statusMatch && consultantMatch;
    });
  }, [orders, searchTerm, statusFilter, consultantFilter]);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-shrink-0">Painel de Pedidos</h2>
        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-blue-500 bg-white dark:bg-slate-700"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-blue-500 bg-white dark:bg-slate-700"
          >
            <option value="all">Todos Status</option>
            {Object.values(PaymentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
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
          {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Salesperson) && (
            <Button onClick={onNewOrder}>Novo Pedido</Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Cód. Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Consultor</th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">Dt. Assinatura</th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">Vcto. Entrada</th>
              <th scope="col" className="px-6 py-3 text-right">Valor Pedido</th>
              <th scope="col" className="px-6 py-3 text-right hidden md:table-cell">Valor Recebido</th>
              <th scope="col" className="px-6 py-3 text-right">Saldo Atual</th>
              <th scope="col" className="px-6 py-3 text-center hidden md:table-cell">Status Pedido</th>
              <th scope="col" className="px-6 py-3 text-center">Status Pagamento</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4 hidden md:table-cell">{order.consultant}</td>
                <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap">{new Date(order.contractSignatureDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap">{new Date(order.downPaymentDueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">{order.orderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-right hidden md:table-cell text-green-600 dark:text-green-400 whitespace-nowrap">{order.received.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-right font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">{order.currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-center hidden md:table-cell">{order.orderStatus}</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <button onClick={() => onSelectOrder(order.id)} className="font-medium text-solar-blue-600 dark:text-solar-blue-400 hover:underline">
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;