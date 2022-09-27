import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { Angulartics2GoogleTagManager } from 'angulartics2';
import { combineLatest } from 'rxjs';

import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';
import { GOOGLE_ANALYTICS_KLARO_KEY } from '../shared/cookies/klaro-configuration';

/**
 * Set up Google Analytics on the client side.
 * See: {@link addTrackingIdToPage}.
 */
@Injectable()
export class GoogleAnalyticsService {

  constructor(
    // private angulartics: Angulartics2GoogleAnalytics,
    private angulartics: Angulartics2GoogleTagManager,
    private klaroService: KlaroService,
    private configService: ConfigurationDataService,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  /**
   * Call this method once when Angular initializes on the client side.
   * It requests a Google Analytics tracking id from the rest backend
   * (property: google.analytics.key), adds the tracking snippet to the
   * page and starts tracking.
   */
  addTrackingIdToPage(): void {
    const googleKey$ = this.configService.findByPropertyName('google.analytics.key').pipe(
      getFirstCompletedRemoteData(),
    );
    combineLatest([this.klaroService.getSavedPreferences(), googleKey$])
      .subscribe(([preferences, remoteData]) => {
        // make sure user has accepted Google Analytics consents
        if (isEmpty(preferences) || isEmpty(preferences[GOOGLE_ANALYTICS_KLARO_KEY]) || !preferences[GOOGLE_ANALYTICS_KLARO_KEY]) {
          return;
        }

        // make sure we got a success response from the backend
        if (!remoteData.hasSucceeded) {
          return;
        }

        const trackingId = remoteData.payload.values[0];

        // make sure we received a tracking id
        if (isEmpty(trackingId)) {
          return;
        }

        // add GTag snippet to page
        const keyScript = this.document.createElement('script');
        keyScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        this.document.body.appendChild(keyScript);

        const libScript = this.document.createElement('script');
        libScript.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){window.dataLayer.push(arguments);}
                               gtag('js', new Date());gtag('config', '${trackingId}');`;
        this.document.body.appendChild(libScript);

        // start tracking
        this.angulartics.startTracking();
      });
  }
}
