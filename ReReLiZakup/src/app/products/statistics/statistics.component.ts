import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnDestroy {
  public darkMode: boolean | undefined;
  private _subs = new Subscription();

  constructor(private _settings: SettingsService) {
    this._subDarkMode();
  }

  private _subDarkMode(): void {
    this._subs.add(
      this._settings.getDarkMode().subscribe((darkMode: boolean) => {
        this.darkMode = darkMode;
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
