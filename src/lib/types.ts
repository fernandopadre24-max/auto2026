export type Part = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  category: string;
  manufacturer: string;
  vehicleModel: string;
  vehicleYear: number;
  condition: string;
  technicalSpecifications: string;
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
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export type SaleItem = {
    partId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

export type Sale = {
    id: string;
    employeeId: string;
    customerId?: string;
    items: SaleItem[];
    total: number;
    paymentMethod: 'Cartão' | 'PIX' | 'Dinheiro' | 'À Vista' | 'Prazo' | 'Parcelado';
    installments: number;
    date: string;
};

export type StoreConfig = {
  storeName: string;
  cnpj?: string;
  address?: string;
  phone?: string;
};
