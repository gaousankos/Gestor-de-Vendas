import { useState, useCallback, useMemo } from 'react';
import type { Order, Payment, Salesperson, CalculatedOrder } from '../types';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../types';

const MOCK_SALESPEOPLE: Salesperson[] = [
  { name: 'Ana Costa', businessUnit: 'São Paulo', salesGoal: 100000 },
  { name: 'Bruno Gomes', businessUnit: 'Rio de Janeiro', salesGoal: 80000 },
  { name: 'Carla Dias', businessUnit: 'São Paulo', salesGoal: 120000 },
  { name: 'Diego Martins', businessUnit: 'Belo Horizonte', salesGoal: 75000 },
];

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Empresa Alpha', consultant: 'Ana Costa', insurance: 'S', orderValue: 25000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.2, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], city: 'São Paulo', contractCreationDate: '2023-10-01', contractSignatureDate: '2023-10-05', paymentMethod: PaymentMethod.Boleto, origin: 'Indicação', prospectedBy: 'Ana Costa', cancellationDate: null, initialPaymentDate: '2023-10-10', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatus.Active },
  { id: 'ORD-002', customerName: 'Construtora Beta', consultant: 'Bruno Gomes', insurance: 'N', orderValue: 50000, initialPaymentPercentage: 0.15, downPaymentPercentage: 0.3, downPaymentDueDate: new Date().toISOString().split('T')[0], city: 'Rio de Janeiro', contractCreationDate: '2023-10-03', contractSignatureDate: '2023-10-08', paymentMethod: PaymentMethod.Transfer, origin: 'Website', prospectedBy: 'Marketing', cancellationDate: null, initialPaymentDate: '2023-10-12', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatus.Active },
  { id: 'ORD-003', customerName: 'Mercado Gama', consultant: 'Ana Costa', insurance: 'N', orderValue: 15000, initialPaymentPercentage: 0.2, downPaymentPercentage: 0.5, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0], city: 'Campinas', contractCreationDate: '2023-10-05', contractSignatureDate: '2023-10-10', paymentMethod: PaymentMethod.Pix, origin: 'Feira', prospectedBy: 'Ana Costa', cancellationDate: null, initialPaymentDate: null, paymentDate80: null, paymentDate100: null, orderStatus: OrderStatus.Active },
  { id: 'ORD-004', customerName: 'Indústria Delta', consultant: 'Carla Dias', insurance: 'S', orderValue: 120000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.1, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0], city: 'São Paulo', contractCreationDate: '2023-09-15', contractSignatureDate: '2023-09-20', paymentMethod: PaymentMethod.CreditCard, origin: 'Prospecção', prospectedBy: 'Carla Dias', cancellationDate: null, initialPaymentDate: '2023-09-25', paymentDate80: '2023-10-25', paymentDate100: '2023-10-25', orderStatus: OrderStatus.Completed },
  { id: 'ORD-005', customerName: 'Varejo Epsilon', consultant: 'Diego Martins', insurance: 'N', orderValue: 35000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.2, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], city: 'Belo Horizonte', contractCreationDate: '2023-10-12', contractSignatureDate: '2023-10-15', paymentMethod: PaymentMethod.Boleto, origin: 'Website', prospectedBy: 'Marketing', cancellationDate: '2023-10-20', initialPaymentDate: null, paymentDate80: null, paymentDate100: null, orderStatus: OrderStatus.Cancelled },
  { id: 'ORD-006', customerName: 'Escola Zeta', consultant: 'Bruno Gomes', insurance: 'S', orderValue: 42000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.25, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0], city: 'Niterói', contractCreationDate: '2023-10-11', contractSignatureDate: '2023-10-14', paymentMethod: PaymentMethod.Pix, origin: 'Indicação', prospectedBy: 'Bruno Gomes', cancellationDate: null, initialPaymentDate: '2023-10-20', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatus.Active },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-001', paymentDate: '2023-10-10', value: 2500 },
  { id: 'PAY-002', orderId: 'ORD-002', paymentDate: '2023-10-12', value: 7500 },
  { id: 'PAY-003', orderId: 'ORD-002', paymentDate: '2023-11-01', value: 7500 },
  { id: 'PAY-004', orderId: 'ORD-004', paymentDate: '2023-09-25', value: 12000 },
  { id: 'PAY-005', orderId: 'ORD-004', paymentDate: '2023-10-25', value: 108000 },
  { id: 'PAY-006', orderId: 'ORD-006', paymentDate: '2023-10-20', value: 10500 },
];

export const useMultiluzData = () => {
  const [salespeople] = useState<Salesperson[]>(MOCK_SALESPEOPLE);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  const paymentsByOrderId = useMemo(() => {
    return payments.reduce((acc, payment) => {
      if (!acc[payment.orderId]) {
        acc[payment.orderId] = [];
      }
      acc[payment.orderId].push(payment);
      return acc;
    }, {} as Record<string, Payment[]>);
  }, [payments]);

  const getPaymentStatus = useCallback((order: Order, received: number, currentBalance: number, relatedPayments: Payment[], downPaymentGoal: number): PaymentStatus => {
    if (order.orderStatus === OrderStatus.Cancelled) {
      return PaymentStatus.Cancelled;
    }

    const dueDate = new Date(order.downPaymentDueDate);
    const overdueDate = new Date(new Date().setDate(new Date().getDate() - 3));
    overdueDate.setHours(0, 0, 0, 0);

    if (dueDate < overdueDate && relatedPayments.length === 0) {
      return PaymentStatus.Overdue;
    }
    // A new order with 0 value shouldn't be 'Confirmed'
    if (currentBalance <= 0 && order.orderValue > 0) {
      return PaymentStatus.Confirmed;
    }
    // To be 'Partial', the received amount must be >= down payment goal, and there must be some payment.
    if (received > 0 && received >= downPaymentGoal) {
      return PaymentStatus.Partial;
    }
    
    return PaymentStatus.Pending;
  }, []);

  const getCalculatedOrders = useCallback((): CalculatedOrder[] => {
    return orders.map(order => {
      const relatedPayments = paymentsByOrderId[order.id] || [];
      const received = relatedPayments.reduce((sum, p) => sum + p.value, 0);
      const currentBalance = order.orderValue - received;
      const downPaymentGoal = order.orderValue * order.downPaymentPercentage;
      const initialPaymentValue = order.orderValue * order.initialPaymentPercentage;
      
      const paymentStatus = getPaymentStatus(order, received, currentBalance, relatedPayments, downPaymentGoal);

      const sortedPayments = [...relatedPayments].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());
      
      let cumulativeReceived = 0;
      let calcInitialPaymentDate: string | null = null;
      let calcPaymentDate80: string | null = null;
      let calcPaymentDate100: string | null = null;

      for (const payment of sortedPayments) {
          cumulativeReceived += payment.value;
          if (!calcInitialPaymentDate && cumulativeReceived >= initialPaymentValue) {
              calcInitialPaymentDate = payment.paymentDate;
          }
          if (!calcPaymentDate80 && cumulativeReceived >= order.orderValue * 0.8) {
              calcPaymentDate80 = payment.paymentDate;
          }
          if (!calcPaymentDate100 && cumulativeReceived >= order.orderValue) {
              calcPaymentDate100 = payment.paymentDate;
          }
      }

      const firstPaymentDate = sortedPayments.length > 0 ? sortedPayments[0].paymentDate : null;

      return {
        ...order,
        received,
        currentBalance,
        downPaymentGoal,
        initialPaymentValue,
        firstPaymentDate,
        paymentStatus,
        initialPaymentDate: calcInitialPaymentDate,
        paymentDate80: calcPaymentDate80,
        paymentDate100: calcPaymentDate100,
      };
    });
  }, [orders, paymentsByOrderId, getPaymentStatus]);

  const addOrder = useCallback((orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    };
    setOrders(prev => [...prev, newOrder]);
  }, [orders.length]);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  }, []);

  const addPayment = useCallback((paymentData: { orderId: string; value: number; paymentDate: string }) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
    };
    setPayments(prev => [...prev, newPayment]);
  }, [payments.length]);

  const updatePayment = useCallback((updatedPayment: Payment) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  }, []);

  const deletePayment = useCallback((paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  }, []);

  return { salespeople, orders, payments, getCalculatedOrders, addOrder, updateOrder, addPayment, updatePayment, deletePayment };
};