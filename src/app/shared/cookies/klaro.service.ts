import { Injectable } from '@angular/core';

/**
 * Abstract class representing a service for handling Klaro consent preferences and UI
 */
@Injectable()
export abstract class KlaroService {
  /**
   * Initializes the service
   */
  abstract initialize();

  /**
   * Shows a the dialog with the current consent preferences
   */
  abstract showSettings();
}
