import {
  Inject,
  Injectable,
  InjectionToken,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { CAPTCHA_NAME } from '../../core/google-recaptcha/google-recaptcha.service';
import { CookieService } from '../../core/services/cookie.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../core/services/window.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '../empty.util';
import { OrejimeService } from './orejime.service';
import {
  ANONYMOUS_STORAGE_NAME_OREJIME,
  getOrejimeConfiguration,
} from './orejime-configuration';

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
 * Update request debounce in ms
 */
const updateDebounce = 300;

/**
 * By using this injection token instead of importing directly we can keep Orejime out of the main bundle
 */
const LAZY_OREJIME = new InjectionToken<Promise<any>>(
  'Lazily loaded Orejime',
  {
    providedIn: 'root',
    factory: async () => (await import('orejime/dist/orejime')),
  },
);

/**
 * Browser implementation for the OrejimeService, representing a service for handling Orejime consent preferences and UI
 */
@Injectable()
export class BrowserOrejimeService extends OrejimeService {

  private readonly GOOGLE_ANALYTICS_KEY = 'google.analytics.key';

  private readonly REGISTRATION_VERIFICATION_ENABLED_KEY = 'registration.verification.enabled';

  private readonly GOOGLE_ANALYTICS_SERVICE_NAME = 'google-analytics';


  /**
   * Initial Orejime configuration
   */
  orejimeConfig = cloneDeep(getOrejimeConfiguration(this._window));

  private orejimeInstance: any;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translateService: TranslateService,
    private authService: AuthService,
    private ePersonService: EPersonDataService,
    private configService: ConfigurationDataService,
    private cookieService: CookieService,
    @Inject(LAZY_OREJIME) private lazyOrejime: Promise<any>,
  ) {
    super();
  }

  /**
   * Initializes the service:
   *  - Retrieves the current authenticated user
   *  - Checks if the translation service is ready
   *  - Initialize configuration for users
   *  - Add and translate orejime configuration messages
   */
  initialize() {
    if (!environment.info.enablePrivacyStatement) {
      this.orejimeConfig.translations.zz.consentModal.privacyPolicy.text = 'cookies.consent.content-modal.no-privacy-policy.text';
    }

    const hideGoogleAnalytics$ = this.configService.findByPropertyName(this.GOOGLE_ANALYTICS_KEY).pipe(
      getFirstCompletedRemoteData(),
      map(remoteData => !remoteData.hasSucceeded || !remoteData.payload || isEmpty(remoteData.payload.values)),
    );

    const hideRegistrationVerification$ = this.configService.findByPropertyName(this.REGISTRATION_VERIFICATION_ENABLED_KEY).pipe(
      getFirstCompletedRemoteData(),
      map((remoteData) =>
        !remoteData.hasSucceeded || !remoteData.payload || isEmpty(remoteData.payload.values) || remoteData.payload.values[0].toLowerCase() !== 'true',
      ),
    );

    const appsToHide$: Observable<string[]> = observableCombineLatest([hideGoogleAnalytics$, hideRegistrationVerification$]).pipe(
      map(([hideGoogleAnalytics, hideRegistrationVerification]) => {
        const appsToHideArray: string[] = [];
        if (hideGoogleAnalytics) {
          appsToHideArray.push(this.GOOGLE_ANALYTICS_SERVICE_NAME);
        }
        if (hideRegistrationVerification) {
          appsToHideArray.push(CAPTCHA_NAME);
        }
        return appsToHideArray;
      }),
    );

    this.translateService.setDefaultLang(environment.defaultLanguage);

    const user$: Observable<EPerson> = this.getUser$();

    const translationServiceReady$ = this.translateService.get('loading.default').pipe(take(1));

    observableCombineLatest([user$, appsToHide$, translationServiceReady$])
      .subscribe(([user, appsToHide, _]: [EPerson, string[], string]) => {
        user = cloneDeep(user);

        if (hasValue(user)) {
          this.initializeUser(user);
        }

        /**
         * Add all message keys for apps and purposes
         */
        this.addAppMessages();

        /**
         * Create categories based on the purposes of the apps
         */
        this.createCategories();

        /**
         * Subscribe on a message to make sure the translation service is ready
         * Translate all keys in the translation section of the configuration
         * Show the configuration if the configuration has not been confirmed
         */
        this.translateConfiguration();

        this.orejimeConfig.apps = this.filterConfigApps(appsToHide);
        this.lazyOrejime.then(({ init }) => {
          this.orejimeInstance = init(this.orejimeConfig);
        });
      });
  }

  /**
   * Return saved preferences stored in the orejime cookie
   */
  getSavedPreferences(): Observable<any> {
    return this.getUser$().pipe(
      map((user: EPerson) => {
        let storageName;
        if (isEmpty(user)) {
          storageName = ANONYMOUS_STORAGE_NAME_OREJIME;
        } else {
          storageName = this.getStorageName(user.uuid);
        }
        return this.cookieService.get(storageName);
      }),
    );
  }

  /**
   * Initialize configuration for the logged in user
   * @param user The authenticated user
   */
  private initializeUser(user: EPerson) {
    this.orejimeConfig.callback = debounce((consent, app) => this.updateSettingsForUsers(user), updateDebounce);
    this.orejimeConfig.cookieName = this.getStorageName(user.uuid);

    const anonCookie = this.cookieService.get(ANONYMOUS_STORAGE_NAME_OREJIME);
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
        take(1),
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
    this.orejimeInstance.show();
  }

  /**
   * Add message keys for all apps and purposes
   */
  addAppMessages() {
    this.orejimeConfig.apps.forEach((app) => {
      this.orejimeConfig.translations.zz[app.name] = {
        title: this.getTitleTranslation(app.name),
        description: this.getDescriptionTranslation(app.name),
      };
      app.purposes.forEach((purpose) => {
        this.orejimeConfig.translations.zz.purposes[purpose] = this.getPurposeTranslation(purpose);
      });
    });
  }

  /**
   * Translate the translation section from the Orejime configuration
   */
  translateConfiguration() {
    /**
     * Make sure the fallback language is english
     */
    this.translateService.setDefaultLang(environment.defaultLanguage);

    this.translate(this.orejimeConfig.translations.zz);
  }

  /**
   * Create categories based on the purposes of the apps
   */
  createCategories() {
    this.orejimeConfig.categories = this.orejimeConfig.apps.reduce((accumulator, current) => {
      let category = accumulator.find((cat) => cat.name === current.purposes[0]);
      if (!category) {
        category = {
          name: current.purposes[0],
          title: this.translateService.instant(this.getPurposeTranslation(current.purposes[0])),
          apps: [],
        };
        accumulator.push(category);
      }
      category.apps.push(current.name);
      return accumulator;
    }, []);
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
   * Retrieves the stored Orejime consent settings for a user
   * @param user The user to resolve the consent for
   */
  getSettingsForUser(user: EPerson) {
    const mdValue = user.firstMetadataValue(COOKIE_MDFIELD);
    return hasValue(mdValue) ? JSON.parse(mdValue) : undefined;
  }

  /**
   * Stores the Orejime consent settings for a user in a metadata field
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
            return this.ePersonService.patch(user, operations);
          }
          return observableOf(undefined);
        },
        ),
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
    this.setSettingsForUser(user, this.cookieService.get(this.getStorageName(user.uuid)));
  }

  /**
   * Create the storage name for orejime cookies based on the user's identifier
   * @param identifier The user's uuid
   */
  getStorageName(identifier: string) {
    return 'orejime-' + identifier;
  }

  /**
   * remove apps that should be hidden from the configuration
   */
  private filterConfigApps(appsToHide: string[]) {
    this.orejimeConfig.categories.forEach((category) => {
      category.apps = category.apps.filter(service => !appsToHide.some(name => name === service));
    });
    this.orejimeConfig.categories = this.orejimeConfig.categories.filter(category => category.apps.length > 0);
    return this.orejimeConfig.apps.filter(service => !appsToHide.some(name => name === service.name));
  }

}
