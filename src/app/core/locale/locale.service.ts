import { Inject, Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { isEmpty } from '../../shared/empty.util';
import { CookieService } from '../services/cookie.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

export const LANG_COOKIE = 'language_cookie';

/**
 * Service to provide localization handler
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    private cookie: CookieService,
    private translate: TranslateService) {
  }

  /**
   * Get the language currently used
   *
   * @returns {string} The language code
   */
  getCurrentLanguageCode(): string {
    // Attempt to get the language from a cookie
    let lang = this.getLanguageCodeFromCookie();
    if (isEmpty(lang)) {
      // Cookie not found
      // Attempt to get the browser language from the user
      if (this.translate.getLangs().includes(this.translate.getBrowserLang())) {
        lang = this.translate.getBrowserLang();
      } else {
        lang = this.config.defaultLanguage;
      }
    }

    return lang;
  }

  /**
   * Retrieve the language from a cookie
   */
  getLanguageCodeFromCookie(): string {
    return this.cookie.get(LANG_COOKIE);
  }

  /**
   * Set the language currently used
   *
   * @param lang
   *  The language to save
   */
  saveLanguageCodeToCookie(lang: string): void {
    this.cookie.set(LANG_COOKIE, lang);
  }

  /**
   * Set the language currently used
   *
   * @param lang
   *  The language to set, if it's not provided retrieve default one
   */
  setCurrentLanguageCode(lang?: string): void {
    if (isEmpty(lang)) {
      lang = this.getCurrentLanguageCode()
    }
    this.translate.use(lang);
    this.saveLanguageCodeToCookie(lang);
  }
}
