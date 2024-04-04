import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { datadogRum } from '@datadog/browser-rum';
import { CookieConsents, KlaroService } from '../cookies/klaro.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatadogRumService {

  consentUpdates$: BehaviorSubject<CookieConsents>;
  isDatadogInitialized = false;
  isDatadogRunning = false;

  constructor(
    private klaroService: KlaroService
  ) {
  }

  initDatadogRum() {
    this.klaroService.watchConsentUpdates();
    this.consentUpdates$ = this.klaroService.consentsUpdates$;
    this.consentUpdates$.subscribe(savedPreferences => {
      if (savedPreferences?.datadog &&
        environment.datadogRum?.clientToken && environment.datadogRum?.applicationId &&
        environment.datadogRum?.service && environment.datadogRum?.env) {
        if (!this.isDatadogInitialized) {
          this.isDatadogInitialized = true;
          this.isDatadogRunning = true;
          datadogRum.init(environment.datadogRum);
        } else if (!this.isDatadogRunning) {
          this.isDatadogRunning = true;
          datadogRum.startSessionReplayRecording();
        }
      } else {
        datadogRum.stopSessionReplayRecording();
        this.isDatadogRunning = false;
      }
    });
  }
}
