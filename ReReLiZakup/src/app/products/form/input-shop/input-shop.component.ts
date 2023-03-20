import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShopFromDatabase } from 'src/app/Data/product.interface';
import { ProductService } from 'src/app/services/Product.service';

@Component({
  selector: 'app-input-shop[formGroupFromFormComponent]',
  templateUrl: './input-shop.component.html',
  styleUrls: ['./input-shop.component.scss'],
})
export class InputShopComponent implements OnDestroy {
  @Input()
  public formGroupFromFormComponent!: FormGroup;
  public keyShopsFound: ShopFromDatabase[] | undefined;
  public shopNotExsist: ShopFromDatabase[] = [
    {
      id: 0,
      name: 'Shop not exsist',
      icon: 'https://cdn-icons-png.flaticon.com/512/57/57480.png',
    },
  ];
  private _shops!: ShopFromDatabase[];
  private _inputSigns!: string;
  private _sub = new Subscription();
  constructor(private _productService: ProductService) {
    this._setShops();
  }

  private _setShops(): void {
    this._sub.add(
      this._productService.getShops().subscribe((shops: ShopFromDatabase[]) => {
        this.keyShopsFound = shops;
        this._shops = shops;
      })
    );
  }

  public filteredShops(): ShopFromDatabase[] {
    if (this._inputSigns) {
      const singsToLowerCase = this._inputSigns.toLowerCase();
      let searchShopsByKey = this._shops.filter((search) =>
        search.name.toLowerCase().startsWith(singsToLowerCase)
      );
      if (searchShopsByKey.length === 0) {
        searchShopsByKey = this.shopNotExsist;
      }
      return searchShopsByKey;
    }
    return this._shops;
  }
  public keyUpHandler($event: Event) {
    const target = $event.target as HTMLInputElement;
    this._inputSigns = target.value;
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
