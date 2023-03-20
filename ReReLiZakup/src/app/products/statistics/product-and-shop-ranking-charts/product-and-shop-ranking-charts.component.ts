import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SumedPurchasedProducts,
  SumedPurchasedProductsInStore,
} from 'src/app/Data/product.interface';
import { ProductNodeServiceService } from 'src/app/services/product-node-service.service';
import { SettingsService } from 'src/app/services/settings.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-product-and-shop-ranking-charts',
  templateUrl: './product-and-shop-ranking-charts.component.html',
  styleUrls: ['./product-and-shop-ranking-charts.component.scss'],
})
export class ProductAndShopRankingChartsComponent implements OnDestroy {
  public resultsInProductsChart!: SumedPurchasedProducts[];
  public resultsInShopsChart!: SumedPurchasedProductsInStore[];
  // ngx-charts options
  public view: [number, number] = [700, 400];
  public showXAxis: boolean = true;
  public showYAxis: boolean = true;
  public gradient: boolean = false;
  public showLegend: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string | undefined;
  public showYAxisLabel: boolean = true;
  public yAxisLabel: string | undefined;
  public colorScheme: any = {
    name: 'myColorScheme',
    selectable: true,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    scaleType: 'Ordinal',
  };

  public summedPurchasedProducts!: SumedPurchasedProducts[];
  public purchasedProductsSumInStore!: SumedPurchasedProductsInStore[];
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(
    private _statisticsService: StatisticsService,
    private _nodeService: ProductNodeServiceService,
    private _settings: SettingsService
  ) {
    this._subSummedPurchasedProducts();
    this._subPurchasedProductsSumInStore();
    this._assignDataToResultsInChart();
    this._subDarkMode();
  }

  private _assignDataToResultsInChart(): void {
    Object.assign(this, {
      resultsInProductsChart: this.summedPurchasedProducts,
    });
    Object.assign(this, {
      resultsInShopsChart: this.purchasedProductsSumInStore,
    });
  }

  private _subSummedPurchasedProducts(): void {
    this._subs.add(
      this._statisticsService
        .getSummedPurchasedProducts()
        .subscribe((summedPurchasedProducts: SumedPurchasedProducts[]) => {
          this.summedPurchasedProducts = summedPurchasedProducts;
        })
    );
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
