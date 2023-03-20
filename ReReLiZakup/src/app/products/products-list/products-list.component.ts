import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy } from '@angular/core';
import { MatTreeFlatDataSource } from '@angular/material/tree';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { TransformedProductTree } from 'src/app/Data/product.interface';
import { HasChildFunction } from 'src/app/Data/product.interface';
import { ProductTree } from 'src/app/Data/product.interface';
import { ProductNodeServiceService } from 'src/app/services/product-node-service.service';
import { markAsBuyAnimation } from 'src/app/Animations/animations';
import { SettingsService } from 'src/app/services/settings.service';
import { checkViewSize } from 'src/app/MegageView/menageView';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: [markAsBuyAnimation],
})
export class ProductsListComponent implements OnDestroy {
  public productTreeControler!: FlatTreeControl<TransformedProductTree>;
  public productDataSource!: MatTreeFlatDataSource<
    ProductTree,
    TransformedProductTree
  >;
  public productTreeLengthHolder: number = 0;
  public changedView: boolean | undefined;
  public darkMode: boolean | undefined;
  private _subs = new Subscription();
  private _productTree!: ProductTree[];

  constructor(
    private _nodeService: ProductNodeServiceService,
    private _settings: SettingsService,
    private _viewportRuler: ViewportRuler
  ) {
    this._subProductDataSource();
    this._subProductTreeAndPatchProductTreeLength();
    this.productDataSource.data = this._productTree;
    this._subProductTreeControler();

    this._manageComponentView();

    this._subDarkMode();
  }

  private _subProductDataSource(): void {
    this._subs.add(
      this._nodeService
        .getProductDataSource()
        .subscribe(
          (
            dataSource: MatTreeFlatDataSource<
              ProductTree,
              TransformedProductTree
            >
          ) => (this.productDataSource = dataSource)
        )
    );
  }

  private _subProductTreeAndPatchProductTreeLength(): void {
    this._subs.add(
      this._nodeService
        .getProductTree()
        .subscribe((productTree: ProductTree[]) => {
          this._productTree = productTree;
          this.productTreeLengthHolder = this._productTree.length;
        })
    );
  }

  private _subProductTreeControler(): void {
    this._subs.add(
      this._nodeService
        .getTreeControler()
        .subscribe((treeControler: FlatTreeControl<TransformedProductTree>) => {
          this.productTreeControler = treeControler;
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

  public nodeHasChild: HasChildFunction =
    this._nodeService.addButtonToOpenTreeWhenHasChild;

  public productIsBuy(product: TransformedProductTree): void {
    product.isBuy = true;

    //follow the service method when the animation end
    setTimeout(() => {
      this._nodeService.markProductAsBuy(product);
    }, 300);
  }

  public deleteProduct(product: TransformedProductTree): void {
    this._nodeService.deleteProduct(product);
  }

  public onNodeClick(nodeEvent: TransformedProductTree): void {
    // This method collapse all nodes except for the selected path
    this._nodeService.collapseRemainingNodes(nodeEvent);
  }

  private _manageComponentView(): void {
    this.changedView = checkViewSize(this._viewportRuler);
    this._trackResolutionChanges();
  }

  private _trackResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.changedView = checkViewSize(this._viewportRuler);
      });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
