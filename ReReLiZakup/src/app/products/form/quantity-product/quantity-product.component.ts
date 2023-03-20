import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quantity-product[formGroupFromFormComponent]',
  templateUrl: './quantity-product.component.html',
  styleUrls: ['./quantity-product.component.scss'],
})
export class QuantityProductComponent {
  @Input()
  public formGroupFromFormComponent!: FormGroup;
}
