import { Injectable, OnDestroy } from '@angular/core';
import { ProductTree } from '../Data/product.interface';
import { ProductService } from './Product.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { TransformedProductTree } from '../Data/product.interface';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  PurchasedProducts,
  SumedPurchasedProductsInStore,
} from '../Data/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductNodeServiceService implements OnDestroy {
  public addButtonToOpenTreeWhenHasChild = (
    _: number,
    node: TransformedProductTree
  ): boolean => {
    return node.expandable;
  };
  private _productTreeControler = new FlatTreeControl<TransformedProductTree>(
    (node) => node.level,
    (node) => node.expandable
  );
  private _treeControler = new BehaviorSubject<
    FlatTreeControl<TransformedProductTree>
  >(this._productTreeControler);

  private _transformer = (
    dataSource: ProductTree,
    level: number
  ): TransformedProductTree => {
    const result = {
      expandable: !!dataSource.children,
      name: dataSource.name,
      level: level,
      isBuy: !!dataSource.isBuy,
      icon: dataSource.icon,
      quantity: dataSource.quantity,
      sum: dataSource.sum,
      title: dataSource.title,
      id: dataSource.id,
    };

    return result;
  };
  private _productTreeFlatenner = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  private _productDataSource = new MatTreeFlatDataSource(
    this._productTreeControler,
    this._productTreeFlatenner
  );
  private _productTree: ProductTree[] = [];
  private _subs = new Subscription();
  private _productTreeInNodeService = new BehaviorSubject<ProductTree[]>(
    this._productTree
  );

  private productDataSourceBehaviorSubject = new BehaviorSubject<
    MatTreeFlatDataSource<ProductTree, TransformedProductTree>
  >(this._productDataSource);

  constructor(private _productService: ProductService) {
    this._subProductTree();
    this._productDataSource.data = this._productTree;
  }

  private _subProductTree(): void {
    this._subs.add(
      this._productService
        .getProductTree()
        .subscribe((productTree: ProductTree[]) => {
          this._productTree = productTree;
          this._productTreeInNodeService.next(this._productTree);
        })
    );
  }

  public collapseRemainingNodes(clickNodeEvent: TransformedProductTree): void {
    // this method collapse all nodes apart from selected path
    if (this._productTreeControler.isExpanded(clickNodeEvent)) {
      this._productTreeControler.collapseAll();

      const productStartIndex =
        this._productTreeControler.dataNodes.indexOf(clickNodeEvent);
      const findIndexShopLevel =
        this._productTreeControler.dataNodes[
          this._findFirstElementOfTheLvl(productStartIndex, 0)
        ];
      this._productTreeControler.expand(clickNodeEvent);
      this._productTreeControler.expand(findIndexShopLevel);
    }
  }

  private _purchasedProducts: PurchasedProducts[] = [];
  private _purchasedProductsBehaviorSubject = new BehaviorSubject<
    PurchasedProducts[]
  >(this._purchasedProducts);
  private _purchasedProductsSumInStore: SumedPurchasedProductsInStore[] = [];
  private _purchasedProductsSumInStoreBehaviorSubject = new BehaviorSubject<
    SumedPurchasedProductsInStore[]
  >(this._purchasedProductsSumInStore);

  public markProductAsBuy(product: TransformedProductTree): void {
    this._purchasedProducts.push({
      name: product.name,
      quantity: product.quantity,
      icon: product.icon,
    });

    this._purchasedProductsBehaviorSubject.next(this._purchasedProducts);

    const productIndex = this._productTreeControler.dataNodes.indexOf(product);

    this._addUpProductsPurchasedInStore(productIndex, product);

    this.deleteProduct(product);
  }

  private _addUpProductsPurchasedInStore(
    productIndex: number,
    product: TransformedProductTree
  ): void {
    const produntStoreIndexFound = this._findFirstElementOfTheLvl(
      productIndex,
      0
    );
    const productStoreFound =
      this._productTreeControler.dataNodes[produntStoreIndexFound];
    const productStoreNames = this._purchasedProductsSumInStore.map(
      (shop: SumedPurchasedProductsInStore) => shop.name
    );
    const productStoreNamesIsExsist = productStoreNames.includes(
      productStoreFound.name
    );

    if (!productStoreNamesIsExsist) {
      this._purchasedProductsSumInStore.push({
        position: undefined,
        name: productStoreFound.name,
        quantityArray: [],
        icon: productStoreFound.icon,
        value: 0,
      });
    }
    for (let store of this._purchasedProductsSumInStore) {
      if (productStoreFound.name === store.name) {
        store.quantityArray.push(product.quantity as number);
        store.value = store.quantityArray.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
      }
    }
  }

  public deleteProduct(product: TransformedProductTree): void {
    //Find match product productTreeControler from the _productTree
    const shopNode = this._findElementAtTheSameId(product).shopNode;
    const typeNode = this._findElementAtTheSameId(product).typeNode;
    const productNode = this._findElementAtTheSameId(product).productNode;

    const productIndexStart =
      this._productTreeControler.dataNodes.indexOf(product);

    typeNode.children = typeNode.children.filter(
      (product: TransformedProductTree) => product !== productNode
    );

    this._productService.countAllProductsInStoreAndFormatTitle(shopNode);
    this._updateTree();

    this._expandFirstFoundElementLvlZero(productIndexStart - 1);
    this._expandFirstFoundElementLvlOne(productIndexStart - 1);

    this._removeTypeNodeIfNoElements(typeNode, shopNode, productIndexStart);
    this._removeShopIfNoElements(shopNode);
  }

  private _removeTypeNodeIfNoElements(
    typeNode: ProductTree,
    shopNode: ProductTree,
    productIndexStart: number
  ): void {
    if (typeNode.children.length === 0) {
      shopNode.children = shopNode.children.filter(
        (productType: ProductTree) => productType !== typeNode
      );
      this._updateTree();
      this._expandFirstFoundElementLvlZero(productIndexStart - 2);
    }
  }

  private _removeShopIfNoElements(shopNode: ProductTree): void {
    if (shopNode.children.length === 0) {
      this._productTree = this._productTree.filter(
        (productShop: ProductTree) => productShop !== shopNode
      );
      this._updateTree();

      this._productService.productTree = this._productTree;
    }
  }

  private _findElementAtTheSameId(
    product: TransformedProductTree
  ): ProductTree | any | null {
    for (let shopNode of this._productTree) {
      for (let typeNode of shopNode.children) {
        for (let productNode of typeNode.children) {
          if (productNode.id === product.id) {
            return { productNode, typeNode, shopNode };
          }
        }
      }
    }
    return null;
  }

  public _findFirstElementOfTheLvl(
    productStartIndex: number,
    level: number
  ): number {
    const nodes = this._productTreeControler.dataNodes;

    // Find first element on lvl 1 starting with product index
    for (let i = productStartIndex; i < nodes.length; i--) {
      if (nodes[i].level === level) {
        return i;
      }
    }
    // If don't have element on lvl 1 return product index
    return productStartIndex;
  }

  private _updateTree(): void {
    // Set new data to main data
    this._productTreeInNodeService.next(this._productTree);

    this._productDataSource.data = this._productTree;
  }

  private _expandFirstFoundElementLvlZero(productIndexStart: number): void {
    this._productTreeControler.expand(
      this._productTreeControler.dataNodes[
        this._findFirstElementOfTheLvl(productIndexStart, 0)
      ]
    );
  }

  private _expandFirstFoundElementLvlOne(productIndexStart: number): void {
    this._productTreeControler.expand(
      this._productTreeControler.dataNodes[
        this._findFirstElementOfTheLvl(productIndexStart, 1)
      ]
    );
  }

  public getPurchasedProductsSumInStore(): Observable<
    SumedPurchasedProductsInStore[]
  > {
    return this._purchasedProductsSumInStoreBehaviorSubject.asObservable();
  }

  public getTreeControler(): Observable<
    FlatTreeControl<TransformedProductTree>
  > {
    return this._treeControler.asObservable();
  }

  public getProductTree(): Observable<ProductTree[]> {
    return this._productTreeInNodeService.asObservable();
  }

  public getProductDataSource(): Observable<
    MatTreeFlatDataSource<ProductTree, TransformedProductTree>
  > {
    return this.productDataSourceBehaviorSubject.asObservable();
  }

  public getPurchasedProducts(): Observable<PurchasedProducts[]> {
    return this._purchasedProductsBehaviorSubject.asObservable();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
