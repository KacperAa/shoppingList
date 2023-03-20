import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-invalid-messages',
  templateUrl: './invalid-messages.component.html',
  styleUrls: ['./invalid-messages.component.scss'],
})
export class InvalidMessagesComponent {
  @Input()
  public productFormControl!: AbstractControl | null;
  @Input()
  public formControlNameString!: string;
}
