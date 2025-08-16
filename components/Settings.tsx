import React from 'react';
import type { AppConfig } from '../types';
import SettingsSection from './common/SettingsSection';
import Card from './common/Card';

interface SettingsProps {
    config: AppConfig;
    onAddItem: (type: keyof AppConfig) => void;
    onEditItem: (type: keyof AppConfig, value: string) => void;
    onDeleteItem: (type: keyof AppConfig, value: string) => void;
}

const configMetadata: Record<keyof AppConfig, { title: string }> = {
    businessUnits: { title: 'Unidades de Negócio' },
    paymentMethods: { title: 'Formas de Pagamento' },
    orderOrigins: { title: 'Origens de Pedidos' },
    salespersonLevels: { title: 'Níveis de Consultores' },
    orderStatuses: { title: 'Status de Pedidos' },
};


const Settings: React.FC<SettingsProps> = ({ config, onAddItem, onEditItem, onDeleteItem }) => {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Configurações Gerais</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gerencie as listas e parâmetros utilizados em todo o aplicativo.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(config) as Array<keyof AppConfig>).map(key => (
                 <Card key={key}>
                    <SettingsSection
                        title={configMetadata[key].title}
                        items={config[key]}
                        onAdd={() => onAddItem(key)}
                        onEdit={(value) => onEditItem(key, value)}
                        onDelete={(value) => onDeleteItem(key, value)}
                    />
                </Card>
            ))}
        </div>
    </div>
  );
};

export default Settings;
