import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductFromDatabase } from 'src/app/Data/product.interface';
import { ProductService } from 'src/app/services/Product.service';

@Component({
  selector: 'app-input-product[formGroupFromFormComponent]',
  templateUrl: './input-product.component.html',
  styleUrls: ['./input-product.component.scss'],
})
export class InputProductComponent implements OnDestroy {
  @Input()
  public formGroupFromFormComponent!: FormGroup;
  public keyProductsFound: ProductFromDatabase[] | undefined;
  public productNotExsist: ProductFromDatabase[] = [
    {
      name: 'Product not Exsist!',
      id: 0,
      type: 'none',
      icon: 'https://findicons.com/files/icons/2799/flat_icons/256/shopping_basket_cross.png',
    },
  ];
  private _products!: ProductFromDatabase[];
  private _inputSigns!: string;
  private _sub = new Subscription();

  constructor(private _productService: ProductService) {
    this._setProducts();
  }

  private _setProducts(): void {
    this._sub.add(
      this._productService
        .getProducts()
        .subscribe((products: ProductFromDatabase[]) => {
          this._products = products;
        })
    );
  }

  public filteredProducts(): ProductFromDatabase[] {
    if (this._inputSigns) {
      const singsToLowerCase = this._inputSigns.toLowerCase();
      let searchProductsByKey = this._products?.filter((search) =>
        search.name.toLowerCase().startsWith(singsToLowerCase)
      );
      if (searchProductsByKey.length === 0) {
        searchProductsByKey = this.productNotExsist;
      }
      return searchProductsByKey;
    }
    return this._products;
  }

  public keyUpHandler($event: Event) {
    const target = $event.target as HTMLInputElement;
    this._inputSigns = target.value;
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
