import { Injectable } from '@angular/core';
import { datadogRum } from '@datadog/browser-rum';
import {
  createSelector,
  Store,
} from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { coreSelector } from '../../core/core.selectors';
import { CoreState } from '../../core/core-state.model';
import {
  CookieConsents,
  KlaroService,
} from '../cookies/klaro.service';
import { setDatadogRumStatusAction } from './datadog-rum.actions';
import { DatadogRumState } from './datadog-rum.reducer';
import { DatadogRumService } from './datadog-rum.service';

@Injectable({ providedIn: 'root' })
export class BrowserDatadogRumService extends DatadogRumService {

  consentsUpdates$: BehaviorSubject<CookieConsents>;
  datadogRumStateSelector = createSelector(coreSelector, (state: CoreState) => state.datadogRum);

  constructor(
    private klaroService: KlaroService,
    private store: Store,
  ) {
    super();
    this.consentsUpdates$ = this.klaroService.consentsUpdates$;
  }

  initDatadogRum() {
    this.klaroService.initialized$.pipe(
      filter(initalized => initalized),
      take(1),
      tap(() => {
        this.klaroService.watchConsentUpdates();
      }),
      switchMap(() => this.consentsUpdates$),
    ).subscribe(savedPreferences => {
      this.getDatadogRumState().subscribe((state) => {
        if (savedPreferences?.datadog &&
          environment.datadogRum?.clientToken && environment.datadogRum?.applicationId &&
          environment.datadogRum?.service && environment.datadogRum?.env) {
          if (!state.isInitialized) {
            this.store.dispatch(new setDatadogRumStatusAction({
              isInitialized: true,
              isRunning: true,
            }));
            datadogRum.init(environment.datadogRum);
          } else if (!state.isRunning) {
            this.store.dispatch(new setDatadogRumStatusAction({
              isRunning: true,
            }));
            datadogRum.startSessionReplayRecording();
          }
        } else {
          datadogRum.stopSessionReplayRecording();
          this.store.dispatch(new setDatadogRumStatusAction({
            isRunning: false,
          }));
        }
      });
    });
  }


  getDatadogRumState(): Observable<DatadogRumState> {
    return this.store
      .select(this.datadogRumStateSelector)
      .pipe(
        distinctUntilChanged(),
        take(1),
      );
  }
}

