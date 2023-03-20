import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { navigationSlideOut } from 'src/app/Animations/animations';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-expendable-nav',
  templateUrl: './expendable-nav.component.html',
  styleUrls: ['./expendable-nav.component.scss'],
  animations: [navigationSlideOut],
})
export class ExpendableNavComponent implements OnDestroy {
  public expandedNavigation: boolean | undefined;
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(private _settings: SettingsService) {
    this._subDarkMode();
    this._getNavigationStatus();
  }

  private _getNavigationStatus(): void {
    this._subs.add(
      this._settings
        .getExpendedNavStatus()
        .subscribe(
          (navStatus: boolean) => (this.expandedNavigation = navStatus)
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
  public expandNavigation(): void {
    this._settings.expandNavigation();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
