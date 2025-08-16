
import React, { useState } from 'react';
import type { Order, Salesperson } from '../types';
import { OrderStatus, PaymentMethod } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, 'id'> | Order) => void;
  salespeople: Salesperson[];
  initialData?: Order | null;
}

const getInitialFormData = (salespeople: Salesperson[], initialData?: Order | null) => {
    if (initialData) {
        return {
            ...initialData,
            cancellationDate: initialData.cancellationDate || '',
            initialPaymentDate: initialData.initialPaymentDate || null,
            paymentDate80: initialData.paymentDate80 || null,
            paymentDate100: initialData.paymentDate100 || null,
        };
    }
    return {
        customerName: '',
        consultant: salespeople[0]?.name || '',
        insurance: 'N' as 'S' | 'N',
        orderValue: 0,
        initialPaymentPercentage: 0.1,
        downPaymentPercentage: 0.2,
        downPaymentDueDate: new Date().toISOString().split('T')[0],
        city: '',
        contractCreationDate: new Date().toISOString().split('T')[0],
        contractSignatureDate: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.Boleto,
        origin: '',
        prospectedBy: '',
        cancellationDate: '',
        initialPaymentDate: null,
        paymentDate80: null,
        paymentDate100: null,
        orderStatus: OrderStatus.Active,
    };
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm" />
);

const FormLabel: React.FC<{htmlFor: string, children: React.ReactNode}> = ({htmlFor, children}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{children}</label>
);


const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSave, salespeople, initialData }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(salespeople, initialData));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['orderValue', 'initialPaymentPercentage', 'downPaymentPercentage'].includes(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
        ...formData,
        cancellationDate: formData.cancellationDate || null,
    };
    if (initialData) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Pedido' : 'Novo Pedido'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3">
            <FormLabel htmlFor="customerName">Nome do Cliente</FormLabel>
            <FormInput type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="consultant">Consultor</FormLabel>
            <FormSelect name="consultant" id="consultant" value={formData.consultant} onChange={handleChange}>
              {salespeople.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="prospectedBy">Prospectado por</FormLabel>
            <FormInput type="text" name="prospectedBy" id="prospectedBy" value={formData.prospectedBy} onChange={handleChange} />
          </div>
          <div>
            <FormLabel htmlFor="city">Cidade do Cliente</FormLabel>
            <FormInput type="text" name="city" id="city" value={formData.city} onChange={handleChange} />
          </div>
           <div>
            <FormLabel htmlFor="orderValue">Valor Pedido</FormLabel>
            <FormInput type="number" name="orderValue" id="orderValue" value={formData.orderValue} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="insurance">Seguro (S/N)</FormLabel>
            <FormSelect name="insurance" id="insurance" value={formData.insurance} onChange={handleChange}>
                <option value="N">Não</option>
                <option value="S">Sim</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="paymentMethod">Forma de Pagamento</FormLabel>
            <FormSelect name="paymentMethod" id="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{pm}</option>)}
            </FormSelect>
          </div>
           <div>
            <FormLabel htmlFor="initialPaymentPercentage">% Pgto. Inicial (ex: 0.1)</FormLabel>
            <FormInput type="number" step="0.01" name="initialPaymentPercentage" id="initialPaymentPercentage" value={formData.initialPaymentPercentage} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="downPaymentPercentage">% Entrada (ex: 0.2)</FormLabel>
            <FormInput type="number" step="0.01" name="downPaymentPercentage" id="downPaymentPercentage" value={formData.downPaymentPercentage} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="origin">Origem</FormLabel>
            <FormInput type="text" name="origin" id="origin" value={formData.origin} onChange={handleChange} />
          </div>
          <div>
            <FormLabel htmlFor="downPaymentDueDate">Vcto. Entrada</FormLabel>
            <FormInput type="date" name="downPaymentDueDate" id="downPaymentDueDate" value={formData.downPaymentDueDate} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="contractCreationDate">Dt. Geração Contrato</FormLabel>
            <FormInput type="date" name="contractCreationDate" id="contractCreationDate" value={formData.contractCreationDate} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="contractSignatureDate">Dt. Assinatura Contrato</FormLabel>
            <FormInput type="date" name="contractSignatureDate" id="contractSignatureDate" value={formData.contractSignatureDate} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="orderStatus">Status do Pedido</FormLabel>
            <FormSelect name="orderStatus" id="orderStatus" value={formData.orderStatus} onChange={handleChange}>
                {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="cancellationDate">Data Cancelamento</FormLabel>
            <FormInput type="date" name="cancellationDate" id="cancellationDate" value={formData.cancellationDate} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderForm;