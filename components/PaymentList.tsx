import React, { useState, useMemo } from 'react';
import type { Payment, Order } from '../types';
import { UserRole } from '../types';
import Button from './common/Button';

interface PaymentListProps {
  payments: Payment[];
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  currentUser: { name: string; role: UserRole };
  onNewPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, orders, onSelectOrder, currentUser, onNewPayment, onEditPayment, onDeletePayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const ordersMap = useMemo(() => {
    return new Map(orders.map(order => [order.id, order]));
  }, [orders]);

  const augmentedPayments = useMemo(() => {
    return payments.map(payment => {
        const order = ordersMap.get(payment.orderId);
        return {
            ...payment,
            customerName: order?.customerName || 'N/A',
            consultant: order?.consultant || 'N/A',
        }
    }).sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [payments, ordersMap]);

  const filteredPayments = useMemo(() => {
    return augmentedPayments.filter(payment =>
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.consultant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [augmentedPayments, searchTerm]);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Registro de Recebimentos</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por cliente, pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-solar-blue-500 bg-white dark:bg-slate-700"
          />
          {currentUser.role === UserRole.Admin && (
            <Button onClick={onNewPayment}>Novo Recebimento</Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">ID Pagamento</th>
              <th scope="col" className="px-6 py-3">Cód. Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Consultor</th>
              <th scope="col" className="px-6 py-3">Data Pagamento</th>
              <th scope="col" className="px-6 py-3 text-right">Valor</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{payment.id}</td>
                <td className="px-6 py-4">{payment.orderId}</td>
                <td className="px-6 py-4">{payment.customerName}</td>
                <td className="px-6 py-4 hidden md:table-cell">{payment.consultant}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.paymentDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap font-semibold text-green-600 dark:text-green-400">{payment.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                  <button onClick={() => onSelectOrder(payment.orderId)} className="font-medium text-solar-blue-600 dark:text-solar-blue-400 hover:underline">
                    Ver Pedido
                  </button>
                   {currentUser.role === UserRole.Admin && (
                    <>
                      <button onClick={() => onEditPayment(payment)} className="font-medium text-yellow-600 dark:text-yellow-400 hover:underline">
                        Editar
                      </button>
                      <button onClick={() => onDeletePayment(payment.id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhum pagamento encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;