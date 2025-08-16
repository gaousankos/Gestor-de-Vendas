import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

interface SettingsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue?: string;
  title: string;
}

const SettingsFormModal: React.FC<SettingsFormModalProps> = ({ isOpen, onClose, onSave, initialValue = '', title }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="settingValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Item
            </label>
            <input
              type="text"
              name="settingValue"
              id="settingValue"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-solar-blue-500 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 sm:text-sm"
            />
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

export default SettingsFormModal;
