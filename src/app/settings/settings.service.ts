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
    localStorage.setItem('midasLanguageCode',language.code);
    localStorage.setItem('code',language.code.split('-')[0]);
    localStorage.setItem('midasLanguageName',language.name) //JSON.stringify(language.code).code);
  }

  /**
   * Returns date format setting.
   */
  get dateFormat() {
    //console.log('Date Format:',localStorage.getItem('midasDateFormat'))
    return 'dd MMMM yyyy';//JSON.parse( localStorage.getItem('midasDateFormat'));
  }

  /**
   * Returns language setting
   */
  get language() {
    // console.log('langcode:',JSON.parse(localStorage.getItem('midasLanguageCode')))
    //return localStorage.getItem('midasLocale');
    return { name: localStorage.getItem('midasLanguageCode'), code: localStorage.getItem('midasLocale') }
  }

}
