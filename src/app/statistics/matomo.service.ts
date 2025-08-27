import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  MatomoInitializerService,
  MatomoTracker,
} from 'ngx-matomo-client';
import {
  combineLatest,
  from as fromPromise,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { RemoteData } from '../core/data/remote-data';
import { NativeWindowService } from '../core/services/window.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { OrejimeService } from '../shared/cookies/orejime.service';
import { isNotEmpty } from '../shared/empty.util';

export const MATOMO_TRACKER_URL = 'matomo.tracker.url';
export const MATOMO_SITE_ID = 'matomo.request.siteid';

export const MATOMO_ENABLED = 'matomo.enabled';

/**
 * Service to manage Matomo analytics integration.
 * Handles initialization and consent management for Matomo tracking.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Service responsible for managing Matomo analytics tracking and consent.
 * Provides methods for initializing tracking, managing consent, and appending visitor identifiers.
 */
export class MatomoService {

  /** Injects the MatomoInitializerService to initialize the Matomo tracker. */
  matomoInitializer: MatomoInitializerService;

  /** Injects the MatomoTracker to manage Matomo tracking operations. */
  matomoTracker: MatomoTracker;

  /** Injects the OrejimeService to manage cookie consent preferences. */
  orejimeService = inject(OrejimeService);

  /** Injects the NativeWindowService to access the native window object. */
  _window = inject(NativeWindowService);

  /** Injects the ConfigurationService. */
  configService = inject(ConfigurationDataService);

  constructor(private injector: EnvironmentInjector) {

  }

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

      combineLatest([preferences$, this.isMatomoEnabled$(), this.getSiteId$(), this.getTrackerUrl$()])
        .subscribe(([preferences, isMatomoEnabled, siteId, trackerUrl]) => {
          if (isMatomoEnabled && siteId && trackerUrl) {
            runInInjectionContext(this.injector, () => {
              this.matomoTracker = inject(MatomoTracker);
              this.matomoInitializer = inject(MatomoInitializerService);
            });
            this.matomoInitializer.initializeTracker({ siteId, trackerUrl });
            this.changeMatomoConsent(preferences?.matomo);
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
      this.matomoTracker?.setConsentGiven();
    } else {
      this.matomoTracker?.forgetConsentGiven();
    }
  };

  /**
   * Appends the Matomo visitor ID to the given URL.
   * @param url - The original URL to which the visitor ID will be added.
   * @returns An Observable that emits the URL with the visitor ID appended.
   */
  appendVisitorId(url: string): Observable<string> {
    return fromPromise(this.matomoTracker?.getVisitorId())
      .pipe(
        map(visitorId => this.appendTrackerId(url, visitorId)),
        take(1),
      );
  }

  /**
   * Retrieves the Matomo tracker URL from the configuration service.
   * @returns An Observable that emits the Matomo tracker URL if available.
   */
  getTrackerUrl$() {

    if (isNotEmpty(environment.matomo?.trackerUrl)) {
      return of(environment.matomo.trackerUrl);
    }

    return this.configService.findByPropertyName(MATOMO_TRACKER_URL)
      .pipe(
        getFirstCompletedRemoteData(),
        map((res: RemoteData<ConfigurationProperty>) => {
          return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0];
        }),
      );
  }

  /**
   * Retrieves the Matomo site ID from the configuration service.
   * @returns An Observable that emits the Matomo site ID if available.
   */
  getSiteId$() {
    return this.configService.findByPropertyName(MATOMO_SITE_ID)
      .pipe(
        getFirstCompletedRemoteData(),
        map((res: RemoteData<ConfigurationProperty>) => {
          return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0];
        }),
      );
  }

  /**
   * Checks if Matomo tracking is enabled by retrieving the configuration property.
   * @returns An Observable that emits a boolean indicating whether Matomo tracking is enabled.
   */
  isMatomoEnabled$(): Observable<boolean> {
    return this.configService.findByPropertyName(MATOMO_ENABLED)
      .pipe(
        getFirstCompletedRemoteData(),
        map((res: RemoteData<ConfigurationProperty>) => {
          return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) &&
            res.payload.values[0]?.toLowerCase() === 'true';
        }),
      );
  }

  /**
   * Appends the visitor ID as a query parameter to the given URL.
   * @param url - The original URL to modify
   * @param visitorId - The visitor ID to append to the URL
   * @returns The updated URL with the visitor ID added as a 'trackerId' query parameter
   */
  private appendTrackerId(url: string, visitorId: string) {
    const updatedURL = new URL(url);
    if (isNotEmpty(visitorId)) {
      updatedURL.searchParams.append('trackerId', visitorId);
    }
    return updatedURL.toString();
  }
}
