'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Part, Customer, Employee, Sale, StoreConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

// Static Mock Data
const mockParts: Part[] = [
    { id: '1', name: 'Filtro de Óleo', sku: 'SKU-58391', stock: 120, purchasePrice: 18.50, salePrice: 29.90, category: 'Filtros', unit: 'UN', manufacturer: 'Mann-Filter', vehicleModel: 'VW Gol G5/G6', vehicleYear: 2013, condition: 'new', technicalSpecifications: 'Rosca M20x1.5', description: 'Filtro de óleo de alta performance para motores Volkswagen 1.0 e 1.6.' },
    { id: '2', name: 'Pastilha de Freio Dianteira', sku: 'SKU-38192', stock: 75, purchasePrice: 65.00, salePrice: 119.90, category: 'Freios', unit: 'JG', manufacturer: 'Fras-le', vehicleModel: 'Fiat Palio 1.4', vehicleYear: 2015, condition: 'new', technicalSpecifications: 'Sistema Teves', description: 'Jogo de pastilhas de freio dianteiras para Fiat Palio com sistema Teves.' },
    { id: '3', name: 'Vela de Ignição', sku: 'SKU-83191', stock: 250, purchasePrice: 12.00, salePrice: 22.50, category: 'Motor', unit: 'UN', manufacturer: 'NGK', vehicleModel: 'Chevrolet Onix 1.0', vehicleYear: 2018, condition: 'new', technicalSpecifications: 'Eletrodo de Níquel', description: 'Vela de ignição original NGK para Chevrolet Onix.' },
    { id: '4', name: 'Amortecedor Dianteiro', sku: 'SKU-10382', stock: 30, purchasePrice: 180.00, salePrice: 320.00, category: 'Suspensão', unit: 'UN', manufacturer: 'Cofap', vehicleModel: 'Ford Ka', vehicleYear: 2019, condition: 'new', technicalSpecifications: 'Turbogás', description: 'Amortecedor dianteiro a gás para Ford Ka. (Lado Direito/Esquerdo)' },
    { id: '5', name: 'Bateria 60Ah', sku: 'SKU-49122', stock: 25, purchasePrice: 250.00, salePrice: 399.90, category: 'Elétrica', unit: 'UN', manufacturer: 'Moura', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'CCA: 440A, 12V', description: 'Bateria automotiva de 60Ah, serve na maioria dos veículos leves.' },
    { id: '6', name: 'Filtro de Ar do Motor', sku: 'SKU-51923', stock: 150, purchasePrice: 15.00, salePrice: 28.00, category: 'Filtros', unit: 'UN', manufacturer: 'Tecfil', vehicleModel: 'Hyundai HB20 1.6', vehicleYear: 2017, condition: 'new', technicalSpecifications: 'Elemento de papel', description: 'Filtro de ar para motor Hyundai HB20 1.6.' },
    { id: '7', name: 'Disco de Freio Dianteiro', sku: 'SKU-93811', stock: 40, purchasePrice: 90.00, salePrice: 165.00, category: 'Freios', unit: 'UN', manufacturer: 'Fremax', vehicleModel: 'Renault Sandero', vehicleYear: 2016, condition: 'new', technicalSpecifications: 'Ventilado, 259mm', description: 'Disco de freio dianteiro ventilado para Renault Sandero.' },
    { id: '8', name: 'Correia Dentada', sku: 'SKU-10392', stock: 60, purchasePrice: 45.00, salePrice: 89.90, category: 'Motor', unit: 'UN', manufacturer: 'Gates', vehicleModel: 'Chevrolet Corsa 1.4', vehicleYear: 2010, condition: 'new', technicalSpecifications: '111 dentes', description: 'Correia sincronizadora para motor GM Família I 1.4.' },
    { id: '9', name: 'Kit de Embreagem', sku: 'SKU-49120', stock: 15, purchasePrice: 350.00, salePrice: 580.00, category: 'Transmissão', unit: 'KT', manufacturer: 'Luk', vehicleModel: 'VW Fox 1.6', vehicleYear: 2014, condition: 'new', technicalSpecifications: 'Platô, Disco e Rolamento', description: 'Kit de embreagem completo para Volkswagen Fox.' },
    { id: '10', name: 'Lâmpada H4 Super Branca', sku: 'SKU-18291', stock: 300, purchasePrice: 8.00, salePrice: 19.90, category: 'Iluminação', unit: 'UN', manufacturer: 'Philips', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: '55/60W, 4300K', description: 'Lâmpada halógena H4 com efeito de luz branca.' },
    { id: '11', name: 'Pivô de Suspensão', sku: 'SKU-18293', stock: 80, purchasePrice: 35.00, salePrice: 65.00, category: 'Suspensão', unit: 'UN', manufacturer: 'Nakata', vehicleModel: 'Fiat Uno', vehicleYear: 2012, condition: 'new', technicalSpecifications: 'Lado esquerdo/direito', description: 'Pivô da bandeja de suspensão para Fiat Uno.' },
    { id: '12', name: 'Filtro de Combustível', sku: 'SKU-18294', stock: 180, purchasePrice: 10.00, salePrice: 19.50, category: 'Filtros', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Bico fino', description: 'Filtro de combustível para veículos a gasolina/etanol.' },
    { id: '13', name: 'Óleo 5W30 Sintético', sku: 'SKU-18295', stock: 90, purchasePrice: 38.00, salePrice: 59.90, category: 'Lubrificantes', unit: 'L', manufacturer: 'ACDelco', vehicleModel: 'Chevrolet Onix', vehicleYear: 2020, condition: 'new', technicalSpecifications: 'API SN, 1L', description: 'Óleo sintético 5W30 para motores modernos.' },
    { id: '14', name: 'Bomba d\'Água', sku: 'SKU-18296', stock: 20, purchasePrice: 110.00, salePrice: 195.00, category: 'Motor', unit: 'UN', manufacturer: 'Urba', vehicleModel: 'Ford Fiesta 1.6', vehicleYear: 2013, condition: 'new', technicalSpecifications: 'Com polia', description: 'Bomba d\'água para motor Zetec Rocam.' },
    { id: '15', name: 'Terminal de Direção', sku: 'SKU-18297', stock: 55, purchasePrice: 40.00, salePrice: 75.00, category: 'Direção', unit: 'UN', manufacturer: 'TRW', vehicleModel: 'Toyota Corolla', vehicleYear: 2019, condition: 'new', technicalSpecifications: 'Rosca Direita', description: 'Terminal de direção para Toyota Corolla.' },
    { id: '16', name: 'Filtro de Cabine (Ar Condicionado)', sku: 'SKU-18298', stock: 200, purchasePrice: 18.00, salePrice: 35.00, category: 'Filtros', unit: 'UN', manufacturer: 'Wega', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Com carvão ativado', description: 'Filtro de ar condicionado com carvão ativado, anti-pólen.' },
    { id: '17', name: 'Rolamento de Roda Dianteiro', sku: 'SKU-18299', stock: 45, purchasePrice: 80.00, salePrice: 140.00, category: 'Suspensão', unit: 'UN', manufacturer: 'SKF', vehicleModel: 'Honda Civic', vehicleYear: 2017, condition: 'new', technicalSpecifications: 'Com ABS', description: 'Rolamento de roda dianteiro para Honda Civic com freio ABS.' },
    { id: '18', name: 'Palheta Limpador de Para-brisa', sku: 'SKU-18300', stock: 150, purchasePrice: 15.00, salePrice: 32.00, category: 'Acessórios', unit: 'UN', manufacturer: 'Dyna', vehicleModel: 'VW Gol G5', vehicleYear: 2013, condition: 'new', technicalSpecifications: '22 polegadas', description: 'Palheta do limpador de para-brisa, lado do motorista.' },
    { id: '19', name: 'Junta Homocinética', sku: 'SKU-18301', stock: 35, purchasePrice: 95.00, salePrice: 170.00, category: 'Transmissão', unit: 'UN', manufacturer: 'Spicer', vehicleModel: 'Chevrolet Celta', vehicleYear: 2014, condition: 'new', technicalSpecifications: '22x28 dentes', description: 'Junta homocinética para semi-eixo, lado da roda.' },
    { id: '20', name: 'Sonda Lambda (Sensor de Oxigênio)', sku: 'SKU-18302', stock: 25, purchasePrice: 150.00, salePrice: 280.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'Universal 4 fios', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Planar, 4 fios', description: 'Sonda lambda universal para sistemas de injeção eletrônica.' },
    { id: '21', name: 'Cabo de Vela', sku: 'SKU-18303', stock: 70, purchasePrice: 55.00, salePrice: 98.00, category: 'Motor', unit: 'JG', manufacturer: 'NGK', vehicleModel: 'Fiat Uno Fire', vehicleYear: 2008, condition: 'new', technicalSpecifications: 'Silicone 8mm', description: 'Jogo de cabos de vela de ignição em silicone.' },
    { id: '22', name: 'Bobina de Ignição', sku: 'SKU-18304', stock: 30, purchasePrice: 120.00, salePrice: 210.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'Magneti Marelli', vehicleModel: 'VW Gol G4', vehicleYear: 2007, condition: 'new', technicalSpecifications: '3 pinos', description: 'Bobina de ignição para motores VW AT 1.0.' },
    { id: '23', name: 'Atuador de Marcha Lenta', sku: 'SKU-18305', stock: 40, purchasePrice: 60.00, salePrice: 110.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'DS', vehicleModel: 'Ford Fiesta', vehicleYear: 2005, condition: 'new', technicalSpecifications: 'Passo a passo', description: 'Atuador de marcha lenta para injeção eletrônica.' },
    { id: '24', name: 'Bieleta da Barra Estabilizadora', sku: 'SKU-18306', stock: 90, purchasePrice: 25.00, salePrice: 49.00, category: 'Suspensão', unit: 'UN', manufacturer: 'Axios', vehicleModel: 'Peugeot 206', vehicleYear: 2008, condition: 'new', technicalSpecifications: '305mm', description: 'Bieleta da suspensão dianteira para Peugeot 206.' },
    { id: '25', name: 'Radiador', sku: 'SKU-18307', stock: 10, purchasePrice: 280.00, salePrice: 450.00, category: 'Arrefecimento', unit: 'UN', manufacturer: 'Valeo', vehicleModel: 'Chevrolet Onix', vehicleYear: 2017, condition: 'new', technicalSpecifications: 'Alumínio brasado', description: 'Radiador do sistema de arrefecimento do motor.' },
    { id: '26', name: 'Aditivo para Radiador', sku: 'SKU-18308', stock: 100, purchasePrice: 20.00, salePrice: 35.00, category: 'Lubrificantes', unit: 'L', manufacturer: 'Paraflu', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Concentrado, Rosa', description: 'Aditivo concentrado para sistema de arrefecimento.' },
    { id: '27', name: 'Cilindro de Roda Traseiro', sku: 'SKU-18309', stock: 60, purchasePrice: 30.00, salePrice: 55.00, category: 'Freios', unit: 'UN', manufacturer: 'Varga', vehicleModel: 'VW Fusca', vehicleYear: 1975, condition: 'new', technicalSpecifications: '19.05mm', description: 'Cilindro de roda para sistema de freio a tambor traseiro.' },
    { id: '28', name: 'Sensor de Temperatura da Água', sku: 'SKU-18310', stock: 85, purchasePrice: 22.00, salePrice: 45.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'MTE-Thomson', vehicleModel: 'Universal 2 fios', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Verde', description: 'Sensor de temperatura do líquido de arrefecimento (cebolinha).' },
    { id: '29', name: 'Coxim do Motor', sku: 'SKU-18311', stock: 30, purchasePrice: 70.00, salePrice: 130.00, category: 'Motor', unit: 'UN', manufacturer: 'Getoflex', vehicleModel: 'Honda Fit', vehicleYear: 2015, condition: 'new', technicalSpecifications: 'Lado direito, hidráulico', description: 'Coxim hidráulico do motor, lado direito.' },
    { id: '30', name: 'Fluido de Freio DOT 4', sku: 'SKU-18312', stock: 120, purchasePrice: 15.00, salePrice: 28.00, category: 'Lubrificantes', unit: '500ml', manufacturer: 'Bosch', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: '500ml', description: 'Fluido para sistemas de freio hidráulico DOT 4.' },
    { id: '31', name: 'Trizeta do Semi-eixo', sku: 'SKU-18313', stock: 40, purchasePrice: 45.00, salePrice: 85.00, category: 'Transmissão', unit: 'UN', manufacturer: 'VTO', vehicleModel: 'Renault Clio', vehicleYear: 2005, condition: 'new', technicalSpecifications: '21 dentes', description: 'Junta tripoide (trizeta) do semi-eixo.' },
    { id: '32', name: 'Mangueira do Filtro de Ar', sku: 'SKU-18314', stock: 50, purchasePrice: 35.00, salePrice: 69.90, category: 'Motor', unit: 'UN', manufacturer: 'Jahu', vehicleModel: 'Fiat Palio Fire', vehicleYear: 2004, condition: 'new', technicalSpecifications: 'Borracha', description: 'Mangueira de admissão de ar do motor.' },
    { id: '33', name: 'Interruptor de Pressão de Óleo', sku: 'SKU-18315', stock: 110, purchasePrice: 12.00, salePrice: 25.00, category: 'Elétrica', unit: 'UN', manufacturer: '3-RHO', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: '1 pino', description: 'Interruptor de pressão de óleo, "cebolinha" do óleo.' },
    { id: '34', name: 'Bico Injetor', sku: 'SKU-18316', stock: 25, purchasePrice: 130.00, salePrice: 240.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'VW Gol 1.0 8V', vehicleYear: 2005, condition: 'new', technicalSpecifications: 'Multiponto', description: 'Bico injetor de combustível para sistema multiponto.' },
    { id: '35', name: 'Sapata de Freio Traseiro', sku: 'SKU-18317', stock: 45, purchasePrice: 55.00, salePrice: 99.00, category: 'Freios', unit: 'JG', manufacturer: 'Cobreq', vehicleModel: 'Chevrolet Celta', vehicleYear: 2012, condition: 'new', technicalSpecifications: 'Com lona', description: 'Jogo de sapatas de freio para tambor traseiro.' },
    { id: '36', name: 'Kit Batente e Coifa do Amortecedor', sku: 'SKU-18318', stock: 70, purchasePrice: 28.00, salePrice: 50.00, category: 'Suspensão', unit: 'KT', manufacturer: 'Sampel', vehicleModel: 'Ford Ka', vehicleYear: 2019, condition: 'new', technicalSpecifications: 'Dianteiro', description: 'Kit reparo do amortecedor dianteiro, com batente e coifa.' },
    { id: '37', name: 'Sensor de Rotação', sku: 'SKU-18319', stock: 35, purchasePrice: 65.00, salePrice: 120.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'DPL', vehicleModel: 'Fiat Palio 1.0', vehicleYear: 2010, condition: 'new', technicalSpecifications: '3 fios', description: 'Sensor de rotação da roda fônica do motor.' },
    { id: '38', name: 'Cilindro Mestre de Freio', sku: 'SKU-18320', stock: 15, purchasePrice: 140.00, salePrice: 250.00, category: 'Freios', unit: 'UN', manufacturer: 'Controil', vehicleModel: 'VW Gol G3', vehicleYear: 2004, condition: 'new', technicalSpecifications: 'Duplo, sem ABS', description: 'Cilindro mestre para sistema de freio hidráulico.' },
    { id: '39', name: 'Válvula Termostática', sku: 'SKU-18321', stock: 50, purchasePrice: 40.00, salePrice: 79.00, category: 'Arrefecimento', unit: 'UN', manufacturer: 'Wahler', vehicleModel: 'Renault Logan', vehicleYear: 2015, condition: 'new', technicalSpecifications: '89°C', description: 'Válvula termostática com carcaça para motores Renault 1.6.' },
    { id: '40', name: 'Tensor da Correia Dentada', sku: 'SKU-18322', stock: 55, purchasePrice: 60.00, salePrice: 115.00, category: 'Motor', unit: 'UN', manufacturer: 'INA', vehicleModel: 'Chevrolet Corsa 1.4', vehicleYear: 2010, condition: 'new', technicalSpecifications: 'Automático', description: 'Tensor automático da correia dentada para motor GM.' },
    { id: '41', name: 'Bomba de Combustível', sku: 'SKU-18323', stock: 20, purchasePrice: 150.00, salePrice: 260.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'Universal (Refil)', vehicleYear: 2023, condition: 'new', technicalSpecifications: '3.0 bar', description: 'Refil da bomba de combustível elétrica para veículos flex.' },
    { id: '42', name: 'Pistão do Motor (com anéis)', sku: 'SKU-18324', stock: 10, purchasePrice: 200.00, salePrice: 350.00, category: 'Motor', unit: 'JG', manufacturer: 'Mahle', vehicleModel: 'Fiat Uno 1.0 Fire', vehicleYear: 2005, condition: 'new', technicalSpecifications: 'Standard (STD)', description: 'Jogo de pistões com anéis para retífica de motor.' },
    { id: '43', name: 'Bronzina de Biela', sku: 'SKU-18325', stock: 30, purchasePrice: 40.00, salePrice: 75.00, category: 'Motor', unit: 'JG', manufacturer: 'Metal Leve', vehicleModel: 'VW AP 1.8', vehicleYear: 1995, condition: 'new', technicalSpecifications: '0.25mm', description: 'Jogo de bronzinas de biela para motor VW AP.' },
    { id: '44', name: 'Retentor do Virabrequim', sku: 'SKU-18326', stock: 80, purchasePrice: 18.00, salePrice: 35.00, category: 'Motor', unit: 'UN', manufacturer: 'Sabó', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Traseiro', description: 'Retentor do virabrequim para vedação de óleo.' },
    { id: '45', name: 'Cebolão do Radiador', sku: 'SKU-18327', stock: 70, purchasePrice: 25.00, salePrice: 48.00, category: 'Arrefecimento', unit: 'UN', manufacturer: 'Igual', vehicleModel: 'VW Gol Quadrado', vehicleYear: 1994, condition: 'new', technicalSpecifications: '92-87°C', description: 'Interruptor térmico do ventilador do radiador.' },
    { id: '46', name: 'Sensor MAP', sku: 'SKU-18328', stock: 30, purchasePrice: 80.00, salePrice: 150.00, category: 'Injeção Eletrônica', unit: 'UN', manufacturer: 'Bosch', vehicleModel: 'Vários Fiat', vehicleYear: 2010, condition: 'new', technicalSpecifications: '4 pinos', description: 'Sensor de pressão absoluta do coletor de admissão.' },
    { id: '47', name: 'Óleo de Câmbio 75W80', sku: 'SKU-18329', stock: 40, purchasePrice: 30.00, salePrice: 55.00, category: 'Lubrificantes', unit: 'L', manufacturer: 'Tutor', vehicleModel: 'Vários Fiat/Peugeot', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'API GL-4', description: 'Óleo para transmissão manual.' },
    { id: '48', name: 'Relé da Bomba de Combustível', sku: 'SKU-18330', stock: 90, purchasePrice: 15.00, salePrice: 30.00, category: 'Elétrica', unit: 'UN', manufacturer: 'DNI', vehicleModel: 'Universal 4 pinos', vehicleYear: 2023, condition: 'new', technicalSpecifications: '40A', description: 'Relé auxiliar universal de 4 pinos.' },
    { id: '49', name: 'Escapamento Traseiro', sku: 'SKU-18331', stock: 12, purchasePrice: 120.00, salePrice: 220.00, category: 'Escapamento', unit: 'UN', manufacturer: 'Tuper', vehicleModel: 'Fiat Uno', vehicleYear: 2011, condition: 'new', technicalSpecifications: 'Silencioso', description: 'Silencioso traseiro do sistema de escapamento.' },
    { id: '50', name: 'Coifa da Homocinética', sku: 'SKU-18332', stock: 100, purchasePrice: 20.00, salePrice: 39.90, category: 'Transmissão', unit: 'KT', manufacturer: 'Spicer', vehicleModel: 'Universal', vehicleYear: 2023, condition: 'new', technicalSpecifications: 'Com graxa e abraçadeiras', description: 'Kit de coifa da junta homocinética, lado roda.' },
];


const mockCustomers: Customer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phoneNumber: '11999998888', address: 'Rua A, 123', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phoneNumber: '21988887777', address: 'Av B, 456', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'default', firstName: 'Consumidor', lastName: 'Final', email: 'consumidor@final.com', phoneNumber: '', address: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockEmployees: Employee[] = [
  { id: '1', employeeCode: 'FUNC-001', firstName: 'Carlos', lastName: 'Pereira', email: 'carlos.p@email.com', phoneNumber: '31977776666', role: 'Vendedor', address: 'Rua das Flores, 123', cpf: '111.222.333-44', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', employeeCode: 'FUNC-002', firstName: 'Ana', lastName: 'Oliveira', email: 'ana.o@email.com', phoneNumber: '41966665555', role: 'Gerente', address: 'Avenida do Sol, 456', cpf: '555.666.777-88', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
  deleteCustomer: (customerId: string) => void;
  updateEmployee: (updatedEmployee: Employee) => void;
  addEmployee: (newEmployee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'employeeCode'>) => void;
  deleteEmployee: (employeeId: string) => void;
  updatePart: (updatedPart: Part) => void;
  addPart: (newPart: Omit<Part, 'id' | 'sku'>) => void;
  deletePart: (partId: string) => void;
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
        if (!storedParts || JSON.parse(storedParts).length < 5) { // Simple check to see if mock data is old
            setParts(mockParts);
            setCustomers(mockCustomers);
            setEmployees(mockEmployees);
            setSales(mockSales);
            setConfig(mockConfig);
        }
        setIsLoading(false);
    }
  }, [setParts, setCustomers, setEmployees, setSales, setConfig]);

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

  const deletePart = (partId: string) => {
    setParts(parts.filter(p => p.id !== partId));
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
    deleteCustomer,
    updateEmployee,
    addEmployee,
    deleteEmployee,
    updatePart,
    addPart,
    deletePart,
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
