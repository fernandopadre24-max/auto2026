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
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastPurchase: string;
};
