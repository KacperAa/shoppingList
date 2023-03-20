import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from 'src/app/services/Product.service';
import { cutWordIfNumberTooHight } from './productsListValidators';
import { SettingsService } from 'src/app/services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy, OnInit {
  public productsForm: FormGroup = new FormGroup({});
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _productService: ProductService,
    private _detRef: ChangeDetectorRef,
    private _settings: SettingsService
  ) {
    this.productsForm = this._fb.group({
      product: ['', [Validators.required]],

      quantity: [
        '',
        [
          Validators.required,
          Validators.max(999),
          Validators.min(1),
          Validators.pattern('^[0-9]*$'),
          cutWordIfNumberTooHight(9999),
        ],
      ],
      shop: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this._subDarkMode();
  }

  private _subDarkMode(): void {
    this._subs.add(
      this._settings.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    );
  }

  get product(): AbstractControl | null {
    return this.productsForm.get('product');
  }

  get quantity(): AbstractControl | null {
    return this.productsForm.get('quantity');
  }

  get shop(): AbstractControl | null {
    return this.productsForm.get('shop');
  }

  public productFormIsValid: boolean = false;

  public addProductToList(): void {
    if (this.productsForm.valid) {
      this._productService.addProduct(this.productsForm.value);
      this.product?.reset();
      this.quantity?.reset();
    } else {
      this.productFormIsValid = !this.productFormIsValid;
      this._detRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
