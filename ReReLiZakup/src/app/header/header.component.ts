import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';
import { checkViewSize } from '../MegageView/menageView';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public showedNav: boolean | undefined;

  constructor(private _viewportRuler: ViewportRuler) {
    this.showedNav = checkViewSize(this._viewportRuler);
    this._trackResolutionChanges();
  }

  private _trackResolutionChanges(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.showedNav = checkViewSize(this._viewportRuler);
      });
  }
}
