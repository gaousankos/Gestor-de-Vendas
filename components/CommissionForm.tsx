import React, { useState, useEffect, useMemo } from 'react';
import type { CalculatedCommission, Commission, CalculatedOrder } from '../types';
import { CommissionStatus } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface CommissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commission: Omit<Commission, 'id'> | Commission) => void;
  initialData?: CalculatedCommission | null;
  orders: CalculatedOrder[];
  commissions: Commission[];
}

const CommissionForm: React.FC<CommissionFormProps> = ({ isOpen, onClose, onSave, initialData, orders, commissions }) => {
  const [selectedOrder, setSelectedOrder] = useState<CalculatedOrder | null>(null);
  const [commissionRate, setCommissionRate] = useState(0.05); // Default 5%
  const [status, setStatus] = useState<CommissionStatus>(CommissionStatus.Pending);
  const [paymentDate, setPaymentDate] = useState<string | null>(null);
  
  // For create mode search
  const [searchTerm, setSearchTerm] = useState('');
  
  const commissionedOrderIds = useMemo(() => {
    // In edit mode, allow the current order to be "commissioned"
    const currentOrderId = initialData?.orderId;
    return new Set(commissions.filter(c => c.orderId !== currentOrderId).map(c => c.orderId));
  }, [commissions, initialData]);

  const searchResults = useMemo(() => {
    if (initialData || !searchTerm) return [];
    return orders.filter(order =>
      !commissionedOrderIds.has(order.id) &&
      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.id.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 5);
  }, [orders, searchTerm, initialData, commissionedOrderIds]);

  const commissionValue = useMemo(() => {
    if (!selectedOrder) return 0;
    return selectedOrder.orderValue * commissionRate;
  }, [selectedOrder, commissionRate]);

  useEffect(() => {
    if (initialData) {
      const orderForInitialData = orders.find(o => o.id === initialData.orderId);
      setSelectedOrder(orderForInitialData || null);
      setCommissionRate(initialData.commissionRate);
      setStatus(initialData.status);
      setPaymentDate(initialData.paymentDate);
    } else {
        // Reset form for create mode
        setSelectedOrder(null);
        setCommissionRate(0.05);
        setStatus(CommissionStatus.Pending);
        setPaymentDate(null);
        setSearchTerm('');
    }
  }, [initialData, orders, isOpen]);

  useEffect(() => {
    // If status is not Paid, clear payment date
    if (status !== CommissionStatus.Paid) {
      setPaymentDate(null);
    } else if (!paymentDate) {
      // If status is Paid and there's no date, set it to today
      setPaymentDate(new Date().toISOString().split('T')[0]);
    }
  }, [status, paymentDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const commissionData = {
      orderId: selectedOrder.id,
      commissionRate,
      status,
      paymentDate
    };

    if (initialData) {
      onSave({ ...commissionData, id: initialData.id });
    } else {
      onSave(commissionData);
    }
  };

  const handleSelectOrder = (order: CalculatedOrder) => {
    setSelectedOrder(order);
    setSearchTerm('');
  };

  const renderContent = () => {
    if (!initialData && !selectedOrder) {
      return (
        // Step 1: Search UI for create mode
        <div className="space-y-4">
          <div>
            <label htmlFor="orderSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Buscar Pedido para Comissionar
            </label>
            <input
              type="text"
              id="orderSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do cliente ou cód. do pedido..."
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
              autoComplete="off"
            />
            {searchResults.length > 0 && (
              <ul className="mt-2 border border-gray-200 dark:border-slate-600 rounded-md max-h-48 overflow-y-auto">
                {searchResults.map(order => (
                  <li 
                    key={order.id} 
                    onClick={() => handleSelectOrder(order)}
                    className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 border-b dark:border-slate-600 last:border-b-0"
                  >
                    <div className="font-semibold">{order.customerName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{order.id}</div>
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && searchResults.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Nenhum pedido encontrado ou já comissionado.</p>
            )}
          </div>
           <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      );
    }

    return (
        // Step 2: Form UI for create/edit
      <form onSubmit={handleSubmit}>
         <div className="space-y-4">
            <div className="p-4 bg-solar-blue-50 dark:bg-slate-700/50 rounded-lg border border-solar-blue-200 dark:border-slate-600">
                <h4 className="font-bold text-lg text-solar-blue-800 dark:text-solar-blue-200">{selectedOrder?.customerName}</h4>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Pedido: <span className="font-mono">{selectedOrder?.id}</span></span>
                    <span>Consultor: <span className="font-semibold">{selectedOrder?.consultant}</span></span>
                    <span>Valor: <span className="font-semibold">{selectedOrder?.orderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de Comissão (ex: 0.05)</label>
                    <input
                        type="number" step="0.001"
                        id="commissionRate"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
                        required
                    />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-md text-right self-end">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor da Comissão: </span>
                    <span className="font-bold text-lg text-green-500">
                        {commissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                        id="status" value={status}
                        onChange={(e) => setStatus(e.target.value as CommissionStatus)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
                    >
                        {Object.values(CommissionStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {status === CommissionStatus.Paid && (
                    <div>
                        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Pagamento</label>
                         <input
                            type="date"
                            id="paymentDate"
                            value={paymentDate || ''}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
                            required
                        />
                    </div>
                )}
             </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <div>
                {!initialData && (
                    <Button type="button" variant="secondary" onClick={() => setSelectedOrder(null)}>&larr; Trocar Pedido</Button>
                )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Comissão</Button>
            </div>
        </div>
      </form>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Comissão' : 'Nova Comissão'} size="lg">
      {renderContent()}
    </Modal>
  );
};

export default CommissionForm;
