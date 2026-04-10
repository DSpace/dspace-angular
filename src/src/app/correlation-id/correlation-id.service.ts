import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { take } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { CookieService } from '../core/services/cookie.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { UUIDService } from '../core/shared/uuid.service';
import { OrejimeService } from '../shared/cookies/orejime.service';
import {
  CORRELATION_ID_COOKIE,
  CORRELATION_ID_OREJIME_KEY,
} from '../shared/cookies/orejime-configuration';
import {
  hasValue,
  isEmpty,
} from '../shared/empty.util';
import { SetCorrelationIdAction } from './correlation-id.actions';
import { correlationIdSelector } from './correlation-id.selector';

/**
 * Service to manage the correlation id, an id used to give context to server side logs
 */
@Injectable({
  providedIn: 'root',
})
export class CorrelationIdService {

  constructor(
    protected cookieService: CookieService,
    protected uuidService: UUIDService,
    protected store: Store<AppState>,
    protected orejimeService: OrejimeService,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
  ) {
    if (this._window?.nativeWindow) {
      this._window.nativeWindow.initCorrelationId = () => this.initCorrelationId();
    }
  }

  /**
   * Check if the correlation id is allowed to be set, then set it
   */
  initCorrelationId(): void {
    this.orejimeService?.getSavedPreferences().subscribe(preferences => {
      if (hasValue(preferences) && preferences[CORRELATION_ID_OREJIME_KEY]) {
        this.setCorrelationId();
      }
    },
    );
  }

  /**
   * Initialize the correlation id based on the cookie or the ngrx store
   */
  setCorrelationId(): void {
    // first see of there's a cookie with a correlation-id
    let correlationId = this.cookieService.get(CORRELATION_ID_COOKIE);

    // if there isn't see if there's an ID in the store
    if (isEmpty(correlationId)) {
      correlationId = this.getCorrelationId();
    }

    // if no id was found, create a new id
    if (isEmpty(correlationId)) {
      correlationId = this.uuidService.generate();
    }

    // Store the correct id both in the store and as a cookie to ensure they're in sync
    this.store.dispatch(new SetCorrelationIdAction(correlationId));
    this.cookieService.set(CORRELATION_ID_COOKIE, correlationId);
  }

  /**
   * Get the correlation id from the store
   */
  getCorrelationId(): string {
    let correlationId;

    this.store.pipe(
      select(correlationIdSelector),
      take(1),
    ).subscribe((storeId: string) => {
      // we can do this because ngrx selects are synchronous
      correlationId = storeId;
    });

    return correlationId;
  }
}
