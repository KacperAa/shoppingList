export interface ProductFromDatabase {
  id: number;
  name: string;
  type: string;
  icon: string;
}

export interface ProductTree {
  name: string;
  icon: string;
  children: any[];
  quantity?: number | undefined;
  id?: number;
  isBuy?: boolean;
  title?: string;
  sum?: number | undefined;
}

export interface ShopFromDatabase {
  id: number;
  name: string;
  icon: string;
}

export interface ProductFormData {
  product: ProductFromDatabase;
  quantity: number;
  shop: ShopFromDatabase;
}

export interface ProductFormValueToOneDimensional {
  id: number;
  name: string;
  type: string;
  quantity: number;
  shop: string;
  iconProduct: string;
  iconShop: string;
}

export interface ProductQuantities {
  name: string;
  quantity: number[];
}

export interface ProductsSumQuantities {
  name: string;
  quantitySum: number;
}

export interface ProductTypeIcons {
  name: string;
  icon: string;
}

export interface HasChildFunction {
  (level: number, node: TransformedProductTree): boolean | undefined;
}

export interface PurchasedProducts {
  name: string;
  quantity: number | undefined;
  icon: string;
}

export interface SumedPurchasedProducts {
  position: number | undefined;
  name: string;
  value: number | undefined;
  icon: string;
}

export interface SumedPurchasedProductsInStore {
  position: undefined | number;
  name: string;
  icon: string;
  quantityArray: number[];
  value: number;
}

export interface TransformedProductTree {
  expandable: boolean;
  name: string;
  level: number;
  isBuy: boolean;
  icon: string;
  sum: number | undefined;
  quantity: number | undefined;
  id?: number;
  title?: string | undefined;
}
