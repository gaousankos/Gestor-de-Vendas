import React from 'react';
import Button from './Button';

interface SettingsSectionProps {
    title: string;
    items: string[];
    onAdd: () => void;
    onEdit: (value: string) => void;
    onDelete: (value: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, items, onAdd, onEdit, onDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
                <Button onClick={onAdd} variant="secondary">+</Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.length > 0 ? items.map(item => (
                    <div key={item} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-2 rounded-md">
                        <span className="text-gray-800 dark:text-gray-300">{item}</span>
                        <div className="space-x-2">
                            <button onClick={() => onEdit(item)} className="font-medium text-sm text-yellow-600 dark:text-yellow-400 hover:underline">
                                Editar
                            </button>
                            <button onClick={() => onDelete(item)} className="font-medium text-sm text-red-600 dark:text-red-400 hover:underline">
                                Excluir
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Nenhum item cadastrado.</p>
                )}
            </div>
        </div>
    );
};

export default SettingsSection;
