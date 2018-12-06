import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { ResetResponseCacheTimestampsAction } from './response-cache.actions';
import { ResponseCacheEffects } from './response-cache.effects';
import { StoreActionTypes } from '../../store.actions';

describe('ResponseCacheEffects', () => {
  let cacheEffects: ResponseCacheEffects;
  let actions: Observable<any>;
  const timestamp = 10000;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResponseCacheEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    cacheEffects = TestBed.get(ResponseCacheEffects);
  });

  describe('fixTimestampsOnRehydrate$', () => {

    it('should return a RESET_TIMESTAMPS action in response to a REHYDRATE action', () => {
      spyOn(Date.prototype, 'getTime').and.callFake(() => {
        return timestamp;
      });
      actions = hot('--a-', { a: { type: StoreActionTypes.REHYDRATE, payload: {} } });

      const expected = cold('--b-', { b: new ResetResponseCacheTimestampsAction(new Date().getTime()) });

      expect(cacheEffects.fixTimestampsOnRehydrate).toBeObservable(expected);
    });
  });
});
