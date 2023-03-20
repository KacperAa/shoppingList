import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _darkMode: boolean = false;
  private _expandedNavigation: boolean = false;
  private _expandedNavigationBehaviorSubject = new BehaviorSubject<boolean>(
    this._expandedNavigation
  );

  private _darkModeBehaviorSubject = new BehaviorSubject<boolean>(
    this._darkMode
  );

  public expandNavigation(): void {
    this._expandedNavigation = !this._expandedNavigation;
    this._expandedNavigationBehaviorSubject.next(this._expandedNavigation);
  }

  public darkModeOn(): void {
    setTimeout(() => {
      this._darkMode = !this._darkMode;
      this._darkModeBehaviorSubject.next(this._darkMode);
    }, 0);
  }

  public getDarkMode(): Observable<boolean> {
    return this._darkModeBehaviorSubject.asObservable();
  }

  public getExpendedNavStatus(): Observable<boolean> {
    return this._expandedNavigationBehaviorSubject.asObservable();
  }
}
