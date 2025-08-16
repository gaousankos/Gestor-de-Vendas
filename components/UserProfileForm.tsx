import React, { useState, useEffect } from 'react';
import type { UserProfile, Salesperson } from '../types';
import { UserRole } from '../types';
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

interface UserProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Omit<UserProfile, 'id'> | UserProfile) => void;
  initialData?: UserProfile | null;
  salespeople: Salesperson[];
}

const getInitialFormData = (initialData?: UserProfile | null, salespeople?: Salesperson[]): Omit<UserProfile, 'id'> => {
    if (initialData) {
        return {
            name: initialData.name,
            email: initialData.email,
            role: initialData.role,
        };
    }
    // Auto-populate email for the first salesperson when creating a new profile
    const firstSalespersonName = salespeople?.[0]?.name || '';
    const emailPrefix = firstSalespersonName.toLowerCase().replace(/\s+/g, '.');

    return {
        name: firstSalespersonName,
        email: firstSalespersonName ? `${emailPrefix}@multiluz.com` : '',
        role: UserRole.Salesperson,
    };
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({ isOpen, onClose, onSave, initialData, salespeople }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(initialData, salespeople));

  useEffect(() => {
    setFormData(getInitialFormData(initialData, salespeople));
  }, [initialData, salespeople, isOpen]); // Reset form state when modal re-opens

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const emailPrefix = selectedName.toLowerCase().replace(/\s+/g, '.');
    setFormData(prev => ({
        ...prev,
        name: selectedName,
        email: `${emailPrefix}@multiluz.com`,
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
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Perfil' : 'Novo Perfil de Usuário'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="name">Nome do Usuário</FormLabel>
            {initialData ? (
                <FormInput 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
            ) : (
                <FormSelect name="name" id="name" value={formData.name} onChange={handleNameChange} required>
                    {salespeople.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </FormSelect>
            )}
          </div>
          <div>
            <FormLabel htmlFor="email">E-mail</FormLabel>
            <FormInput type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <FormLabel htmlFor="role">Perfil de Acesso</FormLabel>
            <FormSelect name="role" id="role" value={formData.role} onChange={handleChange}>
                {Object.values(UserRole).map(s => <option key={s} value={s}>{s}</option>)}
            </FormSelect>
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

export default UserProfileForm;
