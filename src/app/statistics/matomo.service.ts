import {
  inject,
  Injectable,
} from '@angular/core';
import {
  MatomoInitializerService,
  MatomoTracker,
} from 'ngx-matomo-client';

import { environment } from '../../environments/environment';
import { NativeWindowService } from '../core/services/window.service';
import { OrejimeService } from '../shared/cookies/orejime.service';

/**
 * Service to manage Matomo analytics integration.
 * Handles initialization and consent management for Matomo tracking.
 */
@Injectable({
  providedIn: 'root',
})
export class MatomoService {

  /** Injects the MatomoInitializerService to initialize the Matomo tracker. */
  matomoInitializer = inject(MatomoInitializerService);

  /** Injects the MatomoTracker to manage Matomo tracking operations. */
  matomoTracker = inject(MatomoTracker);

  /** Injects the OrejimeService to manage cookie consent preferences. */
  orejimeService = inject(OrejimeService);

  /** Injects the NativeWindowService to access the native window object. */
  _window = inject(NativeWindowService);

  /**
   * Initializes the Matomo tracker if in production environment.
   * Sets up the changeMatomoConsent function on the native window object.
   * Subscribes to cookie consent preferences and initializes the tracker accordingly.
   */
  init() {
    if (this._window.nativeWindow) {
      this._window.nativeWindow.changeMatomoConsent = this.changeMatomoConsent;
    }

    if (environment.production) {
      const preferences$ = this.orejimeService.getSavedPreferences();

      preferences$.subscribe(preferences => {
        this.changeMatomoConsent(preferences.matomo);

        if (environment.matomo?.siteId && environment.matomo?.trackerUrl) {
          this.matomoInitializer.initializeTracker({
            siteId: environment.matomo.siteId,
            trackerUrl: environment.matomo.trackerUrl,
          });
        }
      });
    }
  }

  /**
   * Changes the Matomo consent status based on the given consent value.
   * @param consent - A boolean indicating whether consent is given for Matomo tracking.
   */
  changeMatomoConsent = (consent: boolean) => {
    if (consent) {
      this.matomoTracker.setConsentGiven();
    } else {
      this.matomoTracker.forgetConsentGiven();
    }
  };
}
