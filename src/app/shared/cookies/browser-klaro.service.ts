import { Injectable } from '@angular/core';
import * as Klaro from 'klaro'
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { switchMap, take } from 'rxjs/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { KlaroService } from './klaro.service';
import { hasValue, isEmpty, isNotEmpty } from '../empty.util';
import { CookieService } from '../../core/services/cookie.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { cloneDeep } from 'lodash';
import { ANONYMOUS_STORAGE_NAME_KLARO, klaroConfiguration } from './klaro-configuration';
import { Operation } from 'fast-json-patch';

/**
 * Cookie for has_agreed_end_user
 */
export const HAS_AGREED_END_USER = 'dsHasAgreedEndUser';

/**
 * Metadata field to store a user's cookie consent preferences in
 */
export const COOKIE_MDFIELD = 'dspace.agreements.cookies';

/**
 * Prefix key for app title messages
 */
const cookieNameMessagePrefix = 'cookies.consent.app.title.';

/**
 * Prefix key for app description messages
 */
const cookieDescriptionMessagePrefix = 'cookies.consent.app.description.';

/**
 * Prefix key for app purpose messages
 */
const cookiePurposeMessagePrefix = 'cookies.consent.purpose.';

/**
 * Browser implementation for the KlaroService, representing a service for handling Klaro consent preferences and UI
 */
@Injectable()
export class BrowserKlaroService extends KlaroService {
  /**
   * Initial Klaro configuration
   */
  klaroConfig = klaroConfiguration;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private ePersonService: EPersonDataService,
    private cookieService: CookieService) {
    super();
  }
  /**
   * Initializes the service:
   *  - Retrieves the current authenticated user
   *  - Checks if the translation service is ready
   *  - Initialize configuration for users
   *  - Add and translate klaro configuration messages
   */
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

  /**
   * Initialize configuration for the logged in user
   * @param user The authenticated user
   */
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

  /**
   * Retrieves the currently logged in user
   * Returns undefined when no one is logged in
   */
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

  /**
   * Create a title translation key
   * @param title
   */
  private getTitleTranslation(title: string) {
    return cookieNameMessagePrefix + title;
  }

  /**
   * Create a description translation key
   * @param description
   */
  private getDescriptionTranslation(description: string) {
    return cookieDescriptionMessagePrefix + description;
  }

  /**
   * Create a purpose translation key
   * @param purpose
   */
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

  /**
   * Translate string values in an object
   * @param object The object containing translation keys
   */
  private translate(object) {
    if (typeof (object) === 'string') {
      return this.translateService.instant(object);
    }
    Object.entries(object).forEach(([key, value]: [string, any]) => {
      object[key] = this.translate(value);
    });
    return object;
  }

  /**
   * Retrieves the stored Klaro consent settings for a user
   * @param user The user to resolve the consent for
   */
  getSettingsForUser(user: EPerson) {
    const mdValue = user.firstMetadataValue(COOKIE_MDFIELD);
    return hasValue(mdValue) ? JSON.parse(mdValue) : undefined;
  }

  /**
   * Stores the Klaro consent settings for a user in a metadata field
   * @param user The user to save the settings for
   * @param config The consent settings for the user to save
   */
  setSettingsForUser(user: EPerson, config: object) {
    if (isNotEmpty(config)) {
      user.setMetadata(COOKIE_MDFIELD, undefined, JSON.stringify(config));
    } else {
      user.removeMetadata(COOKIE_MDFIELD);
    }
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

  /**
   * Restores the users consent settings cookie based on the user's stored consent settings
   * @param user The user to save the settings for
   */
  restoreSettingsForUsers(user: EPerson) {
    this.cookieService.set(this.getStorageName(user.uuid), this.getSettingsForUser(user));
  }

  /**
   * Stores the consent settings for a user based on the current cookie for this user
   * @param user
   */
  updateSettingsForUsers(user: EPerson) {
    this.setSettingsForUser(user, this.cookieService.get(this.getStorageName(user.uuid)))
  }

  /**
   * Create the storage name for klaro cookies based on the user's identifier
   * @param identifier The user's uuid
   */
  getStorageName(identifier: string) {
    return 'klaro-' + identifier
  }
}
