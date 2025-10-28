

export type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  category: string;
  size: string;
  color: string;
  gender: 'Masculino' | 'Feminino' | 'Unissex';
  supplierId?: string;
  description: string;
};

export type RecentSale = {
  id: string;
  customerName: string;
  customerEmail: string;

  items: number;
  total: number;
  status: 'Pago' | 'Pendente' | 'Cancelado';
};

export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    cpf?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export type Supplier = {
    id: string;
    name: string;
    cnpj?: string;
    contactName?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
};

export type SaleItem = {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

export type TermPaymentMethod = 'Boleto' | 'Transferencia' | 'Cheque' | 'Outro';

export type Sale = {
    id: string;
    employeeId: string;
    customerId?: string;
    items: SaleItem[];
    total: number;
    paymentMethod: 'Cartão' | 'PIX' | 'Dinheiro' | 'À Vista' | 'Prazo' | 'Parcelado' | 'Indefinido';
    installments: number;
    date: string;
    dueDate?: string;
    termPaymentMethod?: TermPaymentMethod;
    status: 'Pago' | 'Pendente' | 'Cancelado';
    customerCPF?: string;
    cardNumber?: string;
};

export type StoreConfig = {
  storeName: string;
  cnpj?: string;
  address?: string;
  phone?: string;
};
