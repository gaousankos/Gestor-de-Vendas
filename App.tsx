import React, { useState, useMemo } from 'react';
import { useMultiluzData } from './hooks/useMultiluzData';
import { UserRole, View } from './types';
import type { Order, Salesperson, Payment, UserProfile, AppConfig, Commission, CalculatedCommission } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import OrderForm from './components/OrderForm';
import PaymentForm from './components/PaymentForm';
import PaymentList from './components/PaymentList';
import NewPaymentModal from './components/NewPaymentModal';
import EditPaymentModal from './components/EditPaymentModal';
import SalespersonList from './components/SalespersonList';
import SalespersonForm from './components/SalespersonForm';
import UserProfileList from './components/UserProfileList';
import UserProfileForm from './components/UserProfileForm';
import Settings from './components/Settings';
import SettingsFormModal from './components/common/SettingsFormModal';
import CommissionList from './components/CommissionList';
import CommissionForm from './components/CommissionForm';

const App: React.FC = () => {
  const {
    orders,
    payments,
    salespeople,
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
    deleteConfigItem,
  } = useMultiluzData();

  const [currentUser, setCurrentUser] = useState<UserProfile>(userProfiles[0]);
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [paymentForOrderId, setPaymentForOrderId] = useState<string | null>(null);

  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [isSalespersonFormOpen, setIsSalespersonFormOpen] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);

  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<{ type: keyof AppConfig; value?: string; } | null>(null);

  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<CalculatedCommission | null>(null);


  const calculatedOrders = useMemo(() => getCalculatedOrders(), [getCalculatedOrders]);

  const calculatedCommissions = useMemo((): CalculatedCommission[] => {
    const ordersMap = new Map(calculatedOrders.map(o => [o.id, o]));
    return commissions.map(comm => {
        const order = ordersMap.get(comm.orderId);
        const orderValue = order?.orderValue || 0;
        return {
            ...comm,
            customerName: order?.customerName || 'N/A',
            consultant: order?.consultant || 'N/A',
            orderValue: orderValue,
            commissionValue: orderValue * comm.commissionRate,
        };
    }).sort((a,b) => (b.orderValue - a.orderValue));
  }, [commissions, calculatedOrders]);


  const visibleOrders = useMemo(() => {
    if (currentUser.role === UserRole.Salesperson) {
      return calculatedOrders.filter(order => order.consultant === currentUser.name);
    }
    return calculatedOrders;
  }, [calculatedOrders, currentUser]);

  const visiblePayments = useMemo(() => {
    if (currentUser.role === UserRole.Salesperson) {
        const visibleOrderIds = new Set(visibleOrders.map(o => o.id));
        return payments.filter(p => visibleOrderIds.has(p.orderId));
    }
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

  const handleOpenNewSalespersonForm = () => {
    setEditingSalesperson(null);
    setIsSalespersonFormOpen(true);
  };

  const handleOpenEditSalespersonForm = (salesperson: Salesperson) => {
    setEditingSalesperson(salesperson);
    setIsSalespersonFormOpen(true);
  };
  
  const handleSaveSalesperson = (salespersonData: Omit<Salesperson, 'id'> | Salesperson) => {
    if ('id' in salespersonData) {
      updateSalesperson(salespersonData);
    } else {
      addSalesperson(salespersonData);
    }
    setIsSalespersonFormOpen(false);
    setEditingSalesperson(null);
  };

  const handleDeleteSalesperson = (salespersonId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este consultor? Esta ação não pode ser desfeita.')) {
        deleteSalesperson(salespersonId);
    }
  };

  const handleOpenNewProfileForm = () => {
    setEditingProfile(null);
    setIsProfileFormOpen(true);
  };

  const handleOpenEditProfileForm = (profile: UserProfile) => {
    setEditingProfile(profile);
    setIsProfileFormOpen(true);
  };

  const handleSaveProfile = (profileData: Omit<UserProfile, 'id'> | UserProfile) => {
    if ('id' in profileData) {
      updateUserProfile(profileData);
    } else {
      addUserProfile(profileData);
    }
    setIsProfileFormOpen(false);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (currentUser.id === profileId) {
        alert("Não é possível excluir o próprio perfil de usuário.");
        return;
    }
    if (window.confirm('Tem certeza que deseja excluir este perfil? O usuário perderá o acesso ao sistema.')) {
        deleteUserProfile(profileId);
    }
  };

  const handleOpenSettingsModal = (type: keyof AppConfig, value?: string) => {
    setEditingSetting({ type, value });
    setIsSettingsModalOpen(true);
  };
  
  const handleSaveSetting = (newValue: string) => {
    if (!editingSetting) return;

    if (editingSetting.value) { // Editing existing
      updateConfigItem(editingSetting.type, editingSetting.value, newValue);
    } else { // Adding new
      addConfigItem(editingSetting.type, newValue);
    }
    setIsSettingsModalOpen(false);
    setEditingSetting(null);
  };

  const handleOpenNewCommissionForm = () => {
    setEditingCommission(null);
    setIsCommissionFormOpen(true);
  };

  const handleOpenEditCommissionForm = (commission: CalculatedCommission) => {
    setEditingCommission(commission);
    setIsCommissionFormOpen(true);
  };

  const handleSaveCommission = (commissionData: Omit<Commission, 'id'> | Commission) => {
    if ('id' in commissionData) {
      updateCommission(commissionData);
    } else {
      addCommission(commissionData);
    }
    setIsCommissionFormOpen(false);
    setEditingCommission(null);
  };

  const handleDeleteCommission = (commissionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta comissão?')) {
      deleteCommission(commissionId);
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
      case View.Commissions:
        return (
          <CommissionList
            commissions={calculatedCommissions}
            salespeople={salespeople}
            onAdd={handleOpenNewCommissionForm}
            onEdit={handleOpenEditCommissionForm}
            onDelete={handleDeleteCommission}
          />
        );
      case View.Salespeople:
        return (
          <SalespersonList
            salespeople={salespeople}
            onAdd={handleOpenNewSalespersonForm}
            onEdit={handleOpenEditSalespersonForm}
            onDelete={handleDeleteSalesperson}
          />
        );
      case View.Profiles:
        return (
          <UserProfileList
            profiles={userProfiles}
            onAdd={handleOpenNewProfileForm}
            onEdit={handleOpenEditProfileForm}
            onDelete={handleDeleteProfile}
          />
        );
      case View.Settings:
        return (
          <Settings
            config={appConfig}
            onAddItem={handleOpenSettingsModal}
            onEditItem={handleOpenSettingsModal}
            onDeleteItem={deleteConfigItem}
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
        userProfiles={userProfiles}
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
          paymentMethods={appConfig.paymentMethods}
          orderStatuses={appConfig.orderStatuses}
          orderOrigins={appConfig.orderOrigins}
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

      {isSalespersonFormOpen && (
        <SalespersonForm
            isOpen={isSalespersonFormOpen}
            onClose={() => setIsSalespersonFormOpen(false)}
            onSave={handleSaveSalesperson}
            businessUnits={appConfig.businessUnits}
            salespersonLevels={appConfig.salespersonLevels}
            initialData={editingSalesperson}
        />
      )}
      {isProfileFormOpen && (
        <UserProfileForm
          isOpen={isProfileFormOpen}
          onClose={() => setIsProfileFormOpen(false)}
          onSave={handleSaveProfile}
          initialData={editingProfile}
          salespeople={salespeople}
        />
      )}
      {isCommissionFormOpen && (
        <CommissionForm
            isOpen={isCommissionFormOpen}
            onClose={() => setIsCommissionFormOpen(false)}
            onSave={handleSaveCommission}
            initialData={editingCommission}
            orders={calculatedOrders}
            commissions={commissions}
        />
      )}
      {isSettingsModalOpen && (
        <SettingsFormModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveSetting}
          initialValue={editingSetting?.value}
          title={`
            ${editingSetting?.value ? 'Editar' : 'Adicionar'} 
            ${
              {
                businessUnits: "Unidade de Negócio",
                paymentMethods: "Forma de Pagamento",
                orderOrigins: "Origem do Pedido",
                salespersonLevels: "Nível de Consultor",
                orderStatuses: "Status do Pedido"
              }[editingSetting?.type || 'businessUnits'] || 'Item'
            }
          `}
        />
      )}
    </div>
  );
};

export default App;
