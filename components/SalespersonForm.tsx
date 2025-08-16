import React, { useState, useEffect } from 'react';
import type { Salesperson } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm" />
);

const FormLabel: React.FC<{htmlFor: string, children: React.ReactNode}> = ({htmlFor, children}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{children}</label>
);


interface SalespersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salesperson: Omit<Salesperson, 'id'> | Salesperson) => void;
  businessUnits: string[];
  salespersonLevels: string[];
  initialData?: Salesperson | null;
}

const getInitialFormData = (
    businessUnits: string[], 
    salespersonLevels: string[],
    initialData?: Salesperson | null
) => {
    if (initialData) {
        return initialData;
    }
    return {
        name: '',
        businessUnit: businessUnits[0] || '',
        salesGoal: 0,
        level: salespersonLevels[0] || '',
        hireDate: new Date().toISOString().split('T')[0],
    };
};

const SalespersonForm: React.FC<SalespersonFormProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    businessUnits,
    salespersonLevels,
    initialData 
}) => {
  const [formData, setFormData] = useState(() => getInitialFormData(businessUnits, salespersonLevels, initialData));

  useEffect(() => {
    setFormData(getInitialFormData(businessUnits, salespersonLevels, initialData));
  }, [initialData, businessUnits, salespersonLevels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['salesGoal'].includes(name);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSave({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Consultor' : 'Novo Consultor'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="name">Nome Completo</FormLabel>
            <FormInput type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="businessUnit">Unidade de Negócio</FormLabel>
            <FormSelect name="businessUnit" id="businessUnit" value={formData.businessUnit} onChange={handleChange} required>
              {businessUnits.map(bu => <option key={bu} value={bu}>{bu}</option>)}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="salesGoal">Meta de Vendas (R$)</FormLabel>
            <FormInput type="number" name="salesGoal" id="salesGoal" value={formData.salesGoal} onChange={handleChange} required />
          </div>
          <div>
            <FormLabel htmlFor="level">Nível</FormLabel>
            <FormSelect name="level" id="level" value={formData.level} onChange={handleChange}>
                {salespersonLevels.map(s => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="hireDate">Data de Admissão</FormLabel>
            <FormInput type="date" name="hireDate" id="hireDate" value={formData.hireDate} onChange={handleChange} required />
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

export default SalespersonForm;