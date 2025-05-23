import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Abstract class representing a service for handling Orejime consent preferences and UI
 */
@Injectable({ providedIn: 'root' })
export abstract class OrejimeService {
  /**
   * Initializes the service
   */
  abstract initialize();

  /**
   * Shows a dialog with the current consent preferences
   */
  abstract showSettings();

  /**
   * Return saved preferences stored in the Orejime cookie
   */
  abstract getSavedPreferences(): Observable<any>;
}
