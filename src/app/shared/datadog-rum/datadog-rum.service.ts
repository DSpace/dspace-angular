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
          datadogRum.init(environment.datadogRum);
        }
      } else {
        // TODO: if a session starts then stops then starts again an error is thrown. Is there an alternative to the .init method?
        datadogRum.stopSession();
        this.isDatadogInitialized = false;
      }
    });
  }
}
