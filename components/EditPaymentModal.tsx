import React, { useState, useEffect } from 'react';
import type { Payment } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: { value: number; paymentDate: string }) => void;
  payment: Payment | null;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ isOpen, onClose, onSave, payment }) => {
  const [value, setValue] = useState(0);
  const [paymentDate, setPaymentDate] = useState('');

  useEffect(() => {
    if (payment) {
      setValue(payment.value);
      setPaymentDate(payment.paymentDate);
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value > 0) {
      onSave({ value, paymentDate });
    }
  };

  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Recebimento ${payment.id}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Pagamento</label>
            <input
              type="number"
              name="value"
              id="value"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
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
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPaymentModal;
