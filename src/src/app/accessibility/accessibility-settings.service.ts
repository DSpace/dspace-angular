import {
  Inject,
  Injectable,
  Optional,
} from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import {
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../config/app-config.interface';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth/auth.service';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { CookieService } from '../core/services/cookie.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { OrejimeService } from '../shared/cookies/orejime.service';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../shared/empty.util';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';

/**
 * Name of the cookie used to store the settings locally
 */
export const ACCESSIBILITY_COOKIE = 'dsAccessibilityCookie';

/**
 * Name of the metadata field to store settings on the ePerson
 */
export const ACCESSIBILITY_SETTINGS_METADATA_KEY = 'dspace.accessibility.settings';

/**
 * Array containing all possible accessibility settings.
 * When adding new settings, make sure to add the new setting to the accessibility-settings component form.
 * The converter methods to convert from stored format to form format (and vice-versa) need to be updated as well.
 */
export const accessibilitySettingKeys = ['notificationTimeOut', 'liveRegionTimeOut'] as const;

/**
 * Type representing the possible accessibility settings
 */
export type AccessibilitySetting = typeof accessibilitySettingKeys[number];

/**
 * Type representing an object that contains accessibility settings values for all accessibility settings.
 */
export type FullAccessibilitySettings = { [key in AccessibilitySetting]: string };

/**
 * Type representing an object that contains accessibility settings values for some accessibility settings.
 */
export type AccessibilitySettings = Partial<FullAccessibilitySettings>;

/**
 * The accessibility settings object format used by the accessibility-settings component form.
 */
export interface AccessibilitySettingsFormValues {
  notificationTimeOutEnabled: boolean,
  notificationTimeOut: string,
  liveRegionTimeOut: string,
}

/**
 * Service handling the retrieval and configuration of accessibility settings.
 *
 * This service stores the configured settings in either a cookie or on the user's metadata depending on whether
 * the user is authenticated.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessibilitySettingsService {

  constructor(
    protected cookieService: CookieService,
    protected authService: AuthService,
    protected ePersonService: EPersonDataService,
    @Optional() protected orejimeService: OrejimeService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
  }

  /**
   * Get the stored value for the provided {@link AccessibilitySetting}. If the value does not exist or if it is empty,
   * the provided defaultValue is emitted instead.
   */
  get(setting: AccessibilitySetting, defaultValue: string = null): Observable<string> {
    return this.getAll().pipe(
      map(settings => settings[setting]),
      map(value => isNotEmpty(value) ? value : defaultValue),
    );
  }

  /**
   * Get the stored value for the provided {@link AccessibilitySetting} as a number. If the stored value
   * could not be converted to a number, the value of the defaultValue parameter is emitted instead.
   */
  getAsNumber(setting: AccessibilitySetting, defaultValue: number = null): Observable<number> {
    return this.get(setting).pipe(
      map(value => hasValue(value) ? parseInt(value, 10) : NaN),
      map(number => !isNaN(number) ? number : defaultValue),
    );
  }

  /**
   * Get all currently stored accessibility settings
   */
  getAll(): Observable<AccessibilitySettings> {
    return this.getAllSettingsFromAuthenticatedUserMetadata().pipe(
      map(value => isNotEmpty(value) ? value : this.getAllSettingsFromCookie()),
      map(value => isNotEmpty(value) ? value : {}),
    );
  }

  /**
   * Get all settings from the accessibility settings cookie
   */
  getAllSettingsFromCookie(): AccessibilitySettings {
    return this.cookieService.get(ACCESSIBILITY_COOKIE);
  }

  /**
   * Attempts to retrieve all settings from the authenticated user's metadata.
   * Returns an empty object when no user is authenticated.
   */
  getAllSettingsFromAuthenticatedUserMetadata(): Observable<AccessibilitySettings> {
    return this.authService.getAuthenticatedUserFromStoreIfAuthenticated().pipe(
      take(1),
      map(user => hasValue(user) && hasValue(user.firstMetadataValue(ACCESSIBILITY_SETTINGS_METADATA_KEY)) ?
        JSON.parse(user.firstMetadataValue(ACCESSIBILITY_SETTINGS_METADATA_KEY)) :
        {},
      ),
    );
  }

  /**
   * Set a single accessibility setting value, leaving all other settings unchanged.
   * When setting all values, {@link AccessibilitySettingsService#setSettings} should be used.
   * When updating multiple values, {@link AccessibilitySettingsService#updateSettings} should be used.
   *
   * Returns 'cookie' when the changes were stored in the cookie.
   * Returns 'metadata' when the changes were stored in metadata.
   * Returns 'failed' when both options failed.
   */
  set(setting: AccessibilitySetting, value: string): Observable<'metadata' | 'cookie' | 'failed'> {
    return this.updateSettings({ [setting]: value });
  }

  /**
   * Set all accessibility settings simultaneously.
   * This method removes existing settings if they are missing from the provided {@link AccessibilitySettings} object.
   * Removes all settings if the provided object is empty.
   *
   * Returns 'cookie' when the changes were stored in the cookie.
   * Returns 'metadata' when the changes were stored in metadata.
   * Returns 'failed' when both options failed.
   */
  setSettings(settings: AccessibilitySettings): Observable<'metadata' | 'cookie' | 'failed'> {
    return this.setSettingsInAuthenticatedUserMetadata(settings).pipe(
      take(1),
      map(saveLocation => saveLocation === 'metadata'),
      switchMap((savedInMetadata) =>
        savedInMetadata ? ofMetadata() : this.setSettingsInCookie(settings),
      ),
    );
  }

  /**
   * Update multiple accessibility settings simultaneously.
   * This method does not change the settings that are missing from the provided {@link AccessibilitySettings} object.
   *
   * Returns 'cookie' when the changes were stored in the cookie.
   * Returns 'metadata' when the changes were stored in metadata.
   * Returns 'failed' when both options failed.
   */
  updateSettings(settings: AccessibilitySettings): Observable<'metadata' | 'cookie' | 'failed'> {
    return this.getAll().pipe(
      take(1),
      map(currentSettings => Object.assign({}, currentSettings, settings)),
      switchMap(newSettings => this.setSettings(newSettings)),
    );
  }

  /**
   * Attempts to set the provided settings on the currently authorized user's metadata.
   * Emits false when no user is authenticated or when the metadata update failed.
   * Emits 'metadata' when the metadata update succeeded, and 'failed' otherwise.
   */
  setSettingsInAuthenticatedUserMetadata(settings: AccessibilitySettings): Observable<'metadata' | 'failed'> {
    return this.authService.getAuthenticatedUserFromStoreIfAuthenticated().pipe(
      take(1),
      switchMap(user => {
        if (hasValue(user)) {
          // EPerson has to be cloned, otherwise the EPerson's metadata can't be modified
          const clonedUser = cloneDeep(user);
          return this.setSettingsInMetadata(clonedUser, settings);
        } else {
          return ofFailed();
        }
      }),
    );
  }

  /**
   * Attempts to set the provided settings on the user's metadata.
   * Emits false when the update failed, true when the update succeeded.
   */
  setSettingsInMetadata(
    user: EPerson,
    settings: AccessibilitySettings,
  ): Observable<'metadata' | 'failed'> {
    if (isNotEmpty(settings)) {
      user.setMetadata(ACCESSIBILITY_SETTINGS_METADATA_KEY, null, JSON.stringify(settings));
    } else {
      user.removeMetadata(ACCESSIBILITY_SETTINGS_METADATA_KEY);
    }

    return this.ePersonService.createPatchFromCache(user).pipe(
      take(1),
      switchMap(operations =>
        isNotEmpty(operations) ? this.ePersonService.patch(user, operations) : createSuccessfulRemoteDataObject$({})),
      getFirstCompletedRemoteData(),
      switchMap(rd => rd.hasSucceeded ? ofMetadata() : ofFailed()),
    );
  }

  /**
   * Attempts to set the provided settings in a cookie.
   * Emits 'failed' when setting in a cookie failed due to the cookie not being accepted, 'cookie' when it succeeded.
   */
  setSettingsInCookie(settings: AccessibilitySettings): Observable<'cookie' | 'failed'> {
    if (hasNoValue(this.orejimeService)) {
      return of('failed');
    }

    return this.orejimeService.getSavedPreferences().pipe(
      map(preferences => preferences.accessibility),
      map((accessibilityCookieAccepted: boolean) => {
        if (accessibilityCookieAccepted) {
          if (isNotEmpty(settings)) {
            this.cookieService.set(ACCESSIBILITY_COOKIE, settings, { expires: this.appConfig.accessibility.cookieExpirationDuration });
          } else {
            this.cookieService.remove(ACCESSIBILITY_COOKIE);
          }

          return 'cookie';
        } else {
          return 'failed';
        }
      }),
    );
  }

  /**
   * Clears all settings in the cookie and attempts to clear settings in metadata.
   * Emits an array mentioning which settings succeeded or failed.
   */
  clearSettings(): Observable<['cookie' | 'failed', 'metadata' | 'failed']> {
    return combineLatest([
      this.setSettingsInCookie({}),
      this.setSettingsInAuthenticatedUserMetadata({}),
    ]);
  }

  /**
   * Retrieve the default value to be used for the provided AccessibilitySetting.
   * Returns an empty string when no default value is specified for the provided setting.
   */
  getDefaultValue(setting: AccessibilitySetting): string {
    switch (setting) {
      case 'notificationTimeOut':
        return millisecondsToSeconds(environment.notifications.timeOut.toString());
      case 'liveRegionTimeOut':
        return millisecondsToSeconds(environment.liveRegion.messageTimeOutDurationMs.toString());
      default:
        return '';
    }
  }

  /**
   * Convert values in the provided accessibility settings object to values ready to be stored.
   */
  convertFormValuesToStoredValues(settings: AccessibilitySettingsFormValues): FullAccessibilitySettings {
    const storedValues = {
      notificationTimeOut: settings.notificationTimeOutEnabled ?
        secondsToMilliseconds(settings.notificationTimeOut) : '0',
      liveRegionTimeOut: secondsToMilliseconds(settings.liveRegionTimeOut),
    };

    // When the user enables the timeout but does not change the timeout duration from 0,
    // it is removed from the values to be stored so the default value is used.
    // Keeping it at 0 would mean the notifications are not automatically removed.
    if (settings.notificationTimeOutEnabled && settings.notificationTimeOut === '0') {
      delete storedValues.notificationTimeOut;
    }

    return storedValues;
  }

  /**
   * Convert values in the provided accessibility settings object to values ready to show in the form.
   */
  convertStoredValuesToFormValues(settings: AccessibilitySettings): AccessibilitySettingsFormValues {
    return {
      notificationTimeOutEnabled: parseFloat(settings.notificationTimeOut) !== 0,
      notificationTimeOut: millisecondsToSeconds(settings.notificationTimeOut),
      liveRegionTimeOut: millisecondsToSeconds(settings.liveRegionTimeOut),
    };
  }

  /**
   * Returns true if the provided AccessibilitySetting is valid in regard to the provided formValues.
   */
  isValid(setting: AccessibilitySetting, formValues: AccessibilitySettingsFormValues): boolean {
    switch (setting) {
      case 'notificationTimeOut':
        return formValues.notificationTimeOutEnabled ?
          hasNoValue(formValues.notificationTimeOut) || parseFloat(formValues.notificationTimeOut) > 0 :
          true;
      case 'liveRegionTimeOut':
        return hasNoValue(formValues.liveRegionTimeOut) || parseFloat(formValues.liveRegionTimeOut) > 0;
      default:
        throw new Error(`Unhandled accessibility setting during validity check: ${setting}`);
    }
  }

  /**
   * Returns true if all settings in the provided AccessibilitySettingsFormValues object are valid
   */
  formValuesValid(formValues: AccessibilitySettingsFormValues) {
    return accessibilitySettingKeys.every(setting => this.isValid(setting, formValues));
  }
}

/**
 * Converts a string representing seconds to a string representing milliseconds
 * Returns null if the input could not be parsed to a float
 */
function secondsToMilliseconds(secondsStr: string): string {
  const seconds = parseFloat(secondsStr);
  if (isNaN(seconds)) {
    return null;
  } else {
    return (seconds * 1000).toString();
  }
}

/**
 * Converts a string representing milliseconds to a string representing seconds
 * Returns null if the input could not be parsed to a float
 */
function millisecondsToSeconds(millisecondsStr: string): string {
  const milliseconds = parseFloat(millisecondsStr);
  if (isNaN(milliseconds)) {
    return null;
  } else {
    return (milliseconds / 1000).toString();
  }
}

function ofMetadata(): Observable<'metadata'> {
  return of('metadata');
}

function ofFailed(): Observable<'failed'> {
  return of('failed');
}
