/** Angular Imports */
import { Injectable } from '@angular/core';

/** Environment Imports */
import { environment } from '../../environments/environment';

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
   * Sets server URL setting throughout the app.
   * @param {string} url URL
   */
  setServer(url: string) {
    localStorage.setItem('midasServerURL', JSON.stringify(url));
  }

  /**
   * Sets server URL setting throughout the app.
   * @param {string[]} list List of default servers
   */
  setServers(list: string[]) {
    localStorage.setItem('midasServers', JSON.stringify(list));
  }

  /**
   * Sets server URL setting throughout the app.
   * @param {string} url URL
   */
  setBillposServer(url: string) {
    localStorage.setItem('midasBillposServerURL', JSON.stringify(url));
  }

  /**
   * Sets server URL setting throughout the app.
   * @param {string[]} list List of default servers
   */
  setBillposServers(list: string[]) {
    localStorage.setItem('midasBillposServers', JSON.stringify(list));
  }

  /**
   * Returns date format setting.
   * TẠM THÒI HARDCODE PHẦN DATEFORMAT = 'dd MMMM yyyy' VÀ LOCALE = 'en' DO CÓ LỖI KHI GỌI API
   */
  get dateFormat() {
    console.log('Date Format:',localStorage.getItem('midasDateFormat'))
    return JSON.parse( localStorage.getItem('midasDateFormat'));
  }

  /**
   * Returns language setting
   */
  get language() {
    return { name: localStorage.getItem('midasLanguageCode'), code:'en'}; //localStorage.getItem('midasLocale') }
  }

  /**
   * Returns list of default server
   */
  get servers() {
    return JSON.parse(localStorage.getItem('midasServers'));
  }

  /**
   * Returns server setting
   */
  get server() {
    return environment.baseApiUrl;
  }
  /**
   * Returns list of default server
   */
  get serversBillpos() {
    return JSON.parse(localStorage.getItem('midasBillposServers'));
  }

  /**
   * Returns server setting
   */
  get serverBillpos() {
    return environment.GatewayApiUrl;
  }
}
