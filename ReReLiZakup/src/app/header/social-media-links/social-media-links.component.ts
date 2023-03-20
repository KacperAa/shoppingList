import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-social-media-links',
  templateUrl: './social-media-links.component.html',
  styleUrls: ['./social-media-links.component.scss'],
})
export class SocialMediaLinksComponent implements OnDestroy {
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
