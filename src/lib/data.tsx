
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
    { id: '11', name: 'Blusa de Alça de Seda', sku: 'SKU-11223', stock: 65, purchasePrice: 55.00, salePrice: 119.90, category: 'Blusas', size: 'P', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Blusa de alça fina em seda, elegante e versátil.' },
    { id: '12', name: 'Bermuda Cargo Masculina', sku: 'SKU-11224', stock: 80, purchasePrice: 60.00, salePrice: 129.90, category: 'Bermudas', size: '40', color: 'Verde Militar', gender: 'Masculino', supplierId: '2', description: 'Bermuda cargo com bolsos laterais, tecido resistente.' },
    { id: '13', name: 'Macacão Pantalona', sku: 'SKU-11225', stock: 40, purchasePrice: 120.00, salePrice: 249.90, category: 'Macacões', size: 'M', color: 'Vinho', gender: 'Feminino', supplierId: '1', description: 'Macacão pantalona de viscose, sofisticado e confortável.' },
    { id: '14', name: 'Sapato Oxford de Couro', sku: 'SKU-11226', stock: 55, purchasePrice: 180.00, salePrice: 349.90, category: 'Calçados', size: '41', color: 'Marrom', gender: 'Masculino', supplierId: '2', description: 'Sapato Oxford clássico em couro legítimo.' },
    { id: '15', name: 'Blazer Alongado Feminino', sku: 'SKU-11227', stock: 35, purchasePrice: 130.00, salePrice: 279.90, category: 'Blazers', size: 'G', color: 'Branco', gender: 'Feminino', supplierId: '1', description: 'Blazer alongado com corte de alfaiataria.' },
    { id: '16', name: 'Camisa Polo Piquet', sku: 'SKU-11228', stock: 150, purchasePrice: 45.00, salePrice: 99.90, category: 'Camisas Polo', size: 'M', color: 'Azul Marinho', gender: 'Masculino', supplierId: '2', description: 'Camisa polo em malha piquet, um clássico do guarda-roupa.' },
    { id: '17', name: 'Short Jeans Destroyed', sku: 'SKU-11229', stock: 90, purchasePrice: 50.00, salePrice: 109.90, category: 'Shorts', size: '38', color: 'Jeans Claro', gender: 'Feminino', supplierId: '1', description: 'Short jeans com detalhes destroyed e cintura alta.' },
    { id: '18', name: 'Suéter de Lã Gola Alta', sku: 'SKU-11230', stock: 60, purchasePrice: 95.00, salePrice: 199.90, category: 'Malhas', size: 'P', color: 'Bege', gender: 'Unissex', supplierId: '2', description: 'Suéter de lã com gola alta, perfeito para o inverno.' },
    { id: '19', name: 'Sandália de Salto Bloco', sku: 'SKU-11231', stock: 70, purchasePrice: 75.00, salePrice: 159.90, category: 'Calçados', size: '37', color: 'Nude', gender: 'Feminino', supplierId: '1', description: 'Sandália confortável com salto bloco e tira no tornozelo.' },
    { id: '20', name: 'Cinto de Couro Masculino', sku: 'SKU-11232', stock: 110, purchasePrice: 30.00, salePrice: 69.90, category: 'Acessórios', size: 'Único', color: 'Preto', gender: 'Masculino', supplierId: '2', description: 'Cinto social de couro com fivela de metal.' },
    { id: '21', name: 'Cardigan de Tricô', sku: 'SKU-21001', stock: 55, purchasePrice: 80.00, salePrice: 169.90, category: 'Malhas', size: 'M', color: 'Cinza', gender: 'Feminino', supplierId: '1', description: 'Cardigan alongado de tricô, peça coringa para meia-estação.' },
    { id: '22', name: 'Calça de Alfaiataria', sku: 'SKU-21002', stock: 45, purchasePrice: 100.00, salePrice: 219.90, category: 'Calças', size: '38', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Calça de alfaiataria com corte reto e cintura alta.' },
    { id: '23', name: 'Camiseta Estampada', sku: 'SKU-21003', stock: 200, purchasePrice: 30.00, salePrice: 69.90, category: 'Camisetas', size: 'G', color: 'Estampada', gender: 'Masculino', supplierId: '2', description: 'Camiseta de algodão com estampa de banda de rock.' },
    { id: '24', name: 'Bota Coturno Tratorada', sku: 'SKU-21004', stock: 60, purchasePrice: 160.00, salePrice: 329.90, category: 'Calçados', size: '39', color: 'Preta', gender: 'Unissex', description: 'Bota estilo coturno com solado tratorado.' },
    { id: '25', name: 'Chapéu Fedora de Lã', sku: 'SKU-21005', stock: 70, purchasePrice: 45.00, salePrice: 99.90, category: 'Acessórios', size: 'Único', color: 'Marrom', gender: 'Unissex', supplierId: '2', description: 'Chapéu modelo fedora em feltro de lã.' },
    { id: '26', name: 'Vestido Tubinho Preto', sku: 'SKU-21006', stock: 80, purchasePrice: 70.00, salePrice: 149.90, category: 'Vestidos', size: 'P', color: 'Preto', gender: 'Feminino', supplierId: '1', description: 'O clássico "pretinho básico", vestido tubinho em malha encorpada.' },
    { id: '27', name: 'Calça Chino Masculina', sku: 'SKU-21007', stock: 95, purchasePrice: 65.00, salePrice: 139.90, category: 'Calças', size: '42', color: 'Bege', gender: 'Masculino', supplierId: '2', description: 'Calça chino de sarja, confortável e elegante.' },
    { id: '28', name: 'Body de Renda', sku: 'SKU-21008', stock: 50, purchasePrice: 40.00, salePrice: 89.90, category: 'Lingerie', size: 'M', color: 'Vermelho', gender: 'Feminino', supplierId: '1', description: 'Body sensual todo em renda com transparência.' },
    { id: '29', name: 'Jaqueta Jeans Oversized', sku: 'SKU-21009', stock: 75, purchasePrice: 90.00, salePrice: 189.90, category: 'Jaquetas', size: 'G', color: 'Jeans Azul', gender: 'Unissex', supplierId: '2', description: 'Jaqueta jeans com modelagem oversized, estilo anos 90.' },
    { id: '30', name: 'Mocassim de Camurça', sku: 'SKU-21010', stock: 65, purchasePrice: 110.00, salePrice: 229.90, category: 'Calçados', size: '40', color: 'Azul', gender: 'Masculino', supplierId: '2', description: 'Mocassim de camurça com detalhe de laço.' },
    { id: '31', name: 'Regata Canelada', sku: 'SKU-31001', stock: 150, purchasePrice: 20.00, salePrice: 39.90, category: 'Blusas', size: 'M', color: 'Branca', gender: 'Feminino', supplierId: '1', description: 'Regata básica em malha canelada, essencial.' },
    { id: '32', name: 'Bermuda de Moletom', sku: 'SKU-31002', stock: 100, purchasePrice: 40.00, salePrice: 89.90, category: 'Bermudas', size: 'G', color: 'Preta', gender: 'Masculino', supplierId: '2', description: 'Bermuda de moletom para conforto máximo.' },
    { id: '33', name: 'Saia Jeans com Botões', sku: 'SKU-31003', stock: 60, purchasePrice: 55.00, salePrice: 119.90, category: 'Saias', size: '36', color: 'Jeans Escuro', gender: 'Feminino', supplierId: '1', description: 'Saia jeans curta com abotoamento frontal.' },
    { id: '34', name: 'Cachecol Xadrez', sku: 'SKU-31004', stock: 80, purchasePrice: 25.00, salePrice: 59.90, category: 'Acessórios', size: 'Único', color: 'Xadrez Vermelho', gender: 'Unissex', supplierId: '2', description: 'Cachecol de lã macia com estampa xadrez clássica.' },
    { id: '35', name: 'Tênis de Corrida', sku: 'SKU-31005', stock: 70, purchasePrice: 200.00, salePrice: 399.90, category: 'Calçados', size: '42', color: 'Preto e Verde', gender: 'Unissex', description: 'Tênis com amortecimento para corrida.' },
    { id: '36', name: 'Camisa de Linho', sku: 'SKU-31006', stock: 90, purchasePrice: 80.00, salePrice: 179.90, category: 'Camisas', size: 'M', color: 'Branca', gender: 'Masculino', supplierId: '2', description: 'Camisa de linho, leve e perfeita para o verão.' },
    { id: '37', name: 'Vestido Longo Estampado', sku: 'SKU-31007', stock: 40, purchasePrice: 140.00, salePrice: 299.90, category: 'Vestidos', size: 'G', color: 'Estampa Tropical', gender: 'Feminino', supplierId: '1', description: 'Vestido longo com fenda lateral e estampa vibrante.' },
    { id: '38', name: 'Calça Jogger', sku: 'SKU-31008', stock: 110, purchasePrice: 70.00, salePrice: 149.90, category: 'Calças', size: 'P', color: 'Cinza Mescla', gender: 'Unissex', supplierId: '2', description: 'Calça jogger de moletom com punho na barra.' },
    { id: '39', name: 'Mule de Couro', sku: 'SKU-31009', stock: 55, purchasePrice: 90.00, salePrice: 189.90, category: 'Calçados', size: '38', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Mule de couro com detalhe de fivela.' },
    { id: '40', name: 'Boné de Beisebol', sku: 'SKU-31010', stock: 200, purchasePrice: 15.00, salePrice: 39.90, category: 'Acessórios', size: 'Único', color: 'Azul', gender: 'Unissex', supplierId: '2', description: 'Boné básico de algodão com logo bordado.' },
    { id: '41', name: 'Camisa Henley Manga Longa', sku: 'SKU-41001', stock: 85, purchasePrice: 50.00, salePrice: 109.90, category: 'Camisas', size: 'G', color: 'Vinho', gender: 'Masculino', supplierId: '2', description: 'Camisa Henley em malha de algodão com botões.' },
    { id: '42', name: 'Calça Pantacourt', sku: 'SKU-41002', stock: 60, purchasePrice: 65.00, salePrice: 139.90, category: 'Calças', size: 'M', color: 'Mostarda', gender: 'Feminino', supplierId: '1', description: 'Calça pantacourt em tecido leve e com caimento solto.' },
    { id: '43', name: 'Vestido de Tricô', sku: 'SKU-41003', stock: 45, purchasePrice: 110.00, salePrice: 229.90, category: 'Vestidos', size: 'P', color: 'Off-white', gender: 'Feminino', supplierId: '1', description: 'Vestido curto de tricô com mangas longas.' },
    { id: '44', name: 'Chinelo de Couro', sku: 'SKU-41004', stock: 120, purchasePrice: 40.00, salePrice: 89.90, category: 'Calçados', size: '41', color: 'Café', gender: 'Masculino', supplierId: '2', description: 'Chinelo de couro com tiras largas.' },
    { id: '45', name: 'Moletom Cropped', sku: 'SKU-41005', stock: 70, purchasePrice: 60.00, salePrice: 129.90, category: 'Moletons', size: 'M', color: 'Rosa', gender: 'Feminino', supplierId: '1', description: 'Moletom com comprimento cropped e sem capuz.' },
    { id: '46', name: 'Carteira de Couro', sku: 'SKU-41006', stock: 150, purchasePrice: 35.00, salePrice: 79.90, category: 'Acessórios', size: 'Único', color: 'Preta', gender: 'Masculino', supplierId: '2', description: 'Carteira de couro com vários compartimentos.' },
    { id: '47', name: 'Biquíni Cortininha', sku: 'SKU-41007', stock: 80, purchasePrice: 45.00, salePrice: 99.90, category: 'Moda Praia', size: 'P', color: 'Laranja', gender: 'Feminino', supplierId: '1', description: 'Biquíni modelo cortininha com estampa de folhagem.' },
    { id: '48', name: 'Sunga Boxer', sku: 'SKU-41008', stock: 70, purchasePrice: 30.00, salePrice: 69.90, category: 'Moda Praia', size: 'M', color: 'Azul Marinho', gender: 'Masculino', supplierId: '2', description: 'Sunga modelo boxer com listras laterais.' },
    { id: '49', name: 'Saia Lápis', sku: 'SKU-41009', stock: 50, purchasePrice: 60.00, salePrice: 129.90, category: 'Saias', size: 'M', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Saia lápis de cintura alta, ideal para o escritório.' },
    { id: '50', name: 'Jaqueta Corta-vento', sku: 'SKU-41010', stock: 100, purchasePrice: 75.00, salePrice: 159.90, category: 'Jaquetas', size: 'G', color: 'Color Block', gender: 'Unissex', description: 'Jaqueta corta-vento leve e compacta.' },
    { id: '51', name: 'T-shirt Gola V', sku: 'SKU-51001', stock: 180, purchasePrice: 22.00, salePrice: 44.90, category: 'Camisetas', size: 'P', color: 'Preta', gender: 'Unissex', supplierId: '1', description: 'Camiseta básica com gola V em algodão.' },
    { id: '52', name: 'Calça de Sarja Skinny', sku: 'SKU-51002', stock: 80, purchasePrice: 75.00, salePrice: 159.90, category: 'Calças', size: '40', color: 'Caramelo', gender: 'Masculino', supplierId: '2', description: 'Calça de sarja com modelagem skinny e elastano.' },
    { id: '53', name: 'Blusa Ciganinha', sku: 'SKU-51003', stock: 65, purchasePrice: 45.00, salePrice: 99.90, category: 'Blusas', size: 'M', color: 'Branca', gender: 'Feminino', supplierId: '1', description: 'Blusa ombro a ombro (ciganinha) com detalhes em laise.' },
    { id: '54', name: 'Tênis Slip-on', sku: 'SKU-51004', stock: 90, purchasePrice: 60.00, salePrice: 129.90, category: 'Calçados', size: '38', color: 'Preto', gender: 'Unissex', supplierId: '1', description: 'Tênis modelo slip-on, prático para calçar.' },
    { id: '55', name: 'Relógio Digital', sku: 'SKU-51005', stock: 100, purchasePrice: 50.00, salePrice: 119.90, category: 'Acessórios', size: 'Único', color: 'Prata', gender: 'Unissex', supplierId: '2', description: 'Relógio digital com pulseira de aço inoxidável.' },
    { id: '56', name: 'Pijama de Algodão', sku: 'SKU-51006', stock: 75, purchasePrice: 55.00, salePrice: 119.90, category: 'Pijamas', size: 'G', color: 'Azul Claro', gender: 'Masculino', supplierId: '2', description: 'Pijama de manga curta em algodão macio.' },
    { id: '57', name: 'Camisola de Cetim', sku: 'SKU-51007', stock: 60, purchasePrice: 45.00, salePrice: 99.90, category: 'Pijamas', size: 'P', color: 'Champagne', gender: 'Feminino', supplierId: '1', description: 'Camisola curta de cetim com detalhes em renda.' },
    { id: '58', name: 'Gorro de Lã', sku: 'SKU-51008', stock: 120, purchasePrice: 20.00, salePrice: 49.90, category: 'Acessórios', size: 'Único', color: 'Cinza', gender: 'Unissex', supplierId: '2', description: 'Gorro de lã canelado, essencial para o frio.' },
    { id: '59', name: 'Meia Cano Alto', sku: 'SKU-51009', stock: 250, purchasePrice: 10.00, salePrice: 24.90, category: 'Acessórios', size: 'Único', color: 'Branca', gender: 'Unissex', supplierId: '1', description: 'Pacote com 3 pares de meias esportivas de cano alto.' },
    { id: '60', name: 'Vestido Chemise', sku: 'SKU-51010', stock: 50, purchasePrice: 85.00, salePrice: 179.90, category: 'Vestidos', size: 'M', color: 'Listrado', gender: 'Feminino', supplierId: '1', description: 'Vestido modelo camisa (chemise) com faixa para amarração.' },
    { id: '61', name: 'Camisa Floral Masculina', sku: 'SKU-61001', stock: 70, purchasePrice: 60.00, salePrice: 129.90, category: 'Camisas', size: 'M', color: 'Estampado', gender: 'Masculino', supplierId: '2', description: 'Camisa de manga curta com estampa floral.' },
    { id: '62', name: 'Calça Flare', sku: 'SKU-61002', stock: 65, purchasePrice: 80.00, salePrice: 169.90, category: 'Calças', size: '40', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Calça jeans com modelagem flare (boca de sino).' },
    { id: '63', name: 'Blusa de Gola Alta', sku: 'SKU-61003', stock: 90, purchasePrice: 40.00, salePrice: 89.90, category: 'Blusas', size: 'P', color: 'Marrom', gender: 'Feminino', supplierId: '1', description: 'Blusa de malha canelada com gola alta.' },
    { id: '64', name: 'Bota Chelsea de Couro', sku: 'SKU-61004', stock: 50, purchasePrice: 220.00, salePrice: 449.90, category: 'Calçados', size: '42', color: 'Preta', gender: 'Masculino', supplierId: '2', description: 'Bota Chelsea clássica em couro com elástico lateral.' },
    { id: '65', name: 'Saia Midi de Cetim', sku: 'SKU-61005', stock: 40, purchasePrice: 70.00, salePrice: 149.90, category: 'Saias', size: 'G', color: 'Verde Esmeralda', gender: 'Feminino', supplierId: '1', description: 'Saia midi em cetim com caimento enviesado.' },
    { id: '66', name: 'Colete de Nylon', sku: 'SKU-61006', stock: 60, purchasePrice: 90.00, salePrice: 189.90, category: 'Coletes', size: 'M', color: 'Azul', gender: 'Masculino', supplierId: '2', description: 'Colete acolchoado de nylon, ideal para sobreposição.' },
    { id: '67', name: 'Maiô Engana Mamãe', sku: 'SKU-61007', stock: 55, purchasePrice: 75.00, salePrice: 159.90, category: 'Moda Praia', size: 'M', color: 'Preto', gender: 'Feminino', supplierId: '1', description: 'Maiô com recortes laterais, modelo engana mamãe.' },
    { id: '68', name: 'Pulseira de Couro Trançado', sku: 'SKU-61008', stock: 130, purchasePrice: 15.00, salePrice: 39.90, category: 'Acessórios', size: 'Único', color: 'Marrom', gender: 'Masculino', supplierId: '2', description: 'Pulseira de couro trançado com fecho magnético.' },
    { id: '69', name: 'Cropped de Alcinha', sku: 'SKU-61009', stock: 110, purchasePrice: 25.00, salePrice: 49.90, category: 'Blusas', size: 'P', color: 'Amarelo', gender: 'Feminino', supplierId: '1', description: 'Top cropped de alcinha em tecido leve.' },
    { id: '70', name: 'Calça de Moletom', sku: 'SKU-61010', stock: 100, purchasePrice: 60.00, salePrice: 129.90, category: 'Calças', size: 'G', color: 'Cinza', gender: 'Masculino', supplierId: '2', description: 'Calça de moletom básica para o dia a dia.' },
    { id: '71', name: 'Sandália Rasteira', sku: 'SKU-71001', stock: 120, purchasePrice: 35.00, salePrice: 79.90, category: 'Calçados', size: '36', color: 'Dourada', gender: 'Feminino', supplierId: '1', description: 'Sandália rasteira com tiras finas e aplicação de pedras.' },
    { id: '72', name: 'Camisa Xadrez Flanela', sku: 'SKU-71002', stock: 80, purchasePrice: 75.00, salePrice: 159.90, category: 'Camisas', size: 'G', color: 'Xadrez Verde', gender: 'Masculino', supplierId: '2', description: 'Camisa de flanela com estampa xadrez, estilo lenhador.' },
    { id: '73', name: 'Legging Esportiva', sku: 'SKU-71003', stock: 95, purchasePrice: 50.00, salePrice: 109.90, category: 'Fitness', size: 'M', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Calça legging com cós alto para atividades físicas.' },
    { id: '74', name: 'Top Esportivo', sku: 'SKU-71004', stock: 90, purchasePrice: 35.00, salePrice: 79.90, category: 'Fitness', size: 'M', color: 'Preto', gender: 'Feminino', supplierId: '1', description: 'Top com alta sustentação para treinos.' },
    { id: '75', name: 'Short de Corrida', sku: 'SKU-71005', stock: 85, purchasePrice: 30.00, salePrice: 69.90, category: 'Fitness', size: 'G', color: 'Azul', gender: 'Masculino', supplierId: '2', description: 'Short de tactel com sunga interna para corrida.' },
    { id: '76', name: 'Blazer Masculino Slim', sku: 'SKU-71006', stock: 40, purchasePrice: 180.00, salePrice: 359.90, category: 'Blazers', size: 'M', color: 'Cinza Chumbo', gender: 'Masculino', supplierId: '2', description: 'Blazer masculino em lã fria com corte slim.' },
    { id: '77', name: 'Macaquinho Ciganinha', sku: 'SKU-71007', stock: 55, purchasePrice: 65.00, salePrice: 139.90, category: 'Macacões', size: 'P', color: 'Estampa de Poá', gender: 'Feminino', supplierId: '1', description: 'Macaquinho curto com elástico na cintura e ombro a ombro.' },
    { id: '78', name: 'Gravata de Seda', sku: 'SKU-71008', stock: 100, purchasePrice: 40.00, salePrice: 89.90, category: 'Acessórios', size: 'Único', color: 'Azul Royal', gender: 'Masculino', supplierId: '2', description: 'Gravata de seda com textura discreta.' },
    { id: '79', name: 'Brinco de Argola', sku: 'SKU-71009', stock: 150, purchasePrice: 15.00, salePrice: 34.90, category: 'Acessórios', size: 'Médio', color: 'Prata', gender: 'Feminino', supplierId: '1', description: 'Brinco de argola clássico em prata 925.' },
    { id: '80', name: 'Alpargata de Lona', sku: 'SKU-71010', stock: 90, purchasePrice: 50.00, salePrice: 109.90, category: 'Calçados', size: '40', color: 'Cru', gender: 'Unissex', supplierId: '2', description: 'Alpargata de lona com solado de corda.' },
    { id: '81', name: 'Camiseta Longline', sku: 'SKU-81001', stock: 100, purchasePrice: 35.00, salePrice: 79.90, category: 'Camisetas', size: 'M', color: 'Preta', gender: 'Masculino', supplierId: '2', description: 'Camiseta com comprimento alongado e barra arredondada.' },
    { id: '82', name: 'Calça Mom Jeans', sku: 'SKU-81002', stock: 85, purchasePrice: 80.00, salePrice: 179.90, category: 'Calças', size: '38', color: 'Jeans Médio', gender: 'Feminino', supplierId: '1', description: 'Calça jeans com modelagem "mom", cintura alta e pernas retas.' },
    { id: '83', name: 'Vestido Curto de Paetê', sku: 'SKU-81003', stock: 30, purchasePrice: 150.00, salePrice: 329.90, category: 'Vestidos', size: 'P', color: 'Dourado', gender: 'Feminino', supplierId: '1', description: 'Vestido de festa curto, todo bordado em paetês.' },
    { id: '84', name: 'Sobretudo de Lã', sku: 'SKU-81004', stock: 25, purchasePrice: 250.00, salePrice: 499.90, category: 'Casacos', size: 'G', color: 'Preto', gender: 'Masculino', supplierId: '2', description: 'Sobretudo clássico em lã batida, comprimento 3/4.' },
    { id: '85', name: 'Scarpin de Salto Fino', sku: 'SKU-81005', stock: 60, purchasePrice: 90.00, salePrice: 199.90, category: 'Calçados', size: '37', color: 'Vermelho', gender: 'Feminino', supplierId: '1', description: 'Sapato scarpin em verniz com salto fino de 10cm.' },
    { id: '86', name: 'Colar de Corrente Grossa', sku: 'SKU-81006', stock: 110, purchasePrice: 30.00, salePrice: 69.90, category: 'Acessórios', size: 'Único', color: 'Dourado', gender: 'Feminino', supplierId: '1', description: 'Colar de elos grandes, estilo corrente.' },
    { id: '87', name: 'Regata de Academia', sku: 'SKU-81007', stock: 120, purchasePrice: 25.00, salePrice: 59.90, category: 'Fitness', size: 'M', color: 'Cinza', gender: 'Masculino', supplierId: '2', description: 'Regata cavada para treino, em malha dry-fit.' },
    { id: '88', name: 'Saia Longa com Fenda', sku: 'SKU-81008', stock: 45, purchasePrice: 70.00, salePrice: 149.90, category: 'Saias', size: 'M', color: 'Estampada', gender: 'Feminino', supplierId: '1', description: 'Saia longa com fenda frontal e estampa de folhagens.' },
    { id: '89', name: 'Suspensório Ajustável', sku: 'SKU-81009', stock: 80, purchasePrice: 20.00, salePrice: 49.90, category: 'Acessórios', size: 'Único', color: 'Preto', gender: 'Masculino', supplierId: '2', description: 'Suspensório com elástico e clipes de metal.' },
    { id: '90', name: 'Parka com Capuz', sku: 'SKU-81010', stock: 50, purchasePrice: 140.00, salePrice: 289.90, category: 'Jaquetas', size: 'G', color: 'Verde Oliva', gender: 'Unissex', description: 'Parka de sarja com capuz e ajuste na cintura.' },
    { id: '91', name: 'Pochete de Couro', sku: 'SKU-91001', stock: 70, purchasePrice: 45.00, salePrice: 99.90, category: 'Acessórios', size: 'Único', color: 'Preta', gender: 'Unissex', supplierId: '1', description: 'Pochete moderna em couro sintético.' },
    { id: '92', name: 'Camisa de Viscose Estampada', sku: 'SKU-91002', stock: 80, purchasePrice: 55.00, salePrice: 119.90, category: 'Camisas', size: 'P', color: 'Estampa Abstrata', gender: 'Feminino', supplierId: '1', description: 'Camisa de viscose com toque macio e estampa moderna.' },
    { id: '93', name: 'Calça de Linho', sku: 'SKU-91003', stock: 60, purchasePrice: 90.00, salePrice: 189.90, category: 'Calças', size: '42', color: 'Areia', gender: 'Masculino', supplierId: '2', description: 'Calça de linho com corte reto, ideal para climas quentes.' },
    { id: '94', name: 'Chapéu de Praia', sku: 'SKU-91004', stock: 90, purchasePrice: 30.00, salePrice: 69.90, category: 'Acessórios', size: 'Único', color: 'Palha', gender: 'Feminino', supplierId: '1', description: 'Chapéu de palha com abas largas.' },
    { id: '95', name: 'Sapatilha de Bico Fino', sku: 'SKU-91005', stock: 100, purchasePrice: 50.00, salePrice: 109.90, category: 'Calçados', size: '37', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Sapatilha clássica de bico fino em verniz.' },
    { id: '96', name: 'Blusa de Tule', sku: 'SKU-91006', stock: 75, purchasePrice: 35.00, salePrice: 79.90, category: 'Blusas', size: 'M', color: 'Preta com Poá', gender: 'Feminino', supplierId: '1', description: 'Blusa de tule transparente com estampa de poá.' },
    { id: '97', name: 'Jaqueta Puffer', sku: 'SKU-91007', stock: 45, purchasePrice: 160.00, salePrice: 329.90, category: 'Jaquetas', size: 'G', color: 'Vermelha', gender: 'Unissex', supplierId: '2', description: 'Jaqueta acolchoada (puffer) com capuz removível.' },
    { id: '98', name: 'Calça de Couro Fake', sku: 'SKU-91008', stock: 50, purchasePrice: 85.00, salePrice: 179.90, category: 'Calças', size: '38', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Calça skinny em material sintético que imita couro.' },
    { id: '99', name: 'Bermuda de Alfaiataria', sku: 'SKU-91009', stock: 65, purchasePrice: 60.00, salePrice: 129.90, category: 'Bermudas', size: 'P', color: 'Branca', gender: 'Feminino', supplierId: '1', description: 'Bermuda com corte de alfaiataria e cintura alta.' },
    { id: '100', name: 'Abotoaduras de Prata', sku: 'SKU-91010', stock: 80, purchasePrice: 70.00, salePrice: 149.90, category: 'Acessórios', size: 'Único', color: 'Prata', gender: 'Masculino', supplierId: '2', description: 'Par de abotoaduras quadradas em prata.' },
    { id: '101', name: 'Trench Coat Clássico', sku: 'SKU-10101', stock: 35, purchasePrice: 220.00, salePrice: 449.90, category: 'Casacos', size: 'M', color: 'Bege', gender: 'Unissex', supplierId: '1', description: 'Trench coat clássico com cinto e abotoamento duplo.' },
    { id: '102', name: 'Vestido Envelope', sku: 'SKU-10102', stock: 45, purchasePrice: 95.00, salePrice: 199.90, category: 'Vestidos', size: 'G', color: 'Azul Marinho', gender: 'Feminino', supplierId: '1', description: 'Vestido modelo envelope (wrap dress) em malha.' },
    { id: '103', name: 'Camiseta Raglan', sku: 'SKU-10103', stock: 110, purchasePrice: 30.00, salePrice: 69.90, category: 'Camisetas', size: 'M', color: 'Branco e Preto', gender: 'Masculino', supplierId: '2', description: 'Camiseta com mangas raglan em cor contrastante.' },
    { id: '104', name: 'Calça de Moletom Skinny', sku: 'SKU-10104', stock: 80, purchasePrice: 70.00, salePrice: 149.90, category: 'Calças', size: 'P', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Calça de moletom com modelagem skinny, urbana e confortável.' },
    { id: '105', name: 'Bolsa Mochila de Nylon', sku: 'SKU-10105', stock: 60, purchasePrice: 80.00, salePrice: 169.90, category: 'Acessórios', size: 'Único', color: 'Preta', gender: 'Feminino', supplierId: '1', description: 'Mochila compacta de nylon, prática para o dia a dia.' },
    { id: '106', name: 'Sapato de Salto Anabela', sku: 'SKU-10106', stock: 70, purchasePrice: 85.00, salePrice: 179.90, category: 'Calçados', size: '38', color: 'Caramelo', gender: 'Feminino', supplierId: '1', description: 'Sandália com salto anabela de corda.' },
    { id: '107', name: 'Camisa Gola Padre', sku: 'SKU-10107', stock: 75, purchasePrice: 65.00, salePrice: 139.90, category: 'Camisas', size: 'G', color: 'Branca', gender: 'Masculino', supplierId: '2', description: 'Camisa social sem colarinho, modelo gola padre.' },
    { id: '108', name: 'Short Saia', sku: 'SKU-10108', stock: 85, purchasePrice: 50.00, salePrice: 109.90, category: 'Shorts', size: 'M', color: 'Preto', gender: 'Feminino', supplierId: '1', description: 'Short saia com transpasse na frente.' },
    { id: '109', name: 'Lenço de Seda', sku: 'SKU-10109', stock: 120, purchasePrice: 25.00, salePrice: 59.90, category: 'Acessórios', size: 'Único', color: 'Estampa Geométrica', gender: 'Feminino', supplierId: '1', description: 'Lenço quadrado de seda para usar no pescoço ou cabelo.' },
    { id: '110', name: 'Tênis Plataforma', sku: 'SKU-10110', stock: 65, purchasePrice: 100.00, salePrice: 219.90, category: 'Calçados', size: '37', color: 'Branco', gender: 'Feminino', supplierId: '1', description: 'Tênis casual com solado plataforma de 4cm.' },
];


const mockCustomers: Customer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phoneNumber: '11999998888', address: 'Rua A, 123, São Paulo - SP', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phoneNumber: '21988887777', address: 'Av B, 456, Rio de Janeiro - RJ', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'default', firstName: 'Consumidor', lastName: 'Final', email: 'consumidor@final.com', phoneNumber: '', address: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockEmployees: Employee[] = [
  { id: '1', employeeCode: 'FUNC-001', firstName: 'Carlos', lastName: 'Pereira', email: 'carlos.p@email.com', phoneNumber: '31977776666', role: 'Vendedor', address: 'Rua das Flores, 123, Belo Horizonte - MG', cpf: '111.222.333-44', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', employeeCode: 'FUNC-002', firstName: 'Ana', lastName: 'Oliveira', email: 'ana.o@email.com', phoneNumber: '41966665555', role: 'Gerente', address: 'Avenida do Sol, 456, Curitiba - PR', cpf: '555.666.777-88', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', employeeCode: 'FUNC-003', firstName: 'Sofia', lastName: 'Alves', email: 'sofia.a@email.com', phoneNumber: '51955554444', role: 'Caixa', address: 'Rua das Gaivotas, 789, Porto Alegre - RS', cpf: '999.888.777-66', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Distribuidora Têxtil Brasil', cnpj: '12.345.678/0001-00', contactName: 'Ricardo Almeida', email: 'contato@distribuidorabrasil.com', phoneNumber: '1122334455', address: 'Rua dos Fornecedores, 100, São Paulo - SP', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Jeans & Co.', cnpj: '98.765.432/0001-11', contactName: 'Sofia Costa', email: 'vendas@jeansco.com', phoneNumber: '4133445566', address: 'Avenida Industrial, 200, Curitiba - PR', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockSales: Sale[] = [
    { id: '1', employeeId: '1', customerId: '1', items: [{ productId: '1', quantity: 2, unitPrice: 49.90, discount: 0 }], total: 99.80, paymentMethod: 'Cartão', installments: 1, date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'Pago' },
    { id: '2', employeeId: '2', customerId: '2', items: [{ productId: '2', quantity: 1, unitPrice: 149.90, discount: 10 }], total: 139.90, paymentMethod: 'PIX', installments: 1, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'Pago' },
    { id: '3', employeeId: '1', customerId: '2', items: [{ productId: '3', quantity: 1, unitPrice: 199.90, discount: 0 }], total: 199.90, paymentMethod: 'Prazo', installments: 1, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), status: 'Pendente', dueDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), termPaymentMethod: 'Boleto' },
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
  authenticatedEmployee: Employee | null;
  setAuthenticatedEmployee: (employee: Employee | null) => void;
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
  const [authenticatedEmployee, setAuthenticatedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedProducts = window.localStorage.getItem('products');
        if (!storedProducts || JSON.parse(storedProducts).length < 5) {
            setProducts(mockProducts);
            setCustomers(mockCustomers);
            setEmployees(mockEmployees);
            setSuppliers(mockSuppliers);
            setSales(mockSales);
            setConfig(mockConfig);
        }

        const storedEmployee = sessionStorage.getItem('authenticatedEmployee');
        if (storedEmployee) {
            setAuthenticatedEmployee(JSON.parse(storedEmployee));
        }

        setIsLoading(false);
    }
  }, []);

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
    authenticatedEmployee,
    setAuthenticatedEmployee,
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
