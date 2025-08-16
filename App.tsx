import React, { useState, useMemo } from 'react';
import { useMultiluzData } from './hooks/useMultiluzData';
import { UserRole, View } from './types';
import type { Order, Salesperson, Payment } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import OrderForm from './components/OrderForm';
import PaymentForm from './components/PaymentForm';
import PaymentList from './components/PaymentList';
import NewPaymentModal from './components/NewPaymentModal';
import EditPaymentModal from './components/EditPaymentModal';

const App: React.FC = () => {
  const {
    orders,
    payments,
    salespeople,
    getCalculatedOrders,
    addOrder,
    updateOrder,
    addPayment,
    updatePayment,
    deletePayment,
  } = useMultiluzData();

  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole }>({ name: 'Ana Costa', role: UserRole.Admin });
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [paymentForOrderId, setPaymentForOrderId] = useState<string | null>(null);

  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const calculatedOrders = useMemo(() => getCalculatedOrders(), [getCalculatedOrders]);

  const visibleOrders = useMemo(() => {
    if (currentUser.role === UserRole.Salesperson) {
      return calculatedOrders.filter(order => order.consultant === currentUser.name);
    }
    // Admin and Manager see all orders
    return calculatedOrders;
  }, [calculatedOrders, currentUser]);

  const visiblePayments = useMemo(() => {
    if (currentUser.role === UserRole.Salesperson) {
        const visibleOrderIds = new Set(visibleOrders.map(o => o.id));
        return payments.filter(p => visibleOrderIds.has(p.orderId));
    }
    // Admin and Manager see all payments
    return payments;
  }, [payments, visibleOrders, currentUser.role]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView(View.Detail);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    setCurrentView(View.List);
  };
  
  const handleOpenNewOrderForm = () => {
    setEditingOrder(null);
    setIsOrderFormOpen(true);
  };
  
  const handleOpenEditOrderForm = (order: Order) => {
    setEditingOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id'> | Order) => {
    if ('id' in orderData) {
      updateOrder(orderData);
    } else {
      addOrder(orderData);
    }
    setIsOrderFormOpen(false);
    setEditingOrder(null);
  };
  
  const handleOpenPaymentForm = (orderId: string) => {
    setPaymentForOrderId(orderId);
    setIsPaymentFormOpen(true);
  };

  const handleSavePayment = (paymentData: { orderId: string; value: number; paymentDate: string }) => {
    addPayment(paymentData);
    setIsPaymentFormOpen(false);
    setPaymentForOrderId(null);
  };

  const handleSaveNewPayment = (paymentData: { orderId: string; value: number; paymentDate: string }) => {
    addPayment(paymentData);
    setIsNewPaymentModalOpen(false);
  };

  const handleOpenEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
  };

  const handleUpdatePayment = (paymentData: { value: number; paymentDate: string }) => {
    if (editingPayment) {
      updatePayment({ ...editingPayment, ...paymentData });
      setEditingPayment(null);
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este recebimento? Esta ação não pode ser desfeita.')) {
      deletePayment(paymentId);
    }
  };

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return visibleOrders.find(o => o.id === selectedOrderId) || null;
  }, [selectedOrderId, visibleOrders]);

  const renderContent = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard orders={visibleOrders} payments={visiblePayments} salespeople={salespeople} />;
      case View.List:
        return (
          <OrderList 
            orders={visibleOrders} 
            onSelectOrder={handleSelectOrder}
            onNewOrder={handleOpenNewOrderForm}
            currentUser={currentUser}
            salespeople={salespeople}
          />
        );
      case View.Payments:
        return (
          <PaymentList 
            payments={visiblePayments}
            orders={visibleOrders}
            onSelectOrder={handleSelectOrder}
            currentUser={currentUser}
            onNewPayment={() => setIsNewPaymentModalOpen(true)}
            onEditPayment={handleOpenEditPayment}
            onDeletePayment={handleDeletePayment}
          />
        );
      case View.Detail:
        return (
          selectedOrder && (
            <OrderDetail
              order={selectedOrder}
              payments={payments.filter(p => p.orderId === selectedOrder.id)}
              onBack={handleBackToList}
              onAddPayment={handleOpenPaymentForm}
              onEditOrder={handleOpenEditOrderForm}
              currentUser={currentUser}
            />
          )
        );
      default:
        return <Dashboard orders={visibleOrders} payments={visiblePayments} salespeople={salespeople} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        currentView={currentView}
        setCurrentView={setCurrentView}
        salespeople={salespeople}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>

      {isOrderFormOpen && (
        <OrderForm
          key={editingOrder?.id || 'new-order'}
          isOpen={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
          onSave={handleSaveOrder}
          salespeople={salespeople}
          initialData={editingOrder}
        />
      )}
      
      {isPaymentFormOpen && paymentForOrderId && (
        <PaymentForm
          isOpen={isPaymentFormOpen}
          onClose={() => setIsPaymentFormOpen(false)}
          onSave={handleSavePayment}
          orderId={paymentForOrderId}
        />
      )}

      {isNewPaymentModalOpen && (
        <NewPaymentModal
          isOpen={isNewPaymentModalOpen}
          onClose={() => setIsNewPaymentModalOpen(false)}
          onSave={handleSaveNewPayment}
          orders={calculatedOrders}
        />
      )}

      {editingPayment && (
        <EditPaymentModal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          onSave={handleUpdatePayment}
          payment={editingPayment}
        />
      )}
    </div>
  );
};

export default App;