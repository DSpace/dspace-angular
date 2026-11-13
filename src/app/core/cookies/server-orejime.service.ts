import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';

import {
  CookieConsents,
  OrejimeService,
} from './orejime.service';


/**
 * Server implementation for the OrejimeService, representing a service for handling Orejime consent preferences and UI
 */
@Injectable()
export class ServerOrejimeService extends OrejimeService {

  /**
   * Changes in user consents
   */
  consentsUpdates$: BehaviorSubject<CookieConsents>;

  /**
   * Whether the service is initialized
   */
  initialized$: BehaviorSubject<boolean>;

  /**
   * Initializes the service:
   *  - Retrieves the current authenticated user
   *  - Checks if the translation service is ready
   *  - Initialize configuration for users
   *  - Add and translate orejime configuration messages
   */
  initialize() {
  }

  /**
   * Return saved preferences stored in the orejime cookie
   */
  getSavedPreferences(): Observable<any> {
    return of({});
  }

  /**
   * Show the cookie consent form
   */
  showSettings() {
  }

  /**
   * Watch for consent changes
   */
  watchConsentUpdates(): void {
  }

}
