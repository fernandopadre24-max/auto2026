
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Product, Customer, Employee, Sale, StoreConfig, Supplier } from './types';
import { v4 as uuidv4 } from 'uuid';

// Static Mock Data
const mockProducts: Product[] = [
    { id: '1', name: 'Camiseta Básica Branca', sku: 'SKU-58391', stock: 120, purchasePrice: 25.00, salePrice: 49.90, category: 'Camisetas', size: 'M', color: 'Branca', gender: 'Unissex', supplierId: '1', description: 'Camiseta de algodão pima, perfeita para o dia a dia.' },
    { id: '2', name: 'Calça Jeans Slim Fit', sku: 'SKU-38192', stock: 75, purchasePrice: 70.00, salePrice: 149.90, category: 'Calças', size: '42', color: 'Azul Escuro', gender: 'Masculino', supplierId: '2', description: 'Calça jeans com elastano, modelo slim fit que se ajusta ao corpo.' },
    { id: '3', name: 'Vestido Floral Midi', sku: 'SKU-83191', stock: 50, purchasePrice: 90.00, salePrice: 199.90, category: 'Vestidos', size: 'M', color: 'Estampado', gender: 'Feminino', supplierId: '1', description: 'Vestido midi com estampa floral, tecido leve e fluído.' },
    { id: '4', name: 'Jaqueta de Couro PU', sku: 'SKU-10382', stock: 30, purchasePrice: 150.00, salePrice: 299.90, category: 'Jaquetas', size: 'G', color: 'Preta', gender: 'Unissex', description: 'Jaqueta estilo motociclista em couro sintético de alta qualidade.' },
    { id: '5', name: 'Tênis Casual Branco', sku: 'SKU-49122', stock: 80, purchasePrice: 80.00, salePrice: 179.90, category: 'Calçados', size: '40', color: 'Branco', gender: 'Unissex', description: 'Tênis casual versátil, combina com qualquer look.' },
    { id: '6', name: 'Bolsa Tote Caramelo', sku: 'SKU-51923', stock: 40, purchasePrice: 110.00, salePrice: 249.90, category: 'Acessórios', size: 'Único', color: 'Caramelo', gender: 'Feminino', description: 'Bolsa grande em material sintético, ideal para trabalho e lazer.' },
    { id: '7', name: 'Camisa Social Slim', sku: 'SKU-93811', stock: 60, purchasePrice: 65.00, salePrice: 129.90, category: 'Camisas', size: 'M', color: 'Azul Claro', gender: 'Masculino', description: 'Camisa social de algodão, modelagem slim para um caimento perfeito.' },
    { id: '8', name: 'Saia Plissada Rosé', sku: 'SKU-10392', stock: 45, purchasePrice: 50.00, salePrice: 119.90, category: 'Saias', size: 'P', color: 'Rosé', gender: 'Feminino', description: 'Saia midi plissada em tecido acetinado, cor da estação.' },
    { id: '9', name: 'Moletom com Capuz Cinza', sku: 'SKU-49120', stock: 90, purchasePrice: 85.00, salePrice: 179.90, category: 'Moletons', size: 'G', color: 'Cinza Mescla', gender: 'Unissex', description: 'Moletom flanelado com capuz e bolso canguru.' },
    { id: '10', name: 'Óculos de Sol Aviador', sku: 'SKU-18291', stock: 100, purchasePrice: 40.00, salePrice: 99.90, category: 'Acessórios', size: 'Único', color: 'Dourado', gender: 'Unissex', description: 'Clássico modelo aviador com lentes escuras e armação dourada.' },
];


const mockCustomers: Customer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phoneNumber: '11999998888', address: 'Rua A, 123, São Paulo - SP', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phoneNumber: '21988887777', address: 'Av B, 456, Rio de Janeiro - RJ', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'default', firstName: 'Consumidor', lastName: 'Final', email: 'consumidor@final.com', phoneNumber: '', address: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockEmployees: Employee[] = [
  { id: '1', employeeCode: 'FUNC-001', firstName: 'Carlos', lastName: 'Pereira', email: 'carlos.p@email.com', phoneNumber: '31977776666', role: 'Vendedor', address: 'Rua das Flores, 123, Belo Horizonte - MG', cpf: '111.222.333-44', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', employeeCode: 'FUNC-002', firstName: 'Ana', lastName: 'Oliveira', email: 'ana.o@email.com', phoneNumber: '41966665555', role: 'Gerente', address: 'Avenida do Sol, 456, Curitiba - PR', cpf: '555.666.777-88', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Distribuidora Têxtil Brasil', cnpj: '12.345.678/0001-00', contactName: 'Ricardo Almeida', email: 'contato@distribuidorabrasil.com', phoneNumber: '1122334455', address: 'Rua dos Fornecedores, 100, São Paulo - SP', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Jeans & Co.', cnpj: '98.765.432/0001-11', contactName: 'Sofia Costa', email: 'vendas@jeansco.com', phoneNumber: '4133445566', address: 'Avenida Industrial, 200, Curitiba - PR', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSales: Sale[] = [
    { id: '1', employeeId: '1', customerId: '1', items: [{ productId: '1', quantity: 2, unitPrice: 49.90, discount: 0 }], total: 99.80, paymentMethod: 'Cartão', installments: 1, date: new Date().toISOString(), status: 'Pago' },
    { id: '2', employeeId: '1', customerId: '2', items: [{ productId: '2', quantity: 1, unitPrice: 149.90, discount: 10 }], total: 139.90, paymentMethod: 'PIX', installments: 1, date: new Date().toISOString(), status: 'Pago' },
];

const mockConfig: StoreConfig = {
  storeName: 'Fashion Store',
  cnpj: '12.345.678/0001-99',
  address: 'Rua da Moda, 123, Centro',
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
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  suppliers: Supplier[];
  sales: Sale[];
  config: StoreConfig;
  isLoading: boolean;
  saveConfig: (newConfig: StoreConfig) => void;
  updateCustomer: (updatedCustomer: Customer) => void;
  addCustomer: (newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteCustomer: (customerId: string) => void;
  updateEmployee: (updatedEmployee: Employee) => void;
  addEmployee: (newEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'employeeCode'>) => void;
  deleteEmployee: (employeeId: string) => void;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'sku'>) => void;
  deleteProduct: (productId: string) => void;
  addSale: (newSale: Omit<Sale, 'id'>) => void;
  confirmPayment: (saleId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  addSupplier: (newSupplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (updatedSupplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useLocalStorage('products', mockProducts);
  const [customers, setCustomers] = useLocalStorage('customers', mockCustomers);
  const [employees, setEmployees] = useLocalStorage('employees', mockEmployees);
  const [suppliers, setSuppliers] = useLocalStorage('suppliers', mockSuppliers);
  const [sales, setSales] = useLocalStorage('sales', mockSales);
  const [config, setConfig] = useLocalStorage('config', mockConfig);

  // Simulate data fetching and check if localStorage is initialized
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedProducts = window.localStorage.getItem('products');
        if (!storedProducts || JSON.parse(storedProducts).length < 5) { // Simple check to see if mock data is old
            setProducts(mockProducts);
            setCustomers(mockCustomers);
            setEmployees(mockEmployees);
            setSuppliers(mockSuppliers);
            setSales(mockSales);
            setConfig(mockConfig);
        }
        setIsLoading(false);
    }
  }, [setProducts, setCustomers, setEmployees, setSales, setConfig, setSuppliers]);

  const saveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    if (newConfig.storeName) {
      document.title = newConfig.storeName;
    }
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

  const deleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  }
  
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

  const deleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(e => e.id !== employeeId));
  }

  const addProduct = (newProductData: Omit<Product, 'id' | 'sku'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: uuidv4(),
      sku: `SKU-${Date.now().toString().slice(-5)}`,
    };
    setProducts([...products, newProduct]);
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  }

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
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

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  }

  const addSupplier = (newSupplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...newSupplierData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? { ...s, ...updatedSupplier, updatedAt: new Date().toISOString() } : s));
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
  }
  
  const value = {
    products,
    customers,
    employees,
    suppliers,
    sales,
    config,
    isLoading,
    saveConfig,
    updateCustomer,
    addCustomer,
    deleteCustomer,
    updateEmployee,
    addEmployee,
    deleteEmployee,
    updateProduct,
    addProduct,
    deleteProduct,
    addSale,
    confirmPayment,
    getProductById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
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
