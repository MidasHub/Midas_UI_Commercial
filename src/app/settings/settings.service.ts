/** Angular Imports */
import { Injectable } from '@angular/core';

/**
 * Settings Service
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  /**
   * Sets date format setting throughout the app.
   * @param {string} dateFormat Date Format
   */
  setDateFormat(dateFormat: string) {
    localStorage.setItem('midasDateFormat', JSON.stringify(dateFormat));
  }

  /**
   * Sets language setting throughout the app.
   * @param {any} language Language.
   */
  setLanguage(language: { name: string, code: string }) {
    localStorage.setItem('midasLanguageCode',language.code)
    localStorage.setItem('midasLanguageName',language.name) //JSON.stringify(language.code).code);
  }

  /**
   * Returns date format setting.
   */
  get dateFormat() {
    return JSON.parse(localStorage.getItem('midasDateFormat'));
  }

  /**
   * Returns language setting
   */
  get language() {
    return JSON.parse(localStorage.getItem('midasLanguageCode'));
  }

}
