/** Angular Imports */
import {Injectable, EventEmitter} from '@angular/core';

/** Custom Model */
import { Theme } from './theme.model';

/** Custom Services */
import { ThemeManagerService } from './theme-manager.service';

/**
 * Theme storage service.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeStorageService {

  /** Key to store current theme of application in local storage. */
  private themeStorageKey = 'midasTheme';
  /** Theme update event. */
  onThemeUpdate: EventEmitter<Theme>;

  /**
   * Initializes theme update event.
   * @param {ThemeManagerService} themeManagerService
   */
  constructor(public themeManagerService: ThemeManagerService) {
    this.onThemeUpdate = new EventEmitter<Theme>();
  }

  /**
   * Stores current theme in local storage and emits a theme update event.
   * @param midasTheme
   */
  storeTheme(midasTheme: Theme) {
    localStorage.setItem(this.themeStorageKey, JSON.stringify(midasTheme));
    this.onThemeUpdate.emit(midasTheme);
  }

  /**
   * @returns current theme from local storage
   */
  getTheme(): Theme {
    return JSON.parse(localStorage.getItem(this.themeStorageKey));
  }

  /**
   * Removes current theme from local storage.
   */
  clearTheme() {
    localStorage.removeItem(this.themeStorageKey);
  }

  /**
   * Sets a new theme for the application and stores in local storage.
   * @param {Theme} theme
   */
  installTheme(theme: Theme) {
    if (theme.isDefault) {
      this.themeManagerService.removeTheme();
    } else {
      this.themeManagerService.setTheme(`theme/${theme.href}`);
    }
    this.storeTheme(theme);
  }

}
