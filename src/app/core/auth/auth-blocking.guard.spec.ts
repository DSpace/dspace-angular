import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import {
  AppState,
  storeModuleConfig,
} from '../../app.reducer';
import { authReducer } from './auth.reducer';
import { authBlockingGuard } from './auth-blocking.guard';

describe('authBlockingGuard', () => {
  let guard: any;
  let initialState;
  let store: Store<AppState>;
  let mockStore: MockStore<AppState>;

  initialState = {
    core: {
      auth: {
        authenticated: false,
        loaded: false,
        blocking: undefined,
        loading: false,
        authMethods: [],
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer, storeModuleConfig),
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: authBlockingGuard, useValue: guard },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    mockStore = store as MockStore<AppState>;
    guard = authBlockingGuard;
  });

  describe(`canActivate`, () => {

    describe(`when authState.blocking is undefined`, () => {
      it(`should not emit anything`, (done) => {
        expect(guard(null, null, store)).toBeObservable(cold('-'));
        done();
      });
    });

    describe(`when authState.blocking is true`, () => {
      beforeEach(() => {
        const state = Object.assign({}, initialState, {
          core: Object.assign({}, initialState.core, {
            'auth': {
              blocking: true,
            },
          }),
        });
        mockStore.setState(state);
      });

      it(`should not emit anything`, (done) => {
        expect(guard(null, null, store)).toBeObservable(cold('-'));
        done();
      });
    });

    describe(`when authState.blocking is false`, () => {
      beforeEach(() => {
        const state = Object.assign({}, initialState, {
          core: Object.assign({}, initialState.core, {
            'auth': {
              blocking: false,
            },
          }),
        });
        mockStore.setState(state);
      });

      it(`should succeed`, (done) => {
        expect(guard(null, null, store)).toBeObservable(cold('(a|)', { a: true }));
        done();
      });
    });
  });

});
