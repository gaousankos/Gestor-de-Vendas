

export enum OrderStatusEnum {
  Active = 'ATIVO',
  Cancelled = 'CANCELADO',
  Completed = 'CONCLUÍDO',
}

export enum PaymentStatus {
  Confirmed = 'PAGAMENTO CONFIRMADO',
  Partial = 'PAGAMENTO PARCIAL',
  Pending = 'PAGAMENTO PENDENTE',
  Overdue = 'PAGAMENTO EM ATRASO',
  Cancelled = 'CANCELADO',
}

export enum UserRole {
  Admin = 'Admin/Financeiro',
  Manager = 'Gestor',
  Salesperson = 'Vendedor',
}

export enum View {
  Dashboard = 'Dashboard',
  List = 'Pedidos',
  Payments = 'Recebimentos',
  Commissions = 'Comissões',
  Detail = 'Detalhe',
  Salespeople = 'Gestão de Consultores',
  Profiles = 'Gestão de Perfis',
  Settings = 'Configurações',
}

export enum CommissionStatus {
    Pending = 'Pendente',
    Paid = 'Pago',
}

export interface Order {
  id: string; // Cód. Pedido
  customerName: string; // Nome do Cliente
  consultant: string; // Consultor
  insurance: 'S' | 'N'; // Seguro (S/N)
  orderValue: number; // Valor Pedido
  initialPaymentPercentage: number; // % Pgto. Inicial
  downPaymentPercentage: number; // % Entrada
  downPaymentDueDate: string; // Vcto. Entrada
  city: string; // Cidade do Cliente
  contractCreationDate: string; // Dt. Geração Contrato
  contractSignatureDate: string; // Dt. Assinatura Contrato
  paymentMethod: string; // Forma de Pagamento
  origin: string; // Origem
  prospectedBy: string; // Prospectado por:
  cancellationDate: string | null; // Data Cancelamento
  initialPaymentDate: string | null; // Dt. Pgto Inicial
  paymentDate80: string | null; // Dt. Pgto. 80%
  paymentDate100: string | null; // Dt. Pgto. 100%
  orderStatus: string; // Status do Pedido
}

export interface CalculatedOrder extends Order {
  received: number; // Valor Recebido
  currentBalance: number; // Saldo Atual
  downPaymentGoal: number; // Vl. Entrada
  initialPaymentValue: number; // Vl. Pgto. Inicial
  firstPaymentDate: string | null; // 1º Recebimento
  paymentStatus: PaymentStatus;
}

export interface Payment {
  id: string; // ID Pagamento
  orderId: string; // Pedido Vinculado
  paymentDate: string; // Data do Pagamento
  value: number; // Valor
}

export interface Salesperson {
  id: string;
  name: string; // Nome do Consultor
  businessUnit: string; // Unidade de Negócio
  salesGoal: number; // Meta de Vendas
  level: string;
  hireDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Commission {
  id: string;
  orderId: string;
  commissionRate: number; // e.g., 0.05 for 5%
  status: CommissionStatus;
  paymentDate: string | null;
}

export interface CalculatedCommission extends Commission {
    customerName: string;
    consultant: string;
    orderValue: number;
    commissionValue: number;
}


export interface AppConfig {
    businessUnits: string[];
    paymentMethods: string[];
    orderOrigins: string[];
    salespersonLevels: string[];
    orderStatuses: string[];
}
