
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Part, Customer, Employee, Sale } from './types';

interface DataContextProps {
  parts: Part[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  isLoading: boolean;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();

  const partsCollection = useMemoFirebase(
    () => collection(firestore, 'parts'),
    [firestore]
  );
  const { data: parts, isLoading: isLoadingParts } = useCollection<Part>(partsCollection);

  const customersCollection = useMemoFirebase(
    () => collection(firestore, 'customers'),
    [firestore]
  );
  const { data: customers, isLoading: isLoadingCustomers } = useCollection<Customer>(customersCollection);

  const employeesCollection = useMemoFirebase(
    () => collection(firestore, 'employees'),
    [firestore]
  );
  const { data: employees, isLoading: isLoadingEmployees } = useCollection<Employee>(employeesCollection);

  const salesCollection = useMemoFirebase(
    () => collection(firestore, 'sales'),
    [firestore]
  );
  const { data: sales, isLoading: isLoadingSales } = useCollection<Sale>(salesCollection);

  const isLoading = isLoadingParts || isLoadingCustomers || isLoadingEmployees || isLoadingSales;

  const value = {
    parts: parts || [],
    customers: customers || [],
    employees: employees || [],
    sales: sales || [],
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
