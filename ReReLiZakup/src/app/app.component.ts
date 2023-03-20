import { Component, OnDestroy } from '@angular/core';
import { StatisticsService } from './services/statistics.service';
import { checkViewSize } from './MegageView/menageView';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public changedView: boolean | undefined;
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(
    private _statisticsService: StatisticsService,
    private _viewportRuler: ViewportRuler,
    private _settings: SettingsService
  ) {
    this._manageComponentView();
    this._subDarkMode();
  }

  private _subDarkMode() {
    this._subs.add(
      this._settings.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    );
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
