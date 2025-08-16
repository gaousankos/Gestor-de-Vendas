
import React from 'react';
import type { CalculatedOrder, Payment } from '../types';
import { UserRole } from '../types';
import Card from './common/Card';
import StatusBadge from './common/StatusBadge';
import Button from './common/Button';

interface OrderDetailProps {
  order: CalculatedOrder;
  payments: Payment[];
  onBack: () => void;
  onAddPayment: (orderId: string) => void;
  onEditOrder: (order: CalculatedOrder) => void;
  currentUser: { name: string; role: UserRole };
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{value}</span>
  </div>
);

const OrderDetail: React.FC<OrderDetailProps> = ({ order, payments, onBack, onAddPayment, onEditOrder, currentUser }) => {
  const canEdit = currentUser.role === UserRole.Admin;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onBack} variant="secondary">
          &larr; Voltar para a Lista
        </Button>
        <div className="flex gap-2">
            {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Salesperson) && (
              <Button onClick={() => onAddPayment(order.id)}>
                Adicionar Pagamento
              </Button>
            )}
            {canEdit && <Button onClick={() => onEditOrder(order)} variant="secondary">Editar Pedido</Button>}
        </div>
      </div>
      
      <Card>
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4 border-gray-200 dark:border-slate-700">
                <div>
                    <h2 className="text-3xl font-bold text-solar-blue-700 dark:text-solar-yellow-400">{order.customerName}</h2>
                    <p className="text-md text-gray-600 dark:text-gray-300">Pedido: {order.id}</p>
                </div>
                <StatusBadge status={order.paymentStatus} large />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              <DetailItem label="Valor do Pedido" value={order.orderValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              <DetailItem label="Total Recebido" value={<span className="text-green-600 dark:text-green-400">{order.received.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>} />
              <DetailItem label="Saldo Atual" value={<span className="text-red-600 dark:text-red-400">{order.currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>} />
              <DetailItem label="Consultor" value={order.consultant} />
              
              <DetailItem label="Vl. Entrada" value={order.downPaymentGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              <DetailItem label="Vl. Pgto. Inicial" value={order.initialPaymentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              <DetailItem label="Status do Pedido" value={order.orderStatus} />
              <DetailItem label="Seguro" value={order.insurance === 'S' ? 'Sim' : 'Não'} />

              <DetailItem label="Venc. Entrada" value={new Date(order.downPaymentDueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
              <DetailItem label="Dt. Pgto Inicial" value={order.initialPaymentDate ? new Date(order.initialPaymentDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'} />
              <DetailItem label="1º Recebimento" value={order.firstPaymentDate ? new Date(order.firstPaymentDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A'} />
              <DetailItem label="Data Contrato" value={new Date(order.contractSignatureDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />
              
              <DetailItem label="Cidade" value={order.city} />
              <DetailItem label="Forma de Pagamento" value={order.paymentMethod} />
              <DetailItem label="Origem" value={order.origin} />
              <DetailItem label="Prospectado por" value={order.prospectedBy} />

              {order.paymentDate80 && <DetailItem label="Dt. Pgto. 80%" value={new Date(order.paymentDate80).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />}
              {order.paymentDate100 && <DetailItem label="Dt. Pgto. 100%" value={new Date(order.paymentDate100).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} />}
              {order.cancellationDate && <DetailItem label="Data Cancelamento" value={<span className="text-red-500">{new Date(order.cancellationDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>} />}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Histórico de Pagamentos</h3>
              {payments.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">ID Pagamento</th>
                        <th scope="col" className="px-6 py-3">Data</th>
                        <th scope="col" className="px-6 py-3 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.id}</td>
                          <td className="px-6 py-4">{new Date(p.paymentDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                          <td className="px-6 py-4 text-right font-semibold">{p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento registrado.</p>
                </div>
              )}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;
