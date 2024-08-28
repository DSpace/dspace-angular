import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
export interface CookieConsents {
  [key: string]: boolean;
}
/**
 * Abstract class representing a service for handling Klaro consent preferences and UI
 */
@Injectable()
export abstract class KlaroService {
  /**
   * Initializes the service
   */
  abstract initialize(): void;

  /**
   * Shows a dialog with the current consent preferences
   */
  abstract showSettings(): void;

  /**
   * Return saved preferences stored in the klaro cookie
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
