'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Part, Customer, Employee, Sale, StoreConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

// Static Mock Data
const mockParts: Part[] = [
  { id: '1', name: 'Filtro de Óleo', sku: 'FO-001', stock: 100, purchasePrice: 15.50, salePrice: 25.00, category: 'Filtros', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'VW Gol', vehicleYear: 2020, condition: 'new', technicalSpecifications: 'Dimensões: 10x5x5cm', description: 'Filtro de óleo para VW Gol.' },
  { id: '2', name: 'Pastilha de Freio Dianteira', sku: 'PF-002', stock: 50, purchasePrice: 50.00, salePrice: 95.00, category: 'Freios', unit: 'JG', manufacturer: 'Fras-le', vehicleModel: 'Fiat Palio', vehicleYear: 2018, condition: 'new', technicalSpecifications: 'Material: Cerâmica', description: 'Pastilha de freio para Fiat Palio.' },
];

const mockCustomers: Customer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phoneNumber: '11999998888', address: 'Rua A, 123', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phoneNumber: '21988887777', address: 'Av B, 456', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'default', firstName: 'Consumidor', lastName: 'Final', email: 'consumidor@final.com', phoneNumber: '', address: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockEmployees: Employee[] = [
  { id: '1', employeeCode: 'FUNC-001', firstName: 'Carlos', lastName: 'Pereira', email: 'carlos.p@email.com', phoneNumber: '31977776666', role: 'Vendedor', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', employeeCode: 'FUNC-002', firstName: 'Ana', lastName: 'Oliveira', email: 'ana.o@email.com', phoneNumber: '41966665555', role: 'Gerente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSales: Sale[] = [
    { id: '1', employeeId: '1', customerId: '1', items: [{ partId: '1', quantity: 2, unitPrice: 25.00, discount: 0 }], total: 50.00, paymentMethod: 'Cartão', installments: 1, date: new Date().toISOString(), status: 'Pago' },
    { id: '2', employeeId: '1', customerId: '2', items: [{ partId: '2', quantity: 1, unitPrice: 95.00, discount: 10 }], total: 85.00, paymentMethod: 'PIX', installments: 1, date: new Date().toISOString(), status: 'Pago' },
];

const mockConfig: StoreConfig = {
  storeName: 'AutoParts Manager',
  cnpj: '12.345.678/0001-99',
  address: 'Rua Principal, 123, Centro',
  phone: '(11) 98765-4321'
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};


interface DataContextProps {
  parts: Part[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  config: StoreConfig;
  isLoading: boolean;
  saveConfig: (newConfig: StoreConfig) => void;
  updateCustomer: (updatedCustomer: Customer) => void;
  addCustomer: (newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (updatedEmployee: Employee) => void;
  addEmployee: (newEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'employeeCode'>) => void;
  updatePart: (updatedPart: Part) => void;
  addPart: (newPart: Omit<Part, 'id' | 'sku'>) => void;
  addSale: (newSale: Omit<Sale, 'id'>) => void;
  confirmPayment: (saleId: string) => void;
  getPartById: (partId: string) => Part | undefined;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [parts, setParts] = useLocalStorage('parts', mockParts);
  const [customers, setCustomers] = useLocalStorage('customers', mockCustomers);
  const [employees, setEmployees] = useLocalStorage('employees', mockEmployees);
  const [sales, setSales] = useLocalStorage('sales', mockSales);
  const [config, setConfig] = useLocalStorage('config', mockConfig);

  // Simulate data fetching and check if localStorage is initialized
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedParts = window.localStorage.getItem('parts');
        if (!storedParts) {
            setParts(mockParts);
            setCustomers(mockCustomers);
            setEmployees(mockEmployees);
            setSales(mockSales);
            setConfig(mockConfig);
        }
        setIsLoading(false);
    }
  }, []);

  const saveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
  };

  const addCustomer = (newCustomerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? { ...c, ...updatedCustomer, updatedAt: new Date().toISOString() } : c));
  };
  
  const addEmployee = (newEmployeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'employeeCode'>) => {
    const newEmployee: Employee = {
      ...newEmployeeData,
      id: uuidv4(),
      employeeCode: `FUNC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(e => e.id === updatedEmployee.id ? { ...e, ...updatedEmployee, updatedAt: new Date().toISOString() } : e));
  };

  const addPart = (newPartData: Omit<Part, 'id' | 'sku'>) => {
    const newPart: Part = {
      ...newPartData,
      id: uuidv4(),
      sku: `SKU-${Date.now().toString().slice(-5)}`,
    };
    setParts([...parts, newPart]);
  }

  const updatePart = (updatedPart: Part) => {
    setParts(parts.map(p => p.id === updatedPart.id ? { ...p, ...updatedPart } : p));
  }

  const addSale = (newSaleData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
        ...newSaleData,
        id: uuidv4(),
    };
    setSales([newSale, ...sales]);
  }

  const confirmPayment = (saleId: string) => {
    setSales(prevSales => 
        prevSales.map(sale => 
            sale.id === saleId ? { ...sale, status: 'Pago' } : sale
        )
    );
  };

  const getPartById = (partId: string) => {
    return parts.find(p => p.id === partId);
  }
  
  const value = {
    parts,
    customers,
    employees,
    sales,
    config,
    isLoading,
    saveConfig,
    updateCustomer,
    addCustomer,
    updateEmployee,
    addEmployee,
    updatePart,
    addPart,
    addSale,
    confirmPayment,
    getPartById,
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

    