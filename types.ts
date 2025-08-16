
export enum OrderStatus {
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
  Detail = 'Detalhe'
}

export enum PaymentMethod {
    Boleto = 'Boleto',
    Pix = 'Pix',
    CreditCard = 'Cartão de Crédito',
    Transfer = 'Transferência',
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
  paymentMethod: PaymentMethod; // Forma de Pagamento
  origin: string; // Origem
  prospectedBy: string; // Prospectado por:
  cancellationDate: string | null; // Data Cancelamento
  initialPaymentDate: string | null; // Dt. Pgto Inicial
  paymentDate80: string | null; // Dt. Pgto. 80%
  paymentDate100: string | null; // Dt. Pgto. 100%
  orderStatus: OrderStatus; // Status do Pedido
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
  name: string; // Nome do Consultor
  businessUnit: string; // Unidade de Negócio
  salesGoal: number; // Meta de Vendas
}