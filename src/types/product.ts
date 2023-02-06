export interface Product {
  name: string;
  description: string;
  material: string;
  price: number;
  pictures: string | string[];
  department: string | null;
}

export type ProductMapperPaths = {
  [path in keyof Product]: string;
};

export interface BrSupplierProduct {
  nome: string;
  descricao: string;
  material: string;
  preco: string;
  imagem: string;
  departamento: string;
  id: string;
}

export interface EuSupplierProduct {
  name: string;
  description: string;
  price: string;
  gallery: string[];
  hasDiscount: boolean;
  discountValue: `0.0${number}`;
  details: {
    adjective: string;
    material: string;
  };
  id: string;
}
