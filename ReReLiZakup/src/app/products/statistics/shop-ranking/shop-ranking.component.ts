import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SumedPurchasedProductsInStore } from 'src/app/Data/product.interface';
import { ProductNodeServiceService } from 'src/app/services/product-node-service.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-shop-ranking',
  templateUrl: './shop-ranking.component.html',
  styleUrls: ['./shop-ranking.component.scss'],
})
export class ShopRankingComponent implements OnDestroy {
  public displayedColumns: string[] = ['position', 'name', 'value', 'icon'];
  public purchasedProductsSumInStore!: SumedPurchasedProductsInStore[];
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(
    private _nodeService: ProductNodeServiceService,
    private _settings: SettingsService
  ) {
    this._subPurchasedProductsSumInStore();
    this.purchasedProductsSumInStore = this._sortQuantitiesLargestToSmallest();

    this._subDarkMode();
  }

  private _sortQuantitiesLargestToSmallest(): SumedPurchasedProductsInStore[] {
    const sortedProducts = this.purchasedProductsSumInStore.sort(
      (a: SumedPurchasedProductsInStore, b: SumedPurchasedProductsInStore) =>
        b.value! - a.value!
    );
    this.purchasedProductsSumInStore = sortedProducts;
    this._assingRankingPosition(sortedProducts);

    return this.purchasedProductsSumInStore;
  }

  private _assingRankingPosition(
    sortedProducts: SumedPurchasedProductsInStore[]
  ): void {
    for (let products of sortedProducts) {
      products.position = sortedProducts.indexOf(products) + 1;
    }
  }

  private _subPurchasedProductsSumInStore(): void {
    this._subs.add(
      this._nodeService
        .getPurchasedProductsSumInStore()
        .subscribe(
          (purchasedProductsSumInStore: SumedPurchasedProductsInStore[]) => {
            this.purchasedProductsSumInStore = purchasedProductsSumInStore;
          }
        )
    );
  }

  private _subDarkMode(): void {
    this._subs.add(
      this._settings.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    );
  }
  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
