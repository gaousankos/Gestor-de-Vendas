

import { useState, useCallback, useMemo } from 'react';
import type { Order, Payment, Salesperson, CalculatedOrder, UserProfile, AppConfig, Commission } from '../types';
import { OrderStatusEnum, PaymentStatus, UserRole, CommissionStatus } from '../types';

const MOCK_CONFIG: AppConfig = {
    businessUnits: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Matriz'],
    paymentMethods: ['Boleto', 'Pix', 'Cartão de Crédito', 'Transferência'],
    orderOrigins: ['Indicação', 'Website', 'Feira', 'Prospecção'],
    salespersonLevels: ['Júnior', 'Pleno', 'Sênior'],
    orderStatuses: [OrderStatusEnum.Active, OrderStatusEnum.Completed, OrderStatusEnum.Cancelled],
};

const MOCK_SALESPEOPLE: Salesperson[] = [
  { id: 'SP-001', name: 'Ana Costa', businessUnit: 'São Paulo', salesGoal: 100000, level: 'Sênior', hireDate: '2022-01-15' },
  { id: 'SP-002', name: 'Bruno Gomes', businessUnit: 'Rio de Janeiro', salesGoal: 80000, level: 'Pleno', hireDate: '2022-08-20' },
  { id: 'SP-003', name: 'Carla Dias', businessUnit: 'São Paulo', salesGoal: 120000, level: 'Sênior', hireDate: '2021-05-10' },
  { id: 'SP-004', name: 'Diego Martins', businessUnit: 'Belo Horizonte', salesGoal: 75000, level: 'Júnior', hireDate: '2023-03-01' },
  { id: 'SP-005', name: 'Carlos Lima', businessUnit: 'Matriz', salesGoal: 250000, level: 'Sênior', hireDate: '2020-02-01' },
];

const MOCK_USER_PROFILES: UserProfile[] = [
    { id: 'USR-001', name: 'Ana Costa', email: 'ana.costa@multiluz.com', role: UserRole.Admin },
    { id: 'USR-002', name: 'Carlos Lima', email: 'carlos.lima@multiluz.com', role: UserRole.Manager },
    { id: 'USR-003', name: 'Bruno Gomes', email: 'bruno.gomes@multiluz.com', role: UserRole.Salesperson },
    { id: 'USR-004', name: 'Carla Dias', email: 'carla.dias@multiluz.com', role: UserRole.Salesperson },
    { id: 'USR-005', name: 'Diego Martins', email: 'diego.martins@multiluz.com', role: UserRole.Salesperson },
];

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Empresa Alpha', consultant: 'Ana Costa', insurance: 'S', orderValue: 25000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.2, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], city: 'São Paulo', contractCreationDate: '2023-10-01', contractSignatureDate: '2023-10-05', paymentMethod: 'Boleto', origin: 'Indicação', prospectedBy: 'Ana Costa', cancellationDate: null, initialPaymentDate: '2023-10-10', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatusEnum.Active },
  { id: 'ORD-002', customerName: 'Construtora Beta', consultant: 'Bruno Gomes', insurance: 'N', orderValue: 50000, initialPaymentPercentage: 0.15, downPaymentPercentage: 0.3, downPaymentDueDate: new Date().toISOString().split('T')[0], city: 'Rio de Janeiro', contractCreationDate: '2023-10-03', contractSignatureDate: '2023-10-08', paymentMethod: 'Transferência', origin: 'Website', prospectedBy: 'Marketing', cancellationDate: null, initialPaymentDate: '2023-10-12', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatusEnum.Active },
  { id: 'ORD-003', customerName: 'Mercado Gama', consultant: 'Ana Costa', insurance: 'N', orderValue: 15000, initialPaymentPercentage: 0.2, downPaymentPercentage: 0.5, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0], city: 'Campinas', contractCreationDate: '2023-10-05', contractSignatureDate: '2023-10-10', paymentMethod: 'Pix', origin: 'Feira', prospectedBy: 'Ana Costa', cancellationDate: null, initialPaymentDate: null, paymentDate80: null, paymentDate100: null, orderStatus: OrderStatusEnum.Active },
  { id: 'ORD-004', customerName: 'Indústria Delta', consultant: 'Carla Dias', insurance: 'S', orderValue: 120000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.1, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0], city: 'São Paulo', contractCreationDate: '2023-09-15', contractSignatureDate: '2023-09-20', paymentMethod: 'Cartão de Crédito', origin: 'Prospecção', prospectedBy: 'Carla Dias', cancellationDate: null, initialPaymentDate: '2023-09-25', paymentDate80: '2023-10-25', paymentDate100: '2023-10-25', orderStatus: OrderStatusEnum.Completed },
  { id: 'ORD-005', customerName: 'Varejo Epsilon', consultant: 'Diego Martins', insurance: 'N', orderValue: 35000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.2, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], city: 'Belo Horizonte', contractCreationDate: '2023-10-12', contractSignatureDate: '2023-10-15', paymentMethod: 'Boleto', origin: 'Website', prospectedBy: 'Marketing', cancellationDate: '2023-10-20', initialPaymentDate: null, paymentDate80: null, paymentDate100: null, orderStatus: OrderStatusEnum.Cancelled },
  { id: 'ORD-006', customerName: 'Escola Zeta', consultant: 'Bruno Gomes', insurance: 'S', orderValue: 42000, initialPaymentPercentage: 0.1, downPaymentPercentage: 0.25, downPaymentDueDate: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0], city: 'Niterói', contractCreationDate: '2023-10-11', contractSignatureDate: '2023-10-14', paymentMethod: 'Pix', origin: 'Indicação', prospectedBy: 'Bruno Gomes', cancellationDate: null, initialPaymentDate: '2023-10-20', paymentDate80: null, paymentDate100: null, orderStatus: OrderStatusEnum.Active },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-001', paymentDate: '2023-10-10', value: 2500 },
  { id: 'PAY-002', orderId: 'ORD-002', paymentDate: '2023-10-12', value: 7500 },
  { id: 'PAY-003', orderId: 'ORD-002', paymentDate: '2023-11-01', value: 7500 },
  { id: 'PAY-004', orderId: 'ORD-004', paymentDate: '2023-09-25', value: 12000 },
  { id: 'PAY-005', orderId: 'ORD-004', paymentDate: '2023-10-25', value: 108000 },
  { id: 'PAY-006', orderId: 'ORD-006', paymentDate: '2023-10-20', value: 10500 },
];

const MOCK_COMMISSIONS: Commission[] = [
    { id: 'COM-001', orderId: 'ORD-001', commissionRate: 0.05, status: CommissionStatus.Paid, paymentDate: '2023-11-01' },
    { id: 'COM-002', orderId: 'ORD-002', commissionRate: 0.05, status: CommissionStatus.Pending, paymentDate: null },
    { id: 'COM-003', orderId: 'ORD-004', commissionRate: 0.07, status: CommissionStatus.Paid, paymentDate: '2023-11-05' },
    { id: 'COM-004', orderId: 'ORD-006', commissionRate: 0.05, status: CommissionStatus.Pending, paymentDate: null },
];

export const useMultiluzData = () => {
  const [salespeople, setSalespeople] = useState<Salesperson[]>(MOCK_SALESPEOPLE);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(MOCK_USER_PROFILES);
  const [appConfig, setAppConfig] = useState<AppConfig>(MOCK_CONFIG);
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS);

  const paymentsByOrderId = useMemo(() => {
    return payments.reduce((acc, payment) => {
      if (!acc[payment.orderId]) {
        acc[payment.orderId] = [];
      }
      acc[payment.orderId].push(payment);
      return acc;
    }, {} as Record<string, Payment[]>);
  }, [payments]);

  const getPaymentStatus = useCallback((order: Order, received: number, currentBalance: number, relatedPayments: Payment[]): PaymentStatus => {
    if (order.orderStatus === OrderStatusEnum.Cancelled) {
      return PaymentStatus.Cancelled;
    }

    const dueDate = new Date(order.downPaymentDueDate);
    const overdueDate = new Date(new Date().setDate(new Date().getDate() - 3));
    overdueDate.setHours(0, 0, 0, 0);

    if (dueDate < overdueDate && relatedPayments.length === 0) {
      return PaymentStatus.Overdue;
    }
    
    if (currentBalance <= 0 && order.orderValue > 0) {
      return PaymentStatus.Confirmed;
    }
    
    if (received > 0) {
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
      
      const paymentStatus = getPaymentStatus(order, received, currentBalance, relatedPayments);

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

  const addSalesperson = useCallback((salespersonData: Omit<Salesperson, 'id'>) => {
    const newSalesperson: Salesperson = {
      ...salespersonData,
      id: `SP-${String(salespeople.length + 1).padStart(3, '0')}`,
    };
    setSalespeople(prev => [...prev, newSalesperson]);
  }, [salespeople.length]);

  const updateSalesperson = useCallback((updatedSalesperson: Salesperson) => {
    setSalespeople(prev => prev.map(s => s.id === updatedSalesperson.id ? updatedSalesperson : s));
  }, []);

  const deleteSalesperson = useCallback((salespersonId: string) => {
    setSalespeople(prev => prev.filter(s => s.id !== salespersonId));
  }, []);

  const addUserProfile = useCallback((profileData: Omit<UserProfile, 'id'>) => {
    const newUserProfile: UserProfile = {
      ...profileData,
      id: `USR-${String(userProfiles.length + 1).padStart(3, '0')}`,
    };
    setUserProfiles(prev => [...prev, newUserProfile]);
  }, [userProfiles.length]);

  const updateUserProfile = useCallback((updatedProfile: UserProfile) => {
    setUserProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  }, []);

  const deleteUserProfile = useCallback((profileId: string) => {
    setUserProfiles(prev => prev.filter(p => p.id !== profileId));
  }, []);

  // Commission Management
  const addCommission = useCallback((commissionData: Omit<Commission, 'id'>) => {
      const newCommission: Commission = {
          ...commissionData,
          id: `COM-${String(commissions.length + 1).padStart(3, '0')}`,
      };
      setCommissions(prev => [...prev, newCommission]);
  }, [commissions.length]);

  const updateCommission = useCallback((updatedCommission: Commission) => {
      setCommissions(prev => prev.map(c => c.id === updatedCommission.id ? updatedCommission : c));
  }, []);

  const deleteCommission = useCallback((commissionId: string) => {
      setCommissions(prev => prev.filter(c => c.id !== commissionId));
  }, []);


  // Config Management
  const addConfigItem = useCallback((key: keyof AppConfig, value: string) => {
    if (!value.trim()) return; // Prevent adding empty values
    setAppConfig(prev => {
        const currentItems = prev[key];
        if (currentItems.includes(value)) return prev; // Prevent duplicates
        return {
            ...prev,
            [key]: [...currentItems, value]
        };
    });
  }, []);

  const updateConfigItem = useCallback((key: keyof AppConfig, oldValue: string, newValue: string) => {
    if (!newValue.trim() || oldValue === newValue) return;
    setAppConfig(prev => {
        const currentItems = prev[key];
        if (currentItems.includes(newValue)) return prev; // Prevent creating a duplicate
        return {
            ...prev,
            [key]: currentItems.map(item => item === oldValue ? newValue : item)
        };
    });
    // Optional: Update existing records that use the old value
    if (key === 'businessUnits') {
        setSalespeople(prev => prev.map(sp => sp.businessUnit === oldValue ? { ...sp, businessUnit: newValue } : sp));
    }
    // Add similar logic for other config items if needed
  }, []);

  const deleteConfigItem = useCallback((key: keyof AppConfig, value: string) => {
    // Optional: Check if the value is in use before deleting
    // For simplicity, we'll allow deletion for now.
    setAppConfig(prev => ({
        ...prev,
        [key]: prev[key].filter(item => item !== value)
    }));
  }, []);


  return { 
    salespeople, 
    orders, 
    payments,
    userProfiles,
    appConfig,
    commissions,
    getCalculatedOrders, 
    addOrder, 
    updateOrder, 
    addPayment, 
    updatePayment, 
    deletePayment, 
    addSalesperson, 
    updateSalesperson, 
    deleteSalesperson,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
    addCommission,
    updateCommission,
    deleteCommission,
    addConfigItem,
    updateConfigItem,
    deleteConfigItem
  };
};
