import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

/**
* key/value map of current consents
**/

export interface CookieConsents {
  [key: string]: boolean;
}
/**
 * Abstract class representing a service for handling Orejime consent preferences and UI
 */
@Injectable({ providedIn: 'root' })
export abstract class OrejimeService {
  /**
   * Initializes the service
   */
  abstract initialize(): void;

  /**
   * Shows a dialog with the current consent preferences
   */
  abstract showSettings(): void;

  /**
   * Return saved preferences stored in the Orejime cookie
   */
  abstract getSavedPreferences(): Observable<any>;

  /**
   * Watch for changes in consents
   */
  abstract watchConsentUpdates(): void;

  /**
   * Subject to emit updates in the consents
   */
  abstract consentsUpdates$:  BehaviorSubject<CookieConsents>;
  /**
   * Subject to emit initialization
   */
  abstract initialized$:  BehaviorSubject<boolean>;
}
