/** Angular Imports */
import {Injectable} from '@angular/core';
// import { Subject } from 'rxjs';

/** Translation Imports */
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

/** Custom Services */
import {Logger} from '../logger/logger.service';

/** Other Imports */
import {includes} from 'lodash';
import {environment} from 'environments/environment';
// import * as enUS from '../../../translations/en-US.json';
// import * as frFR from '../../../translations/fr-FR.json';
// import * as viVN from '../../../translations/vi-VN.json';

/** Initialize Logger */
const log = new Logger('I18nService');

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param {string} s The string to extract for translation.
 * @return {string} The same string.
 */
export function extract(s: string) {
  return s;
}

@Injectable()
export class I18nService {

  /** Key to store current language of application in local storage. */
  private languageStorageKey = 'midasLanguageCode';
  private localeStorageKey = 'midasLocale';
  private languagesNameStoragekey = 'midasLanguageName';
  languagesNameObj: {
    en: 'English',
    vi: 'Vietnamese'
  };

  defaultLanguage: string;
  supportedLanguages: string[];

  constructor(private translate: TranslateService) {
    /**  Embed languages to avoid extra HTTP requests - Jean: rem due to error when using this method
     *  Jean change to use the default http loader of ngx-translate which is configged in the app.module.ts file
     *
     */
    // translate.setTranslation('en-US', enUS);
    // translate.setTranslation('fr-FR', frFR);
    // translate.setTranslation('vi-VN', viVN);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param {!string} defaultLanguage The default language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';

    this.translate.onLangChange
      .subscribe((event: LangChangeEvent) => {

        localStorage.setItem(this.languageStorageKey, event.lang);
        localStorage.setItem(this.localeStorageKey, event.lang.split('-')[0]);
        localStorage.setItem(this.languagesNameStoragekey, environment.languagesName[event.lang.split('-')[0]]);
      });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(this.languageStorageKey) || this.translate.getBrowserCultureLang();
    let isSupportedLanguage = includes(this.supportedLanguages, language);
    console.log('start:', language);
    console.log('start supported Lang:', isSupportedLanguage);
    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }
    log.debug(`Language set to ${language} and language code is ${language.split('-')[0]}`);
    this.translate.use(language);
  }

  /**
   * Gets the current language.
   * @return {string} The current language code.
   */
  get language(): string {
    return this.translate.currentLang;
  }

  /** Translate in javascript code */
  getTranslate(field: any): string {
    let lbl = '';
    this.translate.get(field).subscribe((res: string) => {
      // console.log('title', res);
      lbl = res;
    });
    return lbl;
  }
}
