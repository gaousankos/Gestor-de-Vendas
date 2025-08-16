
import React, { useMemo, useState } from 'react';
import type { CalculatedOrder, Payment, Salesperson } from '../types';
import { PaymentStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps } from 'recharts';
import Card from './common/Card';

interface DashboardProps {
  orders: CalculatedOrder[];
  payments: Payment[];
  salespeople: Salesperson[];
}

const ChartPlaceholder: React.FC<{title: string}> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">{title}</p>
    </div>
);

const getMonthDateRange = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
    };
};

const Dashboard: React.FC<DashboardProps> = ({ orders, payments, salespeople }) => {

  const [dateRange, setDateRange] = useState(getMonthDateRange(new Date()));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
  };
  
  const filteredOrders = useMemo(() => {
      if (!dateRange.start || !dateRange.end) return orders;
      const startDate = new Date(`${dateRange.start}T00:00:00Z`);
      const endDate = new Date(`${dateRange.end}T23:59:59Z`);
      
      return orders.filter(order => {
          const signatureDate = new Date(order.contractSignatureDate);
          return signatureDate >= startDate && signatureDate <= endDate;
      });
  }, [orders, dateRange]);

  const filteredPayments = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return payments;
    const startDate = new Date(`${dateRange.start}T00:00:00Z`);
    const endDate = new Date(`${dateRange.end}T23:59:59Z`);
    
    return payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startDate && paymentDate <= endDate;
    });
  }, [payments, dateRange]);

  const kpis = useMemo(() => {
    const totalReceivedInRange = filteredPayments.reduce((sum, p) => sum + p.value, 0);

    const totalBalance = filteredOrders.reduce((sum, o) => sum + o.currentBalance, 0);
    
    const totalOrders = filteredOrders.length;

    return { totalReceivedInRange, totalBalance, totalOrders };
  }, [filteredOrders, filteredPayments]);

  const salesByConsultant = useMemo(() => {
    const salesMap = new Map<string, number>();
    filteredOrders.forEach(order => {
      salesMap.set(order.consultant, (salesMap.get(order.consultant) || 0) + order.orderValue);
    });
    return Array.from(salesMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredOrders]);

  const ordersByStatus = useMemo(() => {
    const statusMap = new Map<PaymentStatus, number>();
    Object.values(PaymentStatus).forEach(status => statusMap.set(status, 0));
    filteredOrders.forEach(order => {
      statusMap.set(order.paymentStatus, (statusMap.get(order.paymentStatus) || 0) + 1);
    });
    return Array.from(statusMap.entries())
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);
  }, [filteredOrders]);

  const salesGoalsData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return salespeople.map(sp => {
      const monthlySales = orders
        .filter(o => {
          const signatureDate = new Date(o.contractSignatureDate);
          return (
            o.consultant === sp.name &&
            signatureDate.getMonth() === currentMonth &&
            signatureDate.getFullYear() === currentYear &&
            o.orderStatus !== 'CANCELADO'
          );
        })
        .reduce((sum, o) => sum + o.orderValue, 0);
      
      const percentage = sp.salesGoal > 0 ? (monthlySales / sp.salesGoal) * 100 : 0;

      return {
        name: sp.name,
        monthlySales,
        salesGoal: sp.salesGoal,
        percentage: Math.min(percentage, 100) // cap at 100 for display
      };
    }).sort((a,b) => b.monthlySales - a.monthlySales);
  }, [orders, salespeople]);
  
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
    <div className="space-y-6">
       <Card>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Filtrar Dados por Período</h3>
          <div className="flex items-center gap-2">
            <label htmlFor="start" className="text-sm font-medium text-gray-500 dark:text-gray-400">De:</label>
            <input 
              type="date"
              id="start"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 text-sm"
              aria-label="Data de início"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="end" className="text-sm font-medium text-gray-500 dark:text-gray-400">Até:</label>
            <input 
              type="date"
              id="end"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-solar-blue-500 bg-white dark:bg-slate-700 text-sm"
              aria-label="Data de fim"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total de Pedidos (período)</h3>
              <p className="mt-2 text-4xl font-bold text-solar-blue-600 dark:text-solar-blue-400">{kpis.totalOrders}</p>
          </Card>
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Recebido no Período</h3>
              <p className="mt-2 text-4xl font-bold text-green-600 dark:text-green-400">{kpis.totalReceivedInRange.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </Card>
          <Card>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Saldo Devedor (período)</h3>
              <p className="mt-2 text-4xl font-bold text-red-600 dark:text-red-400">{kpis.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Vendas por Consultor (período)</h3>
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
                  ) : <ChartPlaceholder title="Sem dados de vendas no período" />}
                </div>
            </Card>
        </div>

        <div>
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Pedidos por Status (período)</h3>
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
                  ) : <ChartPlaceholder title="Sem dados de status no período"/>}
                </div>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
            <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Metas de Vendas (Mês Atual)</h3>
                <div className="space-y-4">
                    {salesGoalsData.length > 0 ? salesGoalsData.map(sp => (
                        <div key={sp.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-gray-700 dark:text-gray-300">{sp.name}</span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {sp.monthlySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {sp.salesGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-solar-blue-600 h-2.5 rounded-full" style={{ width: `${sp.percentage}%` }}></div>
                            </div>
                        </div>
                    )) : <ChartPlaceholder title="Sem dados de metas de vendas"/>}
                </div>
            </Card>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
