import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SumedPurchasedProducts } from 'src/app/Data/product.interface';
import { SettingsService } from 'src/app/services/settings.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-product-ranking',
  templateUrl: './product-ranking.component.html',
  styleUrls: ['./product-ranking.component.scss'],
})
export class ProductRankingComponent implements OnDestroy {
  public displayedColumns: string[] = [
    'position',
    'name',
    'numberOfPurchases',
    'icon',
  ];

  public purchasedProductsList!: SumedPurchasedProducts[];
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(
    private _statisticsService: StatisticsService,
    private _settings: SettingsService
  ) {
    this._subSumPurchasedProducts();
    this._subDarkMode();

    this.purchasedProductsList = this._sortQuantitiesLargestToSmallest();
  }
  private _subSumPurchasedProducts(): void {
    this._subs.add(
      this._statisticsService
        .getSummedPurchasedProducts()
        .subscribe((sumedProducts: SumedPurchasedProducts[]) => {
          this.purchasedProductsList = sumedProducts;
        })
    );
  }

  private _subDarkMode(): void {
    this._subs.add(
      this._settings.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    );
  }

  private _sortQuantitiesLargestToSmallest(): any {
    const sortedProducts = this.purchasedProductsList.sort(
      (a: SumedPurchasedProducts, b: SumedPurchasedProducts) =>
        b.value! - a.value!
    );
    this.purchasedProductsList = sortedProducts;

    this._assingRankingPosition(sortedProducts);

    return this.purchasedProductsList;
  }

  private _assingRankingPosition(
    sortedProducts: SumedPurchasedProducts[]
  ): void {
    for (let product of sortedProducts) {
      product.position = sortedProducts.indexOf(product) + 1;
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
