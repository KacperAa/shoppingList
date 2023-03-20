import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resizable-draggable',
  templateUrl: './resizable-draggable.component.html',
  styleUrls: ['./resizable-draggable.component.scss'],
})
export class ResizableDraggableComponent {
  @Input()
  public productFormIsValid: boolean | undefined;
}
