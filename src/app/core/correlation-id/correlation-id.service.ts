import {
  Inject,
  Injectable,
} from '@angular/core';
import { CoreState } from '@dspace/core/core-state.model';
import {
  NativeWindowRef,
  NativeWindowService,
} from '@dspace/core/services/window.service';
import { UUIDService } from '@dspace/core/shared/uuid.service';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  take,
  tap,
} from 'rxjs/operators';

import { CookieService } from '../cookies/cookie.service';
import { OrejimeService } from '../cookies/orejime.service';
import {
  CORRELATION_ID_COOKIE,
  CORRELATION_ID_OREJIME_KEY,
} from '../cookies/orejime-configuration';
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
    protected store: Store<CoreState>,
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
      tap(console.log),
      select(correlationIdSelector),
      take(1),
    ).subscribe((storeId: string) => {
      // we can do this because ngrx selects are synchronous
      correlationId = storeId;
    });

    return correlationId;
  }
}
