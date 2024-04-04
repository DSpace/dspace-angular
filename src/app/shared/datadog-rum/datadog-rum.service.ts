import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { datadogRum } from '@datadog/browser-rum';
import { CookieConsents, KlaroService } from '../cookies/klaro.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { createSelector, Store } from '@ngrx/store';
import { setDatadogRumStatusAction } from './datadog-rum.actions';
import { DatadogRumState } from './datadog-rum.reducer';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { coreSelector } from '../../core/core.selectors';
import { CoreState } from '../../core/core-state.model';

export const getDatadogRumState = createSelector(coreSelector, (state: CoreState) => state.datadogRum);

@Injectable({
  providedIn: 'root'
})
export class DatadogRumService {

  consentUpdates$: BehaviorSubject<CookieConsents>;

  constructor(
    private klaroService: KlaroService,
    private store: Store
  ) {
  }

  initDatadogRum() {
    this.klaroService.watchConsentUpdates();
    this.consentUpdates$ = this.klaroService.consentsUpdates$;
    this.consentUpdates$.subscribe(savedPreferences => {
      this.getDatadogRumState().subscribe((state) => {
        if (savedPreferences?.datadog &&
          environment.datadogRum?.clientToken && environment.datadogRum?.applicationId &&
          environment.datadogRum?.service && environment.datadogRum?.env) {
          if (!state.isInitialized) {
            this.store.dispatch(new setDatadogRumStatusAction({
              isInitialized: true,
              isRunning: true
            }));
            datadogRum.init(environment.datadogRum);
          } else if (!state.isRunning) {
            this.store.dispatch(new setDatadogRumStatusAction({
              isRunning: true
            }));
            datadogRum.startSessionReplayRecording();
          }
        } else {
          datadogRum.stopSessionReplayRecording();
          this.store.dispatch(new setDatadogRumStatusAction({
            isRunning: false
          }));
        }
      });
    });
  }


  getDatadogRumState(): Observable<DatadogRumState> {
    return this.store
      .select(getDatadogRumState)
      .pipe(
        distinctUntilChanged(),
        take(1),
    );
  }
}

