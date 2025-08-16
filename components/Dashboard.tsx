
import React, { useMemo } from 'react';
import type { CalculatedOrder, Payment } from '../types';
import { PaymentStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps } from 'recharts';
import Card from './common/Card';

interface DashboardProps {
  orders: CalculatedOrder[];
  payments: Payment[];
}

const ChartPlaceholder: React.FC<{title: string}> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">{title}</p>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ orders, payments }) => {

  const kpis = useMemo(() => {
    const totalReceivedThisMonth = payments
      .filter(p => new Date(p.paymentDate).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.value, 0);

    const totalBalance = orders.reduce((sum, o) => sum + o.currentBalance, 0);
    
    const totalOrders = orders.length;

    return { totalReceivedThisMonth, totalBalance, totalOrders };
  }, [orders, payments]);

  const salesByConsultant = useMemo(() => {
    const salesMap = new Map<string, number>();
    orders.forEach(order => {
      salesMap.set(order.consultant, (salesMap.get(order.consultant) || 0) + order.orderValue);
    });
    return Array.from(salesMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    const statusMap = new Map<PaymentStatus, number>();
    Object.values(PaymentStatus).forEach(status => statusMap.set(status, 0));
    orders.forEach(order => {
      statusMap.set(order.paymentStatus, (statusMap.get(order.paymentStatus) || 0) + 1);
    });
    return Array.from(statusMap.entries())
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);
  }, [orders]);
  
  const COLORS = {
      [PaymentStatus.Confirmed]: '#22c55e',
      [PaymentStatus.Partial]: '#3b82f6',
      [PaymentStatus.Pending]: '#f97316',
      [PaymentStatus.Overdue]: '#ef4444',
      [PaymentStatus.Cancelled]: '#6b7280',
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    if (typeof cx !== 'number' || typeof cy !== 'number' || typeof midAngle !== 'number' || typeof innerRadius !== 'number' || typeof outerRadius !== 'number' || typeof percent !== 'number') {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total de Pedidos</h3>
              <p className="mt-2 text-4xl font-bold text-solar-blue-600 dark:text-solar-blue-400">{kpis.totalOrders}</p>
          </Card>
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Recebido (Mês Atual)</h3>
              <p className="mt-2 text-4xl font-bold text-green-600 dark:text-green-400">{kpis.totalReceivedThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </Card>
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Saldo Devedor Total</h3>
              <p className="mt-2 text-4xl font-bold text-red-600 dark:text-red-400">{kpis.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </Card>
      </div>

      <div className="md:col-span-2">
          <Card>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Total de Vendas por Consultor</h3>
              <div className="h-96">
                {salesByConsultant.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesByConsultant} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                          <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                          <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} tick={{ fill: 'currentColor' }} />
                          <Tooltip
                            formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                            contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', border: 'none', color: '#fff' }}
                          />
                          <Legend />
                          <Bar dataKey="value" name="Vendas" fill="#3b82f6" />
                      </BarChart>
                  </ResponsiveContainer>
                ) : <ChartPlaceholder title="Sem dados de vendas" />}
              </div>
          </Card>
      </div>

      <div>
          <Card>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Pedidos por Status</h3>
              <div className="h-96">
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {ordersByStatus.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', border: 'none', color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <ChartPlaceholder title="Sem dados de status"/>}
              </div>
          </Card>
      </div>

    </div>
  );
};

export default Dashboard;
   