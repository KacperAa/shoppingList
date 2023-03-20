import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProductFormValueToOneDimensional,
  ProductFromDatabase,
  ProductFormData,
  ProductTypeIcons,
  ShopFromDatabase,
} from '../Data/product.interface';
import { PRODUCTS } from '../Data/productsDatabase';
import { SHOPS } from '../Data/shopsDatabase';
import { ProductTree } from 'src/app/Data/product.interface';
import { TYPES } from '../Data/productsTypeDatabase';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public productTree: ProductTree[] = [];
  private _productsFromDatabase = new BehaviorSubject<ProductFromDatabase[]>(
    PRODUCTS
  );
  private _shopsFromDatabase = new BehaviorSubject<ShopFromDatabase[]>(SHOPS);
  private _iconsProductTypesFromDatabase = new BehaviorSubject<
    ProductTypeIcons[]
  >(TYPES);
  private _productTreeBehaviorSubject = new BehaviorSubject<ProductTree[]>(
    this.productTree
  );
  private _productIdHolder: ProductTree[] = [];

  public addProduct(productsFormValue: ProductFormData): void {
    const product: ProductFormValueToOneDimensional = {
      id: productsFormValue.product.id,
      quantity: productsFormValue.quantity,
      shop: productsFormValue.shop.name,
      iconShop: productsFormValue.shop.icon,
      iconProduct: productsFormValue.product.icon,
      name: productsFormValue.product.name,
      type: productsFormValue.product.type,
    };

    const productTree: ProductTree = {
      name: product.shop,
      icon: product.iconShop,
      sum: undefined,
      title: undefined,
      children: [],
    };

    this._addArrayToIdHolder(productTree);

    this._addShopList(productTree);

    for (let shopFlat of this.productTree) {
      if (shopFlat.name === product.shop) {
        this._addProductType(shopFlat, product);
        for (let typeFlat of shopFlat.children!) {
          this._addProductName(product, typeFlat);
          this.countAllProductsInStoreAndFormatTitle(shopFlat);
        }
      }
    }
    this._productTreeBehaviorSubject.next(this.productTree);
  }

  public countAllProductsInStoreAndFormatTitle(shopFlat: ProductTree): void {
    const foundProductsFlats = shopFlat.children.map(
      (typeFlat: ProductTree) => typeFlat.children
    );
    const mergedProductsFlats = foundProductsFlats.flat();
    const takenQuantiesFromMergedProducts = mergedProductsFlats.map(
      (productFlat: ProductTree) => productFlat.quantity
    );
    const summedUpQuantitiesInShop = takenQuantiesFromMergedProducts.reduce(
      (acc: number, currentValue: number | undefined) =>
        acc + (currentValue || 0),
      0
    );
    shopFlat.sum = summedUpQuantitiesInShop;
    this._formatProductTitle(shopFlat);
  }

  private _formatProductTitle(product: ProductTree): string {
    if (product.sum === 1) {
      product.title = 'product';
    } else {
      product.title = 'products';
    }
    return product.title;
  }

  private _addShopList(productTree: ProductTree): void {
    const shopNames = this.productTree.map((shop: ProductTree) => shop.name);
    const shopExsisting = shopNames.includes(productTree.name);
    if (!shopExsisting) {
      this.productTree.push(productTree);
    }
  }

  private _addProductType(
    shopFlat: ProductTree,
    product: ProductFormValueToOneDimensional
  ): void {
    const typesNames = shopFlat.children.map((type: ProductTree) => type.name);
    const typeExsisting = typesNames.includes(product.type);
    let typeIcons: ProductTypeIcons[] = [];
    this.getProductTypesIcons().subscribe((typeIcon: ProductTypeIcons[]) => {
      typeIcons = typeIcon;
    });

    for (let icon of typeIcons) {
      if (!typeExsisting && icon.name === product.type) {
        shopFlat.children?.push({
          name: product.type,
          children: [],
          icon: icon.icon,
        });
      }
    }
  }

  private _addProductName(
    product: ProductFormValueToOneDimensional,
    typeFlat: ProductTree
  ): void {
    if (typeFlat.name === product.type) {
      typeFlat.children.push({
        id: this._productIdHolder.length,
        name: product.name,
        icon: product.iconProduct,
        quantity: product.quantity,
        isBuy: false,
      });
    }
  }

  private _addArrayToIdHolder(product: ProductTree): void {
    //This method add validation elements to array ready to download length
    this._productIdHolder.push(product);
  }

  public getProducts(): Observable<ProductFromDatabase[]> {
    return this._productsFromDatabase.asObservable();
  }

  public getShops(): Observable<ShopFromDatabase[]> {
    return this._shopsFromDatabase.asObservable();
  }

  public getProductTypesIcons(): Observable<ProductTypeIcons[]> {
    return this._iconsProductTypesFromDatabase.asObservable();
  }

  public getProductTree(): Observable<ProductTree[]> {
    return this._productTreeBehaviorSubject.asObservable();
  }
}
