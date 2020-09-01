import { Injectable } from '@angular/core';
import * as Klaro from 'klaro'
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { switchMap, take } from 'rxjs/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { KlaroService } from './klaro.service';
import { hasValue, isNotEmpty } from '../empty.util';
import { CookieService } from '../../core/services/cookie.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { cloneDeep } from 'lodash';
import { klaroConfiguration } from './klaro-configuration';
import { Operation } from 'fast-json-patch';

export const HAS_AGREED_END_USER = 'dsHasAgreedEndUser';
export const COOKIE_MDFIELD = 'dspace.agreements.cookies';
export const ANONYMOUS_STORAGE_NAME_KLARO = 'klaro-anonymous';
const cookieNameMessagePrefix = 'cookies.consent.app.title.';
const cookieDescriptionMessagePrefix = 'cookies.consent.app.description.';
const cookiePurposeMessagePrefix = 'cookies.consent.purpose.';

@Injectable()
export class BrowserKlaroService extends KlaroService {
  klaroConfig = klaroConfiguration;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private ePersonService: EPersonDataService,
    private cookieService: CookieService) {
    super();
  }

  initialize() {
    this.translateService.setDefaultLang(environment.defaultLanguage);

    const user$: Observable<EPerson> = this.getUser$();

    const translationServiceReady$ = this.translateService.get('loading.default').pipe(take(1));

    observableCombineLatest(user$, translationServiceReady$)
      .subscribe(([user, translation]: [EPerson, string]) => {
        user = cloneDeep(user);
        if (hasValue(user)) {
          this.initializeUser(user);
        }

        /**
         * Add all message keys for apps and purposes
         */
        this.addAppMessages();

        /**
         * Subscribe on a message to make sure the translation service is ready
         * Translate all keys in the translation section of the configuration
         * Show the configuration if the configuration has not been confirmed
         */
        this.translateConfiguration();
        Klaro.renderKlaro(this.klaroConfig, false);
        Klaro.initialize();
      });

  }

  private initializeUser(user: EPerson) {
    this.klaroConfig.callback = (consent, app) => this.updateSettingsForUsers(user);
    this.klaroConfig.storageName = this.getStorageName(user.uuid);

    const anonCookie = this.cookieService.get(ANONYMOUS_STORAGE_NAME_KLARO);
    if (hasValue(this.getSettingsForUser(user))) {
      this.restoreSettingsForUsers(user);
    } else if (hasValue(anonCookie)) {
      this.cookieService.set(this.getStorageName(user.uuid), anonCookie);
      this.updateSettingsForUsers(user);
    }
  }

  private getUser$() {
    return this.authService.isAuthenticated()
      .pipe(
        take(1),
        switchMap((loggedIn: boolean) => {
          if (loggedIn) {
            return this.authService.getAuthenticatedUserFromStore();
          }
          return observableOf(undefined);
        }),
        take(1)
      );
  }

  private getTitleTranslation(title: string) {
    return cookieNameMessagePrefix + title;
  }

  private getDescriptionTranslation(description: string) {
    return cookieDescriptionMessagePrefix + description;
  }

  private getPurposeTranslation(purpose: string) {
    return cookiePurposeMessagePrefix + purpose;
  }

  /**
   * Show the cookie consent form
   */
  showSettings() {
    Klaro.show(this.klaroConfig);
  }

  /**
   * Add message keys for all apps and purposes
   */
  addAppMessages() {
    this.klaroConfig.apps.forEach((app) => {
      this.klaroConfig.translations.en[app.name] = { title: this.getTitleTranslation(app.name), description: this.getDescriptionTranslation(app.name) };
      app.purposes.forEach((purpose) => {
        this.klaroConfig.translations.en.purposes[purpose] = this.getPurposeTranslation(purpose);
      })
    });
  }

  /**
   * Translate the translation section from the Klaro configuration
   */
  translateConfiguration() {
    /**
     * Make sure the fallback language is english
     */
    this.translateService.setDefaultLang(environment.defaultLanguage);

    this.translate(this.klaroConfig.translations.en);
  }

  private translate(object) {
    if (typeof (object) === 'string') {
      return this.translateService.instant(object);
    }
    Object.entries(object).forEach(([key, value]: [string, any]) => {
      object[key] = this.translate(value);
    });
    return object;
  }

  getSettingsForUser(user: EPerson) {
    const mdValue = user.firstMetadataValue(COOKIE_MDFIELD);
    return hasValue(mdValue) ? JSON.parse(mdValue) : undefined;
  }

  setSettingsForUser(user: EPerson, config: object) {
    user.setMetadata(COOKIE_MDFIELD, undefined, JSON.stringify(config));
    this.ePersonService.createPatchFromCache(user)
      .pipe(
        take(1),
        switchMap((operations: Operation[]) => {
            if (isNotEmpty(operations)) {
              return this.ePersonService.patch(user, operations)
            }
            return observableOf(undefined)
          }
        )
      ).subscribe();
  }

  restoreSettingsForUsers(user: EPerson) {
    this.cookieService.set(this.getStorageName(user.uuid), this.getSettingsForUser(user));
  }

  updateSettingsForUsers(user: EPerson) {
    this.setSettingsForUser(user, this.cookieService.get(this.getStorageName(user.uuid)))
  }

  getStorageName(identifier: string) {
    return 'klaro-' + identifier
  }
}
