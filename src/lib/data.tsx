'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Part, Customer, Employee, Sale } from './types';

// Static Mock Data
const mockParts: Part[] = [
  { id: '1', name: 'Filtro de Óleo', sku: 'FO-001', stock: 100, purchasePrice: 15.50, salePrice: 25.00, category: 'Filtros', manufacturer: 'Bosch', vehicleModel: 'VW Gol', vehicleYear: 2020, condition: 'new', technicalSpecifications: 'Dimensões: 10x5x5cm', description: 'Filtro de óleo para VW Gol.' },
  { id: '2', name: 'Pastilha de Freio Dianteira', sku: 'PF-002', stock: 50, purchasePrice: 50.00, salePrice: 95.00, category: 'Freios', manufacturer: 'Fras-le', vehicleModel: 'Fiat Palio', vehicleYear: 2018, condition: 'new', technicalSpecifications: 'Material: Cerâmica', description: 'Pastilha de freio para Fiat Palio.' },
];

const mockCustomers: Customer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phoneNumber: '11999998888', address: 'Rua A, 123', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phoneNumber: '21988887777', address: 'Av B, 456', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockEmployees: Employee[] = [
  { id: '1', firstName: 'Carlos', lastName: 'Pereira', email: 'carlos.p@email.com', phoneNumber: '31977776666', role: 'Vendedor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Ana', lastName: 'Oliveira', email: 'ana.o@email.com', phoneNumber: '41966665555', role: 'Gerente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSales: Sale[] = [
    { id: '1', employeeId: '1', customerId: '1', items: [{ partId: '1', quantity: 2, unitPrice: 25.00, discount: 0 }], total: 50.00, paymentMethod: 'Cartão', installments: 1, date: new Date().toISOString() },
    { id: '2', employeeId: '1', customerId: '2', items: [{ partId: '2', quantity: 1, unitPrice: 95.00, discount: 10 }], total: 85.00, paymentMethod: 'PIX', installments: 1, date: new Date().toISOString() },
];


interface DataContextProps {
  parts: Part[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate a short loading delay
    return () => clearTimeout(timer);
  }, []);
  
  const value = {
    parts: mockParts,
    customers: mockCustomers,
    employees: mockEmployees,
    sales: mockSales,
    isLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
