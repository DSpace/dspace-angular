import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { isEmpty, hasValue } from '../../shared/empty.util';
import { CookieService } from '../services/cookie.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

export const LANG_COOKIE = 'language_cookie';

/**
 * This enum defines the possible origin of the languages
 */
export enum LANG_ORIGIN {
  UI,
  EPERSON,
  BROWSER
};

/**
 * Eperson language metadata
 */
const EPERSON_LANG_METADATA = 'eperson.language';

/**
 * Service to provide localization handler
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    private cookie: CookieService,
    private translate: TranslateService,
    private authService: AuthService) {
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
        lang = environment.defaultLanguage;
      }
    }
    return lang;
  }

  getLanguageCodeList(): Observable<string[]> {
    const bs = new BehaviorSubject<string[]>([]);
    // check if user has set preferred language in UI
    if (this.translate.currentLang) {
      bs.next(
        this.setQuality(
          [this.translate.currentLang],
          LANG_ORIGIN.UI,
          false)
        );
    }
    // check if user is loggedIn and has language associated
    this.authService.getAuthenticatedUserFromStore().subscribe(
      (eperson) => {
        const ePersonLang = eperson.firstMetadataValue(EPERSON_LANG_METADATA);
        bs.next(
          this.setQuality(
            [ePersonLang],
            LANG_ORIGIN.EPERSON,
            !isEmpty(this.translate.currentLang))
          );
      }
    );
    // get the browser languages
    if (navigator.languages) {
      bs.next(
        this.setQuality(
          Object.assign([], navigator.languages),
          LANG_ORIGIN.BROWSER,
          !isEmpty(this.translate.currentLang))
        );
    }
    return bs;
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

  /**
   * Set the quality factor for all element of input array.
   * Returns a new array that contains the languages list with the quality value.
   * The quality factor indicate the relative degree of preference for the language
   * @param languages the languages list
   * @param origin
   * @param hasOther
   */
  setQuality(languages: string[], origin: LANG_ORIGIN, hasOther: boolean): string[] {
    const langWithPrior = [];
    let idx = 0;
    const v = languages.length > 10 ? languages.length : 10;
    let divisor: number;
    switch (origin) {
      case LANG_ORIGIN.EPERSON:
        divisor = 2; break;
      case LANG_ORIGIN.BROWSER:
        divisor = (hasOther ? 10 : 1); break;
      default:
        divisor = 1;
    }
    languages.forEach( (lang) => {
        let value = lang + ';q=';
        let quality = (v - idx++) / v;
        quality = ((languages.length > 10) ? quality.toFixed(2) : quality) as number;
        value += quality / divisor;
        langWithPrior.push(value);
    });
    return langWithPrior;
  }

}
