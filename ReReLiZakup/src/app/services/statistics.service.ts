import { Injectable, OnDestroy } from '@angular/core';
import { ProductNodeServiceService } from './product-node-service.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  PurchasedProducts,
  SumedPurchasedProducts,
} from '../Data/product.interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService implements OnDestroy {
  private _subs = new Subscription();
  private _purchasedProducts: PurchasedProducts[] = [];
  private _sumedPurchasedProducts: SumedPurchasedProducts[] = [];
  private _sumedPurchasedProductsBehaviorSubject = new BehaviorSubject<
    SumedPurchasedProducts[]
  >(this._sumedPurchasedProducts);

  constructor(private _nodeService: ProductNodeServiceService) {
    this._subPurchasedProducts();
  }

  private _subPurchasedProducts(): void {
    this._subs.add(
      this._nodeService
        .getPurchasedProducts()
        .subscribe((purchasedProducts: PurchasedProducts[]) => {
          this._purchasedProducts = purchasedProducts;
          this._sumTotalQuantitiesOfProduct();
        })
    );
  }

  private _sumTotalQuantitiesOfProduct(): void {
    this._addProductToRanking();
    this._sumProductQuantities();
  }

  private _addProductToRanking(): void {
    const getNames = this._sumedPurchasedProducts.map(
      (product: SumedPurchasedProducts) => product.name
    );

    for (let product of this._purchasedProducts) {
      const productNameExsist = getNames.includes(product.name);

      if (!productNameExsist) {
        this._sumedPurchasedProducts.push({
          position: undefined,
          name: product.name,
          value: undefined,
          icon: product.icon,
        });
      }
    }
    this._sumedPurchasedProductsBehaviorSubject.next(
      this._sumedPurchasedProducts
    );
  }

  private _sumProductQuantities() {
    for (let sumedProduct of this._sumedPurchasedProducts) {
      const filteredProductsByNames = this._purchasedProducts.filter(
        (product: PurchasedProducts) => product.name === sumedProduct.name
      );
      const getProductsQuantities = filteredProductsByNames.map(
        (product: PurchasedProducts) => product.quantity
      );
      const addedQuantityOfProducts = getProductsQuantities.reduce(
        (acc: number, currentValue: number | undefined) => acc + currentValue!,
        0
      );
      sumedProduct.value = addedQuantityOfProducts;
    }
  }

  public getSummedPurchasedProducts(): Observable<SumedPurchasedProducts[]> {
    return this._sumedPurchasedProductsBehaviorSubject.asObservable();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
