
import React, { useState, useMemo } from 'react';
import type { CalculatedOrder } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: { orderId: string; value: number; paymentDate: string }) => void;
  orders: CalculatedOrder[];
}

const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ isOpen, onClose, onSave, orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CalculatedOrder | null>(null);
  const [value, setValue] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return orders.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit results to 5
  }, [orders, searchTerm]);

  const handleSelectOrder = (order: CalculatedOrder) => {
    setSelectedOrder(order);
    setSearchTerm(''); // Clear search after selection
  };
  
  const handleBackToSearch = () => {
      setSelectedOrder(null);
      setValue(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value > 0 && selectedOrder) {
      onSave({ orderId: selectedOrder.id, value, paymentDate });
      handleClose(); // Close and reset on successful save
    }
  };
  
  // Clean up state on close
  const handleClose = () => {
      setSearchTerm('');
      setSelectedOrder(null);
      setValue(0);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Recebimento" size="lg">
      {!selectedOrder ? (
        // Step 1: Search for an order
        <div className="space-y-4">
          <div>
            <label htmlFor="orderSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Buscar Pedido (por Cliente ou Cód.)
            </label>
            <input
              type="text"
              id="orderSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite para buscar..."
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
          </div>
           <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={handleClose}>Fechar</Button>
          </div>
        </div>

      ) : (
        // Step 2: Enter payment details for selected order
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* The "background tab" */}
            <div className="p-4 bg-solar-blue-50 dark:bg-slate-700/50 rounded-lg border border-solar-blue-200 dark:border-slate-600">
                <h4 className="font-bold text-lg text-solar-blue-800 dark:text-solar-blue-200">{selectedOrder.customerName}</h4>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Pedido: <span className="font-mono">{selectedOrder.id}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Saldo Devedor: 
                        <span className="font-semibold text-red-600 dark:text-red-400 ml-1">
                            {selectedOrder.currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </p>
                </div>
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Pagamento</label>
              <input
                type="number"
                name="value"
                id="value"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data do Pagamento</label>
              <input
                type="date"
                name="paymentDate"
                id="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
              />
            </div>
          </div>
           <div className="mt-6 flex justify-between items-center">
              <Button type="button" variant="secondary" onClick={handleBackToSearch}>&larr; Trocar Pedido</Button>
              <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
                  <Button type="submit">Salvar Pagamento</Button>
              </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default NewPaymentModal;
