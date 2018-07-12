import { Store } from '@ngrx/store';

import { ResponseCacheService } from './response-cache.service';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../core.reducers';
import { RestResponse } from './response-cache.models';
import { ResponseCacheEntry } from './response-cache.reducer';

describe('ResponseCacheService', () => {
  let service: ResponseCacheService;
  let store: Store<CoreState>;

  const keys = ['125c17f89046283c5f0640722aac9feb', 'a06c3006a41caec5d635af099b0c780c'];
  const timestamp = new Date().getTime();
  const validCacheEntry = (key) => {
    return {
      key: key,
      response: new RestResponse(true, '200'),
      timeAdded: timestamp,
      msToLive: 24 * 60 * 60 * 1000 // a day
    }
  };
  const invalidCacheEntry = (key) => {
    return {
      key: key,
      response: new RestResponse(true, '200'),
      timeAdded: 0,
      msToLive: 0
    }
  };

  beforeEach(() => {
    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');
    service = new ResponseCacheService(store);
    spyOn(Date.prototype, 'getTime').and.callFake(() => {
      return timestamp;
    });
  });

  describe('get', () => {
    it('should return an observable of the cached request with the specified key', () => {
      spyOn(store, 'select').and.callFake((...args: any[]) => {
        return Observable.of(validCacheEntry(keys[1]));
      });

      let testObj: ResponseCacheEntry;
      service.get(keys[1]).first().subscribe((entry) => {
        testObj = entry;
      });
      expect(testObj.key).toEqual(keys[1]);
    });

    it('should not return a cached request that has exceeded its time to live', () => {
      spyOn(store, 'select').and.callFake((...args: any[]) => {
        return Observable.of(invalidCacheEntry(keys[1]));
      });

      let getObsHasFired = false;
      const subscription = service.get(keys[1]).subscribe((entry) => getObsHasFired = true);
      expect(getObsHasFired).toBe(false);
      subscription.unsubscribe();
    });
  });

  describe('has', () => {
    it('should return true if the request with the supplied key is cached and still valid', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(validCacheEntry(keys[1])));
      expect(service.has(keys[1])).toBe(true);
    });

    it('should return false if the request with the supplied key isn\'t cached', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(undefined));
      expect(service.has(keys[1])).toBe(false);
    });

    it('should return false if the request with the supplied key is cached but has exceeded its time to live', () => {
      spyOn(store, 'select').and.returnValue(Observable.of(invalidCacheEntry(keys[1])));
      expect(service.has(keys[1])).toBe(false);
    });
  });
});
