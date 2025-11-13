
import { TestBed } from '@angular/core/testing';
import { coreReducers } from '@dspace/core/core.reducers';
import { CoreState } from '@dspace/core/core-state.model';
import { UUIDService } from '@dspace/core/shared/uuid.service';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CORRELATION_ID_COOKIE } from '../cookies/orejime-configuration';
import { CookieServiceMock } from '../testing/cookie.service.mock';
import { SetCorrelationIdAction } from './correlation-id.actions';
import { CorrelationIdService } from './correlation-id.service';

describe('CorrelationIdService', () => {
  let service: CorrelationIdService;

  let cookieService;
  let uuidService;
  let store;

  const mockStoreModuleConfig: any = {
    runtimeChecks: {
      strictStateImmutability: true,
      strictActionImmutability: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(),
        StoreModule.forFeature('core', coreReducers, mockStoreModuleConfig),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    cookieService = new CookieServiceMock();
    uuidService = new UUIDService();
    store = TestBed.inject(Store) as MockStore<CoreState>;
    // store.setState(initialState);
    const mockOrejimeService = {
      getSavedPreferences: () => of({ CORRELATION_ID_OREJIME_KEY: true }),
      initialize: jasmine.createSpy('initialize'),
      showSettings: jasmine.createSpy('showSettings'),
    };

    service = new CorrelationIdService(cookieService, uuidService, store, mockOrejimeService, { nativeWindow: undefined });
  });

  describe('getCorrelationId', () => {
    it('should get from from store', () => {
      expect(service.getCorrelationId()).toBe(null);
      store.dispatch(new SetCorrelationIdAction('some value'));
      expect(service.getCorrelationId()).toBe('some value');
    });
  });


  describe('setCorrelationId', () => {
    const cookieCID = 'cookie CID';
    const storeCID = 'store CID';

    it('should set cookie and store values to a newly generated value if neither ex', () => {
      service.setCorrelationId();

      expect(cookieService.get(CORRELATION_ID_COOKIE)).toBeTruthy();
      expect(service.getCorrelationId()).toBeTruthy();
      expect(cookieService.get(CORRELATION_ID_COOKIE)).toEqual(service.getCorrelationId());
    });

    it('should set store value to cookie value if present', () => {
      expect(service.getCorrelationId()).toBe(null);

      cookieService.set(CORRELATION_ID_COOKIE, cookieCID);

      service.setCorrelationId();

      expect(cookieService.get(CORRELATION_ID_COOKIE)).toBe(cookieCID);
      expect(service.getCorrelationId()).toBe(cookieCID);
    });

    it('should set cookie value to store value if present', () => {
      store.dispatch(new SetCorrelationIdAction(storeCID));

      service.setCorrelationId();

      expect(cookieService.get(CORRELATION_ID_COOKIE)).toBe(storeCID);
      expect(service.getCorrelationId()).toBe(storeCID);
    });

    it('should set store value to cookie value if both are present', () => {
      cookieService.set(CORRELATION_ID_COOKIE, cookieCID);
      store.dispatch(new SetCorrelationIdAction(storeCID));

      service.setCorrelationId();

      expect(cookieService.get(CORRELATION_ID_COOKIE)).toBe(cookieCID);
      expect(service.getCorrelationId()).toBe(cookieCID);
    });
  });
});
