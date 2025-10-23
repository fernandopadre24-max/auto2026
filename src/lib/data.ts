import type { Part, RecentSale, Customer, Employee } from '@/lib/types';

export const parts: Part[] = [
  {
    id: '1',
    name: 'Filtro de Óleo',
    sku: 'FO-12345',
    stock: 150,
    purchasePrice: 15.5,
    salePrice: 25.0,
    category: 'Filtros',
    manufacturer: 'Mann-Filter',
    vehicleModel: 'VW Gol',
    vehicleYear: 2020,
  },
  {
    id: '2',
    name: 'Pastilha de Freio Dianteira',
    sku: 'PFD-67890',
    stock: 80,
    purchasePrice: 75.0,
    salePrice: 120.0,
    category: 'Freios',
    manufacturer: 'Bosch',
    vehicleModel: 'Fiat Uno',
    vehicleYear: 2018,
  },
  {
    id: '3',
    name: 'Vela de Ignição',
    sku: 'VI-11223',
    stock: 200,
    purchasePrice: 12.0,
    salePrice: 22.5,
    category: 'Motor',
    manufacturer: 'NGK',
    vehicleModel: 'Chevrolet Onix',
    vehicleYear: 2022,
  },
  {
    id: '4',
    name: 'Amortecedor Dianteiro',
    sku: 'AD-44556',
    stock: 40,
    purchasePrice: 180.0,
    salePrice: 290.0,
    category: 'Suspensão',
    manufacturer: 'Cofap',
    vehicleModel: 'Ford Ka',
    vehicleYear: 2019,
  },
  {
    id: '5',
    name: 'Bateria 60Ah',
    sku: 'BAT-77889',
    stock: 25,
    purchasePrice: 250.0,
    salePrice: 380.0,
    category: 'Elétrica',
    manufacturer: 'Moura',
    vehicleModel: 'Universal',
    vehicleYear: 2023,
  },
];


export const recentSales: RecentSale[] = [
    {
        id: '1',
        customerName: 'João Silva',
        customerEmail: 'joao.silva@email.com',
        items: 2,
        total: 145.00,
        status: 'Pago',
    },
    {
        id: '2',
        customerName: 'Maria Oliveira',
        customerEmail: 'maria.o@email.com',
        items: 1,
        total: 380.00,
        status: 'Pago',
    },
    {
        id: '3',
        customerName: 'Carlos Pereira',
        customerEmail: 'carlos.p@email.com',
        items: 5,
        total: 112.50,
        status: 'Pendente',
    },
    {
        id: '4',
        customerName: 'Ana Costa',
        customerEmail: 'ana.costa@email.com',
        items: 1,
        total: 25.00,
        status: 'Pago',
    },
    {
        id: '5',
        customerName: 'Pedro Martins',
        customerEmail: 'pedro.m@email.com',
        items: 3,
        total: 870.00,
        status: 'Cancelado',
    }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    totalSpent: 1250.75,
    lastPurchase: '2023-10-15',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.o@email.com',
    phone: '(21) 91234-5678',
    totalSpent: 850.0,
    lastPurchase: '2023-10-20',
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos.p@email.com',
    phone: '(31) 99999-8888',
    totalSpent: 320.5,
    lastPurchase: '2023-09-05',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(41) 98888-7777',
    totalSpent: 2150.0,
    lastPurchase: '2023-10-22',
  },
  {
    id: '5',
    name: 'Pedro Martins',
    email: 'pedro.m@email.com',
    phone: '(51) 97777-6666',
    totalSpent: 500.25,
    lastPurchase: '2023-08-12',
  },
];

export const employees: Employee[] = [
    {
        id: '1',
        name: 'Roberto Almeida',
        email: 'roberto.a@autoparts.com',
        position: 'Gerente',
        admissionDate: '2020-01-15',
        status: 'Ativo'
    },
    {
        id: '2',
        name: 'Fernanda Lima',
        email: 'fernanda.l@autoparts.com',
        position: 'Vendedora',
        admissionDate: '2021-03-20',
        status: 'Ativo'
    },
    {
        id: '3',
        name: 'Lucas Souza',
        email: 'lucas.s@autoparts.com',
        position: 'Mecânico',
        admissionDate: '2022-07-10',
        status: 'Ativo'
    },
    {
        id: '4',
        name: 'Juliana Santos',
        email: 'juliana.s@autoparts.com',
        position: 'Caixa',
        admissionDate: '2023-02-28',
        status: 'Ativo'
    },
    {
        id: '5',
        name: 'Ricardo Gomes',
        email: 'ricardo.g@autoparts.com',
        position: 'Estoquista',
        admissionDate: '2021-11-01',
        status: 'Inativo'
    }
]
