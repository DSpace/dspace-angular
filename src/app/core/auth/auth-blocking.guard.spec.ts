import { Store } from '@ngrx/store';
import * as ngrx from '@ngrx/store';
import { cold, getTestScheduler, initTestScheduler, resetTestScheduler } from 'jasmine-marbles/es6';
import { of as observableOf } from 'rxjs';
import { AppState } from '../../app.reducer';
import { AuthBlockingGuard } from './auth-blocking.guard';

describe('AuthBlockingGuard', () => {
  let guard: AuthBlockingGuard;
  beforeEach(() => {
    guard = new AuthBlockingGuard(new Store<AppState>(undefined, undefined, undefined));
    initTestScheduler();
  });

  afterEach(() => {
    getTestScheduler().flush();
    resetTestScheduler();
  });

  describe(`canActivate`, () => {

    describe(`when authState.loading is undefined`, () => {
      beforeEach(() => {
        spyOnProperty(ngrx, 'select').and.callFake(() => {
          return () => {
            return () => observableOf(undefined);
          };
        })
      });
      it(`should not emit anything`, () => {
        expect(guard.canActivate()).toBeObservable(cold('|'));
      });
    });

    describe(`when authState.loading is true`, () => {
      beforeEach(() => {
        spyOnProperty(ngrx, 'select').and.callFake(() => {
          return () => {
            return () => observableOf(true);
          };
        })
      });
      it(`should not emit anything`, () => {
        expect(guard.canActivate()).toBeObservable(cold('|'));
      });
    });

    describe(`when authState.loading is false`, () => {
      beforeEach(() => {
        spyOnProperty(ngrx, 'select').and.callFake(() => {
          return () => {
            return () => observableOf(false);
          };
        })
      });
      it(`should succeed`, () => {
        expect(guard.canActivate()).toBeObservable(cold('(a|)', { a: true }));
      });
    });
  });

});
